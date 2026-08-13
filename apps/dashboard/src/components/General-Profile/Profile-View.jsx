import { useDispatch, useSelector } from "react-redux";
import {
  selectProfile,
  selectImages,
  selectCustom,
  selectCustomization,
} from "@/app/stores/selectors/profileSelectors";
import { ImagePlusIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { setLeadCapture } from "@/app/stores/slices/profileSlice";

export default function Profile() {
  const profile = useSelector(selectProfile);
  const { profileImg, logoImg, bannerImg } = useSelector(selectImages);
  const { selectedBg, blur, textColor, fontFamily } = useSelector(selectCustom);
  const {
    font_family,
    font_size,
    about_text_color,
    background_color,
    background_image,
  } = useSelector(selectCustomization);

  const { linkColor, titleColor, backgroundColor } = useSelector(
    (state) => state.profile,
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

  const productCardbgColor = useSelector(
    (state) => state.profile.productCardbgColor,
  );
  const productCardTextColor = useSelector(
    (state) => state.profile.productCardTextColor,
  );

  const visibleProducts = products.filter((product) => product.isVisible);

  const dispatch = useDispatch();
  // Create separate refs
  const productCarouselRef = useRef();
  const mediaCarouselRef = useRef();

  // Separate scroll functions
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
  const { linkStyle = "icons", customLinkStyle = "carousel" } = useSelector(
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

    let gridClasses = "grid gap-4"; // Default grid style with gaps

    // Set grid columns based on the number of links
    if (numLinks === 1) {
      gridClasses += " grid-cols-1"; // 1 column for a single image
    } else if (numLinks === 2) {
      gridClasses += " grid-cols-2"; // 2 columns for 2 images
    } else if (numLinks === 3) {
      gridClasses += " grid-cols-1 md:grid-cols-2 flex-row"; // 1 image in the top row and 2 images in the second row on medium screens
    } else if (numLinks <= 4) {
      gridClasses += " grid-cols-2 md:grid-cols-2"; // 2 columns for small screens, 2 columns for medium and up
    } else {
      gridClasses += " grid-cols-4"; // Default to 4 columns if there are more than 4
    }

    return (
      <div className={gridClasses}>
        {customLinks.map((link, index) => (
          <a
            key={link.id}
            href={link.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className=" rounded-xl  flex flex-col items-center justify-cente transition"
            style={{
              backgroundColor: custombackgroundColor,
            }}
          >
            <img
              src={link.icon}
              alt={link.name}
              className="w-full h-48 object-cover mb-2"
            />
            <p
              className="text-sm font-medium text-center"
              style={{ color: customtitleColor }}
            >
              {link.label || link.name}
            </p>
          </a>
        ))}
      </div>
    );
  };

  const rendercustomCards = () => (
    <div className="space-y-3">
      {customLinks.map((link) => (
        <a
          key={link.id}
          href={link.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white/10 bg-gray-700 rounded-xl p-4 flex items-start gap-3 hover:bg-white/15 dark:hover:bg-gray-600 transition"
          style={{
            backgroundColor: custombackgroundColor,
          }}
        >
          <img src={link.icon} alt={link.name} className="w-10 h-10 rounded" />
          <div className="flex-1 min-w-0 text-left">
            <p
              className="text-white font-medium truncate"
              style={{ color: customtitleColor }}
            >
              {link.label || link.name}
            </p>
            {/* <p
              className="text-xs text-gray-300 truncate"
              style={{ color: linkColor }}
            >
              {link.url}
            </p> */}
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
          .filter((link) => link.isVisible) // Filter based on visibility
          .map((link) => (
            <div
              key={link.id}
              className="rounded-xl flex flex-col items-center justify-center text-white p-2"
            >
              <img src={link.icon} alt={link.name} className="w-18 h-18 mb-2" />
              <p
                className="text-sm font-medium text-center"
                style={{ color: titleColor }}
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
        .filter((link) => link.isVisible) // Filter based on visibility
        .map((link) => (
          <a
            key={link.id}
            href={link.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/10 bg-gray-700 rounded-xl p-4 flex items-start gap-3 hover:bg-white/15 dark:hover:bg-gray-600 transition"
            style={{
              backgroundColor: backgroundColor,
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
                style={{ color: titleColor }}
              >
                {link.label || link.name}
              </p>
              <p
                className="text-xs text-gray-300 truncate"
                style={{ color: linkColor }}
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
      className="relative w-full lg:w-[370px] min-h-[500px] rounded-3xl overflow-hidden shadow-lg"
      style={{
        color: titleColor || "#fff",
        backgroundColor: backgroundColor || "#fff",
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
            Connect with {profile.firstName}
          </h3>
          <form className="mt-4">
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm text-black ">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full h-12 p-2 mt-2 rounded-[9px] bg-[#4F4C4C1A] text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm text-black">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
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
            selectedBg.includes("blob:") || selectedBg.includes("http")
              ? `url(${selectedBg})`
              : "none",
          backgroundColor:
            !selectedBg.includes("blob:") && !selectedBg.includes("http")
              ? selectedBg
              : "transparent",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: `blur(${blur / 10}px)`,
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-center p-4 md:p-6">
        <div className="relative mb-[-45px] flex justify-center">
          {bannerImg ? (
            <img
              src={bannerImg}
              alt="banner"
              className="block object-cover rounded-xl shadow-lg max-h-[180px] w-auto max-w-full"
            />
          ) : (
            <div className="w-[300px] h-[120px] bg-gray-400 dark:bg-[#7B7B7B] rounded-xl flex items-center justify-center border-2 border-dashed border-gray-500">
              <ImagePlusIcon size={32} className="text-gray-500" />
            </div>
          )}
        </div>
        <div className="relative z-10 mb-2">
          {profileImg ? (
            <img
              src={profileImg}
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
        <h4 className="text-lg font-semibold" style={{ color: textColor }}>
          {profile.firstName} {profile.lastName}
        </h4>
        <p
          className="text-sm text-gray-700 dark:text-gray-300 mt-1 mb-6"
          style={{ color: textColor }}
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
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center">
              <button className="livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
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
              {customLinkStyle === "grids" && renderGrid()}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center">
              <button className=" livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                + Add Customize Links
              </button>
            </div>
          )}
        </div>

        {/* Contact Form Section */}
        {emailToggle && (
          <div className="w-full mb-2">
            {(emailLayout || "left") === "left" ? (
              <div className="flex flex-row gap-2 items-center p-4">
                <div className="flex items-center gap-3 dark:bg-[#2B2B2B] rounded-[15px]">
                  <input
                    placeholder="Subscribe to my newsletter"
                    className="bg-transparent p-4 h-10 text-white border-none outline-none text-[12px] w-full"
                  />
                  <a
                    className="bg-[#4F2E86] items-center flex justify-center text-white text-sm px-4 py-2 rounded-lg"
                    style={{
                      background: emailBtnBg,
                      color: emailBtnText,
                    }}
                  >
                    Connect
                  </a>
                </div>
              </div>
            ) : (emailLayout || "left") === "right" ? (
              <div className="flex flex-col gap-4 rounded-[15px] p-4">
                <div className="dark:bg-[#2B2B2B] rounded-xl text-left text-sm">
                  <input
                    placeholder="Subscribe to my newsletter"
                    className="bg-transparent p-4 text-white border-none outline-none text-[12px] w-full"
                  />
                </div>

                <a
                  className="bg-[#4F2E86] h-[51px] items-center flex justify-center text-white text-sm px-4 py-2 rounded-lg"
                  style={{
                    background: emailBtnBg,
                    color: emailBtnText,
                  }}
                >
                  Connect
                </a>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center">
                <button className=" text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                  + Contact Form
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
              }}
            >
              Save Contact
            </a>
          </div>
        ) : (
          <div className="w-full mb-4">
            <div className="rounded-2xl p-2 text-center">
              <button className=" livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
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
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center">
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
                    {medias.map((media) => (
                      <div
                        key={media.id || media.productTitle}
                        className="relative min-w-[263px] rounded-xl overflow-hidden"
                      >
                        <img
                          src={media.productImage}
                          alt={media.productTitle}
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
                      key={m.id || m.productTitle}
                      className="w-full rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 aspect-[16/10]"
                    >
                      <img
                        src={m.productImage}
                        alt={m.productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
          </div>
        ) : (
          <div className="w-full mb-4">
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center">
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
