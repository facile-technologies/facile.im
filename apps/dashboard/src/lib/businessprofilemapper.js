import base64 from "base-64"; // or use btoa if in browser

// src/lib/profileMapper.js

// Helper to safely encode SVG strings to base64 data URL (no external package needed)
const svgToDataUrl = (svgString) => {
  if (!svgString || !svgString.trim().startsWith("<svg")) return svgString;
  try {
    const encoded = btoa(unescape(encodeURIComponent(svgString)));
    return `data:image/svg+xml;base64,${encoded}`;
  } catch (e) {
    console.warn("Failed to encode SVG icon:", e);
    return svgString; // fallback
  }
};

export const mapbusinessProfileViewResponseToState = (data) => {
  const profile = data.profile || {};
  const customization = data.customization || {};
  const linkCustomization = data.linkCustomization || {};
  const customLinkCustomization = data.customLinkCustomization || {};
  const mediaCustomization = data.mediaCustomization || {};
  const contact = data.contact || {};
  const saveContact = data.saveContact || {};
  const contactFields = data.contactFields || [];

  // === Platform Links ===
  const platformLinks = (data.links || []).map((link) => {
    const pl = link.PlatformLink || {};
    const iconSrc = svgToDataUrl(pl.default_icon);

    return {
      id: link.id,
      name: pl.name || link.title,
      icon: iconSrc,
      url: link.url,
      label: link.title || pl.name,
      isVisible: link.is_visible,
    };
  });

  // === Custom Links ===
  const customLinks = (data.customLinks || []).map((cl) => ({
    id: cl.id,
    name: cl.title,
    label: cl.title,
    url: cl.url,
    icon: cl.icon || cl.thumbnail || "",
    isVisible: cl.is_visible,
  }));

  // === Media ===
  const medias = (data.media || []).map((m) => ({
    id: m.id,
    productImage: m.media_url, // reused field in preview
    productTitle: "",
  }));

  // === Layout Mappings ===
  const linkStyleMap = {
    ICONS: "icons",
    CAROUSAL: "carousel",
    CARDS: "cards",
  };

  const customLinkStyleMap = {
    GRID: "grids",
    CARDS: "cards",
    CAROUSAL: "carousel",
  };

  const mediaLayoutMap = {
    CAROUSAL: "carousel",
    CARD: "card",
  };

  // Determine if email form should be toggled on
  const hasEnabledEmailField = contactFields.some(
    (f) => f.field_type === "EMAIL" && f.is_enabled,
  );

  return {
    // Profile basics
    profile: {
      business_name: profile.business_name || "", // ← snake_case
      last_name: profile.last_name || "",
      bio: profile.bio || "",
      banner: profile.banner || null,
      profile_image: profile.profile_image || null,
      username: profile.username || "",
    },
    profile_image: profile.profile_image || null,
    logo: profile.logo || null,
    banner: profile.banner || null,

    // General Customization (background, text, font)
    customization: {
      about_text_color: customization.about_text_color || "#ffffff",
      font_family: customization.font_family || "Arial",
      font_size: customization.font_size || 14,
      background_color:
        customization.background_color === "none"
          ? "#000000"
          : customization.background_color,
      background_image: customization.background_image || null,
      background_blur: customization.background_blur || 0,
    },

    // Platform Links Styling
    linkStyle: linkStyleMap[linkCustomization.layout] || "icons",
    backgroundColor: linkCustomization.background_color || "#000000",
    titleColor: linkCustomization.title_color || "#ffffff",
    linkColor: linkCustomization.link_color || "#ffffff",

    // Custom Links Styling
    customLinkStyle:
      customLinkStyleMap[customLinkCustomization.layout] || "grids",
    custombackgroundColor:
      customLinkCustomization.background_color || "#000000",
    customtitleColor: customLinkCustomization.title_color || "#ffffff",

    // Links
    platformLinks,
    customLinks,

    // Media
    medias,
    mediaLayout: mediaLayoutMap[mediaCustomization.layout] || "carousel",

    // Contact Form (Email Capture)
    emailToggle: contact.is_enabled && hasEnabledEmailField,
    emailLayout: contact.layout === "CARD" ? "right" : "left", // CARD → right, COMPACT → left
    emailFormTitle: contact.title || "",
    emailFormDescription: contact.description || "",
    emailBtnText: contact.button_text || "Connect",
    emailBtnBgColor: contact.button_bg_color || "#4F2E86",
    emailBtnTextColor: contact.button_text_color || "#ffffff",
    emailSuccessMessage: contact.success_message || "",
    buttonCornerRadius: contact.button_corner_radius || 19,

    // Save Contact Button
    saveContact: !!saveContact.id, // true if exists
    saveBtntext: saveContact.button_text || "Save Contact",
    saveBtnBgColor: saveContact.button_bg_color || "#a4891c",
    saveBtnTextColor: saveContact.button_text_color || "#1552ab",

    // Products (none in this profile)
    products: [],
    productLayout: "carousel",

    // Others
    leadCapture: false,
    profileShape: "circle",
    loading: false,
  };
};
