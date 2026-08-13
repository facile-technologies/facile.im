"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPlatformLinks,
  deletePlatformLink,
} from "@/app/stores/slices/businessProfileSlice";
import AddLinkDetailsModal from "../General-Profile/Links/AddLinkDetailsModal";
import Footer from "./Footer";
import { updatePlatformLinksequence } from "@/services/user";
import Loader from "@/store/utils/Loader";
import { showToast } from "@/store/utils/toast";

export default function PlatformLinksAccordionBusiness({ platformLinks }) {
  const profileType = useSelector((state) => state.profile.profileType);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [links, setLinks] = useState([]);
  const [editPlatformLink, setEditPlatformLink] = useState(null);
  const [isloading, setIsloading] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const dispatch = useDispatch();

  // Sync with prop changes (e.g. when data is loaded/refreshed)
  useEffect(() => {
    setLinks(
      platformLinks?.map((link) => ({
        ...link,
        isVisible: link.isVisible ?? true,
      })) || []
    );
  }, [platformLinks]);

  const openDeleteModal = (linkId) => {
    setLinkToDelete(linkId);
    setIsModalOpen(true);
  };

  const handleEditClick = (link) => {
    setEditPlatformLink(link);
    setIsEditModalOpen(true);
  };

  const handleDragStart = (id) => {
    setDraggedItemId(id);
  };

  const handleDragOver = (targetId) => {
    if (draggedItemId === null || draggedItemId === targetId) return;

    const updatedLinks = [...links];
    const draggedIndex = updatedLinks.findIndex((l) => l.id === draggedItemId);
    const targetIndex = updatedLinks.findIndex((l) => l.id === targetId);

    const [draggedItem] = updatedLinks.splice(draggedIndex, 1);
    updatedLinks.splice(targetIndex, 0, draggedItem);

    setDraggedItemId(targetId);
    setLinks(updatedLinks);
    dispatch(setPlatformLinks(updatedLinks));
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
  };
  const handleVisibilityToggle = (linkId) => {
    const updatedLinks = links.map((l) =>
      l.id === linkId ? { ...l, isVisible: !l.isVisible } : l
    );
    setLinks(updatedLinks);
    dispatch(setPlatformLinks(updatedLinks));
  };

  const handleSave = async () => {
    const payload = {
      links: links.map((link) => ({
        id: link.id,
        is_visible: link.isVisible, // send correct field to backend
      })),
    };

    try {
      setIsloading(true);
      await updatePlatformLinksequence(payload);
      setIsloading(false);
      showToast("success", "Sequence updated successfully!");
      dispatch(setPlatformLinks(links));
    } catch (error) {
      console.error(
        "Failed to update platform links visibility/sequence",
        error
      );
    }
  };

  return (
    <>
      <ConfirmModal
        open={isModalOpen}
        onConfirm={() => {
          if (linkToDelete) {
            dispatch(deletePlatformLink({ profileType, linkToDelete }));
          }
          setIsModalOpen(false);
          setLinkToDelete(null);
        }}
        onCancel={() => setIsModalOpen(false)}
      />

      {isEditModalOpen && (
        <AddLinkDetailsModal
          onClose={() => setIsEditModalOpen(false)}
          onSave={() => setIsEditModalOpen(false)}
          platform={editPlatformLink}
        />
      )}
      {isloading && (
        <div>
          <Loader />{" "}
        </div>
      )}
      <Accordion type="multiple" collapsible defaultValue={["platformLinks"]}>
        <AccordionItem value="platformLinks" className="border-none">
          <AccordionTrigger className="text-black dark:text-white text-[14px] font-medium">
            Platform Links
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3 mt-3">
              {links.map((link, index) => (
                <div
                  key={link.id}
                  draggable
                  onDragStart={() => handleDragStart(link.id)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDragOver(link.id);
                  }}
                  onDragEnd={handleDragEnd}
                  className={`flex justify-between items-center rounded-lg p-3 transition-all ${
                    link.isVisible
                      ? "bg-[#F5F5F5] dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#333333]"
                      : "bg-gray-100 dark:bg-[#222222] opacity-60 hover:opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={link.icon}
                      alt={link.title || link.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div>
                      <p className="text-black dark:text-white text-sm font-semibold">
                        {link.title || "Untitled Link"}
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 text-xs truncate max-w-[200px]">
                        {link.url}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <a
                      type="button"
                      onClick={() => handleVisibilityToggle(link.id)}
                      className="p-2 bg-[#ffffff]/10 hover:bg-[#4A4A4A] transition rounded-2xl"
                    >
                      {link.isVisible ? (
                        <Eye size={18} className="text-white" />
                      ) : (
                        <EyeOff size={18} className="text-white" />
                      )}
                    </a>

                    <a
                      type="button"
                      onClick={() => handleEditClick(link)}
                      className="p-2 bg-[#ffffff]/10 hover:bg-[#4A4A4A] transition rounded-2xl"
                    >
                      <Pencil size={18} className="text-white" />
                    </a>

                    <a
                      type="button"
                      onClick={() => openDeleteModal(link.id)}
                      className="p-2 bg-[#ffffff]/10 hover:bg-[#4A4A4A] transition rounded-2xl"
                    >
                      <Trash2 size={18} className="text-white" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Footer buttonText={"Platform Update"} onSave={handleSave} />
    </>
  );
}
