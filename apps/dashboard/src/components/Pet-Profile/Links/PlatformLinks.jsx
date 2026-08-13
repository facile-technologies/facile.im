import { useState } from "react";
import { ChevronUp, Minus, Plus } from "lucide-react";
import LinkThumbnail from "./LinkThumbnail";
import AddPlatformLinkModal from "./AddPlatformLinkModal";
import { useLinksManager } from "@/hooks/useLinksManager";
import PlatformLinksAccordion from "../../shared/PlatformLinksAccordion";
import AddCustomLinkModal from "./AddCustomLinkModal";
import CustomLinkAccordion from "../../shared/customlinkAccordion";

export default function PlatformLinks() {
  const [openModal, setOpenModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const { platformLinks, addPlatformLink, deletePlatformLink } =
    useLinksManager();
  const { customLinks, addCustomLink, deleteCustomLink } = useLinksManager();

  // Generate unique ID for each platform and custom link
  const generateId = () => `link-${Date.now()}`;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="relative flex justify-between items-center">
          <h3 className="text-lg font-semibold dark:text-white text-black">
            Add Platform or Custom Links
          </h3>

          <div className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="inside w-[150px] rounded-3xl p-3 flex items-center justify-center gap-2 px-4 py-2 text-white bg-[#262626] hover:bg-[#2B2B2B]"
            >
              {openDropdown ? <ChevronUp size={16} /> : <Plus size={16} />} Add
              Link
            </button>
            <div
              className={`absolute right-0 mt-2 w-[180px] bg-[#262626] rounded-lg shadow-xl z-50 border border-[#333] 
            transition-all duration-200 ease-out 
            ${
              openDropdown
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            } origin-top-right`}
            >
              <a
                type="button"
                onClick={() => {
                  setOpenModal("Add Links");
                  setOpenDropdown(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#2B2B2B] flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} /> Add Platform Link
              </a>
              <div className="border-t border-[#333]"></div>
              <a
                onClick={() => {
                  setOpenModal("custom");
                  setOpenDropdown(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#2B2B2B] flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} /> Add Custom Link
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

        {openModal === "Add Links" && (
          <AddPlatformLinkModal
            onClose={() => setOpenModal(null)}
            onSave={(link) => {
              const linkWithId = { ...link, id: generateId() };
              addPlatformLink(linkWithId);
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
      </div>
    </>
  );
}
