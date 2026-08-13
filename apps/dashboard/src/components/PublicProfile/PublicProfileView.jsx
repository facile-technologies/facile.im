"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ImagePlusIcon, X, ChevronLeft, ChevronRight, ShoppingCart, ExternalLink } from "lucide-react";
import { getPublicProfile, productCheckout, detectSource, recordProfileClick } from "@/services/user";
import { mapPublicProfileResponseToState } from "@/lib/publicProfileMapper";
import Loader from "@/store/utils/Loader";

export default function PublicProfileView() {
  const { type, code } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const productCarouselRef = useRef();
  const mediaCarouselRef = useRef();
  const platformCarouselRef = useRef();
  const customCarouselRef = useRef();
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Checkout modal state
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Track which products this browser has purchased
  const [purchasedProducts, setPurchasedProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("purchasedProducts") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Identify the profile by either code or combined type/code
        const identifier = type ? code : code;
        const source = detectSource();
        const response = await getPublicProfile(identifier, source);
        const mappedData = mapPublicProfileResponseToState(response.data);
        setData(mappedData);
      } catch (error) {
        console.error("Failed to load public profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      fetchProfile();
    }
  }, [type, code]);

  const scrollProductCarousel = (direction) => {
    if (productCarouselRef.current) {
      productCarouselRef.current.scrollBy({
        left: direction * 300,
        behavior: "smooth",
      });
    }
  };

  const scrollMediaCarousel = (direction) => {
    if (mediaCarouselRef.current) {
      mediaCarouselRef.current.scrollBy({
        left: direction * 300,
        behavior: "smooth",
      });
    }
  };

  const scrollPlatformCarousel = (direction) => {
    if (platformCarouselRef.current) {
      platformCarouselRef.current.scrollBy({
        left: direction * 200,
        behavior: "smooth",
      });
    }
  };

  const scrollCustomCarousel = (direction) => {
    if (customCarouselRef.current) {
      customCarouselRef.current.scrollBy({
        left: direction * 250,
        behavior: "smooth",
      });
    }
  };

  const downloadVCard = () => {
    const isBusiness = profile_type === "BUSINESS";
    const fullName = isBusiness
      ? profile.business_name
      : `${profile.first_name} ${profile.last_name}`.trim();

    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      isBusiness
        ? `FN:${profile.business_name}`
        : `FN:${fullName}`,
      isBusiness
        ? `ORG:${profile.business_name}`
        : `N:${profile.last_name};${profile.first_name};;;`,
    ];

    if (profile.email) lines.push(`EMAIL:${profile.email}`);
    if (profile.phone) lines.push(`TEL:${profile.phone}`);
    if (profile.website) lines.push(`URL:${profile.website}`);
    if (profile.address) lines.push(`ADR:;;${profile.address};;;;`);
    if (profile.bio) lines.push(`NOTE:${profile.bio.replace(/\n/g, "\\n")}`);
    if (profile.profile_image) lines.push(`PHOTO;VALUE=URI:${profile.profile_image}`);

    // Add social links
    platformLinks.filter(l => l.isVisible && l.url).forEach(link => {
      lines.push(`URL;type=${link.name || "social"}:${link.url}`);
    });

    lines.push("END:VCARD");

    const blob = new Blob([lines.join("\r\n")], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fullName || "contact"}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBuyNow = (product) => {
    setCheckoutProduct(product);
    setBuyerEmail("");
    setBuyerName("");
    setCheckoutError("");
  };

  const getPurchasedInfo = (productId) =>
    purchasedProducts.find((p) => p.productId === productId) || null;

  const handleProductAction = (product) => {
    // EXTERNAL: always redirect to product URL directly, no checkout
    if (product.type === "EXTERNAL") {
      if (product.productUrl) {
        const url = /^https?:\/\//i.test(product.productUrl)
          ? product.productUrl
          : `https://${product.productUrl}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
      return;
    }

    // DIGITAL: check if already purchased
    const purchased = getPurchasedInfo(product.id);
    if (!purchased) {
      handleBuyNow(product);
      return;
    }
    // Already purchased — download first file
    const file = purchased.files?.[0];
    if (file?.url) {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name || "download";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();
    }
  };

  const getProductButtonLabel = (product) => {
    if (product.type === "EXTERNAL") return "Visit Site";
    const purchased = getPurchasedInfo(product.id);
    if (!purchased) return product.ctaText || "Buy Now";
    return "Download";
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!buyerEmail.trim()) {
      setCheckoutError("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail.trim())) {
      setCheckoutError("Please enter a valid email address.");
      return;
    }
    setIsCheckingOut(true);
    setCheckoutError("");
    try {
      const origin = window.location.origin;
      const headingParam = checkoutProduct.successHeading
        ? `&heading=${encodeURIComponent(checkoutProduct.successHeading)}`
        : "";
      const subheadingParam = checkoutProduct.successSubheading
        ? `&subheading=${encodeURIComponent(checkoutProduct.successSubheading)}`
        : "";
      const payload = {
        product_id: checkoutProduct.id,
        user_profile_id: userProfileId,
        buyer_email: buyerEmail.trim(),
        ...(buyerName.trim() && { buyer_name: buyerName.trim() }),
        success_url: `${origin}/purchase/success?product_id=${checkoutProduct.id}${headingParam}${subheadingParam}`,
        cancel_url: `${origin}/purchase/cancel`,
      };
      const response = await productCheckout(payload);
      const result = response.data;
      if (result.STATUS === "SUCCESS" && result.checkout_url) {
        // Save product info to sessionStorage so PurchaseSuccess can persist it
        sessionStorage.setItem(
          "pendingPurchase",
          JSON.stringify({
            productId: checkoutProduct.id,
            type: checkoutProduct.type,
            files: checkoutProduct.files || [],
            productUrl: checkoutProduct.productUrl || null,
            profilePath: window.location.pathname,
          })
        );
        window.location.href = result.checkout_url;
      } else {
        setCheckoutError(
          result.MESSAGE || "Checkout failed. Please try again."
        );
      }
    } catch (err) {
      setCheckoutError(
        err?.response?.data?.MESSAGE || "Something went wrong. Please try again."
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (formErrors[fieldId]) {
      setFormErrors((prev) => ({ ...prev, [fieldId]: undefined }));
    }
  };

  const handleSubmitContact = async () => {
    if (!profile?.id) return;

    // Validate all enabled fields are filled
    const enabledFields = emailFields.filter((f) => f.is_enabled);
    const hasEmpty = enabledFields.some((field) => !formData[field.id]?.trim());
    if (hasEmpty) {
      const firstEmpty = enabledFields.find((field) => !formData[field.id]?.trim());
      const label = firstEmpty?.label || firstEmpty?.placeholder || "field";
      setFormErrors((prev) => ({ ...prev, [firstEmpty.id]: `${label} is required` }));
      return;
    }

    try {
      setIsSubmitting(true);
      // Map field labels/placeholders to values for submitted_data
      const submitted_data = {};
      emailFields
        .filter((f) => f.is_enabled)
        .forEach((field) => {
          const key = field.label || field.placeholder || `Field_${field.id}`;
          submitted_data[key] = formData[field.id] || "";
        });

      const payload = {
        profile_id: profile.id,
        submitted_data,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/profile/public/submit-contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        setShowSuccessModal(true);
        setFormData({}); // Clear form
        setFormErrors({});
      } else {
        console.error("Failed to submit contact form");
      }
    } catch (error) {
      console.error("Error submitting contact form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!data)
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white font-bold">
        Profile not found
      </div>
    );

  const {
    profile_type,
    profile,
    customization,
    platformLinks = [],
    customLinks = [],
    medias = [],
    products = [],
    productCustomization = {},
    sellerHasPaymentSetup = false,
    userProfileId = null,
    linkStyle = "icons",
    iconStyle = "DEFAULT",
    customLinkStyle = "GRID",
    mediaLayout,
    productLayout,
    profileShape,
    saveContact,
    saveBtntext,
    saveBtnBgColor,
    saveBtnTextColor,
    emailToggle,
    emailLayout,
    emailFormTitle,
    emailFormDescription,
    emailBtnBgColor,
    emailBtnText,
    emailBtnTextColor,
    platformLinkBackGroundColor,
    platformNameTextColor,
    platformUrlTextColor,
    custombackgroundColor,
    customtitleColor,
    buttonCornerRadius,
    newsletterButtonRadius,
    saveBtnBBorderRadius,
    backgroundColor,
    titleColor,
    logo,
    emailSuccessMessage,
    fields: emailFields = [],
  } = data;

  const normalizedMediaLayout =
    mediaLayout === "carousel" ? "carousel" : mediaLayout;

  const trackClick = (payload = {}) => {
    if (!userProfileId) return;
    recordProfileClick(userProfileId, payload).catch(() => {});
  };

  const renderGrid = () => (
    <div className="grid grid-cols-2 gap-4 py-2 w-full">
      {customLinks.map((link, idx) => {
        const mainImage = link.thumbnail || null;
        const overlayIcon =
          link.icon && link.icon !== "" ? link.icon : "/facile.svg";
        const isFeatured = idx === 0;

        return (
          <a
            key={link.id}
            href={link.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick({ customLinkId: link.id })}
            className={`relative rounded-[20px] overflow-hidden transition-transform active:scale-95 shadow-sm ${isFeatured ? "col-span-2 aspect-[16/9]" : "col-span-1 aspect-square"}`}
            style={{
              backgroundColor: mainImage
                ? "transparent"
                : custombackgroundColor || "rgba(255,255,255,0.1)",
            }}
          >
            {mainImage && (
              <img
                src={mainImage}
                alt={link.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-2 left-2 w-6 h-6 bg-white/10 backdrop-blur-md rounded-md flex items-center justify-center border border-white/20 z-10">
              <img
                src={overlayIcon}
                alt=""
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/facile.svg";
                }}
              />
            </div>
            <div
              className={`absolute inset-0 flex flex-col justify-end p-2 ${mainImage ? "bg-gradient-to-t from-black/80 via-transparent to-transparent" : ""}`}
            >
              <span
                className="text-white font-bold truncate text-center mt-auto"
                style={{
                  color: customtitleColor || "#fff",
                  fontSize: isFeatured ? "14px" : "11px",
                }}
              >
                {link.title || link.label}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );

  const rendercustomCards = () => (
    <div className="space-y-3 py-2 w-full">
      {customLinks.map((link) => {
        const mainImage = link.thumbnail || null;
        const overlayImage =
          link.icon && link.icon !== "" ? link.icon : "/facile.svg";

        return (
          <a
            key={link.id}
            href={link.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick({ customLinkId: link.id })}
            className="relative block w-full rounded-[20px] overflow-hidden transition-transform active:scale-[0.98] shadow-sm min-h-[80px]"
            style={{
              backgroundColor: custombackgroundColor || "rgba(255,255,255,0.1)",
            }}
          >
            {mainImage && (
              <img
                src={mainImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {mainImage && <div className="absolute inset-0 bg-black/40" />}
            <div className="absolute top-3 left-3 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 z-10">
              <img
                src={overlayImage}
                alt=""
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="relative z-10 flex items-center justify-center h-full min-h-[80px] px-16">
              <span
                className="text-white text-lg font-bold text-center"
                style={{ color: customtitleColor || "#fff" }}
              >
                {link.title || link.label}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );

  const renderCustomCarousel = () => (
    <div className="relative w-full flex items-center justify-center py-4 group">
      <div
        ref={customCarouselRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full px-4 flex-nowrap"
      >
        {customLinks
          .filter((link) => link.isVisible)
          .map((link) => {
            const mainImage = link.thumbnail || null;
            const overlayIcon =
              link.icon && link.icon !== "" ? link.icon : "/facile.svg";
            return (
              <a
                key={link.id}
                href={link.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick({ customLinkId: link.id })}
                className="flex flex-col items-center gap-2 min-w-[130px] group cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <div
                  className="relative w-full h-[110px] rounded-2xl overflow-hidden shadow-sm"
                  style={{
                    backgroundColor: mainImage
                      ? "transparent"
                      : custombackgroundColor || "rgba(255,255,255,0.1)",
                  }}
                >
                  {mainImage && (
                    <img
                      src={mainImage}
                      alt={link.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/facile.svg";
                      }}
                    />
                  )}
                  <div className="absolute top-2 right-2 w-7 h-7 bg-white dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white dark:border-white/40 z-10 shadow-sm">
                    <img
                      src={overlayIcon}
                      alt=""
                      className="w-4 h-4 object-contain rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/facile.svg";
                      }}
                    />
                  </div>
                </div>
                <span
                  className="text-[12px] font-bold truncate w-full text-center"
                  style={{ color: customtitleColor || "#fff" }}
                >
                  {link.title || link.label}
                </span>
              </a>
            );
          })}
      </div>
      {/* Carousel Arrows */}
      {customLinks.filter((link) => link.isVisible).length > 2 && (
        <>
          <button
            onClick={() => scrollCustomCarousel(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollCustomCarousel(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );

  const renderIcons = () => (
    <div className="flex justify-center gap-3 flex-wrap px-4">
      {platformLinks
        .filter((link) => link.isVisible)
        .map((link) => {
          const icon = link?.icons?.[iconStyle] || link.icon;
          return (
            <a
              key={link.id}
              href={link.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick({ platformLinkId: link.id })}
              className="flex items-center justify-center transition-transform active:scale-90"
            >
              <img
                src={icon}
                alt={link.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
            </a>
          );
        })}
    </div>
  );

  const renderCasual = () => (
    <div className="relative w-full flex items-center justify-center py-4 group">
      <div
        ref={platformCarouselRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full px-4 flex-nowrap"
      >
        {platformLinks
          .filter((link) => link.isVisible)
          .map((link) => (
            <a
              key={link.id}
              href={link.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick({ platformLinkId: link.id })}
              className="min-w-[70px] flex flex-col items-center transition-transform active:scale-90"
            >
              <img
                src={link?.icons?.[iconStyle] || link.icon}
                alt={link.name}
                className="w-[66px] h-[66px] object-cover rounded-2xl shadow-sm"
              />
              <p
                className="text-[10px] font-semibold mt-1 truncate text-center w-full px-0.5"
                style={{ color: platformNameTextColor }}
              >
                {link.label || link.name}
              </p>
            </a>
          ))}
      </div>
      {/* Carousel Arrows */}
      {platformLinks.filter((link) => link.isVisible).length > 4 && (
        <>
          <button
            onClick={() => scrollPlatformCarousel(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollPlatformCarousel(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );

  const renderCards = () => (
    <div className="space-y-3 w-full px-4">
      {platformLinks
        .filter((link) => link.isVisible)
        .map((link) => (
          <a
            key={link.id}
            href={link.url || "#"}
            target="_blank"
            onClick={() => trackClick({ platformLinkId: link.id })}
            className="block bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-start gap-4 hover:bg-white/15 transition border border-white/5"
            style={{ backgroundColor: platformLinkBackGroundColor }}
          >
            <img
              src={link?.icons?.[iconStyle] || link.icon}
              alt={link.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0 text-left">
              <p
                className="text-white font-bold truncate"
                style={{ color: platformNameTextColor }}
              >
                {link.label || link.name}
              </p>
              <p
                className="text-xs text-white/60 truncate"
                style={{ color: platformUrlTextColor }}
              >
                {link.url}
              </p>
            </div>
          </a>
        ))}
    </div>
  );

  return (
    <div className="w-full h-screen flex items-center justify-center !bg-white dark:bg-[#111]">
      <div
        className="relative w-full max-w-[600px] h-full md:h-screen shadow-2xl overflow-hidden border border-white/10"
        style={{
          fontFamily: customization.font_family,
          fontSize: `${parseInt(customization.font_size)}px`,
        }}
      >
        {/* Persistent Background Layer */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              customization.background_image &&
              customization.background_image !== "none"
                ? `url(${customization.background_image})`
                : "none",
            backgroundColor: customization.background_color || "#111",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Blur Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0 backdrop-blur-[20px]"
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: `blur(${customization.background_blur / 10}px)`,
          }}
        />

        {/* Scrollable Content Layer */}
        <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar flex flex-col items-center text-center">
          {/* Header Banner */}
          <div className="relative mb-[-45px] w-full flex justify-center shrink-0">
            {profile.banner ? (
              <img src={profile.banner} alt="banner" className="block object-cover object-top rounded-3xl shadow-lg h-[160px] w-full" />
            ) : (
              <div className="w-full h-[120px] bg-white/10 rounded-b-3xl flex items-center justify-center border-b border-white/10">
                <ImagePlusIcon size={32} className="text-white/20" />
              </div>
            )}
          </div>

          {/* Profile Image */}
          <div className="relative z-10 mb-2 shrink-0">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt="profile"
                className={`block mx-auto border-4 border-white dark:border-white/20 bg-white dark:bg-[#777] 
                  ${profileShape === "circle" ? "rounded-full" : "rounded-3xl"} 
                  w-[110px] h-[110px] object-cover shadow-xl`}
              />
            ) : (
              <div
                className={`w-[110px] h-[110px] ${profileShape === "circle" ? "rounded-full" : "rounded-3xl"} bg-[#7B7B7B] border-4 border-white flex items-center justify-center text-xs mx-auto text-white shadow-xl`}
              >
                No Image
              </div>
            )}
          </div>

          {/* Name and Bio */}
          <div className="mb-8 px-6 shrink-0">
            <h4
              className="text-2xl font-black tracking-tight"
              style={{ color: customization.about_text_color || "#fff" }}
            >
              {profile_type === "BUSINESS"
                ? profile.business_name
                : `${profile.first_name} ${profile.last_name}`}
            </h4>
            <p
              className="text-sm opacity-70 mt-2 line-clamp-3 leading-relaxed"
              style={{ color: customization.about_text_color || "#fff" }}
            >
              {profile.bio}
            </p>
          </div>

          {/* Sections Container */}
          <div className="w-full flex-1 flex flex-col gap-8 pb-12">
            {/* Links Section */}
            {platformLinks.length > 0 && (
              <div className="w-full">
                {linkStyle === "icons" && renderIcons()}
                {linkStyle === "carousel" && renderCasual()}
                {linkStyle === "cards" && renderCards()}
              </div>
            )}

            {/* Custom Links Section */}
            {customLinks.length > 0 && (
              <div className="w-full px-4">
                {customLinkStyle === "cards" && rendercustomCards()}
                {customLinkStyle === "carousel" && renderCustomCarousel()}
                {customLinkStyle === "grid" && renderGrid()}
              </div>
            )}

            {/* Connect Section (Newsletter) */}
            {emailToggle && (
              <div
                className="mx-4 dark:bg-[#2B2B2B] rounded-[24px] p-6 flex flex-col gap-4 shadow-2xl border border-white/20"
                style={{ color: titleColor || "#fff" }}
              >
                <div className="text-center">
                  <h3 className="text-xl font-black">{emailFormTitle}</h3>
                  <p className="text-sm opacity-60 mt-1">
                    {emailFormDescription}
                  </p>
                </div>

                <div
                  className={`flex w-full ${emailLayout === "left" && emailFields.filter((f) => f.is_enabled).length === 1 ? "flex-row items-stretch" : "flex-col gap-3"}`}
                >
                  {emailFields
                    .filter((f) => f.is_enabled)
                    .map((field) => (
                      <input
                        key={field.id}
                        placeholder={field.placeholder || field.label}
                        value={formData[field.id] || ""}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
                        className={`w-full p-4 bg-white/5 border text-white text-sm placeholder:text-white/40 focus:bg-white/10 outline-none transition-all ${
                          formErrors[field.id] ? "border-red-400" : "border-white/10"
                        } ${
                          emailLayout === "left" &&
                          emailFields.filter((f) => f.is_enabled).length === 1
                            ? "border-r-0 flex-1"
                            : "rounded-2xl"
                        }`}
                        style={{
                          borderRadius:
                            emailLayout === "left" &&
                            emailFields.filter((f) => f.is_enabled).length === 1
                              ? `${newsletterButtonRadius ?? 16}px 0 0 ${newsletterButtonRadius ?? 16}px`
                              : `${newsletterButtonRadius ?? 16}px`,
                        }}
                      />
                    ))}
                  <button
                    onClick={() => { trackClick({}); handleSubmitContact(); }}
                    disabled={isSubmitting}
                    className={`font-black transition-all active:scale-95 shadow-xl hover:brightness-110 disabled:opacity-50 ${
                      emailLayout === "left" &&
                      emailFields.filter((f) => f.is_enabled).length === 1
                        ? "w-auto px-8 h-auto shrink-0"
                        : "w-full p-4 rounded-2xl"
                    }`}
                    style={{
                      backgroundColor: emailBtnBgColor || "#4F2E86",
                      color: emailBtnTextColor || "#fff",
                      borderRadius:
                        emailLayout === "left" &&
                        emailFields.filter((f) => f.is_enabled).length === 1
                          ? `0 ${newsletterButtonRadius ?? 16}px ${newsletterButtonRadius ?? 16}px 0`
                          : `${newsletterButtonRadius ?? 16}px`,
                    }}
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                    ) : (
                      emailBtnText || "Connect"
                    )}
                  </button>
                </div>
                {emailFields.filter((f) => f.is_enabled).some((f) => formErrors[f.id]) && (
                  <p className="text-red-400 text-xs font-semibold mt-2 px-1">
                    {emailFields.filter((f) => f.is_enabled && formErrors[f.id]).map((f) => formErrors[f.id]).join(", ")}
                  </p>
                )}
              </div>
            )}

            {saveContact && (
              <div className="px-4">
                <button
                  onClick={() => { trackClick({}); downloadVCard(); }}
                  className="w-full py-5 font-black text-lg shadow-2xl transition-all active:scale-[0.98] hover:brightness-110"
                  style={{
                    backgroundColor: saveBtnBgColor || "#a4891c",
                    color: saveBtnTextColor || "#fff",
                    borderRadius: `${saveBtnBBorderRadius ?? 16}px`,
                  }}
                >
                  {saveBtntext}
                </button>
              </div>
            )}

            {/* Ecommerce Section */}
            {products.filter(p => p.isVisible).length > 0 && productCustomization.isVisible !== false && (
              <div className="w-full">
                <div className="flex items-center justify-between mb-3 px-6">
                  <h5 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Store</h5>
                </div>
                {productLayout === "carousel" ? (
                  <div className="relative w-full group">
                    <div
                      ref={productCarouselRef}
                      className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth py-2 px-6 flex-nowrap"
                    >
                      {products.filter(p => p.isVisible).map((product) => (
                        <div
                          key={product.id}
                          className="relative min-w-[280px] h-[200px] rounded-[24px] overflow-hidden shadow-2xl flex-shrink-0 cursor-pointer active:scale-[0.97] transition-transform"
                        >
                          {/* Background Image */}
                          <img
                            src={product.imageUrl || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop"}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          {/* Bottom Info */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-2">
                            <div className="flex flex-col items-start">
                              <span className="text-white font-black text-sm leading-tight line-clamp-2 text-left" style={{ color: productCustomization.mainColor }}>
                                {product.title}
                              </span>
                              <span className="text-white/80 font-bold text-xs mt-0.5 flex flex-col items-start leading-tight" style={{ color: productCustomization.mainColor }}>
                                {product.isOnSale && product.salePrice ? (
                                  <>
                                    <span className="line-through opacity-50">{product.currency} {product.price}</span>
                                    <span>{product.currency} {product.salePrice}</span>
                                  </>
                                ) : (
                                  <span>{product.currency} {product.price}</span>
                                )}
                              </span>
                            </div>
                            <button
                              className="shrink-0 text-xs font-black px-4 py-2 rounded-full shadow-xl active:scale-95 transition whitespace-nowrap flex items-center gap-1"
                              style={{ backgroundColor: productCustomization.buttonBgColor, color: productCustomization.buttonTextColor }}
                              onClick={() => { trackClick({}); handleProductAction(product); }}
                            >
                              {product.type === "EXTERNAL" && <ExternalLink size={11} />}
                              {getProductButtonLabel(product)}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Carousel Arrows */}
                    {products.filter((p) => p.isVisible).length > 1 && (
                      <>
                        <button
                          onClick={() => scrollProductCarousel(-1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => scrollProductCarousel(1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 px-6">
                    {products.filter(p => p.isVisible).map((product) => (
                      <div
                        key={product.id}
                        className="relative w-full h-[190px] rounded-[24px] overflow-hidden shadow-2xl cursor-pointer active:scale-[0.98] transition-transform"
                      >
                        {/* Background Image */}
                        <img
                          src={product.imageUrl || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop"}
                          alt={product.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        {/* Bottom Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-2">
                          <div className="flex flex-col items-start">
                            <span className="text-white font-black text-sm leading-tight text-left" style={{ color: productCustomization.mainColor }}>
                              {product.title}
                            </span>
                            <span className="text-white/80 font-bold text-xs mt-0.5 flex flex-col items-start leading-tight" style={{ color: productCustomization.mainColor }}>
                              {product.isOnSale && product.salePrice ? (
                                <>
                                  <span className="line-through opacity-50">{product.currency} {product.price}</span>
                                  <span>{product.currency} {product.salePrice}</span>
                                </>
                              ) : (
                                <span>{product.currency} {product.price}</span>
                              )}
                            </span>
                          </div>
                          <button
                            className="shrink-0 text-xs font-black px-4 py-2 rounded-full shadow-xl active:scale-95 transition whitespace-nowrap flex items-center gap-1"
                            style={{ backgroundColor: productCustomization.buttonBgColor, color: productCustomization.buttonTextColor }}
                            onClick={() => { trackClick({}); handleProductAction(product); }}
                          >
                            {product.type === "EXTERNAL" && <ExternalLink size={11} />}
                            {getProductButtonLabel(product)}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Media Section */}
            {medias.filter((m) => m.isVisible).length > 0 && (
              <div className="w-full">
                <div className="flex items-center mb-4 px-6">
                  <h5 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">
                    Gallery
                  </h5>
                </div>
                {normalizedMediaLayout === "carousel" ? (
                  <div className="relative w-full group">
                    <div
                      ref={mediaCarouselRef}
                      className={`flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-6 flex-nowrap ${medias.filter((m) => m.isVisible).length === 1 ? "justify-center" : "justify-start"}`}
                    >
                      {medias
                        .filter((m) => m.isVisible)
                        .map((m) => (
                          <div
                            key={m.id}
                            className="min-w-[300px] aspect-[16/10] bg-white/10 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/20 shadow-2xl"
                          >
                            <img
                              src={m.url}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                        ))}
                    </div>
                    {/* Carousel Arrows */}
                    {medias.filter((m) => m.isVisible).length > 1 && (
                      <>
                        <button
                          onClick={() => scrollMediaCarousel(-1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => scrollMediaCarousel(1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 px-4">
                    {medias
                      .filter((m) => m.isVisible)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="aspect-[16/10] bg-white/10 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/20 shadow-xl"
                        >
                          <img
                            src={m.url}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer Branding */}
            <div className="mt-8 pb-12 flex flex-col items-center opacity-30 shrink-0">
              <img src="/facile.svg" className="w-16 grayscale" alt="Facile" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] mt-4 text-white">
                Powering Connectivity
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {/* Checkout Modal */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1C1E] rounded-3xl p-6 w-full max-w-sm border border-white/10 shadow-2xl relative">
            <button
              onClick={() => setCheckoutProduct(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white bg-transparent border-none cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Product mini preview */}
            <div className="flex items-center gap-3 mb-6">
              {checkoutProduct.imageUrl && (
                <img
                  src={checkoutProduct.imageUrl}
                  alt={checkoutProduct.title}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0"
                />
              )}
              <div className="flex flex-col items-start">
                <span className="text-white font-black text-base leading-tight">{checkoutProduct.title}</span>
                <span className="text-white/60 font-bold text-sm mt-0.5">
                  {checkoutProduct.isOnSale && checkoutProduct.salePrice
                    ? `${checkoutProduct.currency} ${checkoutProduct.salePrice}`
                    : `${checkoutProduct.currency} ${checkoutProduct.price}`}
                </span>
              </div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-white/50 text-xs font-bold uppercase tracking-wider">Your Email *</label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="buyer@example.com"
                  className="w-full bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/40 transition"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/50 text-xs font-bold uppercase tracking-wider">Your Name <span className="normal-case text-white/30">(optional)</span></label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/40 transition"
                />
              </div>

              {checkoutError && (
                <p className="text-red-400 text-sm font-semibold text-center px-2">{checkoutError}</p>
              )}

              <button
                type="submit"
                disabled={isCheckingOut}
                className="mt-2 w-full py-3.5 rounded-2xl font-black text-sm transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: productCustomization.buttonBgColor || "#ffffff",
                  color: productCustomization.buttonTextColor || "#000000",
                }}
              >
                {isCheckingOut ? "Redirecting to checkout..." : `Pay ${checkoutProduct.currency} ${checkoutProduct.isOnSale && checkoutProduct.salePrice ? checkoutProduct.salePrice : checkoutProduct.price}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#2B2B2B] rounded-3xl p-8 max-w-sm w-full text-center border border-white/10 shadow-2xl relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 !text-white/40 hover:text-white !bg-transparent"
            >
              <X size={20} className="cursor-pointer " />
            </button>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
            <p className="text-white/60">
              {emailSuccessMessage || "Submitted"}
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 w-full py-3 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
