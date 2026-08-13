"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setColorCustomization,
  setcustomLinkstyle,
  setcustomColorCustomization,
  setLinkStyle,
  setPlatformCustomization,
  saveCustomLinkCustomization,
  savePlatfromLinkCustomization,
  setIconStyle,
} from "@/app/stores/slices/profileSlice";
import { Instagram, RotateCcw, Pipette } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { useLinksManager } from "@/hooks/useLinksManager";
import { useState } from "react";
import ColorPickerPopUp from "../../shared/ColorPicker";
import Footer from "@/components/shared/Footer";
import { useTheme } from "@/context/Themcontext";

export default function LinkStyleAccordionItem() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  console.log(isDarkMode, "isDarkMode");

  const dispatch = useDispatch();
  const {
    profileType = "personal",
    linkStyle = "icons",
    iconStyle = "DEFAULT",
    customLinkStyle = "CAROUSAL",
    customLinkCustomization = {
      layout: "ICONS",
      background_color: "#ffffff",
      title_color: "#000000",
    },
    platformLinkBackGroundColor = "#ffffff",
    platformNameTextColor = "#000000",
    platformUrlTextColor = "#ffffff",
    customtitleColor = "#000000",
    custombackgroundColor = "#ffffff",
  } = useSelector((state) => state.profile || {});

  const { platformLinks, customLinks } = useLinksManager();

  // Placeholder Platforms for preview when none added
  const placeholderPlatforms = [
    {
      id: "p1",
      name: "Instagram",
      title: "Instagram",
      icon: "/facile.svg",
      icons: {
        DEFAULT: "/facile.svg",
        BLACK: "/Facile-black.svg",
        STROKED: "/facile.svg",
        COLORED: "/facile.svg",
        WHITE: "/facile.svg",
      },
    },
    {
      id: "p2",
      name: "Facebook",
      title: "Facebook",
      icon: "/facile.svg",
      icons: {
        DEFAULT: "/facile.svg",
        BLACK: "/Facile-black.svg",
        STROKED: "/facile.svg",
        COLORED: "/facile.svg",
        WHITE: "/facile.svg",
      },
    },
    {
      id: "p3",
      name: "Twitter",
      title: "Twitter",
      icon: "/facile.svg",
      icons: {
        DEFAULT: "/facile.svg",
        BLACK: "/Facile-black.svg",
        STROKED: "/facile.svg",
        COLORED: "/facile.svg",
        WHITE: "/facile.svg",
      },
    },
  ];

  const displayPlatforms =
    platformLinks.length > 0 ? platformLinks : placeholderPlatforms;

  const [activeTab, setActiveTab] = useState("background");

  const [showCardColorPicker, setShowCardColorPicker] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState("platform");
  const [colorPickerField, setColorPickerField] = useState("background");
  const [currentColor, setCurrentColor] = useState("#ffffff");

  const getIsSelectedPlatform = (tab, color) => {
    if (tab === "background") return platformLinkBackGroundColor === color;
    if (tab === "name") return platformNameTextColor === color;
    if (tab === "url") return platformUrlTextColor === color;
    return false;
  };

  const getIsSelectedCustom = (tab, color) => {
    if (tab === "background") return custombackgroundColor === color;
    if (tab === "name") return customtitleColor === color;
    return false;
  };

  const getActivePlatformColor = (tab) => {
    if (tab === "background") return platformLinkBackGroundColor;
    if (tab === "name") return platformNameTextColor;
    if (tab === "url") return platformUrlTextColor;
    return "#ffffff";
  };

  const getActiveCustomColor = (tab) => {
    if (tab === "background") return custombackgroundColor;
    if (tab === "name") return customtitleColor;
    return "#ffffff";
  };

  const getContrastColor = (hexcolor) => {
    if (
      !hexcolor ||
      hexcolor === "gradient" ||
      hexcolor === "transparent" ||
      hexcolor === "none"
    )
      return isDarkMode ? "white" : "black";
    const cleanedHex = hexcolor.replace("#", "");
    const r = parseInt(cleanedHex.substr(0, 2), 16) || 255;
    const g = parseInt(cleanedHex.substr(2, 2), 16) || 255;
    const b = parseInt(cleanedHex.substr(4, 2), 16) || 255;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  const handleColorChange = (tab, color) => {
    if (colorPickerTarget === "platform") {
      dispatch(
        setPlatformCustomization({
          backgroundColor: tab === "background" ? color : undefined,
          nameTextColor: tab === "name" ? color : undefined,
          urlTextColor: tab === "url" ? color : undefined,
        }),
      );
    } else {
      dispatch(setColorCustomization({ colorType: tab, colorValue: color }));
    }
  };

  const handlecustomColorChange = (tab, color) => {
    dispatch(
      setcustomColorCustomization({ colorType: tab, colorValue: color }),
    );
  };

  const handleBgChange = (target, type) => {
    if (type === "default") {
      if (target === "platform") {
        dispatch(
          setPlatformCustomization({
            backgroundColor: "#ffffff",
            nameTextColor: "#e67e22",
            urlTextColor: "#000000",
          }),
        );
      } else if (target === "custom") {
        dispatch(
          setcustomColorCustomization({
            colorType: "background",
            colorValue: "#ffffff",
          }),
        );
        dispatch(
          setcustomColorCustomization({
            colorType: "name",
            colorValue: "#e67e22",
          }),
        );
      }
    }
  };

  const handleStyleChange = (id, type) => {
    if (type === "platform") {
      dispatch(setLinkStyle(id));
    } else if (type === "custom") {
      dispatch(setcustomLinkstyle(id));
    }
  };

  const openColorPicker = (target, field, color) => {
    setColorPickerTarget(target);
    setColorPickerField(field);
    setCurrentColor(color);
    setShowCardColorPicker(true);
  };

  const handleSaveCustomization = () => {
    const customizationData = {
      layout: customLinkStyle.toUpperCase(),
      background_color: custombackgroundColor,
      title_color: customtitleColor,
    };
    dispatch(saveCustomLinkCustomization({ profileType, customizationData }));
  };

  const handleSavePlatfromCustomization = () => {
    const platfromcustomizationData = {
      layout: linkStyle.toUpperCase(),
      icon_styled: iconStyle,
      background_color: platformLinkBackGroundColor,
      title_color: platformNameTextColor,
      link_color: platformUrlTextColor,
    };

    dispatch(
      savePlatfromLinkCustomization({ profileType, platfromcustomizationData }),
    );
  };

  const colors = [
    "#ffffff",
    "#a3a8b8",
    "#7b849b",
    "#000000",
    "#e67e22",
    "#f1c40f",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
  ];

  const styles = [
    {
      id: "icons",
      label: "Icons",
      previewRenderer: () => (
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
          <div>{link.icon}</div>
        </div>
      ),
    },
    {
      id: "carousel",
      label: "Carousel",
      previewRenderer: () => (
        <div className="w-12 h-12 bg-gradient-to-br from-accent to-[#6ea0ff] rounded-xl flex flex-col items-center justify-center p-1 text-white">
          {platformLinks[0] ? (
            <>
              <img
                src={platformLinks[0].icon}
                alt=""
                className="w-5 h-5 mb-0.5"
              />
              <p className="text-[9px] truncate w-full text-center px-0.5">
                {platformLinks[0].label || platformLinks[0].name}
              </p>
            </>
          ) : (
            <Instagram className="w-5 h-5 text-white/60" />
          )}
        </div>
      ),
    },
    {
      id: "cards",
      label: "Cards",
      previewRenderer: () => (
        <div className="w-12 h-12 bg-white/10 rounded-xl p-1 flex items-start gap-1 text-white">
          {platformLinks[0] ? (
            <>
              <img
                src={platformLinks[0].icon}
                alt=""
                className="w-5 h-5 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[8px] truncate font-medium">
                  {platformLinks[0].label || platformLinks[0].name}
                </p>
                <p className="text-[6px] text-gray-400 truncate">link.com</p>
              </div>
            </>
          ) : (
            <Instagram className="w-5 h-5 text-white/60" />
          )}
        </div>
      ),
    },
  ];

  const customstyles = [
    {
      id: "cards",
      label: "Cards",
      previewRenderer: () => (
        <div className="flex flex-col gap-2 w-full px-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-gray-100 dark:bg-[#3A3A3A] p-2 rounded-lg w-full"
            >
              <div className="w-6 h-6 rounded bg-gray-300 dark:bg-gray-600" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="h-2 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
                <div className="h-1.5 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "carousel",
      label: "Carousel",
      previewRenderer: () => (
        <div className="flex justify-center gap-2 w-full px-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-600" />
              <div className="h-1.5 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "grid",
      label: "Grids",
      previewRenderer: () => (
        <div className="flex flex-col gap-2 w-full px-4">
          <div className="w-full h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
            <div className="h-2 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center p-1"
              >
                <div className="h-1 w-6 bg-gray-200 dark:bg-gray-600 rounded" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Accordion defaultValue="link-style" type="single" collapsible>
        {/* PLATFORM LINKS */}
        <AccordionItem value="link-style">
          <AccordionTrigger
            className={`${isDarkMode ? "" : "text-black font-semibold"}`}
          >
            Platform Links Customization
          </AccordionTrigger>
          <AccordionContent>
            <div
              className={`rounded-2xl p-4 sm:p-6 border transition-all ${
                isDarkMode
                  ? "bg-[#303030] border-[#C0C0C017]"
                  : "bg-white border-gray-100 shadow-sm"
              }`}
            >
              <div
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 p-4 sm:p-5 rounded-2xl transition-colors ${
                  isDarkMode ? "bg-[#3A3A3A]" : "bg-gray-50"
                }`}
              >
                <h2
                  className={`text-left mb-3 sm:mb-0 font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  Customize Link Style
                </h2>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  {[
                    { id: "DEFAULT", label: "Default" },
                    { id: "BLACK", label: "Black" },
                    { id: "STROKED", label: "Stroked" },
                    { id: "COLORED", label: "Colored" },
                    { id: "WHITE", label: "White" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setIconStyle(style.id));
                      }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        iconStyle === style.id
                          ? "bg-black dark:bg-white border-2 border-primary shadow-md scale-110"
                          : "bg-white/10 hover:bg-white/20 border border-transparent"
                      }`}
                      title={style.label}
                    >
                      <img
                        src={
                          displayPlatforms[0]?.icons?.[style.id] ||
                          displayPlatforms[0]?.icon
                        }
                        alt={style.label}
                        className="w-6 h-6 object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={`mt-4 p-4 rounded-2xl transition-colors ${
                  isDarkMode
                    ? "bg-[#3A3A3A]"
                    : "bg-gray-50/50 border border-gray-100"
                }`}
              >
                <h2
                  className={`mb-3 font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  Select Link Layout
                </h2>
                <div className="flex flex-wrap gap-6 mt-3">
                  {styles.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => handleStyleChange(s.id, "platform")}
                      className={`flex flex-col items-center gap-3 p-3 rounded-xl transition-all !bg-transparent ${
                        linkStyle === s.id
                          ? `border-2 ${isDarkMode ? "border-white" : "border-black"}`
                          : "border border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div
                        className={`w-[140px] h-[86px] rounded-lg p-3 flex flex-col items-center justify-center overflow-hidden transition-colors shadow-sm ${
                          isDarkMode
                            ? "bg-[#2A2A2A]"
                            : "bg-white border border-gray-100"
                        }`}
                      >
                        {s.id === "cards" ? (
                          <div className="flex flex-col gap-2 w-full px-2">
                            {[1, 2].map((i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 bg-gray-100 dark:bg-[#3A3A3A] p-2 rounded-lg w-full"
                              >
                                <div className="w-6 h-6 rounded bg-gray-300 dark:bg-gray-600" />
                                <div className="flex flex-col flex-1 gap-1">
                                  <div className="h-2 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
                                  <div className="h-1.5 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : s.id === "icons" ? (
                          <div className="flex justify-center gap-3 w-full">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="flex items-center justify-center transition-transform hover:scale-110"
                              >
                                <div className="w-[42px] h-[42px] rounded-full bg-gray-200 dark:bg-gray-600" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2 w-full px-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="flex flex-col items-center gap-1"
                              >
                                <div className="w-[36px] h-[36px] rounded-lg bg-gray-200 dark:bg-gray-600" />
                                <div className="h-1 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold tracking-wider ${
                          isDarkMode ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PLATFORM — Color Customization Section */}
              {linkStyle?.toLowerCase() !== "none" &&
                linkStyle?.toLowerCase() !== "icons" && (
                  <div
                    className={`mt-6 p-5 rounded-2xl transition-colors ${
                      isDarkMode
                        ? "bg-[#3a3a3a]"
                        : "bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                      <h3
                        className={`font-semibold text-sm mb-2 sm:mb-0 ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {linkStyle?.toLowerCase() === "carousel"
                          ? "Title color"
                          : "Color Customization"}
                      </h3>
                      <a
                        type="button"
                        onClick={() => handleBgChange("platform", "default")}
                        className="flex items-center gap-1 dark:text-white/80 text-black hover:text-white text-sm"
                      >
                        <RotateCcw size={14} />
                        Reset colors to default
                      </a>
                    </div>

                    {/* Adaptive Tab Bar (Not for carousel or icons) */}
                    {["cards", "grid", "rounded"].includes(
                      linkStyle?.toLowerCase(),
                    ) && (
                      <div
                        className={`flex flex-col sm:flex-row items-center border rounded-full overflow-hidden mb-5 transition-colors ${
                          isDarkMode
                            ? "border-[#EAECF04A] bg-[#3F3F3F]"
                            : "border-gray-200 bg-gray-100/50"
                        }`}
                      >
                        {(linkStyle?.toLowerCase() === "cards"
                          ? ["background", "name", "url"]
                          : ["background", "name"]
                        ).map((tab) => (
                          <a
                            type="button"
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 text-center py-2 text-sm rounded-full transition h-full flex items-center justify-center font-medium
                          ${
                            activeTab === tab
                              ? isDarkMode
                                ? "bg-black text-white"
                                : "bg-white text-black shadow-sm"
                              : isDarkMode
                                ? "text-white/60 hover:text-white"
                                : "text-gray-500 hover:text-black"
                          }`}
                          >
                            {tab === "background"
                              ? "Link Background"
                              : tab === "name"
                                ? "Link Name"
                                : tab === "url"
                                  ? "Link URL"
                                  : tab}
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 flex-wrap">
                      {/* Pipette Button */}
                      <button
                        onClick={() => {
                          const field =
                            linkStyle?.toLowerCase() === "carousel"
                              ? "name"
                              : linkStyle?.toLowerCase() === "icons"
                                ? "background"
                                : activeTab;
                          openColorPicker(
                            "platform",
                            field,
                            getActivePlatformColor(field),
                          );
                        }}
                        className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 transition shadow-sm"
                        style={{
                          backgroundColor: getActivePlatformColor(
                            linkStyle?.toLowerCase() === "carousel"
                              ? "name"
                              : linkStyle?.toLowerCase() === "icons"
                                ? "background"
                                : activeTab,
                          ),
                          color: getContrastColor(
                            getActivePlatformColor(
                              linkStyle?.toLowerCase() === "carousel"
                                ? "name"
                                : linkStyle?.toLowerCase() === "icons"
                                  ? "background"
                                  : activeTab,
                            ),
                          ),
                        }}
                      >
                        <Pipette size={14} color="currentColor" />
                      </button>

                      {/* Presets */}
                      {colors.map((color) => {
                        const field =
                          linkStyle?.toLowerCase() === "carousel"
                            ? "name"
                            : linkStyle?.toLowerCase() === "icons"
                              ? "background"
                              : activeTab;
                        return (
                          <button
                            key={color}
                            onClick={() => handleColorChange(field, color)}
                            className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-105 ${
                              getIsSelectedPlatform(field, color)
                                ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                                : "border-black/10 dark:border-white/10 hover:scale-110"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        );
                      })}

                      {/* Gradient Button */}
                      <button
                        onClick={() => {
                          const field =
                            linkStyle?.toLowerCase() === "carousel"
                              ? "name"
                              : linkStyle?.toLowerCase() === "icons"
                                ? "background"
                                : activeTab;
                          handleColorChange(field, "gradient");
                        }}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden transition-all ${
                          getIsSelectedPlatform(
                            linkStyle?.toLowerCase() === "carousel"
                              ? "name"
                              : linkStyle?.toLowerCase() === "icons"
                                ? "background"
                                : activeTab,
                            "gradient",
                          )
                            ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                            : "border-black/10 dark:border-white/10 hover:scale-110"
                        }`}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-[#6ea0ff]" />
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <Footer
          buttonText={"Platform Update"}
          onSave={handleSavePlatfromCustomization}
        />
        {/* CUSTOM LINKS */}
        <AccordionItem value="custom-link-style" className="mt-4">
          <AccordionTrigger
            className={`${isDarkMode ? "" : "text-black font-semibold"}`}
          >
            Custom Links Customization
          </AccordionTrigger>
          <AccordionContent>
            <div
              className={`rounded-2xl p-4 sm:p-6 border transition-all ${
                isDarkMode
                  ? "bg-[#303030] border-[#C0C0C017]"
                  : "bg-white border-gray-100 shadow-sm"
              }`}
            >
              {/* Layout Section */}
              <div
                className={`mt-4 p-4 rounded-2xl transition-colors ${
                  isDarkMode
                    ? "bg-[#3A3A3A]"
                    : "bg-gray-50/50 border border-gray-100"
                }`}
              >
                <h2
                  className={`mb-3 font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  Select Link Layout
                </h2>
                <div className="flex flex-wrap gap-6 mt-3">
                  {customstyles.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => handleStyleChange(s.id, "custom")}
                      className={`flex flex-col items-center gap-3 p-3 rounded-[11px] transition-all !bg-transparent ${
                        customLinkStyle?.toLowerCase() === s.id?.toLowerCase()
                          ? "border-2 dark:border-white border-black"
                          : "border border-transparent"
                      }`}
                    >
                      <div className="w-[140px] h-[100px] dark:bg-[#2A2A2A] bg-[#FFFFFF] rounded-lg p-2 py-4 flex flex-col items-center justify-center overflow-hidden">
                        {s.previewRenderer()}
                      </div>
                      <span
                        className={`text-xs font-bold tracking-wider ${
                          isDarkMode ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PLATFORM ADDITION - Grid/Rounded/Icons could be added here if needed, but let's stick to user request for Custom first */}
              {/* Ensure all Custom layout checks are case-insensitive */}

              {/* CUSTOM — Carousel */}
              {customLinkStyle?.toLowerCase() === "carousel" && (
                <div
                  className={`mt-6 p-5 rounded-2xl transition-colors ${
                    isDarkMode
                      ? "bg-[#3a3a3a]"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <h3
                      className={`font-semibold text-sm mb-2 sm:mb-0 ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Color Customization
                    </h3>
                    <a
                      type="button"
                      onClick={() => handleBgChange("custom", "default")}
                      className="flex items-center gap-1 dark:text-white/80 text-black hover:text-white text-sm"
                    >
                      <RotateCcw size={14} />
                      Reset colors to default
                    </a>
                  </div>
                  <div
                    className={`flex flex-col sm:flex-row items-center border rounded-full overflow-hidden mb-5 transition-colors ${
                      isDarkMode
                        ? "border-[#EAECF04A] bg-[#3F3F3F]"
                        : "border-gray-200 bg-gray-100/50"
                    }`}
                  >
                    {["background", "name"].map((tab) => (
                      <a
                        type="button"
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 text-center py-2 text-sm rounded-full transition h-full flex items-center justify-center font-medium
                        ${
                          activeTab === tab
                            ? isDarkMode
                              ? "bg-black text-white"
                              : "bg-white text-black shadow-sm"
                            : isDarkMode
                              ? "text-white/60 hover:text-white"
                              : "text-gray-500 hover:text-black"
                        }`}
                      >
                        {tab === "background"
                          ? "Link Background"
                          : tab === "name"
                            ? "Link Name"
                            : tab}
                      </a>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() =>
                        openColorPicker(
                          "custom",
                          activeTab,
                          getActiveCustomColor(activeTab),
                        )
                      }
                      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 transition shadow-sm"
                      style={{
                        backgroundColor: getActiveCustomColor(activeTab),
                        color: getContrastColor(
                          getActiveCustomColor(activeTab),
                        ),
                      }}
                    >
                      <Pipette size={14} color="currentColor" />
                    </button>
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          handlecustomColorChange(activeTab, color);
                        }}
                        className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-105 ${
                          getIsSelectedCustom(activeTab, color)
                            ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                            : "border-white/10 hover:scale-110"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <button
                      onClick={() =>
                        handlecustomColorChange(activeTab, "gradient")
                      }
                      className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden transition-all ${
                        getIsSelectedCustom(activeTab, "gradient")
                          ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                          : "border-white/10 hover:scale-110"
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-[#6ea0ff]" />
                    </button>
                  </div>
                </div>
              )}

              {/* CUSTOM — Grids */}
              {customLinkStyle?.toLowerCase() === "grid" && (
                <div
                  className={`mt-6 p-5 rounded-2xl transition-colors ${
                    isDarkMode
                      ? "bg-[#3a3a3a]"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <h3
                      className={`font-semibold text-sm mb-2 sm:mb-0 ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Color Customization
                    </h3>
                    <a
                      type="button"
                      onClick={() => handleBgChange("custom", "default")}
                      className="flex items-center gap-1 dark:text-white/80 text-black hover:text-white text-sm"
                    >
                      <RotateCcw size={14} />
                      Reset colors to default
                    </a>
                  </div>
                  <div
                    className={`flex flex-col sm:flex-row items-center border rounded-full overflow-hidden mb-5 transition-colors ${
                      isDarkMode
                        ? "border-[#EAECF04A] bg-[#3F3F3F]"
                        : "border-gray-200 bg-gray-100/50"
                    }`}
                  >
                    {["background", "name"].map((tab) => (
                      <a
                        type="button"
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 text-center py-2 text-sm rounded-full transition h-full flex items-center justify-center font-medium
                        ${
                          activeTab === tab
                            ? isDarkMode
                              ? "bg-black text-white"
                              : "bg-white text-black shadow-sm"
                            : isDarkMode
                              ? "text-white/60 hover:text-white"
                              : "text-gray-500 hover:text-black"
                        }`}
                      >
                        {tab === "background"
                          ? "Link Background"
                          : tab === "name"
                            ? "Link Name"
                            : tab}
                      </a>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() =>
                        openColorPicker(
                          "custom",
                          activeTab,
                          getActiveCustomColor(activeTab),
                        )
                      }
                      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 transition shadow-sm"
                      style={{
                        backgroundColor: getActiveCustomColor(activeTab),
                        color: getContrastColor(
                          getActiveCustomColor(activeTab),
                        ),
                      }}
                    >
                      <Pipette size={14} color="currentColor" />
                    </button>
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          handlecustomColorChange(activeTab, color);
                        }}
                        className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-105 ${
                          getIsSelectedCustom(activeTab, color)
                            ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                            : "border-white/10 hover:scale-110"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <button
                      onClick={() =>
                        handlecustomColorChange(activeTab, "gradient")
                      }
                      className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden transition-all ${
                        getIsSelectedCustom(activeTab, "gradient")
                          ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                          : "border-white/10 hover:scale-110"
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-[#6ea0ff]" />
                    </button>
                  </div>
                </div>
              )}

              {/* CUSTOM — Cards */}
              {customLinkStyle?.toLowerCase() === "cards" && (
                <div
                  className={`mt-6 p-5 rounded-2xl transition-colors ${
                    isDarkMode
                      ? "bg-[#3a3a3a]"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <h3
                      className={`font-semibold text-sm mb-2 sm:mb-0 ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Color Customization
                    </h3>
                    <a
                      type="button"
                      onClick={() => handleBgChange("custom", "default")}
                      className="flex items-center gap-1 dark:text-white/80 text-black hover:text-white text-sm"
                    >
                      <RotateCcw size={14} />
                      Reset colors to default
                    </a>
                  </div>
                  <div
                    className={`flex flex-col sm:flex-row items-center border rounded-full overflow-hidden mb-5 transition-colors ${
                      isDarkMode
                        ? "border-[#EAECF04A] bg-[#3F3F3F]"
                        : "border-gray-200 bg-gray-100/50"
                    }`}
                  >
                    {["background", "name"].map((tab) => (
                      <a
                        type="button"
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 text-center py-2 text-sm rounded-full transition h-full flex items-center justify-center font-medium
                        ${
                          activeTab === tab
                            ? isDarkMode
                              ? "bg-black text-white"
                              : "bg-white text-black shadow-sm"
                            : isDarkMode
                              ? "text-white/60 hover:text-white"
                              : "text-gray-500 hover:text-black"
                        }`}
                      >
                        {tab === "background"
                          ? "Link Background"
                          : tab === "name"
                            ? "Link Name"
                            : tab}
                      </a>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() =>
                        openColorPicker(
                          "custom",
                          activeTab,
                          getActiveCustomColor(activeTab),
                        )
                      }
                      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 transition shadow-sm"
                      style={{
                        backgroundColor: getActiveCustomColor(activeTab),
                        color: getContrastColor(
                          getActiveCustomColor(activeTab),
                        ),
                      }}
                    >
                      <Pipette size={14} color="currentColor" />
                    </button>
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          handlecustomColorChange(activeTab, color);
                        }}
                        className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-105 ${
                          getIsSelectedCustom(activeTab, color)
                            ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                            : "border-white/10 hover:scale-110"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <button
                      onClick={() =>
                        handlecustomColorChange(activeTab, "gradient")
                      }
                      className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden transition-all ${
                        getIsSelectedCustom(activeTab, "gradient")
                          ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                          : "border-white/10 hover:scale-110"
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-[#6ea0ff]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* GLOBAL COLOR PICKER POPUP */}
        {showCardColorPicker && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <div className="relative">
              <ColorPickerPopUp
                currentColor={currentColor}
                onSelect={(newColor) => {
                  setCurrentColor(newColor);
                  if (colorPickerTarget === "platform") {
                    handleColorChange(colorPickerField, newColor);
                  } else if (colorPickerTarget === "custom") {
                    handlecustomColorChange(colorPickerField, newColor);
                  }
                }}
                onClose={() => setShowCardColorPicker(false)}
              />
              <button
                onClick={() => setShowCardColorPicker(false)}
                className="absolute -top-3 -right-3 bg-white text-black rounded-full w-7 h-7 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </Accordion>
      <Footer buttonText={"Custom Update"} onSave={handleSaveCustomization} />
    </>
  );
}
