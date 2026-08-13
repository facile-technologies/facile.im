// SaveContactForm.js
import { useEffect, useState } from "react";
import { Switch } from "../../ui/switch";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContactButtonSettings,
  saveContactButtonSettings,
  setEmailBtnBgColor,
  setEmailBtnTextColor,
  setSaveBtnBgColor,
  setSavebtntext,
  setSaveBtnTextColor,
  setSaveContact,
  toggleSaveContactStatus,
  setSaveContactButtonRadius,
} from "@/app/stores/slices/profileSlice";
import ColorPickerPopUp from "../../shared/ColorPicker";
import Footer from "@/components/shared/Footer";
import { Pipette, RotateCcw, Maximize } from "lucide-react";

export default function SaveContactForm() {
  const profileType = useSelector((state) => state.profile.profileType);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [showCardColorPicker, setShowCardColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("Background");
  const [buttonTab, setButtonTab] = useState("Background");
  const [currentButtonColor, setCurrentButtonColor] = useState("#ffffff");
  const [currentEmailColor, setCurrentEmailColor] = useState("#ffffff");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const saveBtntext = useSelector((s) => s.profile.saveBtntext);
  const savebtnTextColor = useSelector((s) => s.profile.saveBtnTextColor);
  const saveBtnBgColor = useSelector((s) => s.profile.saveBtnBgColor);
  const saveContact = useSelector((s) => s.profile.saveContact);
  const saveBtnBBorderRadius = useSelector((s) => s.profile.saveBtnBBorderRadius);
  const dispatch = useDispatch();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
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
  useEffect(() => {
    dispatch(fetchContactButtonSettings({ profileType }));
  }, [dispatch]);

  const handleSaveContactToggle = () => {
    dispatch(
      toggleSaveContactStatus({ profileType, is_enabled: !saveContact })
    );
  };

  // const handleColorChange = (color) => {
  //   setCurrentColor(color.hex);
  //   if (activeTab === "Background") {
  //     dispatch(setSaveBtnBgColor(color.hex));
  //   } else {
  //     dispatch(setSaveBtnTextColor(color.hex));
  //   }
  // };
  const handleColorChange = (hex) => {
  setCurrentColor(hex);

  if (activeTab === "Background") {
    dispatch(setSaveBtnBgColor(hex));
  } else {
    dispatch(setSaveBtnTextColor(hex));
  }
};

  const getContrastColor = (hexColor) => {
    if (!hexColor) return "black";
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "black" : "white";
  };

  const activeColor = activeTab === "Background" ? saveBtnBgColor : savebtnTextColor;

  const handleSave = () => {
    const data = {
      button_text: saveBtntext,
      button_corner_radius: saveBtnBBorderRadius,
      button_bg_color: saveBtnBgColor,
      button_text_color: savebtnTextColor,
      is_enabled: true,
    };
    dispatch(saveContactButtonSettings({ profileType, data }));
  };
  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex flex-col gap-2 dark:bg-[#303030] bg-white rounded-2xl p-6 border dark:border-[#C0C0C017] border-gray-200 shadow-sm w-full max-w-[700px]">
        <div className="flex items-center justify-between w-full">
          <h2 className="dark:text-white text-black text-[16px] font-bold">
            Save Contact
          </h2>
          <Switch
            id="saveContactToggle"
            checked={saveContact}
            onCheckedChange={handleSaveContactToggle}
          />
        </div>
      </div>

      {saveContact && (
        <>
          <div className="flex flex-col dark:bg-[#303030] bg-[#F9FAFB] rounded-2xl p-4 border dark:border-[#C0C0C017] border-gray-200 w-full max-w-[700px]">
            <h3 className="dark:text-white text-black text-[16px] font-semibold mb-6">
              Button Customization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm dark:text-gray-300 text-gray-700 font-medium mb-2 block">
                  Button Text
                </label>
                <input
                  value={saveBtntext}
                  type="text"
                  placeholder="Save Contact"
                  onChange={(e) => {
                    dispatch(setSavebtntext(e.target.value));
                  }}
                  className="w-full dark:bg-[#2B2B2B] bg-white dark:text-white text-black px-4 py-2.5 rounded-xl border dark:border-[#5B5B5B] border-gray-300 outline-none placeholder:dark:text-white/50 placeholder:text-black/40 focus:border-gray-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm dark:text-gray-300 text-gray-700 font-medium mb-2 block">
                  Button Corner Radius
                </label>
                <div className="relative flex items-center w-full dark:bg-[#2B2B2B] bg-white rounded-xl border dark:border-[#5B5B5B] border-gray-300 overflow-hidden focus-within:border-gray-500 transition-colors">
                  <div className="px-3 flex items-center justify-center dark:text-gray-400 text-gray-500">
                    <Maximize size={16} />
                  </div>
                  <input
                    value={saveBtnBBorderRadius === 0 ? "" : saveBtnBBorderRadius}
                    type="number"
                    min={0}
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value;
                      dispatch(setSaveContactButtonRadius(val === "" ? 0 : Number(val)));
                    }}
                    className="w-full bg-transparent dark:text-white text-black py-2.5 outline-none placeholder:dark:text-white/50 placeholder:text-black/40"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center border border-[#EAECF04A] dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full mt-6 mb-5">
              {["Background", "Text"].map((tab) => (
                <a
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-center py-2 text-sm rounded-full cursor-pointer transition
                          ${activeTab === tab
                      ? "bg-black text-white font-medium shadow-sm"
                      : "dark:text-white/60 text-black/60 dark:hover:text-white hover:text-black"
                    }`}
                >
                  {tab}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              {/* Pipette icon for custom color picker */}
              <div
                onClick={() => {
                  setShowCardColorPicker("save");
                }}
                style={{ backgroundColor: activeColor || "#ffffff", color: getContrastColor(activeColor || "#ffffff") }}
                className={`w-8 h-8 rounded-full cursor-pointer border border-white/20 flex items-center justify-center transition-transform hover:scale-105 shadow-sm`}
              >
                <Pipette size={16} />
              </div>

              {colors.map((c) => (
                <div
                  key={c}
                  onClick={() => {
                    if (activeTab === "Background") {
                      dispatch(setSaveBtnBgColor(c));
                    } else {
                      dispatch(setSaveBtnTextColor(c));
                    }
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full cursor-pointer border shadow-sm transition-transform hover:scale-105 ${activeColor === c
                    ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                    : "border-gray-200 dark:border-white/10"
                    }`}
                />
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  dispatch(setSaveBtnBgColor("#4F2E86"));
                  dispatch(setSaveBtnTextColor("#FFFFFF"));
                }}
                className={`${isDarkMode ? "!text-[#C8C8C8]" : "!text-gray-500"} flex items-center gap-2 text-xs hover:text-black dark:hover:text-white transition !bg-transparent`}
              >
                <RotateCcw size={14} />
                Reset colors to default
              </button>
            </div>
          </div>
          <div className="w-full max-w-[700px]">
            <Footer onSave={handleSave} />
          </div>
        </>
      )}

      {showCardColorPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="relative">
            <ColorPickerPopUp
              currentColor={currentColor}
              onSelect={handleColorChange}
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

    </div>
  );
}
