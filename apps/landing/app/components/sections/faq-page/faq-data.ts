/**
 * FAQ content for the standalone /faq page.
 *
 * Copy is hand-written in a warm, human voice for the Facile NFC smart-card
 * product, grouped into the category tabs shown in the design — Getting Started,
 * NFC Cards, Profile & Links, Shipping, Billing, Technical (compatibility, QR
 * fallback, profile updates, shipping, privacy/security, returns, bulk orders).
 */
export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  label: string;
  items: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    items: [
      {
        question: "What exactly is Facile?",
        answer:
          "Facile is a smart card paired with a digital profile. Tap your card on any phone and it instantly opens your profile — links, socials, contact details, whatever you want to share. Think of it as your whole introduction in a single tap. No app, ever.",
      },
      {
        question: "How does the tap actually work?",
        answer:
          "There's a tiny NFC chip inside every card. When a phone comes close, the chip wakes up and pops your profile open in the browser — no pairing, no battery, nothing to install. It's the same technology your phone already uses to pay at the till.",
      },
      {
        question: "Does anyone need to download an app?",
        answer:
          "Nope — not you, and not the person you're tapping. Your card opens instantly in any mobile browser, and you edit your profile from any browser too. Zero friction on both ends.",
      },
      {
        question: "Can I change my profile after my card ships?",
        answer:
          "Absolutely. Edit your profile anytime and changes go live instantly. New job, new number, new link — your card always points to the latest you, no reprint needed.",
      },
    ],
  },
  {
    id: "nfc-cards",
    label: "NFC Cards",
    items: [
      {
        question: "Will it work with my phone?",
        answer:
          "Almost certainly. Every iPhone since the iPhone 7 and basically every modern Android has NFC built in and switched on by default. Just hold the card near the top-back of the phone and your profile pops up.",
      },
      {
        question: "What if someone's phone won't tap?",
        answer:
          "No problem — every card has a laser-engraved QR code on the back. If a phone can't tap, or NFC happens to be off, they just open the camera, point it at the code, and land on the exact same profile.",
      },
      {
        question: "Will the card wear out over time?",
        answer:
          "It won't. The chip is passive — no battery, no moving parts, nothing to drain or break. Toss it in your wallet and tap away; it's built to keep working for years.",
      },
    ],
  },
  {
    id: "profile-links",
    label: "Profile & Links",
    items: [
      {
        question: "What can I put on my profile?",
        answer:
          "Pretty much anything you'd want to share: contact details, socials, your website, payment links, portfolio, a calendar booking link, and more. Arrange and label every section exactly the way you want people to see it.",
      },
      {
        question: "Can people save my contact in one tap?",
        answer:
          "Yes. Your profile has a one-tap \"Save Contact\" button that drops your details straight into the other person's phone as a contact card — no typing, no missed digits.",
      },
      {
        question: "Can I link more than one card to a profile?",
        answer:
          "Of course. Link as many cards as you like to a single profile — handy for a backup, a different finish, or a card you keep at your desk. They all point to the same, always-current profile.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping",
    items: [
      {
        question: "How fast will my card arrive?",
        answer:
          "We print and ship within 2–3 business days, and standard delivery usually lands in 5–7. You'll get a tracking link by email the moment it's on its way.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "We do — worldwide. Delivery times and any customs fees depend on where you are, and you'll see the full estimate at checkout before you pay a thing.",
      },
      {
        question: "What's your return policy?",
        answer:
          "Unused cards can come back within 30 days for a full refund. And if a card ever shows up faulty, we'll replace it free — just message support and we'll sort it.",
      },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    items: [
      {
        question: "Is there a monthly subscription?",
        answer:
          "None. The card is a one-time purchase and your digital profile comes free with it. No recurring fees, no \"premium\" wall to keep it working — buy it once, use it forever.",
      },
      {
        question: "Do you do team or bulk orders?",
        answer:
          "We do. Teams get volume pricing and a single dashboard to manage everyone's branded cards and profiles in one place. Get in touch and we'll put together a quote.",
      },
      {
        question: "Which payment methods do you accept?",
        answer:
          "All the major credit and debit cards, plus Apple Pay and Google Pay. Every payment runs over an encrypted, secure connection.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    items: [
      {
        question: "Is my data safe?",
        answer:
          "Yes. The chip only ever holds a link to your profile — never your personal data. You choose exactly which details are public, and you can pause or update your profile in seconds from your account.",
      },
      {
        question: "What if I lose my card?",
        answer:
          "Your profile lives in your account, not on the card, so nothing personal is exposed. Just deactivate the lost card's link from your dashboard — it'll stop opening your profile — and order a replacement.",
      },
      {
        question: "Do you ever sell my information?",
        answer:
          "Never. We don't sell your data, full stop. Your profile only shares what you choose to make public, and you stay in complete control of what visitors can see.",
      },
    ],
  },
];
