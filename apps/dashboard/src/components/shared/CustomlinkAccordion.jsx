"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Eye, EyeOff, Pencil, Trash2, GripVertical } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import {
  deleteCustomLink,
  fetchCustomLinks,
  setCustomLinks,
  updateCustomLinkSequence,
} from "@/app/stores/slices/profileSlice";
import AddCustomLinkModal from "../General-Profile/Links/AddCustomLinkModal";
import Footer from "./Footer";
import Loader from "@/store/utils/Loader";
import { showToast } from "@/store/utils/toast";
import { updateCustomLinksequence } from "@/services/user";

import { useTheme } from "@/context/Themcontext";

function SortableLinkItem({
  link,
  handleVisibilityToggle,
  setEditingLink,
  setIsAddModalOpen,
  openDeleteModal,
}) {
  const profileLogo = useSelector((state) => state.profile.profile?.logo);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex justify-between items-center rounded-xl p-4 transition-all border ${isDragging ? "opacity-50 scale-[1.02] shadow-xl z-50" : ""} ${link.isVisible
        ? (isDarkMode
          ? "bg-[#3A3A3A]  border-transparent hover:bg-[#333333]"
          : "bg-white border-gray-100 hover:border-gray-200 shadow-sm")
        : (isDarkMode
          ? "bg-[#222222] border-transparent opacity-60"
          : "bg-gray-50 border-gray-100 opacity-60")
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Dragger Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <GripVertical size={20} />
        </div>

        <img
          src={link.thumbnail || link.icon || profileLogo}
          alt={link.title || link.name}
          className="w-10 h-10 object-contain rounded-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = isDarkMode ? "/facile.svg" : "/Facile-black.svg";
          }}
        />
        <div>
          <p className="text-black dark:text-white text-sm font-semibold">
            {link.title || link.name || "Untitled Link"}
          </p>
          <p className="text-gray-700 dark:text-gray-400 text-xs truncate max-w-[200px]">
            {link.url}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleVisibilityToggle(link.id)}
          className={`p-2 transition rounded-xl shadow-sm ${isDarkMode ? "!bg-[#4D4D4D] hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          {link.isVisible ? (
            <Eye size={18} className={isDarkMode ? "text-white" : "text-gray-700"} />
          ) : (
            <EyeOff size={18} className={isDarkMode ? "text-white" : "text-gray-700"} />
          )}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setEditingLink(link);
            setIsAddModalOpen(true);
          }}
          className={`p-2 transition rounded-xl shadow-sm cursor-pointer ${isDarkMode ? "!bg-[#4D4D4D] hover:bg-white/20" : "bg-gray-100 hover:border-gray-200"
            }`}
        >
          <Pencil size={18} className={isDarkMode ? "text-white" : "text-gray-700"} />
        </button>
        <button
          type="button"
          onClick={() => openDeleteModal(link.id)}
          className={`p-2 transition rounded-xl shadow-sm cursor-pointer ${isDarkMode ? "!bg-[#4D4D4D] hover:bg-white/20" : "bg-gray-100 hover:border-gray-200"
            }`}
        >
          <Trash2 size={18} className={isDarkMode ? "text-white" : "text-gray-700"} />
        </button>
      </div>
    </div>
  );
}

/* 🔹 wrapper ONLY – no style change */
export default function CustomLinkAccordion({ customLinks, onDelete }) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const profileType = useSelector((state) => state.profile.profileType);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [editingLink, setEditingLink] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [links, setLinks] = useState(customLinks);
  const [isloading, setIsloading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );



  useEffect(() => {
    setLinks(
      customLinks?.map((link) => ({
        ...link,
        isVisible: link.isVisible ?? true,
      })) || [],
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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = links.findIndex((i) => i.id === active.id);
      const newIndex = links.findIndex((i) => i.id === over.id);
      const updatedLinks = arrayMove(links, oldIndex, newIndex);

      setLinks(updatedLinks);
      dispatch(setCustomLinks(updatedLinks));
      dispatch(updateCustomLinkSequence({ profileType, links: updatedLinks }));
    }
  };
  const handleVisibilityToggle = (linkId) => {
    const updatedLinks = links.map((l) =>
      l.id === linkId ? { ...l, isVisible: !l.isVisible } : l,
    );
    setLinks(updatedLinks);
    dispatch(setCustomLinks(updatedLinks));
  };

  const handleSave = async () => {
    try {
      setIsloading(true);
      await dispatch(updateCustomLinkSequence({ profileType, links })).unwrap();
      setIsloading(false);
      showToast("success", "Sequence updated successfully!");
    } catch (error) {
      setIsloading(false);
      console.error(
        "Failed to update platform links visibility/sequence",
        error,
      );
      showToast("error", "Failed to update sequence.");
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
              l.id === updatedLink.id ? updatedLink : l,
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
          <div className="border border-[#C0C0C017] rounded-xl overflow-hidden !bg-[#303030]">
            <AccordionTrigger className="text-black dark:text-white text-[14px] font-medium">
              Custom Links
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={links.map((link) => link.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-3 mt-3">
                    {links.map((link) => (
                      <SortableLinkItem
                        key={link.id}
                        link={link}
                        handleVisibilityToggle={handleVisibilityToggle}
                        setEditingLink={setEditingLink}
                        setIsAddModalOpen={setIsAddModalOpen}
                        openDeleteModal={openDeleteModal}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion >
      <Footer buttonText="Custom Update" onSave={handleSave} />
    </>
  );
}
