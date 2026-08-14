// Product purchase delivery, sent from the Stripe webhook.
//
// Previously this lived inline in ProductPayment.controller.js with its own
// nodemailer transport configured for `service: "gmail"` while holding Gandi
// credentials — so it could not send at all in production.
//
// The `||` defaults live here rather than in the controller so that the preview
// harness renders exactly what a buyer receives.
//
// Note the escaping matters more here than anywhere else: title, heading and
// subheading are SELLER-controlled and land in a BUYER's inbox. Without
// escaping, one tenant injects markup into another tenant's email.

import { baseLayout } from "../layout.js";
import {
  ctaButton,
  divider,
  escapeHtml,
  heading,
  linkFallback,
  linkList,
  paragraph,
  sectionLabel,
} from "../blocks.js";

const DEFAULT_HEADING = "Thank you for your purchase!";
const DEFAULT_SUBHEADING = "Hope you enjoy the product!";

export default {
  key: "purchase-delivery",
  usesLogo: true,

  subject: ({ productTitle }) => `Your purchase: ${productTitle || "your order"}`,

  sample: {
    productTitle: "Brand Kit Vol. 2",
    heading: "Your brand kit is ready",
    subheading: "Everything you need to launch, in one download.",
    type: "DIGITAL",
    files: [
      { label: "brand-kit-vol2.zip", href: "https://facile.im/api/uploads/brand-kit-vol2.zip" },
      { label: "usage-guide.pdf", href: "https://facile.im/api/uploads/usage-guide.pdf" },
    ],
    productUrl: null,
  },

  render: (
    { productTitle, heading: h, subheading, type, files = [], productUrl },
    ctx = {}
  ) => {
    const isDigital = type === "DIGITAL";
    const body = [
      heading(escapeHtml(h || DEFAULT_HEADING)),
      paragraph(escapeHtml(subheading || DEFAULT_SUBHEADING), { muted: true }),
    ];

    if (isDigital && files.length > 0) {
      body.push(sectionLabel("Your downloads"), linkList(files));
    } else if (isDigital) {
      // Previously this branch rendered an empty card with no explanation.
      body.push(
        paragraph(
          "Your files are being prepared and will arrive shortly. If they don't turn up, reply to this email and the seller can help.",
          { muted: true }
        )
      );
    } else if (productUrl) {
      body.push(
        ctaButton({ href: productUrl, label: "Access your product" }),
        linkFallback(productUrl)
      );
    }

    body.push(
      divider(),
      paragraph(
        `Order: ${escapeHtml(productTitle || "—")}`,
        { muted: true, size: 13 }
      )
    );

    return baseLayout({
      title: "Your purchase",
      preheader: `Your purchase of ${productTitle || "your order"} is ready.`,
      logoSrc: ctx.logoSrc,
      footerNote:
        "Delivered via Facile. For questions about this product, reply to this email to reach the seller.",
      bodyHtml: body.join("\n"),
    });
  },

  text: ({ productTitle, files = [], productUrl, type }) => {
    const lines = [`Your purchase: ${productTitle || "your order"}`, ""];
    if (type === "DIGITAL" && files.length) {
      lines.push("Your downloads:");
      files.forEach((f) => lines.push(`  ${f.label}: ${f.href}`));
    } else if (productUrl) {
      lines.push(`Access your product: ${productUrl}`);
    }
    return lines.join("\n");
  },
};
