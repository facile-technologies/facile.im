import Stripe from "stripe";
import axios from "axios";
import { Op, fn, col, literal } from "sequelize";
import { sequelize } from "../database/connectDB.js";
import {
  Product,
  ProductFile,
  ProductPurchase,
  ProductView,
  StripeConnectAccount,
  Team,
  TeamMember,
  User,
  UserProfile,
} from "../models/Association.js";
import { SERVER_URL_NORMALIZED } from "../config/index.js";
import { sendTemplateEmail } from "../utils/email/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT || 10);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || null;
}

async function getCountryFromIp(ip) {
  if (!ip) return null;
  const cleanIp = ip.startsWith("::ffff:") ? ip.slice(7) : ip;
  try {
    const geo = await axios.get(`https://ipapi.co/${cleanIp}/json/`, { timeout: 3000 });
    return geo.data?.country_code || null;
  } catch {
    return null;
  }
}

/**
 * Buyer's delivery email, sent from the Stripe webhook.
 *
 * Previously this built its own nodemailer transport configured for Gmail while
 * holding Gandi credentials, so it could not send at all. It now goes through
 * the shared mailer; the markup lives in utils/email/templates/purchaseDelivery.js.
 *
 * This function's only job is mapping the Sequelize row onto template data —
 * notably absolutizing file URLs, which stays here so the template never has to
 * know about SERVER_URL.
 */
async function sendPurchaseDeliveryEmail(purchase) {
  const product = purchase.product;
  if (!product) return;

  const files = (product.files || []).map((f) => ({
    label: f.name,
    href: f.url.startsWith("http") ? f.url : `${SERVER_URL_NORMALIZED}${f.url}`,
  }));

  await sendTemplateEmail({
    to: purchase.buyer_email,
    template: "purchase-delivery",
    // Replies reach the seller rather than the noreply mailbox. Falls back to
    // no replyTo when the seller relation wasn't loaded.
    replyTo: product.user?.email || undefined,
    data: {
      productTitle: product.title,
      heading: product.success_heading,
      subheading: product.success_subheading,
      type: product.type,
      files,
      productUrl: product.product_url,
    },
  });
}

// ─── SELLER: onboard with Stripe Connect ─────────────────────────────────────

export const onboardSeller = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ STATUS: "ERROR", MESSAGE: "User not found." });
    }

    let connectAccount = await StripeConnectAccount.findOne({
      where: { user_id: userId },
    });

    if (connectAccount) {
      // Refresh capabilities from Stripe
      const stripeAccount = await stripe.accounts.retrieve(
        connectAccount.stripe_account_id
      );
      await connectAccount.update({
        charges_enabled: stripeAccount.charges_enabled,
        payouts_enabled: stripeAccount.payouts_enabled,
        account_status: stripeAccount.charges_enabled ? "ACTIVE" : "PENDING",
      });

      if (stripeAccount.charges_enabled) {
        return res.status(200).json({
          STATUS: "SUCCESS",
          MESSAGE: "Your Stripe account is already active and ready to receive payments.",
          is_active: true,
        });
      }

      // Account exists but onboarding incomplete — return a fresh onboarding link
      const accountLink = await stripe.accountLinks.create({
        account: connectAccount.stripe_account_id,
        refresh_url: process.env.STRIPE_CONNECT_REFRESH_URL,
        return_url: process.env.STRIPE_CONNECT_RETURN_URL,
        type: "account_onboarding",
      });

      return res.status(200).json({
        STATUS: "SUCCESS",
        MESSAGE: "Please complete your Stripe onboarding to start receiving payments.",
        onboarding_url: accountLink.url,
        is_active: false,
      });
    }

    // First time — create an Express account
    const stripeAccount = await stripe.accounts.create({
      type: "express",
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      settings: {
        payouts: {
          schedule: { interval: "manual" }, // seller controls when payouts happen
        },
      },
      metadata: { user_id: userId.toString() },
    });

    connectAccount = await StripeConnectAccount.create({
      user_id: userId,
      stripe_account_id: stripeAccount.id,
      charges_enabled: false,
      payouts_enabled: false,
      account_status: "PENDING",
    });

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccount.id,
      refresh_url: process.env.STRIPE_CONNECT_REFRESH_URL,
      return_url: process.env.STRIPE_CONNECT_RETURN_URL,
      type: "account_onboarding",
    });

    return res.status(201).json({
      STATUS: "SUCCESS",
      MESSAGE: "Stripe Connect account created. Complete onboarding to receive payments.",
      onboarding_url: accountLink.url,
      is_active: false,
    });
  } catch (error) {
    console.error("onboardSeller error:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

// ─── SELLER: get connect account status ──────────────────────────────────────

export const getConnectStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const connectAccount = await StripeConnectAccount.findOne({
      where: { user_id: userId },
    });

    if (!connectAccount) {
      return res.status(200).json({
        STATUS: "SUCCESS",
        has_account: false,
        is_active: false,
      });
    }

    // Always refresh from Stripe to get the real-time state
    const stripeAccount = await stripe.accounts.retrieve(
      connectAccount.stripe_account_id
    );

    // Ensure payout schedule is manual so sellers control their own withdrawals.
    // This silently migrates accounts that were created before manual payouts were set.
    const currentInterval = stripeAccount.settings?.payouts?.schedule?.interval;
    if (currentInterval !== "manual") {
      await stripe.accounts.update(connectAccount.stripe_account_id, {
        settings: { payouts: { schedule: { interval: "manual" } } },
      });
    }

    await connectAccount.update({
      charges_enabled: stripeAccount.charges_enabled,
      payouts_enabled: stripeAccount.payouts_enabled,
      account_status: stripeAccount.charges_enabled ? "ACTIVE" : "PENDING",
    });

    return res.status(200).json({
      STATUS: "SUCCESS",
      has_account: true,
      is_active: stripeAccount.charges_enabled,
      charges_enabled: stripeAccount.charges_enabled,
      payouts_enabled: stripeAccount.payouts_enabled,
      account_status: connectAccount.account_status,
    });
  } catch (error) {
    console.error("getConnectStatus error:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

// ─── SELLER: refresh expired onboarding link ──────────────────────────────────

export const refreshOnboardingLink = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const connectAccount = await StripeConnectAccount.findOne({
      where: { user_id: userId },
    });

    if (!connectAccount) {
      return res.status(404).json({
        STATUS: "ERROR",
        MESSAGE: "No Stripe Connect account found. Please start onboarding first.",
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: connectAccount.stripe_account_id,
      refresh_url: process.env.STRIPE_CONNECT_REFRESH_URL,
      return_url: process.env.STRIPE_CONNECT_RETURN_URL,
      type: "account_onboarding",
    });

    return res.status(200).json({
      STATUS: "SUCCESS",
      onboarding_url: accountLink.url,
    });
  } catch (error) {
    console.error("refreshOnboardingLink error:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

// ─── PUBLIC: create product checkout session ──────────────────────────────────

export const createProductCheckout = async (req, res, next) => {
  try {
    const { product_id, user_profile_id, buyer_email, buyer_name, success_url, cancel_url } =
      req.body;

    if (!product_id || !user_profile_id || !buyer_email) {
      return res.status(400).json({
        STATUS: "ERROR",
        MESSAGE: "product_id, user_profile_id and buyer_email are required.",
      });
    }

    const product = await Product.findByPk(product_id, {
      include: [{ model: ProductFile, as: "files" }],
    });

    if (!product) {
      return res.status(404).json({ STATUS: "ERROR", MESSAGE: "Product not found." });
    }

    const effectivePrice =
      product.is_on_sale && product.sale_price
        ? parseFloat(product.sale_price)
        : parseFloat(product.price);

    if (!effectivePrice || effectivePrice <= 0) {
      return res.status(400).json({
        STATUS: "ERROR",
        MESSAGE: "Product does not have a valid price.",
      });
    }

    const userProfile = await UserProfile.findByPk(user_profile_id);
    if (!userProfile) {
      return res.status(404).json({ STATUS: "ERROR", MESSAGE: "Profile not found." });
    }

    const connectAccount = await StripeConnectAccount.findOne({
      where: { user_id: userProfile.user_id },
    });

    if (!connectAccount || !connectAccount.charges_enabled) {
      return res.status(400).json({
        STATUS: "ERROR",
        MESSAGE: "Seller has not completed payment setup. Purchases are currently unavailable.",
      });
    }

    const platformFeeAmount = parseFloat(
      ((effectivePrice * PLATFORM_FEE_PERCENT) / 100).toFixed(2)
    );
    const sellerAmount = parseFloat((effectivePrice - platformFeeAmount).toFixed(2));
    const currency = (product.currency || "usd").toLowerCase();

    const ip = getClientIp(req);
    const buyerCountry = await getCountryFromIp(ip);

    const imageUrls = product.image_url
      ? [
          product.image_url.startsWith("http")
            ? product.image_url
            : `${SERVER_URL_NORMALIZED}${product.image_url}`,
        ]
      : [];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: product.title,
              ...(product.description && { description: product.description }),
              ...(imageUrls.length > 0 && { images: imageUrls }),
            },
            unit_amount: Math.round(effectivePrice * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.round(platformFeeAmount * 100),
        transfer_data: {
          destination: connectAccount.stripe_account_id,
        },
      },
      customer_email: buyer_email,
      success_url: success_url || `${process.env.FRONTEND_URL}/purchase/success`,
      cancel_url: cancel_url || `${process.env.FRONTEND_URL}/purchase/cancel`,
      metadata: {
        purchase_type: "product",
        product_id: product.id.toString(),
        user_profile_id: user_profile_id.toString(),
        seller_user_id: userProfile.user_id.toString(),
        buyer_name: buyer_name || "",
        buyer_country: buyerCountry || "",
      },
    });

    await ProductPurchase.create({
      product_id: product.id,
      user_profile_id,
      seller_user_id: userProfile.user_id,
      buyer_email,
      buyer_name: buyer_name || null,
      buyer_country: buyerCountry,
      amount: effectivePrice,
      platform_fee: platformFeeAmount,
      seller_amount: sellerAmount,
      currency,
      stripe_session_id: session.id,
      status: "PENDING",
    });

    return res.status(200).json({
      STATUS: "SUCCESS",
      MESSAGE: "Checkout session created.",
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error("createProductCheckout error:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

// ─── WEBHOOK: Stripe product purchase webhook ─────────────────────────────────
// Register this endpoint separately in Stripe Dashboard with its own signing secret.

export const productPurchaseWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_PRODUCT_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_PRODUCT_WEBHOOK_SECRET in environment.");
    return res.status(400).send("Webhook secret is missing.");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Product webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata || {};

    // Guard: only handle product purchases, not plan purchases
    if (meta.purchase_type !== "product") {
      return res.status(200).end();
    }

    try {
      const purchase = await ProductPurchase.findOne({
        where: { stripe_session_id: session.id },
        include: [
          {
            model: Product,
            as: "product",
            include: [
              { model: ProductFile, as: "files" },
              // Seller address only — used as replyTo on the delivery email so
              // buyer replies reach them instead of the noreply mailbox.
              { model: User, as: "user", attributes: ["email"] },
            ],
          },
        ],
      });

      if (!purchase) {
        // Acknowledge to Stripe even if we can't find the record — avoids retries
        console.error("ProductPurchase not found for session:", session.id);
        return res.status(200).end();
      }

      // ── Re-validate the platform fee against the authoritative Stripe amount ──
      // The stored platform_fee was computed server-side at checkout, but re-derive it
      // here from the amount Stripe actually charged and reconcile. If they diverge by
      // more than a 1-cent rounding tolerance, do NOT silently complete — flag for manual
      // review (leave the purchase PENDING) so a tampered/stale fee can't be paid out.
      const paidAmountCents =
        session.amount_total != null
          ? session.amount_total
          : Math.round(Number(purchase.amount) * 100);
      const expectedFeeCents = Math.round((paidAmountCents * PLATFORM_FEE_PERCENT) / 100);
      const storedFeeCents = Math.round(Number(purchase.platform_fee) * 100);

      if (Math.abs(expectedFeeCents - storedFeeCents) > 1) {
        // NOTE: the status ENUM only allows PENDING/COMPLETED/FAILED/REFUNDED — there is no
        // REVIEW/FLAGGED value, so we leave the row PENDING rather than write an invalid enum.
        console.warn(
          `[productPurchaseWebhook] platform fee mismatch — leaving purchase un-completed for review. ` +
            `session: ${session.id}, purchase_id: ${purchase.id}, product: ${meta.product_id}, ` +
            `stored_fee: ${(storedFeeCents / 100).toFixed(2)}, expected_fee: ${(expectedFeeCents / 100).toFixed(2)}, ` +
            `paid_amount: ${(paidAmountCents / 100).toFixed(2)}, fee_percent: ${PLATFORM_FEE_PERCENT}`
        );
        // Ack to Stripe (200) so it stops retrying; a human/job can reconcile the PENDING row.
        return res.status(200).end();
      }

      // buyer_country was resolved via ipapi.co at checkout creation time and stored in metadata.
      const countryFromMeta = meta.buyer_country || null;

      await purchase.update({
        status: "COMPLETED",
        stripe_payment_intent_id: session.payment_intent || null,
        ...(countryFromMeta && { buyer_country: countryFromMeta }),
      });

      // Send product delivery email to the buyer
      try {
        await sendPurchaseDeliveryEmail(purchase);
      } catch (emailErr) {
        // Email failure must not fail the webhook acknowledgement
        console.error("Failed to send purchase delivery email:", emailErr.message);
      }

      console.log(
        `Product purchase completed — session: ${session.id}, product: ${meta.product_id}`
      );
    } catch (err) {
      console.error("Error handling product purchase webhook:", err);
      return res.status(500).send("Internal error.");
    }
  }

  return res.status(200).end();
};

// ─── PUBLIC: track a product view ────────────────────────────────────────────
// Called by the frontend whenever a product card is rendered on a public profile.

export const trackProductView = async (req, res, next) => {
  try {
    const { product_id, user_profile_id } = req.body;

    if (!product_id || !user_profile_id) {
      return res.status(400).json({
        STATUS: "ERROR",
        MESSAGE: "product_id and user_profile_id are required.",
      });
    }

    const product = await Product.findByPk(product_id, {
      attributes: ["id", "user_id"],
    });

    if (!product) {
      return res.status(404).json({ STATUS: "ERROR", MESSAGE: "Product not found." });
    }

    const ip = getClientIp(req);
    const buyerCountry = await getCountryFromIp(ip);

    await ProductView.create({
      product_id,
      user_profile_id,
      seller_user_id: product.user_id,
      buyer_country: buyerCountry,
      buyer_ip: ip ? ip.substring(0, 45) : null,
    });

    return res.status(200).json({ STATUS: "SUCCESS", MESSAGE: "View tracked." });
  } catch (error) {
    console.error("trackProductView error:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

// ─── SELLER: get sales history ────────────────────────────────────────────────

// ─── SELLER: get connected account balance ───────────────────────────────────

export const getConnectBalance = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const connectAccount = await StripeConnectAccount.findOne({
      where: { user_id: userId },
    });

    if (!connectAccount) {
      return res.status(404).json({
        STATUS: "ERROR",
        MESSAGE: "No connected account found. Please complete onboarding first.",
      });
    }

    if (!connectAccount.charges_enabled) {
      return res.status(400).json({
        STATUS: "ERROR",
        MESSAGE: "Your Stripe account is not yet active. Please complete onboarding.",
      });
    }

    // Retrieve balance on behalf of the connected account
    const balance = await stripe.balance.retrieve(
      {},
      { stripeAccount: connectAccount.stripe_account_id }
    );

    // Normalize: return available + pending per currency
    const formatEntries = (entries) =>
      entries.map((e) => ({
        amount: e.amount / 100,          // convert cents → whole units
        currency: e.currency.toUpperCase(),
      }));

    return res.status(200).json({
      STATUS: "SUCCESS",
      data: {
        available: formatEntries(balance.available),
        pending: formatEntries(balance.pending),
      },
    });
  } catch (error) {
    console.error("getConnectBalance error:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

// ─── SELLER: withdraw (instant payout) ───────────────────────────────────────
// POST /connect/withdraw
// Body: { amount?: number (in dollars), currency?: string }
// If amount is omitted, withdraws the full available balance.
// Uses Stripe Instant Payouts — requires a debit card linked to the account.

export const withdrawFunds = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const connectAccount = await StripeConnectAccount.findOne({
      where: { user_id: userId },
    });

    if (!connectAccount) {
      return res.status(404).json({
        STATUS: "ERROR",
        MESSAGE: "No connected account found. Please complete onboarding first.",
      });
    }

    if (!connectAccount.charges_enabled) {
      return res.status(400).json({
        STATUS: "ERROR",
        MESSAGE: "Your Stripe account is not yet active. Please complete onboarding.",
      });
    }

    const stripeAccountId = connectAccount.stripe_account_id;

    // Get available balance on the connected account
    const balance = await stripe.balance.retrieve({}, { stripeAccount: stripeAccountId });

    const requestedCurrency = (req.body.currency || "usd").toLowerCase();

    const availableEntry = balance.available.find(
      (e) => e.currency === requestedCurrency
    );

    if (!availableEntry || availableEntry.amount <= 0) {
      return res.status(400).json({
        STATUS: "ERROR",
        MESSAGE: `No available balance in ${requestedCurrency.toUpperCase()} to withdraw.`,
      });
    }

    // Determine payout amount (cents)
    let payoutAmountCents;

    if (req.body.amount !== undefined) {
      const requestedDollars = parseFloat(req.body.amount);

      if (isNaN(requestedDollars) || requestedDollars <= 0) {
        return res.status(400).json({
          STATUS: "ERROR",
          MESSAGE: "amount must be a positive number.",
        });
      }

      payoutAmountCents = Math.round(requestedDollars * 100);

      if (payoutAmountCents > availableEntry.amount) {
        return res.status(400).json({
          STATUS: "ERROR",
          MESSAGE: `Requested amount $${requestedDollars} exceeds available balance $${(availableEntry.amount / 100).toFixed(2)}.`,
        });
      }
    } else {
      // No amount specified — withdraw everything available
      payoutAmountCents = availableEntry.amount;
    }

    // Stripe minimum payout: $1 = 100 cents
    if (payoutAmountCents < 100) {
      return res.status(400).json({
        STATUS: "ERROR",
        MESSAGE: "Minimum withdrawal amount is $1.00.",
      });
    }

    // Create instant payout on the connected account.
    // NOTE: Instant payouts require a debit card linked to the Stripe Express account.
    // If the seller only has a bank account, Stripe will return an error which we surface below.
    const payout = await stripe.payouts.create(
      {
        amount: payoutAmountCents,
        currency: requestedCurrency,
        method: "instant",
        description: "Facile seller withdrawal",
      },
      { stripeAccount: stripeAccountId }
    );

    return res.status(200).json({
      STATUS: "SUCCESS",
      MESSAGE: "Instant payout initiated successfully.",
      data: {
        payout_id: payout.id,
        amount: payout.amount / 100,
        currency: payout.currency.toUpperCase(),
        method: payout.method,
        status: payout.status,             // paid | pending | in_transit
        arrival_date: payout.arrival_date, // Unix timestamp
        created: payout.created,
      },
    });
  } catch (error) {
    console.error("withdrawFunds error:", error);

    // Surface friendly Stripe errors (e.g. no debit card, insufficient funds)
    if (error.type === "StripeInvalidRequestError") {
      return res.status(400).json({ STATUS: "ERROR", MESSAGE: error.message });
    }

    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

// ─── SELLER: payout history ───────────────────────────────────────────────────
// GET /connect/payouts?limit=20&starting_after=po_xxx

export const getPayoutHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const connectAccount = await StripeConnectAccount.findOne({
      where: { user_id: userId },
    });

    if (!connectAccount) {
      return res.status(404).json({
        STATUS: "ERROR",
        MESSAGE: "No connected account found. Please complete onboarding first.",
      });
    }

    if (!connectAccount.charges_enabled) {
      return res.status(400).json({
        STATUS: "ERROR",
        MESSAGE: "Your Stripe account is not yet active. Please complete onboarding.",
      });
    }

    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const params = { limit };
    if (req.query.starting_after) params.starting_after = req.query.starting_after;

    const payouts = await stripe.payouts.list(params, {
      stripeAccount: connectAccount.stripe_account_id,
    });

    const data = payouts.data.map((p) => ({
      payout_id: p.id,
      amount: p.amount / 100,
      currency: p.currency.toUpperCase(),
      method: p.method,
      status: p.status,
      arrival_date: p.arrival_date,
      created: p.created,
      description: p.description || null,
    }));

    const last_id = data.length > 0 ? data[data.length - 1].payout_id : null;

    return res.status(200).json({
      STATUS: "SUCCESS",
      data,
      pagination: {
        limit,
        has_more: payouts.has_more,
        next_cursor: payouts.has_more ? last_id : null,
      },
    });
  } catch (error) {
    console.error("getPayoutHistory error:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

// ─── SELLER: sales analytics dashboard ───────────────────────────────────────

export const getSalesAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const context = (req.query.context || "facile").toLowerCase();
    const period  = (req.query.period  || "this_month").toLowerCase();

    // ── Date range ───────────────────────────────────────────────────────────
    const now   = new Date();
    let dateFrom, dateTo;

    if (period === "this_week") {
      const day = now.getDay(); // 0=Sun
      dateFrom  = new Date(now); dateFrom.setDate(now.getDate() - day); dateFrom.setHours(0,0,0,0);
      dateTo    = new Date(now); dateTo.setHours(23,59,59,999);
    } else if (period === "last_month") {
      dateFrom  = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      dateTo    = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else {
      // this_month (default)
      dateFrom  = new Date(now.getFullYear(), now.getMonth(), 1);
      dateTo    = new Date(now); dateTo.setHours(23,59,59,999);
    }

    const createdAtRange = { [Op.between]: [dateFrom, dateTo] };

    // ── Previous period (for % change badges) ────────────────────────────────
    let prevDateFrom, prevDateTo;
    if (period === "this_week") {
      prevDateFrom = new Date(dateFrom); prevDateFrom.setDate(prevDateFrom.getDate() - 7);
      prevDateTo   = new Date(dateTo);   prevDateTo.setDate(prevDateTo.getDate() - 7);
    } else if (period === "last_month") {
      prevDateFrom = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      prevDateTo   = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);
    } else {
      // this_month: compare same # of days in the previous month
      prevDateFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      const sameDay       = Math.min(now.getDate(), lastMonthDays);
      prevDateTo   = new Date(now.getFullYear(), now.getMonth() - 1, sameDay, 23, 59, 59, 999);
    }
    const prevCreatedAtRange = { [Op.between]: [prevDateFrom, prevDateTo] };

    // ── Resolve scoped profile IDs for teams context ──────────────────────
    let sellerFilter_purchases, sellerFilter_views;

    if (context === "teams") {
      const team = await Team.findOne({ where: { user_id: userId } });
      if (!team) {
        return res.status(200).json({ STATUS: "SUCCESS", data: buildEmpty(period, dateFrom, dateTo) });
      }
      const members = await TeamMember.findAll({
        where: { team_id: team.id, invitation_status: "ACCEPTED" },
        attributes: ["user_profile_id"],
        raw: true,
      });
      const profileIds = members.map((m) => m.user_profile_id).filter(Boolean);
      if (profileIds.length === 0) {
        return res.status(200).json({ STATUS: "SUCCESS", data: buildEmpty(period, dateFrom, dateTo) });
      }
      sellerFilter_purchases = { user_profile_id: { [Op.in]: profileIds } };
      sellerFilter_views     = { user_profile_id: { [Op.in]: profileIds } };
    } else {
      sellerFilter_purchases = { seller_user_id: userId };
      sellerFilter_views     = { seller_user_id: userId };
    }

    // ── Summary cards ─────────────────────────────────────────────────────
    const [views, ordersRaw, earningsRaw, prevViews, prevOrdersRaw, prevEarningsRaw] = await Promise.all([
      // Current period
      ProductView.count({
        where: { ...sellerFilter_views, created_at: createdAtRange },
      }),
      ProductPurchase.count({
        where: { ...sellerFilter_purchases, status: "COMPLETED", created_at: createdAtRange },
      }),
      ProductPurchase.sum("seller_amount", {
        where: { ...sellerFilter_purchases, status: "COMPLETED", created_at: createdAtRange },
      }),
      // Previous period (for change badges)
      ProductView.count({
        where: { ...sellerFilter_views, created_at: prevCreatedAtRange },
      }),
      ProductPurchase.count({
        where: { ...sellerFilter_purchases, status: "COMPLETED", created_at: prevCreatedAtRange },
      }),
      ProductPurchase.sum("seller_amount", {
        where: { ...sellerFilter_purchases, status: "COMPLETED", created_at: prevCreatedAtRange },
      }),
    ]);

    const orders   = ordersRaw  || 0;
    const earnings = Number(earningsRaw || 0);
    const conversion = views > 0 ? ((orders / views) * 100).toFixed(1) : "0.0";

    // Period-over-period change
    const prevOrders         = prevOrdersRaw  || 0;
    const prevEarnings       = Number(prevEarningsRaw || 0);
    const prevConversionVal  = prevViews > 0 ? (prevOrders / prevViews) * 100 : 0;
    const currentConversionVal = views > 0 ? (orders / views) * 100 : 0;

    const calcChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? "+100%" : "0%";
      const pct = ((curr - prev) / prev) * 100;
      return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
    };

    const views_change      = calcChange(views, prevViews);
    const orders_change     = calcChange(orders, prevOrders);
    const conversion_change = calcChange(currentConversionVal, prevConversionVal);
    const earnings_change   = calcChange(earnings, prevEarnings);

    // ── Real-time activity chart (daily buckets) ──────────────────────────
    const groupByDay = (rows) => {
      // rows: [{ day: "2026-04-17", count/sum }]
      const map = {};
      rows.forEach((r) => { map[r.day] = Number(r.value); });
      // Fill all days in range
      const result = [];
      const cursor = new Date(dateFrom);
      while (cursor <= dateTo) {
        const key = cursor.toISOString().slice(0, 10);
        result.push({ date: key, value: map[key] || 0 });
        cursor.setDate(cursor.getDate() + 1);
      }
      return result;
    };

    const [ordersChart, earningsChart, viewsChart] = await Promise.all([
      // Orders by day
      ProductPurchase.findAll({
        attributes: [
          [fn("DATE", col("created_at")), "day"],
          [fn("COUNT", col("id")), "value"],
        ],
        where: { ...sellerFilter_purchases, status: "COMPLETED", created_at: createdAtRange },
        group: [fn("DATE", col("created_at"))],
        order:  [[fn("DATE", col("created_at")), "ASC"]],
        raw: true,
      }),
      // Earnings by day
      ProductPurchase.findAll({
        attributes: [
          [fn("DATE", col("created_at")), "day"],
          [fn("SUM", col("seller_amount")), "value"],
        ],
        where: { ...sellerFilter_purchases, status: "COMPLETED", created_at: createdAtRange },
        group: [fn("DATE", col("created_at"))],
        order:  [[fn("DATE", col("created_at")), "ASC"]],
        raw: true,
      }),
      // Views by day (for conversions chart = views per day)
      ProductView.findAll({
        attributes: [
          [fn("DATE", col("created_at")), "day"],
          [fn("COUNT", col("id")), "value"],
        ],
        where: { ...sellerFilter_views, created_at: createdAtRange },
        group: [fn("DATE", col("created_at"))],
        order:  [[fn("DATE", col("created_at")), "ASC"]],
        raw: true,
      }),
    ]);

    // Conversion chart = orders/views per day
    const ordersMap  = {};
    ordersChart.forEach((r) => { ordersMap[r.day] = Number(r.value); });
    const viewsMap   = {};
    viewsChart.forEach((r) => { viewsMap[r.day] = Number(r.value); });
    const allDays    = groupByDay(ordersChart.map((r) => ({ day: r.day, value: r.value })));
    const conversionChart = allDays.map(({ date }) => {
      const o = ordersMap[date] || 0;
      const v = viewsMap[date]  || 0;
      return { date, value: v > 0 ? Number(((o / v) * 100).toFixed(1)) : 0 };
    });

    const real_time_activity = {
      views:       groupByDay(viewsChart.map((r) => ({ day: r.day, value: r.value }))),
      orders:      groupByDay(ordersChart.map((r) => ({ day: r.day, value: r.value }))),
      conversions: conversionChart,
      earnings:    groupByDay(earningsChart.map((r) => ({ day: r.day, value: r.value }))),
    };

    // ── Geographic analytics ──────────────────────────────────────────────
    const geoRows = await ProductPurchase.findAll({
      attributes: [
        "buyer_country",
        [fn("COUNT", col("id")), "orders"],
      ],
      where: {
        ...sellerFilter_purchases,
        status: "COMPLETED",
        created_at: createdAtRange,
        buyer_country: { [Op.not]: null },
      },
      group: ["buyer_country"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      limit: 10,
      raw: true,
    });

    const geographic = geoRows.map((r) => ({
      country: r.buyer_country,
      orders:  Number(r.orders),
    }));

    // ── Per-product table ─────────────────────────────────────────────────
    // Get product IDs relevant to this seller/context
    const productPurchasedRows = await ProductPurchase.findAll({
      attributes: [[fn("DISTINCT", col("product_id")), "product_id"]],
      where: { ...sellerFilter_purchases, created_at: createdAtRange },
      raw: true,
    });
    const productViewRows = await ProductView.findAll({
      attributes: [[fn("DISTINCT", col("product_id")), "product_id"]],
      where: { ...sellerFilter_views, created_at: createdAtRange },
      raw: true,
    });

    const allProductIds = [
      ...new Set([
        ...productPurchasedRows.map((r) => r.product_id),
        ...productViewRows.map((r) => r.product_id),
      ]),
    ];

    let products = [];
    if (allProductIds.length > 0) {
      const [productOrderStats, productViewStats, productEarningStats, productRows] =
        await Promise.all([
          // Orders per product
          ProductPurchase.findAll({
            attributes: ["product_id", [fn("COUNT", col("id")), "orders"]],
            where: { ...sellerFilter_purchases, status: "COMPLETED", created_at: createdAtRange, product_id: { [Op.in]: allProductIds } },
            group: ["product_id"],
            raw: true,
          }),
          // Views per product
          ProductView.findAll({
            attributes: ["product_id", [fn("COUNT", col("id")), "views"]],
            where: { ...sellerFilter_views, created_at: createdAtRange, product_id: { [Op.in]: allProductIds } },
            group: ["product_id"],
            raw: true,
          }),
          // Earnings per product
          ProductPurchase.findAll({
            attributes: ["product_id", [fn("SUM", col("seller_amount")), "earnings"]],
            where: { ...sellerFilter_purchases, status: "COMPLETED", created_at: createdAtRange, product_id: { [Op.in]: allProductIds } },
            group: ["product_id"],
            raw: true,
          }),
          // Product info
          Product.findAll({
            where: { id: { [Op.in]: allProductIds } },
            attributes: ["id", "title", "image_url"],
            raw: true,
          }),
        ]);

      const ordersMap2   = {}; productOrderStats.forEach((r) => { ordersMap2[r.product_id]   = Number(r.orders); });
      const viewsMap2    = {}; productViewStats.forEach((r)  => { viewsMap2[r.product_id]    = Number(r.views); });
      const earningsMap2 = {}; productEarningStats.forEach((r) => { earningsMap2[r.product_id] = Number(r.earnings); });

      products = productRows.map((p) => {
        const o = ordersMap2[p.id]   || 0;
        const v = viewsMap2[p.id]    || 0;
        const e = earningsMap2[p.id] || 0;
        const imgUrl = p.image_url && !p.image_url.startsWith("http")
          ? `${SERVER_URL_NORMALIZED}${p.image_url}`
          : p.image_url;
        return {
          product_id:  p.id,
          title:       p.title,
          image_url:   imgUrl,
          views:       v,
          orders:      o,
          conversion:  v > 0 ? Number(((o / v) * 100).toFixed(1)) : 0,
          earnings:    e,
        };
      });
    }

    return res.status(200).json({
      STATUS: "SUCCESS",
      data: {
        period,
        date_from: dateFrom.toISOString(),
        date_to:   dateTo.toISOString(),
        summary: {
          views,
          views_change,
          total_orders: orders,
          orders_change,
          conversion: `${conversion}%`,
          conversion_change,
          earnings,
          earnings_change,
        },
        real_time_activity,
        geographic,
        products,
      },
    });
  } catch (error) {
    console.error("getSalesAnalytics error:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

function buildEmpty(period, dateFrom, dateTo) {
  return {
    period,
    date_from: dateFrom.toISOString(),
    date_to:   dateTo.toISOString(),
    summary: { views: 0, total_orders: 0, conversion: "0.0%", earnings: 0 },
    real_time_activity: { orders: [], conversions: [], earnings: [] },
    geographic: [],
    products: [],
  };
}

// ─── SELLER: transaction history (balance transactions on connected account) ──

export const getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const connectAccount = await StripeConnectAccount.findOne({
      where: { user_id: userId },
    });

    if (!connectAccount) {
      return res.status(404).json({
        STATUS: "ERROR",
        MESSAGE: "No connected account found. Please complete onboarding first.",
      });
    }

    if (!connectAccount.charges_enabled) {
      return res.status(400).json({
        STATUS: "ERROR",
        MESSAGE: "Your Stripe account is not yet active. Please complete onboarding.",
      });
    }

    // Stripe uses cursor-based pagination (starting_after = last txn id from prev page)
    const limit         = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const starting_after = req.query.starting_after || undefined;

    const params = { limit };
    if (starting_after) params.starting_after = starting_after;

    const balanceTxns = await stripe.balanceTransactions.list(params, {
      stripeAccount: connectAccount.stripe_account_id,
    });

    // Map Stripe types to human-readable labels and machine-readable keys
    const resolveType = (type) => {
      switch (type) {
        case "payment":
          return { key: "product_sold",   label: "Product Sold" };
        case "payment_refund":
          return { key: "refund",         label: "Refund" };
        case "payout":
          return { key: "withdrawal",     label: "Withdrawal" };
        case "payout_cancel":
          return { key: "payout_cancel",  label: "Withdrawal Cancelled" };
        case "payout_failure":
          return { key: "payout_failed",  label: "Withdrawal Failed" };
        default:
          return {
            key:   type,
            label: type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          };
      }
    };

    const resolveStatus = (status) => {
      switch (status) {
        case "available": return "Complete";
        case "pending":   return "Pending";
        default:          return status.charAt(0).toUpperCase() + status.slice(1);
      }
    };

    const data = balanceTxns.data.map((txn) => {
      const resolvedType = resolveType(txn.type);
      return {
        transaction_id: `TD-${txn.id.slice(-7).toUpperCase()}`,
        stripe_txn_id:  txn.id,               // use as starting_after cursor
        type:           resolvedType.key,      // "product_sold" | "withdrawal" | "refund" etc.
        type_label:     resolvedType.label,    // human-readable label
        date:           new Date(txn.created * 1000).toISOString(),
        status:         resolveStatus(txn.status),
        amount:         txn.amount / 100,      // positive = credit (sale), negative = debit (payout)
        net:            txn.net / 100,
        fee:            txn.fee / 100,
        currency:       txn.currency.toUpperCase(),
      };
    });

    // Cursor for the next page = stripe_txn_id of the last item
    const last_id  = data.length > 0 ? data[data.length - 1].stripe_txn_id : null;

    return res.status(200).json({
      STATUS: "SUCCESS",
      data,
      pagination: {
        limit,
        has_more:        balanceTxns.has_more,
        next_cursor:     balanceTxns.has_more ? last_id : null,  // pass as starting_after in next call
      },
    });
  } catch (error) {
    console.error("getTransactionHistory error:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

// ─── SELLER: list all purchases ───────────────────────────────────────────────

export const getSellerPurchases = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // context=facile (default) → user's own product orders
    // context=teams           → orders on team-member profile products
    const context = (req.query.context || "facile").toLowerCase();

    // ── Pagination ───────────────────────────────────────────────────────────
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const productInclude = {
      model: Product,
      as: "product",
      attributes: ["id", "title", "type", "image_url", "currency"],
    };

    // ── Facile Teams context ─────────────────────────────────────────────────
    if (context === "teams") {
      // 1. Find the team owned by this user
      const team = await Team.findOne({ where: { user_id: userId } });
      if (!team) {
        return res.status(200).json({ STATUS: "SUCCESS", data: [], pagination: { total: 0, page, limit, total_pages: 0 } });
      }

      // 2. Accepted team members that have been assigned a profile
      const teamMembers = await TeamMember.findAll({
        where: { team_id: team.id, invitation_status: "ACCEPTED" },
        attributes: ["user_profile_id", "full_name", "email"],
        raw: true,
      });

      const profileIdToMember = {};
      const profileIds = [];
      for (const m of teamMembers) {
        if (m.user_profile_id) {
          profileIds.push(m.user_profile_id);
          profileIdToMember[m.user_profile_id] = {
            full_name: m.full_name,
            email: m.email,
          };
        }
      }

      if (profileIds.length === 0) {
        return res.status(200).json({ STATUS: "SUCCESS", data: [], pagination: { total: 0, page, limit, total_pages: 0 } });
      }

      // 3. Paginated purchases on those team-member profiles
      const { count, rows } = await ProductPurchase.findAndCountAll({
        where: { user_profile_id: profileIds },
        include: [productInclude],
        order: [["created_at", "DESC"]],
        limit,
        offset,
      });

      // 4. Attach team_member info and normalize image_url
      const data = rows.map((p) => {
        const json = p.toJSON();
        if (json.product?.image_url && !json.product.image_url.startsWith("http")) {
          json.product.image_url = `${SERVER_URL_NORMALIZED}${json.product.image_url}`;
        }
        return { ...json, team_member: profileIdToMember[p.user_profile_id] || null };
      });

      return res.status(200).json({
        STATUS: "SUCCESS",
        data,
        pagination: {
          total: count,
          page,
          limit,
          total_pages: Math.ceil(count / limit),
        },
      });
    }

    // ── Default: Facile (own products) ───────────────────────────────────────
    const { count, rows } = await ProductPurchase.findAndCountAll({
      where: { seller_user_id: userId },
      include: [productInclude],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const data = rows.map((p) => {
      const json = p.toJSON();
      if (json.product?.image_url && !json.product.image_url.startsWith("http")) {
        json.product.image_url = `${SERVER_URL_NORMALIZED}${json.product.image_url}`;
      }
      return json;
    });

    return res.status(200).json({
      STATUS: "SUCCESS",
      data,
      pagination: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("getSellerPurchases error:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};
