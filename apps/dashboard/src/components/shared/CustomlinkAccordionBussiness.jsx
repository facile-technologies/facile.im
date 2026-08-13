"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import {
  deleteCustomLink,
  fetchCustomLinks,
  setCustomLinks,
  updateCustomLinkSequence,
} from "@/app/stores/slices/businessProfileSlice";
import Footer from "./Footer";
import Loader from "@/store/utils/Loader";
import { showToast } from "@/store/utils/toast";
import { updateCustomLinksequence } from "@/services/businessuser";
import AddCustomLinkModal from "../Bussiness-Profile/Links/AddCustomLinkModal";

export default function CustomLinkAccordionBussiness({
  customLinks,
  onDelete,
}) {
  const profileType = useSelector((state) => state.profile.profileType);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const profileLogo = useSelector((state) => state.profile.profile?.logo);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [links, setLinks] = useState(customLinks);
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    setLinks(
      customLinks?.map((link) => ({
        ...link,
        isVisible: link.isVisible ?? true,
      })) || []
    );
  }, [customLinks]);
  const openDeleteModal = (id) => {
    setLinkToDelete(id);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (linkToDelete) {
      dispatch(deleteCustomLink({ profileType, linkToDelete }));
      setIsModalOpen(false);
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const updatedLinks = [...links];
    const draggedItem = updatedLinks.splice(draggedIndex, 1)[0];
    updatedLinks.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setLinks(updatedLinks);
  };

  const handleDragEnd = () => {
    dispatch(setCustomLinks(links));
    dispatch(updateCustomLinksequence(links));
    setDraggedIndex(null);
  };
  const handleVisibilityToggle = (linkId) => {
    const updatedLinks = links.map((l) =>
      l.id === linkId ? { ...l, isVisible: !l.isVisible } : l
    );
    setLinks(updatedLinks);
    dispatch(setCustomLinks(updatedLinks));
  };

  const handleSave = async () => {
    const payload = {
      links: links.map((link) => ({
        id: link.id,
        is_visible: link.isVisible,
      })),
    };

    try {
      setIsloading(true);
      await updateCustomLinkSequence({ profileType, payload });
      setIsloading(false);
      showToast("success", "Sequence updated successfully!");
      dispatch(setCustomLinks(links));
    } catch (error) {
      console.error(
        "Failed to update platform links visibility/sequence",
        error
      );
    }
  };

  return (
    <>
      {isAddModalOpen && (
        <AddCustomLinkModal
          linkData={editingLink}
          id={editingLink.id}
          onClose={() => {
            setEditingLink(null);
            setIsAddModalOpen(false);
          }}
          onSave={(updatedLink) => {
            const updatedLinks = links.map((l) =>
              l.id === updatedLink.id ? updatedLink : l
            );
            setLinks(updatedLinks);
            dispatch(setCustomLinks(updatedLinks));
            setIsAddModalOpen(false);
            setEditingLink(null);
          }}
        />
      )}

      <ConfirmModal
        open={isModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
      {isloading && (
        <div>
          <Loader />{" "}
        </div>
      )}
      <Accordion type="multiple" collapsible>
        <AccordionItem value="customLinks" className="border-none">
          <AccordionTrigger className="text-black dark:text-white text-[14px] font-medium">
            Custom Links
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col gap-4 mt-3">
              {links.map((link, index) => (
                <div
                  key={link.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDragOver(index);
                  }}
                  onDragEnd={handleDragEnd}
                  className={`flex justify-between items-center rounded-lg p-3 transition-all ${link.isVisible
                    ? "bg-[#F5F5F5] dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#333333]"
                    : "bg-gray-100 dark:bg-[#222222] opacity-60 hover:opacity-80"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={link.thumbnail || link.icon || profileLogo}
                      alt={link.name}
                      className="w-7 h-7 rounded-md object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = isDarkMode ? "/facile.svg" : "/Facile-black.svg";
                      }}
                    />
                    <div>
                      <p className="text-black dark:text-white text-sm font-semibold">
                        {link.name}
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 text-xs truncate max-w-[200px]">
                        {link.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLink(link);
                        setIsAddModalOpen(true);
                      }}
                      className="p-2 bg-[#ffffff]/10 hover:bg-[#4A4A4A] transition rounded-2xl"
                    >
                      <Pencil size={18} className="text-white" />
                    </a>
                    <a
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
      <Footer buttonText={"Custom Update"} onSave={handleSave} />
    </>
  );
}
