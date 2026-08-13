import base64 from "base-64";

const svgToDataUrl = (svgString) => {
  if (!svgString || !svgString.trim().startsWith("<svg")) return svgString;
  try {
    const encoded = btoa(unescape(encodeURIComponent(svgString)));
    return `data:image/svg+xml;base64,${encoded}`;
  } catch (e) {
    console.warn("Failed to encode SVG icon:", e);
    return svgString;
  }
};

export const mapPublicProfileResponseToState = (data) => {
  const profileType = data.profileType || "personal";
  const profile = data.profile || {};
  const customization = data.customization || {};
  const linkCustomization = data.linkCustomization || {};
  const customLinkCustomization = data.customLinkCustomization || {};
  const mediaCustomization = data.mediaCustomization || {};
  const contact = data.contact || {};
  const saveContact = data.saveContact || {};
  const contactFields = data.contactFields || [];
  const customLinks = (data.customLinks || []).map((cl) => ({
    id: cl.id,
    title: cl.title,
    name: cl.title,
    label: cl.title,
    url: cl.url,
    icon: cl.icon || "",
    thumbnail: cl.thumbnail || "",
    isVisible: cl.is_visible ?? true,
  }));
  const medias = (data.media || []).map((m) => ({
    id: m.id,
    url: m.media_url,
    sequence: m.sequence,
    isVisible: m.is_visible ?? true,
  }));

  const linkStyleMap = {
    ICONS: "icons",
    CAROUSAL: "carousel",
    CARDS: "cards",
  };

  const customLinkStyleMap = {
    GRID: "grid",
    CARDS: "cards",
    CAROUSAL: "carousel",
  };

  const mediaLayoutMap = {
    CAROUSAL: "carousel",
    CARDS: "cards",
    CARD: "cards",
  };

  return {
    profile_type: profileType || "personal",
    profile: {
      id: profile.id || null,
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      business_name: profile.business_name || "",
      bio: profile.bio || "",
      banner: profile.banner || null,
      profile_image: profile.profile_image || null,
      username: profile.username || "",
      logo: profile.logo || null,
      last_username_update: profile.last_username_update || null,
      profile_type: profile.profile_type || "personal",
      email: profile.email || "",
      phone: profile.phone || profile.phone_number || "",
      website: profile.website || "",
      address: profile.address || "",
    },
    profile_image: profile.profile_image || null,
    logo: profile.logo || null,
    banner: profile.banner || null,
    customization: {
      id: customization.id || null,
      user_profile_id: customization.user_profile_id || null,
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
    linkStyle: linkStyleMap[linkCustomization.layout] || "icons",
    iconStyle: linkCustomization.icon_styled || "DEFAULT",
    platformLinkBackGroundColor:
      linkCustomization.background_color || "#000000",
    platformNameTextColor: linkCustomization.title_color || "#ffffff",
    platformUrlTextColor: linkCustomization.link_color || "#ffffff",
    customLinkStyle:
      customLinkStyleMap[customLinkCustomization.layout] || "grid",
    custombackgroundColor:
      customLinkCustomization.background_color || "#000000",
    customtitleColor: customLinkCustomization.title_color || "#ffffff",
    platformLinks: (data.links || []).map((link) => {
      const pl = link.PlatformLink || {};
      return {
        id: link.id,
        title: link.title || pl.name,
        name: pl.name || link.title || "Link",
        icon: svgToDataUrl(pl.default_icon),
        icons: {
          DEFAULT: svgToDataUrl(pl.default_icon),
          BLACK: svgToDataUrl(pl.black_icon),
          STROKED: svgToDataUrl(pl.stroked_icon),
          COLORED: svgToDataUrl(pl.colored_icon),
          WHITE: svgToDataUrl(pl.white_icon),
        },
        url: link.url,
        label: link.title || pl.name,
        isVisible: link.is_visible ?? true,
      };
    }),
    customLinks,
    medias,
    mediaLayout: mediaLayoutMap[mediaCustomization.layout] || "carousel",
    emailToggle: contact.is_enabled,
    emailLayout: contact.layout === "CARD" ? "right" : "left",
    emailFormTitle: contact.title || "",
    emailFormDescription: contact.description || "",
    emailBtnText: contact.button_text || "Connect",
    emailBtnBgColor: contact.button_bg_color || "#4F2E86",
    emailBtnTextColor: contact.button_text_color || "#ffffff",
    emailSuccessMessage: contact.success_message || "",
    buttonCornerRadius: contact.button_corner_radius || 19,
    saveContact: !!saveContact.is_enabled,
    saveBtntext: saveContact.button_text || "Save Contact",
    saveBtnBgColor: saveContact.button_bg_color || "#a4891c",
    saveBtnTextColor: saveContact.button_text_color || "#1552ab",
    saveBtnBBorderRadius: saveContact.button_corner_radius || 19,
    userProfileId: customization.user_profile_id || null,
    sellerHasPaymentSetup: data.seller_has_payment_setup || false,
    products: (data.products || []).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      salePrice: p.sale_price,
      isOnSale: p.is_on_sale,
      currency: p.currency || "USD",
      ctaText: p.cta_text || "Buy Now",
      imageUrl: p.image_url || null,
      productUrl: p.product_url || null,
      type: p.type,
      isVisible: p.is_visible ?? true,
      sequence: p.sequence ?? 0,
      files: p.files || [],
      successHeading: p.success_heading || null,
      successSubheading: p.success_subheading || null,
    })),
    productLayout:
      data.productCustomization?.layout === "CAROUSAL" ||
      data.productCustomization?.layout === "CAROUSAL"
        ? "carousel"
        : data.productCustomization?.layout === "CARDS"
          ? "cards"
          : "carousel",
    productCustomization: {
      mainColor: data.productCustomization?.main_color || "#FFFFFF",
      buttonBgColor: data.productCustomization?.button_bg_color || "#000000",
      buttonTextColor:
        data.productCustomization?.button_text_color || "#FFFFFF",
      isVisible: data.productCustomization?.is_visible ?? true,
    },
    leadCapture: false,
    fields: contactFields
      .map((f, i) => ({
        id: f.id ?? Date.now() + i,
        field_type: (f.field_type ?? "").toUpperCase(),
        label: f.label ?? "",
        placeholder: f.placeholder ?? "",
        is_enabled: f.is_enabled ?? true,
        sort_order: f.sort_order ?? i + 1,
      }))
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    profileShape: "circle",
    loading: false,
  };
};
