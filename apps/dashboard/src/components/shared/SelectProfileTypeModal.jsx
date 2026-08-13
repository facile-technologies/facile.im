import React, { useState, useEffect } from "react";
import { X, User, Briefcase, Store, ShieldAlert, PawPrint } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/Themcontext";

const networkProfileTypes = [
  {
    key: "personal",
    icon: User,
    label: "Personal",
    description:
      "For individuals who want to share links, content, or personal information.",
  },
  {
    key: "business",
    icon: Briefcase,
    label: "Business",
    description: "For brands and professionals who want to promote services.",
  },
  {
    key: "storefront",
    icon: Store,
    label: "Storefront",
    description: "For showcasing your stores and restaurants.",
  },
];

const rescueProfileTypes = [
  {
    key: "sos",
    icon: ShieldAlert,
    label: "SOS Profile",
    description:
      "Emergency profile with medical info and emergency contacts for critical situations.",
    profileLayout: 0,
  },
  {
    key: "pet",
    icon: PawPrint,
    label: "Pet Profile",
    description:
      "Profile for your pet with identification, medical info, and owner contact details.",
    profileLayout: 1,
  },
];

import { useDispatch, useSelector } from "react-redux";
import { setProfileType } from "../../app/stores/slices/profileSlice";

export default function SelectProfileTypeModal({ isOpen, onClose, excludeTypes = [] }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileMode = useSelector((state) => state.user.profileMode);
  const isRescue = profileMode === "rescue";

  const allProfileTypes = isRescue ? rescueProfileTypes : networkProfileTypes;
  const excludedKeys = excludeTypes.map((e) => e.toLowerCase());
  const profileTypes = allProfileTypes;
  const availableTypes = allProfileTypes.filter((t) => !excludedKeys.includes(t.key.toLowerCase()));
  const [selected, setSelected] = useState(availableTypes[0]?.key ?? "");

  useEffect(() => {
    if (!availableTypes.find((t) => t.key === selected)) {
      setSelected(availableTypes[0]?.key ?? "");
    }
  }, [excludeTypes.join(",")]);

  const isDarkMode = theme === "dark";

  if (!isOpen) return null;

  const handleNext = () => {
    if (isRescue) {
      const chosen = rescueProfileTypes.find((t) => t.key === selected);
      localStorage.setItem("profileLayout", String(chosen.profileLayout));
      localStorage.setItem("profileType", chosen.key);
      dispatch(setProfileType(chosen.key));
      navigate("/profile-layout", { state: { profileLayout: chosen.profileLayout, isNew: true } });
    } else {
      localStorage.setItem("profileType", selected);
      dispatch(setProfileType(selected));
      localStorage.setItem("profileMode", "create");
      navigate("/profile-layout", { state: { isNew: true } });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[580px] rounded-[20px] shadow-2xl relative overflow-hidden bg-white dark:bg-[#2C2C2C]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-black dark:text-[#9CA3AF] dark:hover:text-[#FFFFFF] transition bg-transparent"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-5">
          <h2 className="text-[21px] font-bold tracking-tight leading-tight text-black dark:text-[#FFFFFF]">
            Select Profile Type
          </h2>
          <p className="text-sm mt-1 font-medium text-gray-500 dark:text-[#9CA3AF]">
            Select the type of profile you want to create.
          </p>
        </div>

        {/* Options */}
        <div className="px-6 pb-6 flex flex-col gap-3">
          {profileTypes.map(({ key, icon: Icon, label, description }) => {
            const isDisabled = excludedKeys.includes(key.toLowerCase());
            const isSelected = selected === key && !isDisabled;
            return (
              <div key={key} className="relative group">
                <button
                  onClick={() => { if (!isDisabled) setSelected(key); }}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-[14px] border text-left transition-all duration-200 ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed " + (isDarkMode ? "bg-[#303030] border-white/10" : "bg-white border-gray-200")
                      : isSelected
                        ? isDarkMode
                          ? "bg-[#303030] border-white/60"
                          : "bg-gray-50 border-black"
                        : isDarkMode
                          ? "bg-[#303030] border-white/10 hover:border-white/10"
                          : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                  style={isDarkMode ? { backgroundColor: "#303030" } : {}}
                >
                  {/* Icon badge */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-black dark:bg-[#000000]"
                        : "bg-gray-100 dark:bg-white/5"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        isSelected
                          ? "text-white dark:text-[#FFFFFF]"
                          : "text-gray-500 dark:text-[#6B7280]"
                      }
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <p
                      className={`font-bold text-sm leading-tight mb-0.5 ${
                        isSelected
                          ? "text-black dark:text-[#FFFFFF]"
                          : "text-gray-500 dark:text-white/50"
                      }`}
                    >
                      {label}
                    </p>
                    <p
                      className={`text-[12px] leading-relaxed font-medium ${
                        isSelected
                          ? "text-gray-600 dark:text-[#D1D5DB]"
                          : "text-gray-400 dark:text-[#D1D5DB]/50"
                      }`}
                    >
                      {description}
                    </p>
                  </div>
                </button>

                {/* Tooltip for disabled */}
                {isDisabled && (
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-gray-800 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    This profile is already created
                    <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 border-4 border-transparent border-l-gray-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <button
            onClick={onClose}
            className="w-28 h-11 flex items-center justify-center rounded-full font-semibold text-sm transition-all active:scale-[0.97] hover:opacity-90 bg-gray-100 text-black dark:bg-[#FFFFFF] dark:text-[#000000]"
          >
            Cancel
          </button>

          <button
            onClick={handleNext}
            disabled={!selected}
            className="w-28 h-[55px] flex items-center justify-center rounded-full font-semibold text-sm transition-all active:scale-[0.97] hover:opacity-90 bg-black text-white dark:bg-[#000000] dark:text-[#FFFFFF] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
