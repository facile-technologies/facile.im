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
} from "@/app/stores/slices/profileSlice";
import { Instagram, RotateCcw } from "lucide-react";
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

export default function LinkStyleAccordionItem() {
  const profileType = useSelector((state) => state.profile.profileType);
  const dispatch = useDispatch();
  const {
    linkStyle = "icons",
    customLinkStyle = "CAROUSAL",
    customLinkCustomization = {
      layout: "ICONS",
      background_color: "#ffffff",
      title_color: "#000000",
    },
    platformLinkBackGroundColor = "#ffffff",
    platformNameTextColor = "#000000",
    platformUrlTextColor = "#ffffff",
  } = useSelector((state) => state.profile || {});

  const { platformLinks, customLinks } = useLinksManager();

  const [activeTab, setActiveTab] = useState("background");

  const [showCardColorPicker, setShowCardColorPicker] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState("platform");
  const [colorPickerField, setColorPickerField] = useState("background");
  const [currentColor, setCurrentColor] = useState("#ffffff");

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
      background_color: customLinkCustomization.background_color,
      title_color: customLinkCustomization.title_color,
    };
    dispatch(saveCustomLinkCustomization({ profileType, customizationData }));
  };

  const handleSavePlatfromCustomization = () => {
    const platfromcustomizationData = {
      layout: linkStyle.toUpperCase(),
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
          <AccordionTrigger>Platform Links Customization</AccordionTrigger>
          <AccordionContent>
            <div className="dark:bg-[#303030] bg-[#FFFFFF] rounded-2xl p-4 sm:p-6 border border-[#C0C0C017]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 dark:bg-[#3A3A3A] bg-[#F5F5F5] p-4 sm:p-5 rounded-2xl">
                <h2 className="text-left dark:text-white text-black mb-3 sm:mb-0">
                  Customize Link Style
                </h2>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  {platformLinks.slice(0, 4).map((link) => (
                    <div
                      key={link.id}
                      className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center"
                    >
                      <img
                        src={link.icon}
                        alt={link.name}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-3 dark:bg-[#3A3A3A] bg-[#F5F5F5] rounded-2xl">
                <h2 className="dark:text-white text-black mb-3">
                  Select Link Layout
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {styles.map((s) => (
                    <a
                      type="button"
                      key={s.id}
                      onClick={() => handleStyleChange(s.id, "platform")}
                      className="relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                    >
                      <div
                        className={`flex flex-col items-center justify-end ${
                          linkStyle === s.id
                            ? "border w-[162px] rounded-[11px] dark:border-white border-black p-2 sm:p-2"
                            : "border-2 border-transparent"
                        }`}
                      >
                        {s.id === "cards" ? (
                          <div className="flex flex-wrap gap-4 mt-2 w-full sm:w-[150px] dark:bg-[#2A2A2A] bg-[#FFFFFF] p-2 rounded-[11px]">
                            {platformLinks.slice(0, 3).map((link) => (
                              <div
                                key={link.id}
                                className="flex items-center gap-2 bg-gray-100 dark:bg-[#3A3A3A] p-1.5 rounded-lg"
                              >
                                <img
                                  src={link.icon}
                                  alt={link.name}
                                  className="w-5 h-5 rounded object-contain"
                                />
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-medium dark:text-white text-black">
                                    {link.title}
                                  </span>
                                  <span className="text-[6px] text-gray-500 dark:text-gray-400 break-all">
                                    {link.url}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : s.id === "icons" ? (
                          <div className="flex flex-wrap gap-4 mt-2 w-full sm:w-[150px] dark:bg-[#2A2A2A] bg-[#FFFFFF] p-2 rounded-[11px]">
                            {platformLinks.slice(0, 4).map((link) => (
                              <div
                                key={link.id}
                                className="rounded-lg flex flex-col items-center justify-center"
                              >
                                <img
                                  src={link.icon}
                                  alt={link.name}
                                  className="w-[30px] h-[30px] object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex s gap-2 mt-2 w-full sm:w-[150px] dark:bg-[#2A2A2A] bg-[#FFFFFF] p-2 rounded-[11px]">
                            {platformLinks.slice(0, 4).map((link) => (
                              <div
                                key={link.id}
                                className="rounded-lg  items-center justify-center"
                              >
                                <img
                                  src={link.icon}
                                  alt={link.name}
                                  className="w-[30px] h-[30px] object-contain"
                                />
                                <span className="dark:text-white text-black text-[6px] mt-1">
                                  {link.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        <span className="mt-2 text-sm dark:text-white text-black">
                          {s.label}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* PLATFORM — Carousel title color */}
              {linkStyle === "carousel" && (
                <div className="mt-6 p-4 dark:bg-[#3a3a3a] bg-[#F5F5F5] rounded-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                    <span className="dark:text-white text-black font-medium text-sm mb-2 sm:mb-0">
                      Tittle color
                    </span>
                    <a
                      type="button"
                      onClick={() => handleBgChange("gradient")}
                      className="flex items-center gap-1 dark:text-white text-black text-sm hover:text-gray-300 transition"
                    >
                      <RotateCcw size={14} />
                      Reset to default
                    </a>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex gap-3 flex-wrap">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            handleColorChange(activeTab, color);
                            openColorPicker("platform", activeTab, color);
                          }}
                          className="w-8 h-8 rounded-full border-2 transition-all"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <a
                      type="button"
                      onClick={() => handleBgChange("gradient")}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all"
                    >
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-[#6ea0ff]" />
                    </a>
                  </div>
                </div>
              )}

              {/* PLATFORM — Cards: bg / name / url */}
              {linkStyle === "cards" && (
                <div className="mt-6 p-4 dark:bg-[#3a3a3a] bg-[#F5F5F5] rounded-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <h3 className="dark:text-white text-black font-medium text-sm mb-2 sm:mb-0">
                      Color Customization
                    </h3>
                    <a
                      type="button"
                      onClick={() => handleBgChange("default")}
                      className="flex items-center gap-1 dark:text-white/80 text-black hover:text-white text-sm"
                    >
                      <RotateCcw size={14} />
                      Reset colors to default
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center border border-[#EAECF04A] dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full mb-5">
                    {["background", "name", "url"].map((tab) => (
                      <a
                        type="button"
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 text-center py-2 text-sm rounded-full transition
                        ${
                          activeTab === tab
                            ? "bg-black text-white font-medium"
                            : "dark:text-white/60 text-black/60 dark:hover:text-white"
                        }`}
                      >
                        {tab}
                      </a>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          handleColorChange(activeTab, color);
                          openColorPicker("platform", activeTab, color);
                        }}
                        className="w-8 h-8 rounded-full border-2 border-white/10 hover:scale-110 transition"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <button
                      onClick={() => handleColorChange(activeTab, "gradient")}
                      className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center overflow-hidden"
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
          <AccordionTrigger>Custom Links Customization</AccordionTrigger>

          <AccordionContent>
            <div className="dark:bg-[#303030] bg-[#FFFFFF] rounded-2xl p-4 sm:p-6 border border-[#C0C0C017]">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 dark:bg-[#3A3A3A] bg-[#F5F5F5] p-4 sm:p-5 rounded-2xl">
                <h2 className="text-left dark:text-white text-black mb-3 sm:mb-0">
                  Customize Custom Link Style
                </h2>

                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  {customLinks.slice(0, 4).map((link) => (
                    <div
                      key={link.id}
                      className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center"
                    >
                      <img
                        src={link.icon}
                        alt={link.label}
                        className="w-5 h-5"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout Section */}
              <div className="mt-4 p-3 dark:bg-[#3A3A3A] bg-[#F5F5F5] rounded-2xl">
                <h2 className="dark:text-white text-black mb-3">
                  Select Custom Link Layout
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {customstyles.map((s) => (
                    <a
                      type="button"
                      key={s.id}
                      onClick={() => handleStyleChange(s.id, "custom")}
                      className="relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                    >
                      <div
                        className={`flex flex-col items-center justify-center ${
                          customLinkStyle === s.id
                            ? "border h-[98px] w-[162px] rounded-[11px] dark:border-white border-black"
                            : "border-2 border-transparent"
                        }`}
                      >
                        <div className="flex gap-3 sm:gap-5 mt-2 rounded-[11px] w-full sm:w-[150px] dark:bg-[#2A2A2A] bg-[#FFFFFF] p-2 overflow-hidden">
                          {s.previewRenderer()}
                        </div>
                        <span className="mt-2 text-sm dark:text-white text-black">
                          {s.label}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* CUSTOM — Carousel */}
              {customLinkStyle === "carousel" && (
                <div className="mt-6 p-4 dark:bg-[#3a3a3a] bg-[#F5F5F5] rounded-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                    <h3 className="dark:text-white text-black font-medium text-sm mb-2 sm:mb-0">
                      Color Customization
                    </h3>
                    <a
                      type="button"
                      onClick={() => handleBgChange("default")}
                      className="flex items-center gap-1 dark:text-white/80 text-black hover:text-white text-sm"
                    >
                      <RotateCcw size={14} />
                      Reset colors to default
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center border border-[#EAECF04A] dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full mb-5">
                    {["background", "name"].map((tab) => (
                      <a
                        type="button"
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 text-center py-2 text-sm rounded-full transition
                        ${
                          activeTab === tab
                            ? "bg-black text-white font-medium"
                            : "dark:text-white/60 text-black/60 dark:hover:text-white"
                        }`}
                      >
                        {tab}
                      </a>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          handlecustomColorChange(activeTab, color);
                          openColorPicker("custom", activeTab, color);
                        }}
                        className="w-8 h-8 rounded-full border-2 border-white/10 hover:scale-110 transition"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <button
                      onClick={() =>
                        handlecustomColorChange(activeTab, "gradient")
                      }
                      className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center overflow-hidden"
                    >
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-[#6ea0ff]" />
                    </button>
                  </div>
                </div>
              )}

              {/* CUSTOM — Grids */}
              {customLinkStyle === "grid" && (
                <div className="mt-6 p-4 dark:bg-[#3a3a3a] bg-[#F5F5F5] rounded-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                    <h3 className="dark:text-white text-black font-medium text-sm mb-2 sm:mb-0">
                      Color Customization
                    </h3>
                    <a
                      type="button"
                      onClick={() => handleBgChange("default")}
                      className="flex items-center gap-1 dark:text-white/80 text-black hover:text-white text-sm"
                    >
                      <RotateCcw size={14} />
                      Reset colors to default
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center border border-[#EAECF04A] dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full mb-5">
                    {["background", "name"].map((tab) => (
                      <a
                        type="button"
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 text-center py-2 text-sm rounded-full transition
                        ${
                          activeTab === tab
                            ? "bg-black text-white font-medium"
                            : "dark:text-white/60 text-black/60 dark:hover:text-white"
                        }`}
                      >
                        {tab}
                      </a>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          handlecustomColorChange(activeTab, color);
                          openColorPicker("custom", activeTab, color);
                        }}
                        className="w-8 h-8 rounded-full border-2 border-white/10 hover:scale-110 transition"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <button
                      onClick={() =>
                        handlecustomColorChange(activeTab, "gradient")
                      }
                      className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center overflow-hidden"
                    >
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-[#6ea0ff]" />
                    </button>
                  </div>
                </div>
              )}

              {/* CUSTOM — Cards */}
              {customLinkStyle === "cards" && (
                <div className="mt-6 p-4 dark:bg-[#3a3a3a] bg-[#F5F5F5] rounded-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <h3 className="dark:text-white text-black font-medium text-sm mb-2 sm:mb-0">
                      Color Customization
                    </h3>
                    <a
                      type="button"
                      onClick={() => handleBgChange("default")}
                      className="flex items-center gap-1 dark:text-white/80 text-black hover:text-white text-sm"
                    >
                      <RotateCcw size={14} />
                      Reset colors to default
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center border border-[#EAECF04A] dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full mb-5">
                    {["background", "name"].map((tab) => (
                      <a
                        type="button"
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 text-center py-2 text-sm rounded-full transition
                        ${
                          activeTab === tab
                            ? "bg-black text-white font-medium"
                            : "dark:text-white/60 text-black/60 dark:hover:text-white"
                        }`}
                      >
                        {tab}
                      </a>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          handlecustomColorChange(activeTab, color);
                          openColorPicker("custom", activeTab, color);
                        }}
                        className="w-8 h-8 rounded-full border-2 border-white/10 hover:scale-110 transition"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <button
                      onClick={() =>
                        handlecustomColorChange(activeTab, "gradient")
                      }
                      className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center overflow-hidden"
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
