import { useEffect, useState } from "react";
import { ChevronUp, Minus, Plus } from "lucide-react";
import LinkThumbnail from "./LinkThumbnail";
import AddPlatformLinkModal from "./AddPlatformLinkModal";
import { useLinksManager } from "@/hooks/useLinksManager";
import PlatformLinksAccordion from "../../shared/PlatformLinksAccordion";
import AddCustomLinkModal from "./AddCustomLinkModal";
import CustomLinkAccordion from "../../shared/CustomlinkAccordion";
import Footer from "@/components/shared/Footer";
import { fetchPlatformLinks } from "@/app/stores/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/context/Themcontext";
import AddLinkDetailsModal from "./AddLinkDetailsModal";

export default function PlatformLinks() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const profileType = useSelector((state) => state.profile.profileType);
  const [openModal, setOpenModal] = useState(false);
  const [openPlatformModal, setOpenPlatformModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { platformLinks, addPlatformLink, deletePlatformLink } =
    useLinksManager();
  const dispatch = useDispatch();
  const { customLinks, addCustomLink, deleteCustomLink } = useLinksManager();
  const generateId = () => `link-${Date.now()}`;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="relative flex justify-between items-center border-1 border-[#C0C0C017] p-4 rounded-xl">
          <h3 className="text-lg font-semibold dark:text-white text-black">
            Add Platform or Custom Links
          </h3>

          <div className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className={`inside w-[150px] rounded-3xl p-3 flex items-center justify-center gap-2 px-4 py-2 transition-all ${isDarkMode
                ? "text-white bg-[#262626] hover:bg-[#2B2B2B]"
                : "text-white bg-black hover:bg-gray-800 shadow-md transform active:scale-95"
                }`}
            >
              {openDropdown ? <ChevronUp size={16} /> : <Plus size={16} />} Add
              Link
            </button>
            <div
              className={`absolute right-0 mt-2 w-[190px] rounded-xl shadow-xl z-50 border transition-all duration-200 ease-out origin-top-right overflow-hidden ${isDarkMode
                ? "bg-[#262626] border-[#333]"
                : "bg-white border-gray-100"
                } ${openDropdown
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
            >
              <a
                type="button"
                onClick={() => {
                  setOpenPlatformModal("Add Links");
                  setOpenDropdown(false);
                }}
                className={`w-full text-left px-4 py-3.5 text-sm flex items-center gap-3 cursor-pointer transition-colors ${isDarkMode ? "text-white hover:bg-[#2B2B2B]" : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <div className={`p-1 rounded-md ${isDarkMode ? "bg-white/5 text-white" : "bg-gray-100 text-black"}`}>
                  <Plus size={14} />
                </div>
                Add Platform Link
              </a>
              <div className={`border-t ${isDarkMode ? "border-[#333]" : "border-gray-50"}`}></div>
              <a
                onClick={() => {
                  setOpenModal("custom");
                  setOpenDropdown(false);
                }}
                className={`w-full text-left px-4 py-3.5 text-sm flex items-center gap-3 cursor-pointer transition-colors ${isDarkMode ? "text-white hover:bg-[#2B2B2B]" : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <div className={`p-1 rounded-md ${isDarkMode ? "bg-white/5 text-white" : "bg-gray-100 text-black"}`}>
                  <Plus size={14} />
                </div>
                Add Custom Link
              </a>
            </div>
          </div>
        </div>
        {platformLinks.length > 0 && (
          <div className="mt-6">
            <PlatformLinksAccordion
              platformLinks={platformLinks}
              onDelete={deletePlatformLink}
            />
          </div>
        )}

        {customLinks?.length > 0 && (
          <div className="mt-1">
            <CustomLinkAccordion
              customLinks={customLinks}
              onDelete={deleteCustomLink}
            />
          </div>
        )}

        {openPlatformModal === "Add Links" && (
          <AddPlatformLinkModal
            onClose={() => setOpenPlatformModal(false)}
            onSave={(link) => {
              const linkWithId = { ...link, id: generateId() };
              addPlatformLink(linkWithId);
              setOpenPlatformModal(false);
            }}
            onSelectPlatform={(platform) => {
              setSelectedPlatform(platform);
              setShowDetailsModal(true);
              setOpenPlatformModal(false);
            }}
          />
        )}
        {openModal === "custom" && (
          <AddCustomLinkModal
            onClose={() => setOpenModal(null)}
            onSave={(link) => {
              const linkWithId = { ...link, id: generateId() };
              addCustomLink(linkWithId);
            }}
          />
        )}

        {showDetailsModal && (
          <AddLinkDetailsModal
            platform={selectedPlatform}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedPlatform(null);
            }}
            onSave={(linkData) => {
              const linkWithId = { ...linkData, id: generateId() };
              addPlatformLink(linkWithId);
              setShowDetailsModal(false);
            }}
          />
        )}
      </div>
    </>
  );
}
