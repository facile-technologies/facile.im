import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  RotateCcw,
  Plus,
  X,
  Ban,
  Palette,
  Pipette,
} from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import ColorPickerPopUp from "./ColorPicker";
import { selectSOSProfile } from "@/app/stores/selectors/sosProfileSelector";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBgImage,
  selectBgImage,
  setBgImage,
  setLayout,
  setProfileActivation,
} from "@/app/stores/slices/sosprofileSlice";
import {
  setBackgroundImage,
  setPetLayout,
  setPetProfileActivation,
  setBgImage as petSetBgImage,
  removeBgImage as petRemoveBgImage,
  selectBgImage as petSelectBgImage,
} from "@/app/stores/slices/petprofileSlice";
import { selectPetProfile } from "@/app/stores/selectors/petProfileSelector";

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

export default function CustomAccordion({
  onBgChange,
  onBlurChange,
  onBackgorundImgChange,
  onTextColorChange,
  onBackgorundChange,
  onFontChange,
  onFontSizeChange,
  backgroundInputRef,
  blurValue,
  currentBgImage,
  currentBgColor,
  currentTextColor,
}) {
  const { theme: currentTheme } = useSelector((state) => state.profile || {});
  const isDarkMode = currentTheme === "dark";

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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const [pickerTarget, setPickerTarget] = useState(null);
  const dispatch = useDispatch();

  const sosProfile = useSelector((state) => state.sosprofile.profileActivation);
  const petProfile = useSelector((state) => state.petprofile.profileActivation);
  const layoutType = useSelector((state) => state.sosprofile.layout);
  const petLayout = useSelector(
    (state) => state.petprofile.customization?.layout,
  );
  console.log(sosProfile, "sosProfile");
  console.log(petProfile, "petProfile");

  useEffect(() => {
    const profileType = localStorage.getItem("profileLayout");
    console.log(profileType, "profileType");

    profileType === "0"
      ? dispatch(setProfileActivation(true))
      : dispatch(setProfileActivation(false));
    profileType === "1"
      ? dispatch(setPetProfileActivation(true))
      : dispatch(setPetProfileActivation(false));
  }, []);

  const openColorPicker = (target, color) => {
    setPickerTarget(target);
    setCurrentColor(color);
    setShowColorPicker(true);
  };
  const handleLayoutChange = (layout) => {
    dispatch(setLayout(layout)); // Dispatch action to change layout
  };
  const handlePetLayoutChange = (layout) => {
    dispatch(setPetLayout({ layout }));
  };

  return (
    <>
      <AccordionPrimitive.Root
        type="single"
        collapsible
        className="w-full space-y-3"
      >
        {/* --- Text Color Customization --- */}
        <AccordionItem value="about">
          <AccordionTrigger>About Customization</AccordionTrigger>
          <AccordionContent>
            <div className="p-4 rounded-2xl dark:bg-[#2f2f2f] bg-[#F5F5F5]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-sm">
                  Text Color Customization
                </span>
                <a
                  type="button"
                  className="flex items-center gap-1 text-gray-400 text-sm hover:text-white transition"
                  onClick={() => onTextColorChange?.("#ffffff")}
                >
                  <RotateCcw size={14} />
                  Reset colors to default
                </a>
              </div>

              <div className="flex gap-3 flex-wrap mb-4 items-center">
                <button
                  type="button"
                  onClick={() =>
                    openColorPicker("aboutText", currentTextColor || "#000000")
                  }
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 transition shadow-sm"
                  style={{
                    backgroundColor: currentTextColor || "#000000",
                    color: getContrastColor(currentTextColor || "#000000"),
                  }}
                >
                  <Pipette size={14} color="currentColor" />
                </button>
                {colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onTextColorChange?.(String(color));
                    }}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-105 ${
                      currentTextColor === color
                        ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#2f2f2f] border-transparent"
                        : "border-black/10 dark:border-white/10 hover:scale-110"
                    }`}
                  />
                ))}
              </div>
              {sosProfile && (
                <div className="mt-4 p-4 rounded-2xl dark:bg-[#2f2f2f] bg-[#F5F5F5]">
                  <span className="block font-medium text-sm mb-2 text-black dark:text-white">
                    Layout
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Customize the fields you'd like to collect from users.
                  </p>

                  <div className="flex gap-3">
                    <div
                      className={`flex-1 flex flex-col items-center justify-center border rounded-xl cursor-pointer p-2 transition bg-[#3F3F3F] ${
                        layoutType === "LIST" ? "border-white" : "border-none"
                      }`}
                      onClick={() => handleLayoutChange("LIST")}
                    >
                      <div className="w-full h-8 bg-[#7C7C7C] rounded mb-1"></div>
                      <div className="w-full h-8 bg-[#7C7C7C] rounded"></div>
                      <span className="text-xs text-gray-700 dark:text-gray-200 mt-1">
                        List
                      </span>
                    </div>

                    <div
                      className={`flex-1 flex flex-col items-center justify-center border rounded-xl cursor-pointer p-2 transition bg-[#3F3F3F] ${
                        layoutType === "CARD" ? "border-white" : "border-none"
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
              )}

              {petProfile && !sosProfile && (
                <div className="mt-4 p-4 rounded-2xl dark:bg-[#2f2f2f] bg-[#F5F5F5]">
                  <span className="block font-medium text-sm mb-2 text-black dark:text-white">
                    Layout
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Customize the fields you'd like to collect from users.
                  </p>

                  <div className="flex gap-3">
                    <div
                      className={`flex-1 flex flex-col items-center justify-center border rounded-xl cursor-pointer p-2 transition bg-[#3F3F3F] ${
                        petLayout === "LIST" ? "border-white" : "border-none"
                      }`}
                      onClick={() => handlePetLayoutChange("LIST")}
                    >
                      <div className="w-full h-8 bg-[#7C7C7C] rounded mb-1"></div>
                      <div className="w-full h-8 bg-[#7C7C7C] rounded"></div>
                      <span className="text-xs text-gray-700 dark:text-gray-200 mt-1">
                        List
                      </span>
                    </div>

                    <div
                      className={`flex-1 flex flex-col items-center justify-center border rounded-xl cursor-pointer p-2 transition bg-[#3F3F3F] ${
                        petLayout === "CARD" ? "border-white" : "border-none"
                      }`}
                      onClick={() => handlePetLayoutChange("CARD")}
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
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="profile">
          <AccordionTrigger>Profile Customization</AccordionTrigger>
          <AccordionContent>
            <ProfileCustomizationUI
              onBgChange={onBgChange}
              onBlurChange={onBlurChange}
              onBackgorundImgChange={onBackgorundImgChange}
              onBackgorundChange={onBackgorundChange}
              backgroundInputRef={backgroundInputRef}
              onOpenBgColorPicker={(color) =>
                openColorPicker("profileBg", color)
              }
              onFontChange={onFontChange}
              onFontSizeChange={onFontSizeChange}
              blurValue={blurValue}
              currentBgImage={currentBgImage}
              currentBgColor={currentBgColor}
              isDarkMode={isDarkMode}
              getContrastColor={getContrastColor}
            />
          </AccordionContent>
        </AccordionItem>
      </AccordionPrimitive.Root>
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
          <div className="relative">
            <ColorPickerPopUp
              currentColor={currentColor}
              onSelect={(newColor) => {
                setCurrentColor(newColor);
                if (pickerTarget === "aboutText") {
                  onTextColorChange?.(newColor);
                } else if (pickerTarget === "profileBg") {
                  onBgChange?.(newColor);
                }
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
    </>
  );
}
function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "border-none bg-[#F5F5F5] dark:bg-[#2f2f2f] rounded-2xl",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({ children, className, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group w-full text-sm font-medium outline-none transition-all px-5 py-3 text-left flex justify-between items-center",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="w-5 h-5 text-gray-300 ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ children, className, ...props }) {
  return (
    <AccordionPrimitive.Content
      className="accordion-content rounded-b-xl data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
      {...props}
    >
      <div className={cn(" rounded-2xl px-1 py-1  m-4 text-sm", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

function ProfileCustomizationUI({
  onBgChange,
  onBlurChange,
  onBackgorundImgChange,
  backgroundInputRef,
  onOpenBgColorPicker,
  onFontChange,
  onFontSizeChange,
  blurValue,
  currentBgImage,
  currentBgColor,
  isDarkMode,
  getContrastColor,
}) {
  const dispatch = useDispatch();
  const [blur, setBlur] = useState(blurValue || 0);
  const [selectedBg, setSelectedBg] = useState("none");
  const [sessionUpload, setSessionUpload] = useState(null);

  const petProfileActive = useSelector((state) => state.petprofile.profileActivation);
  const sosBgImages = useSelector((state) => state.sosprofile.backgroundImages || []);
  const petBgImages = useSelector((state) => state.petprofile.backgroundImages || []);
  const backgroundImages = petProfileActive ? petBgImages : sosBgImages;

  useEffect(() => {
    if (currentBgImage && currentBgImage !== "none") {
      setSelectedBg(currentBgImage);
    } else if (currentBgColor) {
      setSelectedBg(currentBgColor);
    } else {
      setSelectedBg("none");
    }
  }, [currentBgImage, currentBgColor]);

  useEffect(() => {
    if (currentBgImage && currentBgImage !== "none") {
      setSessionUpload(null);
    }
  }, [currentBgImage]);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedBg(imageUrl);

    // Push to Redux backgroundImages + set as active background
    onBackgorundImgChange?.({ url: imageUrl, file });
    onBgChange?.("none");
  };

  // const handleImageUpload = (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   setBackgroundImages((prev) => [
  //     ...prev,
  //     { src: URL.createObjectURL(file), file },
  //   ]);
  //   setSelectedBg(URL.createObjectURL(file));
  //   onBackgorundImgChange?.(file);

  //   onBgChange?.("none");
  // };

  // Handle removing the image
  const handleRemoveImage = (index) => {
    if (petProfileActive) {
      dispatch(petRemoveBgImage(index));
      dispatch(petSelectBgImage(null));
    } else {
      dispatch(removeBgImage(index));
      dispatch(selectBgImage(null));
    }
    dispatch(setBackgroundImage(null));
    setSelectedBg("none");
    onBgChange?.("none");
  };

  // Handle selecting an image as background
  const handleSelectImage = (img) => {
    const url = typeof img === "string" ? img : img.src;
    setSelectedBg(url);
    if (petProfileActive) {
      dispatch(petSelectBgImage(url));
    } else {
      dispatch(selectBgImage(url));
    }
    dispatch(setBackgroundImage(url));
    onBgChange?.("none");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        {/* Font */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl dark:bg-[#2f2f2f] bg-[#F5F5F5]">
          {/* column 1 */}
          <div className="flex flex-col gap-2">
            <span className="text-[#000000] dark:text-white font-medium text-sm">
              Font
            </span>
            <select
              className="dark:bg-[#3a3a3a] bg-[#FAFAFA] border border-[#C0C0C075] dark:border-[#4a4a4a]
      text-black dark:text-white text-sm rounded-xl px-4 py-3 focus:outline-none 
      focus:ring-1 focus:ring-[#555]"
              onChange={(e) => onFontChange?.(e.target.value)}
            >
              <option>Inter</option>
              <option>Poppins</option>
              <option>Roboto</option>
              <option>SF Pro Display</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[#000000] dark:text-white font-medium text-sm">
              Font Size
            </span>
            <select
              className="dark:bg-[#3a3a3a] bg-[#FAFAFA] border border-[#C0C0C075] dark:border-[#4a4a4a]
                  text-black dark:text-white text-sm rounded-xl px-4 py-3 focus:outline-none 
                  focus:ring-1 focus:ring-[#555]"
              onChange={(e) => onFontSizeChange?.(Number(e.target.value))}
            >
              <option value={12}>12</option>
              <option value={14}>14</option>
              <option value={16}>16</option>
              <option value={18}>18</option>
              <option value={20}>20</option>
              <option value={22}>22</option>
              <option value={24}>24</option>
            </select>
          </div>
        </div>

        {/* Background Color */}
        <div className="flex flex-col gap-2 p-4 rounded-2xl dark:bg-[#2f2f2f] bg-[#F5F5F5] mt-2">
          <div className="flex items-center justify-between mb-3 mt-2 ">
            <span className="text-[#000000] dark:text-white font-medium text-sm">
              Background Color
            </span>
            <a
              type="button"
              className="flex items-center gap-1 text-[#000000] dark:text-white text-sm  transition"
              onClick={() => onBgChange?.("#000000")}
            >
              <RotateCcw size={14} />
              Reset colors to default
            </a>
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            <button
              type="button"
              onClick={() => onOpenBgColorPicker?.(currentBgColor || "#ffffff")}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 transition shadow-sm"
              style={{
                backgroundColor: currentBgColor || "#ffffff",
                color: getContrastColor(currentBgColor || "#ffffff"),
              }}
            >
              <Pipette size={14} color="#ffff" />
            </button>
            {colors.map((color, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedBg(color);
                  onBgChange?.(color);
                  // Clear active background image without pushing to the array
                  if (petProfileActive) {
                    dispatch(petSelectBgImage(null));
                  } else {
                    dispatch(selectBgImage(null));
                  }
                  dispatch(setBackgroundImage(null));
                }}
                style={{ backgroundColor: color }}
                className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-105 ${
                  currentBgColor === color
                    ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#2f2f2f] border-transparent"
                    : "border-black/10 dark:border-white/10 hover:scale-110"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div className="flex flex-col gap-2 p-4 rounded-2xl dark:bg-[#2f2f2f] bg-[#F5F5F5] mt-2">
        <span className="text-[#000000] dark:text-white font-medium text-sm block mb-3">
          Background Image
        </span>
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className={`w-[58px] h-[92px] rounded-lg border-2 flex items-center justify-center cursor-pointer text-gray-400 text-sm ${
              selectedBg === "none"
                ? "border-white bg-[#3a3a3a]"
                : "border-[#3a3a3a] bg-[#2f2f2f]"
            }`}
            onClick={() => {
              setSelectedBg("none");
              if (petProfileActive) {
                dispatch(petSelectBgImage(null));
              } else {
                dispatch(selectBgImage(null));
              }
              dispatch(setBackgroundImage(null));
            }}
          >
            <Ban size={16} />
          </div>

          {backgroundImages.map((img, idx) => (
            <div
              key={idx}
              className="relative group w-[58px] h-[92px] cursor-pointer"
              onClick={() => handleSelectImage(img)} // Set selected image as background
            >
              <img
                src={img.src} // Use the URL for preview
                alt={`bg-${idx}`}
                className={`w-full h-full object-cover rounded-lg border-2 ${
                  selectedBg === img.src ? "border-white" : "border-[#3a3a3a]"
                }`}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering parent click
                  handleRemoveImage(idx); // Remove image from the list
                }}
                className="absolute -top-1.5 -right-1.5 bg-black/60 rounded-full p-0.5 opacity-100 transition"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}

          {sessionUpload && (
            <div
              className={`relative group w-[58px] h-[92px] cursor-pointer`}
              onClick={() => handleSelectImage(sessionUpload)}
            >
              <img
                src={sessionUpload}
                alt="session-upload"
                className={`w-full h-full object-cover rounded-lg border-2 ${
                  selectedBg === sessionUpload
                    ? "border-white"
                    : "border-[#3a3a3a]"
                }`}
              />
            </div>
          )}

          {/* External/Saved Background Image */}
          {currentBgImage &&
            currentBgImage !== "none" &&
            !sessionUpload &&
            !backgroundImages.some((img) => img.src === currentBgImage) && (
              <div
                className={`relative group w-[58px] h-[92px] cursor-pointer`}
                onClick={() => handleSelectImage(currentBgImage)}
              >
                <img
                  src={currentBgImage}
                  alt="external-bg"
                  className={`w-full h-full object-cover rounded-lg border-2 ${
                    selectedBg === currentBgImage
                      ? "border-white"
                      : "border-[#3a3a3a]"
                  }`}
                />
              </div>
            )}

          <div
            className="w-[58px] h-[92px] rounded-lg bg-[#3a3a3a] flex items-center justify-center cursor-pointer hover:bg-[#4a4a4a] transition"
            onClick={() => backgroundInputRef.current?.click()}
          >
            <Plus className="text-gray-300" size={16} />
          </div>

          <input
            type="file"
            accept="image/*"
            ref={backgroundInputRef || fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Blur */}
        <div>
          <label className="text-[#000000] dark:text-white font-medium text-sm block mb-2 mt-2">
            Blur Background Image
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={blur}
            onChange={(e) => {
              const newValue = e.target.value;
              setBlur(newValue);
              onBlurChange?.(newValue);
            }}
            className="w-full accent-black border-none"
          />
          <div className="text-gray-400 text-xs mt-1">{blur}</div>
        </div>
      </div>
    </div>
  );
}
