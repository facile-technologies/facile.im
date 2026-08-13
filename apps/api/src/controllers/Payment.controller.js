import Stripe from "stripe";
import { User, Plan, UserPlan } from "../models/Association.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

export const createCheckoutSession = async (req, res, next) => {
  try {
    const userId = req.user.id; // from token middleware
    const { planId, successUrl, cancelUrl } = req.body;

    if (!planId) {
      return res.status(400).json({ STATUS: "ERROR", MESSAGE: "planId is required" });
    }

    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(404).json({ STATUS: "ERROR", MESSAGE: "Plan not found" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ STATUS: "ERROR", MESSAGE: "User not found" });
    }

    // Attempt to make a stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.title,
              description: plan.description,
            },
            unit_amount: Math.round(plan.price * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment-cancel`,
      customer_email: user.email,
      metadata: {
        userId: user.id.toString(),
        planId: plan.id.toString(),
      },
    });

    // Create a pending UserPlan record
    await UserPlan.create({
      user_id: user.id,
      plan_id: plan.id,
      stripe_session_id: session.id,
      status: "PENDING",
    });

    return res.status(200).json({
      STATUS: "SUCCESS",
      MESSAGE: "Checkout session created directly",
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error in createCheckoutSession:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};

export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET in environment");
    return res.status(400).send("Webhook secret is missing");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { userId, planId } = session.metadata || {};

      if (!userId || !planId) {
        console.error("Missing metadata in session:", session.id);
        return res.status(400).send("Missing metadata");
      }

      const plan = await Plan.findByPk(planId);
      if (!plan) {
        console.error("Plan not found in webhook for planId:", planId);
        return res.status(400).send("Plan not found");
      }

      // Calculate end date based on duration
      let durationDays = 30; // default to monthly
      const planDurationStr = plan.duration ? plan.duration.toLowerCase() : "";
      if (planDurationStr.includes("year")) {
        durationDays = 365;
      } else if (planDurationStr.includes("month")) {
        durationDays = 30;
      } else if (planDurationStr.includes("week")) {
        durationDays = 7;
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + durationDays);

      // Cancel any previously active plans for this user so they don't have multiple ACTIVE plans
      await UserPlan.update(
        { status: "CANCELED" },
        { where: { user_id: userId, status: "ACTIVE" } }
      );

      // find the pending user plan
      let userPlan = await UserPlan.findOne({
        where: { stripe_session_id: session.id },
      });

      if (userPlan) {
        // Update existing pending record
        await userPlan.update({
          status: "ACTIVE",
          stripe_customer_id: session.customer,
          start_date: startDate,
          end_date: endDate,
          duration_days: durationDays,
        });
      } else {
        // Create new record (fallback if pending was not created)
        userPlan = await UserPlan.create({
          user_id: userId,
          plan_id: planId,
          stripe_session_id: session.id,
          stripe_customer_id: session.customer,
          status: "ACTIVE",
          start_date: startDate,
          end_date: endDate,
          duration_days: durationDays,
        });
      }

      // Also update User.plan_id
      await User.update({ plan_id: planId }, { where: { id: userId } });

      console.log(`Payment successful for user ${userId}, plan ${planId}`);
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send().end();
  } catch (error) {
    console.error("Error in webhook handling:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find any ACTIVE plans for this user based on end_date logic 
    const activePlans = await UserPlan.findAll({
      where: { user_id: userId, status: "ACTIVE" }
    });

    if (!activePlans || activePlans.length === 0) {
      return res.status(404).json({ STATUS: "ERROR", MESSAGE: "No active subscription found to cancel." });
    }

    // Attempt to cancel it gracefully in Stripe using cancel_at_period_end
    for (const plan of activePlans) {
      if (plan.stripe_customer_id) {
        try {
          const subscriptions = await stripe.subscriptions.list({
            customer: plan.stripe_customer_id,
            status: 'active',
          });
          
          for (const sub of subscriptions.data) {
            await stripe.subscriptions.update(sub.id, {
              cancel_at_period_end: true,
            });
          }
        } catch (stripeErr) {
          console.error("Failed to cancel Stripe subscription:", stripeErr.message);
        }
      }
    }

    // Mark them as canceled internally
    await UserPlan.update(
      { status: "CANCELED" },
      { where: { user_id: userId, status: "ACTIVE" } }
    );

    // Keep the plan_id intact so they don't immediately lose access, 
    // depending entirely on the dashboard's end_date query.
    // await User.update({ plan_id: null }, { where: { id: userId } });

    return res.status(200).json({
      STATUS: "SUCCESS",
      MESSAGE: "Your subscription has been successfully canceled."
    });

  } catch (error) {
    console.error("Error in cancelSubscription:", error);
    return res.status(500).json({ STATUS: "ERROR", MESSAGE: error.message });
  }
};
