import { useDispatch, useSelector } from "react-redux";
import {
  selectProfile,
  selectImages,
  selectCustom,
  selectCustomization,
} from "@/app/stores/selectors/profileSelectors";
import { ImagePlusIcon, X } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import {
  setContactFieldValue,
  setLeadCapture,
  setProfileViewData,
} from "@/app/stores/slices/profileSlice";
import { getUserProfile } from "@/services/user";
import { mapProfileViewResponseToState } from "@/lib/profileMapper";

export default function LivePreview() {
  const profileType = useSelector((state) => state.profile.profileType);
  const isBusiness = profileType === "business";

  const profile = useSelector(selectProfile);
  const customCarouselRef = useRef(null);
  const platformCarouselRef = useRef(null);

  const { profile_image, logo, banner } = useSelector(selectImages);
  const {
    font_family,
    font_size,
    about_text_color,
    background_color,
    background_image,
    background_blur,
  } = useSelector(selectCustomization);

  const emailFields = useSelector((state) => state.profile.fields);
  const { linkColor, titleColor, backgroundColor } = useSelector(
    (state) => state.profile,
  );
  const platformLinkBackGroundColor = useSelector(
    (state) => state.profile.platformLinkBackGroundColor,
  );
  const platformNameTextColor = useSelector(
    (state) => state.profile.platformNameTextColor,
  );
  const platformUrlTextColor = useSelector(
    (state) => state.profile.platformUrlTextColor,
  );
  const emailFormTitle = useSelector((state) => state.profile.emailFormTitle);
  const emailFormDescription = useSelector(
    (state) => state.profile.emailFormDescription,
  );
  const newsletterButtonRadius = useSelector(
    (state) => state.profile.newsletterButtonRadius,
  );
  const saveBtnBBorderRadius = useSelector(
    (state) => state.profile.saveBtnBBorderRadius,
  );
  const { customtitleColor, custombackgroundColor } = useSelector(
    (state) => state.profile,
  );
  const leadCapture = useSelector((state) => state.profile.leadCapture);
  const emailLayout = useSelector((state) => state.profile.emailLayout);
  const saveContact = useSelector((state) => state.profile.saveContact);
  const products = useSelector((state) => state.profile.products);
  const productLayout = useSelector((state) => state.profile.productLayout);
  const mediaLayout = useSelector((state) => state.profile.mediaLayout);
  const medias = useSelector((state) => state.profile.medias);
  const normalizedMediaLayout =
    mediaLayout === "carousel" ? "carousel" : mediaLayout;
  const emailToggle = useSelector((state) => state.profile.emailToggle);
  const emailBtnBg = useSelector((s) => s.profile.emailBtnBgColor);
  const emailBtnText = useSelector((s) => s.profile.emailBtnTextColor);
  const saveBtnBg = useSelector((s) => s.profile.saveBtnBgColor);
  const saveBtnText = useSelector((s) => s.profile.saveBtnTextColor);
  const buyBtnBgColor = useSelector((s) => s.profile.buyBtnBgColor);
  const buyBtnTextColor = useSelector((s) => s.profile.buyBtnTextColor);
  const profileShape = useSelector((state) => state.profile.profileShape);
  const { saveBtntext } = useSelector((state) => state.profile);
  const emailtext = useSelector((state) => state.profile.emailBtnText);

  const productCardbgColor = useSelector(
    (state) => state.profile.productCardbgColor,
  );
  const productCardTextColor = useSelector(
    (state) => state.profile.productCardTextColor,
  );

  const visibleProducts = products.filter((product) => product.isVisible);
  const customization = useSelector((state) => state.profile.customization);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   const loadProfile = async () => {
  //     try {
  //       const response = await getUserProfile();
  //       const data = response.data;

  //       const mappedState = mapProfileViewResponseToState(data);

  //       dispatch(setProfileViewData(mappedState));
  //     } catch (error) {
  //       console.error("Failed to load profile", error);
  //     }
  //   };

  //   loadProfile();
  // }, [dispatch]);
  const productCarouselRef = useRef();
  const mediaCarouselRef = useRef();
  const scrollProductCarousel = (direction) => {
    const el = productCarouselRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction * 280,
      behavior: "smooth",
    });
  };

  const scrollMediaCarousel = (direction) => {
    const el = mediaCarouselRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction * 280,
      behavior: "smooth",
    });
  };

  const platformLinks = useSelector(
    (state) => state.profile.platformLinks || [],
  );
  const customLinks = useSelector((state) => state.profile.customLinks || []);
  const { linkStyle = "icons", customLinkStyle = "GRID" } = useSelector(
    (s) => s.profile || {},
  );

  const showPlatformLinks = platformLinks.length > 0 || customLinks.length > 0;
  const [index, setIndex] = useState(0);
  const visibleCount = 3;
  const showArrows = platformLinks.length > visibleCount;
  const start = index;
  const end = start + visibleCount;
  const visibleLinks = showArrows
    ? [
        ...platformLinks.slice(start, end),
        ...platformLinks.slice(0, Math.max(0, end - platformLinks.length)),
      ]
    : platformLinks;

  const CARD_WIDTH = 90;

  const scrollPlatformNext = (dir) => {
    platformCarouselRef.current?.scrollBy({
      left: dir * CARD_WIDTH,
      behavior: "smooth",
    });
  };

  const scrollPlatformPrev = () => {
    platformCarouselRef.current?.scrollBy({
      left: -CARD_WIDTH,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    customCarouselRef.current?.scrollBy({
      left: CARD_WIDTH,
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    customCarouselRef.current?.scrollBy({
      left: -CARD_WIDTH,
      behavior: "smooth",
    });
  };

  const getOverlayIcon = (link) => {
    if (link.icon) return link.icon;
    if (logo) return logo;
    return "/facile.svg";
  };

  const getThumbnail = (link) => {
    return link.thumbnail || null;
  };

  const renderGrid = () => {
    return (
      <div className="grid grid-cols-2 gap-4 py-2 w-full">
        {customLinks.map((link, idx) => {
          const mainImage = link.thumbnail || null;
          // 🛡️ Strict fallback
          const overlayIcon =
            link.icon && link.icon !== ""
              ? link.icon
              : logo && logo !== mainImage
                ? logo
                : "/facile.svg";
          const isFeatured = idx === 0;

          return (
            <a
              key={link.id}
              href={link.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative rounded-[20px] overflow-hidden transition-transform active:scale-95 shadow-sm ${isFeatured ? "col-span-2 aspect-[16/9]" : "col-span-1 aspect-square"}`}
              style={{
                backgroundColor: mainImage
                  ? "transparent"
                  : custombackgroundColor || "#1C1D2d",
              }}
            >
              {mainImage && (
                <img
                  src={mainImage}
                  alt={link.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Tiny Overlay for grid items */}
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
  };

  const rendercustomCards = () => (
    <div className="space-y-3 py-2">
      {customLinks.map((link) => {
        const mainImage = link.thumbnail || null;
        // 🛡️ Strict fallback
        const overlayImage =
          link.icon && link.icon !== ""
            ? link.icon
            : logo && logo !== mainImage
              ? logo
              : "/facile.svg";

        return (
          <a
            key={link.id}
            href={link.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block w-full rounded-[20px] overflow-hidden transition-transform active:scale-[0.98] shadow-sm min-h-[80px]"
            style={{ backgroundColor: custombackgroundColor || "#1C1D2d" }}
          >
            {/* Background Thumbnail for Case 2 & 3 */}
            {mainImage && (
              <img
                src={mainImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Dark Overlay for text legibility if thumbnail exists */}
            {mainImage && <div className="absolute inset-0 bg-black/40" />}

            {/* Top-Left Logo/Icon Overlay (Always shown in all 3 cases) */}
            <div className="absolute top-3 left-3 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 z-10">
              <img
                src={overlayImage}
                alt=""
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/facile.svg";
                }}
              />
            </div>

            {/* Title Text */}
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
    <div className="relative w-full flex items-center py-4">
      {showArrows && (
        <button
          onClick={handlePrev}
          className="absolute left-2 z-10  text-white! text-[40px]! bg-transparent! p-2 rounded-full"
        >
          &#8249;
        </button>
      )}

      <div
        ref={customCarouselRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full px-4"
      >
        {customLinks.map((link) => {
          const mainImage = link.thumbnail || null;
          // 🛡️ Strict fallback
          const overlayIcon =
            link.icon && link.icon !== ""
              ? link.icon
              : logo && logo !== mainImage
                ? logo
                : "/facile.svg";

          return (
            <div
              key={link.id}
              className="flex flex-col items-center gap-2 min-w-[70px]"
            >
              <div
                className="relative w-16 h-16 rounded-[20px] overflow-hidden shadow-sm"
                style={{
                  backgroundColor: mainImage
                    ? "transparent"
                    : custombackgroundColor || "#1C1D2d",
                }}
              >
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={link.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Overlay for carousel items */}
                <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-white/10 backdrop-blur-md rounded-md flex items-center justify-center border border-white/20 z-10">
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
              </div>
              <p
                className="text-[11px] font-semibold truncate w-full text-center"
                style={{ color: customtitleColor || "#fff" }}
              >
                {link.label || link.title}
              </p>
            </div>
          );
        })}
      </div>

      {showArrows && (
        <button
          onClick={handleNext}
          className="absolute right-2 z-10  text-white! text-[40px]! bg-transparent! p-2 rounded-full"
        >
          &#8250;
        </button>
      )}
    </div>
  );

  const renderIcons = () => (
    <div className="flex justify-center gap-3 flex-wrap">
      {platformLinks
        .filter((link) => link.isVisible)
        .map((link) => (
          <a
            key={link.id}
            href={link.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition"
          >
            <img src={link.icon} alt={link.name} className="w-8 h-8" />
          </a>
        ))}
    </div>
  );

  const renderCasual = () => (
    <div className="relative w-full flex items-center py-4">
      {showArrows && (
        <button
          onClick={() => scrollPlatformPrev(-1)}
          className="absolute left-2  text-white! text-[40px]! bg-transparent! p-2 rounded-full"
        >
          &#8249;
        </button>
      )}

      <div
        ref={platformCarouselRef}
        className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar w-full"
      >
        {platformLinks
          .filter((link) => link.isVisible)
          .map((link) => (
            <div
              key={link.id}
              className="min-w-[100px] shrink-0 flex flex-col items-center"
            >
              <img src={link.icon} className="w-16 h-16 mb-2" />
              <p style={{ color: titleColor }}>{link.label || link.name}</p>
            </div>
          ))}
      </div>

      {showArrows && (
        <button
          onClick={() => scrollPlatformNext(1)}
          className="absolute right-2  text-white! text-[40px]! bg-transparent!  p-2 rounded-full"
        >
          &#8250;
        </button>
      )}
    </div>
  );

  const renderCards = () => (
    <div className="space-y-3">
      {platformLinks
        .filter((link) => link.isVisible)
        .map((link) => (
          <a
            key={link.id}
            href={link.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/10 rounded-xl p-4 flex items-start gap-3 hover:bg-white/15 transition"
            style={{
              backgroundColor: platformLinkBackGroundColor,
            }}
          >
            <img
              src={link.icon}
              alt={link.name}
              className="w-10 h-10 rounded"
            />
            <div className="flex-1 min-w-0 text-left">
              <p
                className="text-white font-medium truncate"
                style={{ color: platformNameTextColor }}
              >
                {link.label || link.name}
              </p>
              <p
                className="text-xs text-gray-300 truncate"
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
    <div
      className="relative w-full lg:w-[520px] h-screen rounded-3xl overflow-x-hidden overflow-y-visible shadow-lg"
      style={{
        color: titleColor || "#fff",
        backgroundColor: backgroundColor || "#fff",
        fontFamily: customization.font_family,
        fontSize: `${parseInt(customization.font_size)}px`,
      }}
    >
      {/* Contact Form Overlay */}
      {leadCapture && (
        <div
          className="absolute top-15 left-1/2 -translate-x-1/2 bg-white dark:bg-[#FFFFFF] rounded-[30px] shadow-lg z-50"
          style={{
            width: "298px",
            height: "606px",
            padding: "20px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
            borderRadius: "30px",
          }}
        >
          <X
            onClick={() => dispatch(setLeadCapture(false))}
            className="absolute top-0 right-0 w-6 h-6 bg-black text-white rounded-2xl p-1 cursor-pointer hover:scale-110 transition"
          />

          <h3 className="text-xl font-bold text-black">
            Connect with {profile.first_name} {profile.last_name}
          </h3>
          <form className="mt-4">
            <div className="mb-4">
              <label htmlFor="first_name" className="block text-sm text-black ">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="w-full h-12 p-2 mt-2 rounded-[9px] bg-[#4F4C4C1A] text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="last_name" className="block text-sm text-black">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="w-full p-2 mt-2 rounded-md bg-[#4F4C4C1A] text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm text-black">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="w-full p-2 mt-2 rounded-md bg-[#4F4C4C1A] text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 mt-2 rounded-md bg-[#4F4C4C1A] text-black"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm text-black">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full p-2 mt-2 rounded-md bg-[#4F4C4C1A] text-black"
              ></textarea>
            </div>

            <button
              type="submit"
              className="leadCapturebtn w-full py-2 bg-purple-600 text-white rounded-md"
            >
              Connect
            </button>
          </form>
        </div>
      )}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            background_image &&
            typeof background_image === "string" &&
            (background_image.includes("blob:") ||
              background_image.includes("http"))
              ? `url(${background_image})`
              : "none",

          backgroundColor:
            !background_image || background_image === "none"
              ? customization.background_color
              : "transparent",

          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: `blur(${customization.background_blur / 10}px)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center p-4 h-full overflow-y-auto scrollbar-thin  live-preview-scroll">
        <div className="relative mb-[-45px] flex justify-center">
          {profile.banner ? (
            <img
              src={profile.banner}
              alt="banner"
              className="block object-cover rounded-xl shadow-lg w-full max-w-full max-h-[180px]"
            />
          ) : (
            <div className="w-[300px] max-w-[600px] h-[120px] bg-gray-400 dark:bg-[#7B7B7B] rounded-xl flex items-center justify-center border-2 border-dashed border-gray-500">
              <ImagePlusIcon size={32} className="text-gray-500" />
            </div>
          )}
        </div>

        <div className="relative z-10 mb-2">
          {profile.profile_image ? (
            <img
              src={profile.profile_image}
              alt="profile"
              className={`block mx-auto border-4 border-gray-800 dark:bg-[#7B7B7B] 
        ${profileShape === "circle" ? "rounded-full" : "rounded-md"} 
        w-auto h-[90px] max-w-[110px]`}
            />
          ) : (
            <div
              className={`w-[90px] h-[90px] 
        ${profileShape === "circle" ? "rounded-full" : "rounded-md"} 
        bg-[#7B7B7B] border-2 border-[#4F2E86] flex items-center justify-center text-xs mx-auto`}
            >
              No Image
            </div>
          )}
        </div>

        <h4
          className="text-lg font-semibold"
          style={{ color: customization.about_text_color }}
        >
          {isBusiness
            ? profile.business_name
            : `${profile.first_name} ${profile.last_name}`}
        </h4>
        <p
          className="text-sm text-gray-700 dark:text-gray-300 mt-1 mb-6"
          style={{ color: customization.about_text_color }}
        >
          {profile.bio}
        </p>

        {/* LINKS - DYNAMIC STYLE */}
        <div className="w-full px-2 mb-6">
          {platformLinks.length > 0 ? (
            <div>
              {linkStyle === "icons" && renderIcons()}
              {linkStyle === "carousel" && renderCasual()}
              {linkStyle === "cards" && renderCards()}
            </div>
          ) : (
            <div className="border-2 border-dashed border-white rounded-2xl p-6 text-center">
              <button className=" livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                + Add Platform Links
              </button>
            </div>
          )}
        </div>
        <div className="w-full px-2 mb-6">
          {customLinks.length > 0 ? (
            <div>
              {customLinkStyle === "cards" && rendercustomCards()}
              {customLinkStyle === "carousel" && renderCustomCarousel()}
              {customLinkStyle === "grid" && renderGrid()}
            </div>
          ) : (
            <div className="border-2 border-dashed border-white rounded-2xl p-6 text-center">
              <button className=" livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                + Add Customize Links
              </button>
            </div>
          )}
        </div>
        {emailToggle && (
          <div className="w-full mb-2 dark:bg-[#2B2B2B] rounded-[15px] p-4 flex flex-col gap-2">
            <h3 className="text-xl font-bold">{emailFormTitle}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 mb-2">
              {emailFormDescription}
            </p>
            {(emailLayout || "left") === "left" ? (
              <div className="flex flex-row gap-0 items-center justify-center p-4">
                <div className="flex items-center dark:bg-[#2B2B2B] rounded-[15px]">
                  <input
                    placeholder={
                      emailFields?.find((f) => f.is_enabled)?.placeholder ||
                      "Subscribe to my newsletter"
                    }
                    className="p-4 h-10 text-white border-l border-t border-b border-[#626262] outline-none text-[12px] w-full rounded-l-[15px]"
                  />
                  <a
                    className="bg-[#4F2E86] h-10 items-center flex justify-center text-white text-sm px-4 py-2 rounded-r-[15px]"
                    style={{
                      background: emailBtnBg,
                      color: emailBtnText,
                    }}
                  >
                    {emailtext}
                  </a>
                </div>
              </div>
            ) : (emailLayout || "left") === "right" ? (
              <div className="flex flex-col gap-2  p-2">
                <div className="flex flex-col gap-2">
                  {(emailFields || [])
                    .filter((f) => f.is_enabled !== false)
                    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                    .map((field) => {
                      const t = (field.field_type || "").toUpperCase();

                      return (
                        <div key={field.id} className="flex flex-col gap-2">
                          {t === "NAME" && (
                            <input
                              value={field.placeholder ?? ""}
                              onChange={(e) =>
                                dispatch(
                                  setContactFieldValue({
                                    id: field.id,
                                    value: e.target.value,
                                  }),
                                )
                              }
                              placeholder="Name"
                              className="w-full rounded-xl border border-[#626262] p-3 text-white"
                            />
                          )}

                          {t === "EMAIL" && (
                            <input
                              value={field.placeholder ?? ""}
                              onChange={(e) =>
                                dispatch(
                                  setContactFieldValue({
                                    id: field.id,
                                    value: e.target.value,
                                  }),
                                )
                              }
                              placeholder="Email"
                              className="w-full rounded-xl border border-[#626262] p-3 text-white"
                            />
                          )}

                          {(t === "CONTACT" || t === "PHONE") && (
                            <input
                              value={field.placeholder ?? ""}
                              onChange={(e) =>
                                dispatch(
                                  setContactFieldValue({
                                    id: field.id,
                                    value: e.target.value,
                                  }),
                                )
                              }
                              placeholder="Phone Number"
                              className="w-full rounded-xl border border-[#626262] p-3 text-white"
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
                <a
                  className="bg-[#4F2E86] h-[51px] items-center flex justify-center text-white text-sm px-4 py-2 rounded-lg"
                  style={{
                    background: emailBtnBg,
                    color: emailBtnText,
                    borderRadius: `${newsletterButtonRadius ?? 16}px`,
                  }}
                >
                  {emailtext}
                </a>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white rounded-2xl p-6 text-center">
                <button className="livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                  + Add Contact Form
                </button>
              </div>
            )}
          </div>
        )}

        {saveContact ? (
          <div className=" rounded-[15px] p-4 text-center w-full mb-6">
            <a
              type=" button"
              className="bg-[#4F2E86] h-[51px] items-center flex justify-center text-white text-sm px-4 py-2 rounded-lg"
              style={{
                background: saveBtnBg,
                color: saveBtnText,
                borderRadius: `${saveBtnBBorderRadius ?? 16}px`,
              }}
            >
              {saveBtntext}
            </a>
          </div>
        ) : (
          <div className="w-full mb-4">
            <div className="border-2 border-dashed border-white rounded-2xl p-6 text-center">
              <button className="livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                + Add Contact Form
              </button>
            </div>
          </div>
        )}
        {visibleProducts && visibleProducts.length > 0 ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex flex-col items-center gap-2 w-full relative">
              {visibleProducts &&
                visibleProducts.length > 0 &&
                productLayout === "carousel" && (
                  <div className="relative w-full">
                    {/* Carousel container */}
                    <div
                      className={`flex gap-4 overflow-x-auto py-2 scroll-smooth no-scrollbar ${
                        visibleProducts.length === 1
                          ? "justify-center"
                          : "justify-start"
                      }`}
                      ref={productCarouselRef}
                    >
                      {visibleProducts.map((product) => (
                        <div
                          key={product.id || product.productTitle}
                          className="relative min-w-[263px] rounded-xl overflow-x-hidden overflow-y-visible"
                        >
                          <img
                            src={product.productImage}
                            alt={product.productTitle}
                            className="w-[263px] h-[172px] object-cover rounded-lg"
                          />
                          {/* overlay stuff */}
                          {/* Overlay */}
                          <div className="absolute bottom-2 left-0 right-0 flex justify-between items-center  p-2 rounded-b-lg">
                            <div className="flex flex-col items-start">
                              <span className="text-[12px] text-white truncate">
                                {product.productTitle}
                              </span>
                              <p className="text-[12px] text-gray-200 truncate">
                                ${product.productPrice}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                type="button"
                                className="bg-black text-white text-sm px-4 py-2 rounded-3xl  transition"
                              >
                                Buy Now
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Left arrow */}
                    {visibleProducts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => scrollProductCarousel(-1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                      >
                        &#8249;
                      </button>
                    )}

                    {/* Right arrow */}
                    {visibleProducts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => scrollProductCarousel(1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                      >
                        &#8250;
                      </button>
                    )}
                  </div>
                )}
            </div>

            {visibleProducts &&
              visibleProducts.length > 0 &&
              productLayout === "card" && (
                <div className="flex flex-col gap-2 w-full p-2 rounded-xl">
                  {products
                    .filter((p) => p.isVisible)
                    .map((product, index) => (
                      <div
                        key={product.id || index}
                        className="flex items-start w-full gap-2 rounded-xl p-2"
                        style={{
                          backgroundColor: productCardbgColor || "#2B2B2B",
                          color: productCardTextColor || "#fff",
                        }}
                      >
                        <img
                          src={product.productImage}
                          alt={product.productTitle}
                          className="w-[126px] h-[102px] rounded-lg object-cover"
                        />
                        <div className="flex flex-col items-start mt-5">
                          <span
                            className="text-[17px] text-white truncate"
                            style={{ color: productCardTextColor || "#fff" }}
                          >
                            {product.productTitle}
                          </span>
                          <p
                            className="text-[12px] text-gray-200 truncate"
                            style={{ color: productCardTextColor || "#fff" }}
                          >
                            ${product.productPrice}
                          </p>
                          <a
                            type="button"
                            className="bg-black text-white text-sm px-2 py-1 rounded-3xl  transition"
                            style={{
                              backgroundColor: buyBtnBgColor || "#000",
                              color: buyBtnTextColor || "#fff",
                            }}
                          >
                            Buy Now
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              )}
          </div>
        ) : (
          <div className="w-full mb-4">
            <div className="border-2 border-dashed border-white rounded-2xl p-6 text-center">
              <button className="livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                + Add E-commerce Product
              </button>
            </div>
          </div>
        )}
        {medias && medias.length > 0 ? (
          <div className="flex flex-col items-center gap-2 w-full">
            {medias &&
              medias.length > 0 &&
              normalizedMediaLayout === "carousel" && (
                <div className="relative w-full">
                  {/* Carousel container */}
                  <div
                    className={`flex gap-4 overflow-x-auto py-2 scroll-smooth no-scrollbar ${
                      medias.length === 1 ? "justify-center" : "justify-start"
                    }`}
                    ref={mediaCarouselRef}
                  >
                    {medias.map((media) => {
                      return (
                        <div
                          key={media.id}
                          className="relative min-w-[263px] rounded-xl overflow-hidden"
                        >
                          <img
                            src={media.url}
                            alt={"Media Image"}
                            className="w-[263px] h-[172px] object-cover rounded-lg"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Left arrow */}
                  {medias.length > 1 && (
                    <button
                      type="button"
                      onClick={() => scrollMediaCarousel(-1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2  text-white! text-[40px]! p-2 rounded-full  transition bg-transparent!"
                    >
                      &#8249;
                    </button>
                  )}

                  {/* Right arrow */}
                  {medias.length > 1 && (
                    <button
                      type="button"
                      onClick={() => scrollMediaCarousel(1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2  text-white! text-[40px]! p-2 rounded-full  transition bg-transparent!"
                    >
                      &#8250;
                    </button>
                  )}
                </div>
              )}

            {medias &&
              medias.length > 0 &&
              normalizedMediaLayout === "card" && (
                <div className="flex flex-col gap-3 w-full">
                  {medias.slice(0, 4).map((m) => (
                    <div
                      key={m.id}
                      className="w-full rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 aspect-[16/10]"
                    >
                      <img
                        src={m.url}
                        alt={"Media Image"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
          </div>
        ) : (
          <div className="w-full mb-4">
            <div className="border-2 border-dashed border-white rounded-2xl p-6 text-center">
              <button className=" livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                + Add Media
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
