import { useState, useEffect } from "react";
import { Pipette } from "lucide-react";
import { Switch } from "../../ui/switch";
import { useDispatch, useSelector } from "react-redux";
import {
  setContactCustomizationBackgroundColor,
  setContactCustomizationheadertextColor,
  setContactCustomizationTextColor,
  setContactCustomizationTitle,
  setContactBtnEnabled,
  updateContcatCustomizations,
} from "@/app/stores/slices/petprofileSlice";
import ColorPickerPopUp from "../../shared/ColorPicker";
import Footer from "../../shared/Footer";

const COLORS = [
  "#FFFFFF",
  "#E0E6EF",
  "#A6AEC5",
  "#000000",
  "#E05A59",
  "#F4A63A",
  "#F7D858",
  "#4CAF50",
  "#6AA7FF",
  "#A469FF",
];

export default function ContactCustomization() {
  const [contactButtonEnabled, setContactButtonEnabled] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("Background");
  const dispatch = useDispatch();

  const contactCustomization = useSelector(
    (state) => state.petprofile.ContactCustomization
  );
  const loading = useSelector((state) => state.petprofile.loading);

  useEffect(() => {
    if (contactCustomization?.contactBtnEnabled !== undefined) {
      setContactButtonEnabled(!!contactCustomization.contactBtnEnabled);
    }
  }, [contactCustomization?.contactBtnEnabled]);

  const handleSaveCustomization = () => {
    dispatch(
      updateContcatCustomizations({
        title: contactCustomization?.title,
        background_color: contactCustomization?.backgroundColor,
        header_color: contactCustomization?.headerTextColor,
        body_color: contactCustomization?.bodyTextColor,
        contact_btn_enabled: contactButtonEnabled,
      })
    );
  };

  const getCurrentTabColor = () => {
    if (activeTab === "Background") return contactCustomization?.backgroundColor || "#ffffff";
    if (activeTab === "Header") return contactCustomization?.headerTextColor || "#000000";
    return contactCustomization?.bodyTextColor || "#000000";
  };

  const applyColor = (color) => {
    if (activeTab === "Background") {
      dispatch(setContactCustomizationBackgroundColor(color));
    } else if (activeTab === "Header") {
      dispatch(setContactCustomizationheadertextColor(color));
    } else {
      dispatch(setContactCustomizationTextColor(color));
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full mx-auto">
      <h3 className="dark:text-white text-black text-[16px] font-semibold mt-5">
        Contact Customization
      </h3>

      {/* Title */}
      <div className="flex flex-col dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-4 border border-[#C0C0C017] w-full gap-3">
        <div>
          <h3 className="dark:text-white text-black text-[16px] font-semibold">Title</h3>
          <p className="dark:text-white/50 text-black/50 text-[12px]">Give title to the contact form</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="dark:text-white text-black text-sm">Title</label>
          <input
            type="text"
            value={contactCustomization?.title || ""}
            onChange={(e) => dispatch(setContactCustomizationTitle(e.target.value))}
            className="w-full dark:bg-[#2B2B2B] bg-white dark:text-white text-black px-4 py-3 rounded-xl border border-[#5B5B5B] outline-none"
          />
        </div>
      </div>

      {/* Color Customization */}
      <div className="flex flex-col dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-4 border border-[#C0C0C017] w-full gap-3">
        <h3 className="dark:text-white text-black text-[15px] font-semibold">Color Customization</h3>

        {/* Tab switcher */}
        <div className="flex dark:bg-[#3F3F3F] bg-[#E8E8E8] rounded-full w-full h-10 overflow-hidden">
          {["Background", "Header", "Body"].map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 h-full text-center text-sm transition font-medium ${
                activeTab === tab
                  ? "bg-black! text-white! rounded-full!"
                  : "dark:text-gray-300! text-gray-600! hover:opacity-80! bg-transparent!"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Swatches row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Pipette — opens full color picker */}
          <button
            type="button"
            onClick={() => setShowColorPicker(true)}
            className="w-9 h-9 rounded-full border-2 border-gray-300 dark:border-gray-500 flex items-center justify-center hover:scale-110 transition shadow-sm bg-white dark:bg-[#2B2B2B]"
          >
            <Pipette size={15} className="text-gray-600 dark:text-gray-300" />
          </button>

          {/* Preset swatches — apply immediately */}
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => applyColor(c)}
              style={{ backgroundColor: c }}
              className={`w-9 h-9 rounded-full border shadow-sm transition-transform hover:scale-110 ${
                getCurrentTabColor()?.toLowerCase() === c.toLowerCase()
                  ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                  : "border-black/10 dark:border-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Contact Button toggle */}
      <div className="flex flex-col dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl px-4 py-4 border border-[#C0C0C017] w-full">
        <div className="flex items-center justify-between w-full">
          <h2 className="dark:text-white text-black text-[15px] font-semibold">Contact Button</h2>
          <Switch
            id="contact-btn"
            checked={contactButtonEnabled}
            onCheckedChange={(val) => {
              setContactButtonEnabled(val);
              dispatch(setContactBtnEnabled(val));
            }}
          />
        </div>
      </div>

      {/* Color picker modal — only opened by Pipette */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="relative">
            <ColorPickerPopUp
              currentColor={getCurrentTabColor()}
              onSelect={(color) => applyColor(color)}
              onClose={() => setShowColorPicker(false)}
            />
            <button
              onClick={() => setShowColorPicker(false)}
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-7 h-7 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Footer buttonText="Update" onSave={handleSaveCustomization} loading={loading} />
    </div>
  );
}
