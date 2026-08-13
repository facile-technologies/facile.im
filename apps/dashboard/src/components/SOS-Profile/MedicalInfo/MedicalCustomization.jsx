import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSOSProfile,
  updateMedicalCustomizations,
} from "@/app/stores/slices/Sosprofile/thunk";
import ColorPickerPopUp from "../../shared/ColorPicker";
import Footer from "@/components/shared/Footer";
import { selectSOSLoading } from "@/app/stores/selectors/sosProfileSelector";
import Loader from "@/store/utils/Loader";
import { showToast } from "@/store/utils/toast";
import {
  setMedicalCustomizationBackgroundColor,
  setMedicalCustomizationheadertextColor,
  setMedicalCustomizationTextColor,
  setMedicalCustomizationTitle,
} from "@/app/stores/slices/sosprofileSlice";
import { Pipette, RotateCcw } from "lucide-react";

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

const DEFAULT_COLORS = {
  backgroundColor: "#ffffff",
  headerTextColor: "#000000",
  bodyTextColor: "#000000",
};

export default function MedicalCustomization() {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("Background");
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();

  const mediaclCustomization = useSelector(
    (state) => state.sosprofile.medicaCustomization
  );
  const loading = useSelector(selectSOSLoading);

  const getCurrentTabColor = () => {
    if (activeTab === "Background") return mediaclCustomization?.backgroundColor || "#ffffff";
    if (activeTab === "Header") return mediaclCustomization?.headerTextColor || "#000000";
    return mediaclCustomization?.bodyTextColor || "#000000";
  };

  const applyColor = (color) => {
    if (activeTab === "Background") {
      dispatch(setMedicalCustomizationBackgroundColor(color));
    } else if (activeTab === "Header") {
      dispatch(setMedicalCustomizationheadertextColor(color));
    } else {
      dispatch(setMedicalCustomizationTextColor(color));
    }
  };

  const handleResetColors = () => {
    dispatch(setMedicalCustomizationBackgroundColor(DEFAULT_COLORS.backgroundColor));
    dispatch(setMedicalCustomizationheadertextColor(DEFAULT_COLORS.headerTextColor));
    dispatch(setMedicalCustomizationTextColor(DEFAULT_COLORS.bodyTextColor));
  };

  const handleSaveMedicalCustomization = () => {
    setIsSaving(true);
    dispatch(
      updateMedicalCustomizations({
        background_color: mediaclCustomization?.backgroundColor,
        header_color: mediaclCustomization?.headerTextColor,
        body_color: mediaclCustomization?.bodyTextColor,
        header_text: mediaclCustomization?.headerText,
      })
    )
      .then(() => dispatch(fetchSOSProfile()))
      .catch(() => showToast("error", "Failed to update medical customization!"))
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {loading && <Loader />}

      {/* Title section */}
      <div className="flex flex-col dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-4 border border-[#C0C0C017] w-full gap-3">
        <h3 className="dark:text-white text-black text-[16px] font-semibold">Customization</h3>
        <div className="relative mt-2">
          <div className="w-full rounded-xl border border-[#5A5A5A] dark:border-[#555] bg-transparent px-5 pt-2 pb-1">
            <label className="text-gray-400! text-[15px]">Header Text</label>
            <input
              type="text"
              value={mediaclCustomization?.headerText || ""}
              onChange={(e) => dispatch(setMedicalCustomizationTitle(e.target.value))}
              className="w-full bg-transparent text-black dark:text-white text-[18px] outline-none pb-1"
            />
          </div>
        </div>
      </div>

      {/* Color Customization section */}
      <div className="flex flex-col dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-4 border border-[#C0C0C017] w-full gap-3">
        <div className="flex items-center justify-between">
          <h3 className="dark:text-white text-black text-[15px] font-semibold">Color Customization</h3>
          <button
            type="button"
            onClick={handleResetColors}
            className="flex items-center gap-1 text-[#C8C8C8]! dark:text-white text-sm transition hover:opacity-70 bg-transparent!"
          >
            <RotateCcw size={13} />
            Reset colors to default
          </button>
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

      {/* Color picker modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
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

      <Footer buttonText="Update" onSave={handleSaveMedicalCustomization} loading={isSaving} />
    </div>
  );
}
