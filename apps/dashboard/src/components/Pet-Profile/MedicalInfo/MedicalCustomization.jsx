import { useState } from "react";
import { Pipette } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMedicalCustomizationBackgroundColor,
  setMedicalCustomizationheadertextColor,
  setMedicalCustomizationTextColor,
  setMedicalCustomizationTitle,
  updateMedicalCustomizations,
} from "@/app/stores/slices/petprofileSlice";
import ColorPickerPopUp from "../../shared/ColorPicker";
import Footer from "@/components/shared/Footer";

const COLORS = [
  "#FFFFFF", "#E0E6EF", "#A6AEC5", "#000000",
  "#E05A59", "#F4A63A", "#F7D858", "#4CAF50", "#6AA7FF", "#A469FF",
];

export default function MedicalCustomization() {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("Background");
  const dispatch = useDispatch();

  const mediaclCustomization = useSelector(
    (state) => state.petprofile.medicaCustomization
  );
  const loading = useSelector((state) => state.petprofile.loading);

  const getCurrentTabColor = () => {
    if (activeTab === "Background") return mediaclCustomization?.backgroundColor || "#3F3F3F";
    if (activeTab === "Header") return mediaclCustomization?.headerTextColor || "#ffffff";
    return mediaclCustomization?.bodyTextColor || "#ffffff";
  };

  const applyColor = (color) => {
    if (activeTab === "Background") dispatch(setMedicalCustomizationBackgroundColor(color));
    else if (activeTab === "Header") dispatch(setMedicalCustomizationheadertextColor(color));
    else dispatch(setMedicalCustomizationTextColor(color));
  };

  const handleSaveMedicalCustomization = () => {
    dispatch(
      updateMedicalCustomizations({
        background_color: mediaclCustomization.backgroundColor,
        header_color: mediaclCustomization.headerTextColor,
        body_color: mediaclCustomization.bodyTextColor,
        header_text: mediaclCustomization.title,
        contact_btn_enabled: mediaclCustomization.contactBtnEnabled ?? true,
      })
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-4 border border-[#C0C0C017] w-full gap-3">
        <h3 className="dark:text-white text-black text-[16px] font-semibold">
          Customization
        </h3>

        {/* Title Input */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-white text-black text-sm">Title</label>
          <input
            type="text"
            value={mediaclCustomization.title || ""}
            onChange={(e) => dispatch(setMedicalCustomizationTitle(e.target.value))}
            className="w-full dark:bg-[#2B2B2B] dark:text-white text-white px-4 py-3 rounded-xl border border-[#5B5B5B] outline-none"
          />
        </div>

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

      {/* Color picker modal — only opened by Pipette */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="relative">
            <ColorPickerPopUp
              currentColor={getCurrentTabColor()}
              onSelect={(color) => {
                applyColor(color);
                setShowColorPicker(false);
              }}
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

      <Footer onSave={handleSaveMedicalCustomization} loading={loading} />
    </div>
  );
}
