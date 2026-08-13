import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pipette } from "lucide-react";
import {
  setIdentifucationLayout,
  setIdentificationCustomization,
  savePETIdentificationById,
  fetchPETIdentification,
} from "@/app/stores/slices/petprofileSlice";
import ColorPickerPopUp from "../../shared/ColorPicker";
import Footer from "@/components/shared/Footer";

export default function IdentificationCustomization() {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("Background");
  const dispatch = useDispatch();
  const identification = useSelector(
    (state) => state.petprofile.identification
  );
  const colors = [
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
  const identificationCustomization = useSelector(
    (state) => state.petprofile.identificationCustomization
  );
  const petIdentification = useSelector(
    (state) => state.petprofile.identificationLayout
  );
  const loading = useSelector((state) => state.petprofile.loading);

  useEffect(() => {
    dispatch(fetchPETIdentification());
  }, [dispatch]);

  const getCurrentTabColor = () => {
    if (activeTab === "Background") return identificationCustomization?.backgroundColor || "#3F3F3F";
    if (activeTab === "Header") return identificationCustomization?.headerTextColor || "#ffffff";
    return identificationCustomization?.bodyTextColor || "#ffffff";
  };

  const applyColor = (color) => {
    if (activeTab === "Background") {
      dispatch(setIdentificationCustomization({ backgroundColor: color }));
    } else if (activeTab === "Header") {
      dispatch(setIdentificationCustomization({ headerTextColor: color }));
    } else {
      dispatch(setIdentificationCustomization({ bodyTextColor: color }));
    }
  };

  const handleLayoutChange = (layout) => {
    dispatch(setIdentifucationLayout(layout));
  };

  const handleTitleChange = (e) => {
    dispatch(setIdentificationCustomization({ title: e.target.value }));
  };

  const handleSaveIdentification = () => {
    const payload = {
      ...identification,
      ...identificationCustomization,
      layout: petIdentification,
    };
    dispatch(savePETIdentificationById(payload));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-4 border border-[#C0C0C017] w-full gap-3">
        <h3 className="dark:text-white text-black text-[15px] font-semibold">Customization</h3>
        <div className="flex flex-col gap-1">
          <label className="dark:text-white text-black text-sm">Title</label>
          <input
            type="text"
            value={identificationCustomization.title}
            onChange={handleTitleChange}
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
          {colors.map((c) => (
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

      <div className="flex flex-col gap-2 dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-6 border border-[#C0C0C017] w-full">
        <div className="mt-4 p-4 rounded-2xl dark:bg-[#2f2f2f] bg-[#F5F5F5]">
          <span className="block font-medium text-sm mb-2 text-black dark:text-white">
            Layout
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Customize the fields you'd like to collect from users.
          </p>

          <div className="flex gap-3">
            {/* List Layout */}
            <div
              className={`flex-1 flex flex-col items-center justify-center border rounded-xl cursor-pointer p-2 transition bg-[#3F3F3F] ${
                petIdentification === "LIST" ? "border-white" : " border-none"
              }`}
              onClick={() => handleLayoutChange("LIST")}
            >
              <div className="w-full h-8 bg-[#7C7C7C] rounded mb-1"></div>
              <div className="w-full h-8 bg-[#7C7C7C] rounded"></div>
              <span className="text-xs text-gray-700 dark:text-gray-200 mt-1">
                List
              </span>
            </div>

            {/* Card Layout */}
            <div
              className={`flex-1 flex flex-col items-center justify-center border rounded-xl cursor-pointer p-2 transition bg-[#3F3F3F] ${
                petIdentification === "CARD" ? "border-white" : " border-none"
              }`}
              onClick={() => handleLayoutChange("CARD")}
            >
              <div className="w-full flex flex-col-2 gap-1 mb-1">
                <div className="w-full h-8 bg-[#7C7C7C] rounded"></div>
                <div className="w-full h-8 bg-[#7C7C7C] rounded"></div>
              </div>

              <span className="text-xs text-gray-700 dark:text-gray-200 mt-1">
                Card
              </span>
            </div>
          </div>
        </div>
      </div>
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
      <Footer onSave={handleSaveIdentification} loading={loading} />
    </div>
  );
}
