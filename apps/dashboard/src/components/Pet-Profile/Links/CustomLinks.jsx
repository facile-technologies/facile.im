"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setColorCustomization,
  setcustomLinkstyle,
  setcustomColorCustomization,
  setLinkStyle,
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

export default function LinkStyleAccordionItem() {
  const dispatch = useDispatch();
  const { linkStyle = "icons", customLinkStyle = "carousel" } = useSelector(
    (state) => state.profile || {},
  );
  const { platformLinks, customLinks } = useLinksManager();
  const [activeTab, setActiveTab] = useState("background");
  const [showCardColorPicker, setShowCardColorPicker] = useState(false);

  const handleColorChange = (tab, color) => {
    dispatch(setColorCustomization({ colorType: tab, colorValue: color }));
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
          {platformLinks[0] ? (
            <img src={platformLinks[0].icon} alt="" className="w-8 h-8" />
          ) : (
            <Instagram className="w-6 h-6 text-white/60" />
          )}
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
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
          {customLinks[0] ? (
            <img src={customLinks[0].icon} alt="" className="w-8 h-8" />
          ) : (
            <Instagram className="w-6 h-6 text-white/60" />
          )}
        </div>
      ),
    },
    {
      id: "carousel",
      label: "Carousel",
      previewRenderer: () => (
        <div className="w-12 h-12 bg-gradient-to-br from-accent to-[#6ea0ff] rounded-xl flex flex-col items-center justify-center p-1 text-white">
          {customLinks[0] ? (
            <>
              <img
                src={customLinks[0].icon}
                alt=""
                className="w-5 h-5 mb-0.5"
              />
              <p className="text-[9px] truncate w-full text-center px-0.5">
                {customLinks[0].label || customLinks[0].name}
              </p>
            </>
          ) : (
            <Instagram className="w-5 h-5 text-white/60" />
          )}
        </div>
      ),
    },
    {
      id: "grids",
      label: "Grids",
      previewRenderer: () => (
        <div className="w-full bg-gray-800 p-4 rounded-xl">
          {/* Title Row */}
          <div className="w-full bg-gray-600 text-white p-4 rounded-t-xl mb-4 text-center">
            <p className="text-xl font-semibold">Title</p>
          </div>

          {/* Grid Layout with auto-resizing and no overflow */}
          <div className="grid gap-4">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
                customLinks.length <= 4 ? "grid-rows-1" : "grid-rows-auto"
              }`}
            >
              {customLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-gray-700 text-white p-4 rounded-lg flex flex-col items-center justify-center"
                >
                  <img
                    src={link.icon}
                    alt={link.name}
                    className="w-16 h-16 rounded-full mb-2"
                  />
                  <p className="text-sm font-medium">
                    {link.label || link.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {link.url || "link.com"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Accordion defaultValue="link-style" type="single" collapsible>
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
                    <img src={link.icon} alt={link.name} className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="mt-4 p-3 dark:bg-[#3A3A3A] bg-[#F5F5F5] rounded-2xl">
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
                          ? "border h-[`100x] w-[162px] rounded-[11px]  dark:border-white border-black p-2 sm:p-2"
                          : "border-2 border-transparent"
                      }`}
                    >
                      <div className="flex gap-3 sm:gap-2 mt-2 rounded-[11px] w-full sm:w-[150px]  dark:bg-[#2A2A2A] bg-[#FFFFFF] p-2 sm:p-4">
                        {platformLinks.slice(0, 4).map((link) => (
                          <div
                            key={link.id}
                            className="rounded-lg flex flex-col items-center justify-center min-w-[30px]"
                          >
                            <img
                              src={link.icon}
                              alt={link.name}
                              className="w-[30px] h-[30px]"
                            />
                            <span className="dark:text-white text-black text-[8px] mt-1">
                              {link.label || link.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <span className="mt-2 text-sm dark:text-white text-black">
                        {s.label}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div> */}
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
                          ? "border  w-[162px] rounded-[11px] dark:border-white border-black p-2 sm:p-2"
                          : "border-2 border-transparent"
                      }`}
                    >
                      <div className="flex flex-wrap gap-3 sm:gap-2 mt-2 rounded-[11px] w-full sm:w-[150px]  dark:bg-[#2A2A2A] bg-[#FFFFFF] p-2 sm:p-4">
                        {platformLinks.slice(0, 4).map((link) => (
                          <div
                            key={link.id}
                            className="rounded-lg flex flex-col items-center justify-center min-w-[30px] max-w-[30%] sm:max-w-[25%]"
                          >
                            <img
                              src={link.icon}
                              alt={link.name}
                              className="w-[30px] h-[30px] object-contain"
                            />
                            <span className="dark:text-white text-black text-[8px] mt-1">
                              {link.label || link.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <span className="mt-2 text-sm dark:text-white text-black">
                        {s.label}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

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
                        onClick={() => handleColorChange(activeTab, color)} // Pass the activeTab here
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
                      onClick={() => handleColorChange(activeTab, color)}
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
                    <img src={link.icon} alt={link.label} className="w-5 h-5" />
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
                      className={`flex flex-col items-center justify-end ${
                        customLinkStyle === s.id
                          ? "border h-[120px] w-[162px] rounded-[11px] dark:border-white border-black"
                          : "border-2 border-transparent"
                      }`}
                    >
                      <div className="flex gap-3 sm:gap-5 mt-2 rounded-[11px] w-full sm:w-[150px] h-[85px] dark:bg-[#2A2A2A] bg-[#FFFFFF] p-2 sm:p-4 py-4">
                        {customLinks.slice(0, 4).map((link) => (
                          <div
                            key={link.id}
                            className="rounded-lg flex items-center justify-center min-w-[30px]"
                          >
                            <img
                              src={link.icon}
                              alt={link.label}
                              className="w-[30px] h-[30px]"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="mt-2 text-sm dark:text-white text-black">
                        {s.label}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Color section — same conditions */}
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
                      onClick={() => handlecustomColorChange(activeTab, color)}
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
            {customLinkStyle === "grids" && (
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
                      onClick={() => handlecustomColorChange(activeTab, color)}
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
                      onClick={() => handlecustomColorChange(activeTab, color)}
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
    </Accordion>
  );
}
