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
} from "@/app/stores/slices/profileSlice";
import ColorPickerPopUp from "../../shared/ColorPicker";
import Footer from "@/components/shared/Footer";

export default function SaveContactForm() {
  const profileType = useSelector((state) => state.profile.profileType);
  const [saveContactToggle, setSaveContactToggle] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [showCardColorPicker, setShowCardColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("Background");
  const [buttonTab, setButtonTab] = useState("Background");
  const [currentButtonColor, setCurrentButtonColor] = useState("#ffffff");
  const [currentEmailColor, setCurrentEmailColor] = useState("#ffffff");
  const saveBtntext = useSelector((s) => s.profile.saveBtntext);
  const savebtnTextColor = useSelector((s) => s.profile.saveBtnTextColor);
  const saveBtnBgColor = useSelector((s) => s.profile.saveBtnBgColor);
  const dispatch = useDispatch();
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
    setSaveContactToggle((prev) => {
      const newValue = !prev;
      dispatch(setSaveContact(newValue));
      return newValue;
    });
  };
  useEffect(() => {
    if (saveBtntext) {
      setSaveContactToggle(true);
    } else {
      setSaveContactToggle(false);
    }
  }, [saveBtntext]);

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
    dispatch(setSaveBtnBgColor(color.hex));
  };

  const handleSave = () => {
    const payload = {
      button_text: saveBtntext,
      button_corner_radius: 0,
      button_bg_color: saveBtnBgColor,
      button_text_color: savebtnTextColor,
    };
    dispatch(saveContactButtonSettings({ profileType, payload }));
  };
  return (
    <div className="flex flex-col gap-10 w-full max-w-[1100px] mx-auto">
      <div className="flex flex-col gap-2 dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-6 border border-[#C0C0C017] w-full max-w-[700px]">
        <div className="flex items-center justify-between w-full">
          <h2 className="dark:text-white text-black text-[16px] font-bold">
            Save Contact
          </h2>
          <Switch
            id="saveContactToggle"
            checked={saveContactToggle}
            onCheckedChange={handleSaveContactToggle}
          />
        </div>
      </div>

      {saveContactToggle && (
        <div className="flex flex-col  dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-4 border border-[#C0C0C017] w-full max-w-[700px]">
          <h3 className="dark:text-white text-black text-[16px] font-semibold mb-1">
            Button Customization
          </h3>
          <p className="dark:text-white text-black opacity-50 text-[12px] mb-4">
            Customize form button
          </p>
          <input
            value={saveBtntext}
            type="text"
            placeholder="Save Contact"
            onChange={(e) => {
              dispatch(setSavebtntext(e.target.value));
            }}
            className="w-full dark:bg-[#2B2B2B] dark:text-white text-white px-4 py-3 rounded-xl border border-[#5B5B5B] outline-none placeholder:text-white/50"
          />
          <div className="flex flex-col sm:flex-row items-center border border-[#EAECF04A] dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full mt-4 mb-5">
            {["Background", "Name"].map((tab) => (
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
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            {colors.map((c) => (
              <div
                key={c}
                onClick={() => {
                  setCurrentButtonColor(c);
                  setShowCardColorPicker("save");
                }}
                style={{ backgroundColor: c }}
                className="w-8 h-8 rounded-full cursor-pointer border border-white/20"
              />
            ))}
          </div>
        </div>
      )}

      {/* Color Picker Modal */}
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
      {showCardColorPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="relative">
            <ColorPickerPopUp
              currentColor={
                showCardColorPicker === "email"
                  ? currentEmailColor
                  : currentButtonColor
              }
              onSelect={(newColor) => {
                if (showCardColorPicker === "email") {
                  setCurrentEmailColor(newColor);
                  buttonTab === "Background"
                    ? dispatch(setEmailBtnBgColor(newColor))
                    : dispatch(setEmailBtnTextColor(newColor));
                } else if (showCardColorPicker === "save") {
                  setCurrentButtonColor(newColor);
                  activeTab === "Background"
                    ? dispatch(setSaveBtnBgColor(newColor))
                    : dispatch(setSaveBtnTextColor(newColor));
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
      <Footer onSave={handleSave} />
    </div>
  );
}
