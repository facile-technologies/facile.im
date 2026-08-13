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
import Loader from "@/store/utils/Loader";

export default function GeneralLivePreview() {
  const profile = useSelector(selectProfile);
  const profileType = useSelector((state) => state.profile.profileType);
  console.log(profileType, "profileType");

  const { background_color, background_image } =
    useSelector(selectCustomization);
  const [isloading, setIsloading] = useState(false);

  const emailFields = useSelector((state) => state.profile.fields);
  const {
    titleColor,
    platformUrlTextColor,
    platformNameTextColor,
    backgroundColor,
    platformLinkBackGroundColor,
  } = useSelector((state) => state.profile);
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
  //       setIsloading(true);
  //       const response = await getUserProfile();
  //       const data = response.data;

  //       const mappedState = mapProfileViewResponseToState(data);

  //       dispatch(setProfileViewData(mappedState));
  //       setIsloading(false);
  //     } catch (error) {
  //       console.error("Failed to load profile", error);
  //     }
  //   };

  //   loadProfile();
  // }, [dispatch]);
  const productCarouselRef = useRef();
  const mediaCarouselRef = useRef();
  const scrollProductCarousel = (direction) => {
    if (productCarouselRef.current) {
      productCarouselRef.current.scrollBy({
        left: direction * 280,
        behavior: "smooth",
      });
    }
  };

  const scrollMediaCarousel = (direction) => {
    if (mediaCarouselRef.current) {
      mediaCarouselRef.current.scrollBy({
        left: direction * 280,
        behavior: "smooth",
      });
    }
  };
  const platformLinks = useSelector(
    (state) => state.profile.platformLinks || [],
  );
  const customLinks = useSelector((state) => state.profile.customLinks || []);
  const { linkStyle = "icons", customLinkStyle = "CARUSAL" } = useSelector(
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

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? platformLinks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === platformLinks.length - 1 ? 0 : prev + 1));
  };

  const renderGrid = () => {
    const numLinks = customLinks.length;

    let gridClasses = "grid gap-4 ";

    if (numLinks === 1) {
      gridClasses += " grid-cols-1";
    } else if (numLinks === 2) {
      gridClasses += " grid-cols-2";
    } else if (numLinks === 3) {
      gridClasses += " grid-cols-1 md:grid-cols-2 flex-row";
    } else if (numLinks <= 4) {
      gridClasses += " grid-cols-2 md:grid-cols-2";
    } else {
      gridClasses += " grid-cols-4";
    }

    return (
      <div className={`${gridClasses} py-2`}>
        {customLinks.map((link, index) => (
          <a
            key={link.id}
            href={link.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group block rounded-xl overflow-hidden transition"
            style={{
              backgroundColor: custombackgroundColor,
            }}
          >
            <img
              src={link.icon}
              alt={link.name}
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <p
                className="text-sm font-medium text-center text-white"
                style={{ color: customtitleColor || "#fff" }}
              >
                {link.label || link.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    );
  };

  const rendercustomCards = () => (
    <div className="space-y-3 w-[300px]">
      {customLinks.map((link) => (
        <a
          key={link.id}
          href={link.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="  block bg-white/10 bg-gray-700 rounded-xl p-4 flex items-start gap-3 hover:bg-white/15 dark:hover:bg-gray-600 transition"
          style={{
            backgroundColor: custombackgroundColor,
          }}
        >
          <img src={link.icon} alt="" className="w-10 h-10 rounded" />
          <div className="flex-1 min-w-0 text-left">
            <p
              className="text-white font-medium truncate"
              style={{ color: customtitleColor }}
            >
              {link.label || link.title}
            </p>
          </div>
        </a>
      ))}
    </div>
  );

  const renderCustomCarousel = () => (
    <div className="relative w-full flex items-center justify-center py-4">
      {showArrows && (
        <button
          onClick={handlePrev}
          className="absolute left-2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition"
        >
          <svg width="18" height="18" fill="currentColor">
            <path d="M12 15l-6-6 6-6" />
          </svg>
        </button>
      )}

      <div className="flex gap-3">
        {customLinks.map((link) => (
          <div
            key={link.id}
            className="rounded-xl flex flex-col items-center justify-center text-white p-2"
          >
            <img src={link.icon} alt={link.name} className="w-18 h-18 mb-2" />
            <p
              className="text-sm font-medium text-center"
              style={{ color: customtitleColor }}
            >
              {link.label || link.title}
            </p>
          </div>
        ))}
      </div>

      {showArrows && (
        <button
          onClick={handleNext}
          className="absolute right-2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition"
        >
          <svg width="18" height="18" fill="currentColor">
            <path d="M6 3l6 6-6 6" />
          </svg>
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
    <div className="relative w-full flex items-center justify-center py-4">
      {showArrows && (
        <button
          onClick={handlePrev}
          className="absolute left-2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition"
        >
          <svg width="18" height="18" fill="currentColor">
            <path d="M12 15l-6-6 6-6" />
          </svg>
        </button>
      )}

      <div className="flex gap-3">
        {platformLinks
          .filter((link) => link.isVisible)
          .map((link) => (
            <div
              key={link.id}
              className="rounded-xl flex flex-col items-center justify-center text-white p-2"
            >
              <img src={link.icon} alt={link.name} className="w-18 h-18 mb-2" />
              <p
                className="text-sm font-medium text-center"
                style={{ color: platformNameTextColor }}
              >
                {link.label || link.name}
              </p>
            </div>
          ))}
      </div>

      {showArrows && (
        <button
          onClick={handleNext}
          className="absolute right-2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition"
        >
          <svg width="18" height="18" fill="currentColor">
            <path d="M6 3l6 6-6 6" />
          </svg>
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
            style={{ backgroundColor: platformLinkBackGroundColor }}
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
    <>
      {isloading ? <Loader /> : null}

      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1e1e1e] p-4">
        <div
          className="relative w-full max-w-[420px] lg:w-[370px] min-h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
          style={{
            color: titleColor || "#fff",
            backgroundColor: backgroundColor || "#fff",
            fontFamily: customization.font_family,
            fontSize: `${parseInt(customization.font_size)}px`,
          }}
        >
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
                  <label
                    htmlFor="first_name"
                    className="block text-sm text-black "
                  >
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
                  <label
                    htmlFor="last_name"
                    className="block text-sm text-black"
                  >
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
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm text-black"
                  >
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

          <div className="relative z-10 flex flex-col items-center text-center p-4 md:p-6">
            <div className="relative mb-[-45px] flex justify-center">
              {profile.banner ? (
                <img
                  src={profile.banner}
                  alt="banner"
                  className="block object-cover rounded-xl shadow-lg max-h-[180px] w-auto max-w-full"
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
              {profile.first_name} {profile.last_name}
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

            {/* Custom Links Section */}
            <div className="w-full px-2 mb-6">
              {customLinks.length > 0 ? (
                <div>
                  {customLinkStyle === "cards" && rendercustomCards()}
                  {customLinkStyle === "carousel" && renderCustomCarousel()}
                  {customLinkStyle === "grid" && renderGrid()}
                </div>
              ) : (
                <div className="border-2 border-dashed border-white rounded-2xl p-6 text-center mb-3">
                  <button className="livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                    + Add Customize Links
                  </button>
                </div>
              )}
            </div>

            {emailToggle && (
              <div className="w-full mb-2  dark:bg-[#2B2B2B] rounded-[15px] p-4 flex flex-col gap-2">
                <h3 className="text-xl font-bold">{emailFormTitle}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 mb-2">
                  {emailFormDescription}
                </p>
                {(emailLayout || "left") === "left" ? (
                  <div className="flex flex-row gap-0 items-center justify-center p-4">
                    <div className="flex items-center dark:bg-[#2B2B2B] rounded-xl overflow-hidden w-full">
                      <input
                        placeholder="Subscribe to my newsletter"
                        className="p-4 h-10 text-white border-l border-t border-b border-[#626262] outline-none text-[12px] w-full "
                        style={{
                          borderRadius: `${newsletterButtonRadius ?? 16}px 0 0 ${newsletterButtonRadius ?? 16}px`,
                        }}
                      />
                      <a
                        className="bg-[#4F2E86] h-10 items-center flex justify-center text-white text-sm px-4 py-2 "
                        style={{
                          background: emailBtnBg,
                          color: emailBtnText,
                        }}
                        style={{
                          background: emailBtnBg,
                          color: emailBtnText,
                          borderRadius: `0 ${newsletterButtonRadius ?? 16}px ${newsletterButtonRadius ?? 16}px 0`,
                        }}
                      >
                        Connect
                      </a>
                    </div>
                  </div>
                ) : (emailLayout || "left") === "right" ? (
                  <div className="flex flex-col gap-2  p-2">
                    <div className="flex flex-col gap-2">
                      {(emailFields || [])
                        .filter((f) => f.is_enabled !== false)
                        .sort(
                          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
                        )
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
                      Connect
                    </a>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-white rounded-2xl p-6 text-center">
                    <button className="livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                      + Contact Form
                    </button>
                  </div>
                )}
              </div>
            )}

            {saveContact.length > 0 ? (
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
                {" "}
                <div className="border-2 border-dashed border-white rounded-2xl p-6 text-center">
                  <button className="livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                    + Add Contact Form
                  </button>
                </div>
              </div>
            )}
            {/* Ecommerce product Section */}
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
                              className="relative min-w-[263px] rounded-xl overflow-hidden"
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
                          <a
                            type="button"
                            onClick={() => scrollProductCarousel(-1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                          >
                            &#8249;
                          </a>
                        )}

                        {/* Right arrow */}
                        {visibleProducts.length > 1 && (
                          <a
                            type="button"
                            onClick={() => scrollProductCarousel(1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                          >
                            &#8250;
                          </a>
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
                                style={{
                                  color: productCardTextColor || "#fff",
                                }}
                              >
                                {product.productTitle}
                              </span>
                              <p
                                className="text-[12px] text-gray-200 truncate"
                                style={{
                                  color: productCardTextColor || "#fff",
                                }}
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
                          medias.length === 1
                            ? "justify-center"
                            : "justify-start"
                        }`}
                        ref={mediaCarouselRef}
                      >
                        {medias.map((media) => (
                          <div
                            key={media.id}
                            className="relative min-w-[263px] rounded-xl overflow-hidden"
                          >
                            {console.log(media, "media")}
                            <img
                              src={media.url}
                              alt={"Media Image"}
                              className="w-[263px] h-[172px] object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Left arrow */}
                      {medias.length > 1 && (
                        <a
                          type="button"
                          onClick={() => scrollMediaCarousel(-1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2  text-white p-2 rounded-full hover:bg-black/70 transition"
                        >
                          &#8249;
                        </a>
                      )}

                      {/* Right arrow */}
                      {medias.length > 1 && (
                        <a
                          type="button"
                          onClick={() => scrollMediaCarousel(1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2  text-white p-2 rounded-full hover:bg-black/70 transition"
                        >
                          &#8250;
                        </a>
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
      </div>
    </>
  );
}
