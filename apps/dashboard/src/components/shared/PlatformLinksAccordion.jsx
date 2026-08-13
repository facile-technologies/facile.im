"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Eye, EyeOff, Pencil, Trash2, GripVertical } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPlatformLinks,
  deletePlatformLink,
  updatePlatformLinkSequence,
} from "@/app/stores/slices/profileSlice";
import AddLinkDetailsModal from "../General-Profile/Links/AddLinkDetailsModal";
import Footer from "./Footer";
import Loader from "@/store/utils/Loader";
import { showToast } from "@/store/utils/toast";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme } from "@/context/Themcontext";

function SortableLinkItem({
  link,
  handleVisibilityToggle,
  handleEditClick,
  openDeleteModal,
}) {
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
          ? "bg-[#3A3A3A] border-transparent hover:bg-[#333333]"
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
          onClick={() => handleEditClick(link)}
          className={`p-2 transition rounded-xl shadow-sm ${isDarkMode ? "!bg-[#4D4D4D] hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          <Pencil size={18} className={isDarkMode ? "text-white" : "text-gray-700"} />
        </button>

        <button
          type="button"
          onClick={() => openDeleteModal(link.id)}
          className={`p-2 transition rounded-xl shadow-sm ${isDarkMode ? "!bg-[#4D4D4D] hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          <Trash2 size={18} className={isDarkMode ? "text-white" : "text-gray-700"} />
        </button>
      </div>
    </div>
  );
}

export default function PlatformLinksAccordion({ platformLinks }) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const profileType = useSelector((state) => state.profile.profileType);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [links, setLinks] = useState([]);
  const [editPlatformLink, setEditPlatformLink] = useState(null);
  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch();


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const updatedLinks = arrayMove(items, oldIndex, newIndex);

        // Update Redux immediately for UI sync
        dispatch(setPlatformLinks(updatedLinks));
        return updatedLinks;
      });
    }
  };

  const handleVisibilityToggle = (linkId) => {
    const updatedLinks = links.map((l) =>
      l.id === linkId ? { ...l, isVisible: !l.isVisible } : l
    );
    setLinks(updatedLinks);
    dispatch(setPlatformLinks(updatedLinks));
  };

  const handleSave = async () => {
    try {
      setIsloading(true);
      // Persist sequence and visibility to server
      await dispatch(updatePlatformLinkSequence({ profileType, links })).unwrap();
      setIsloading(false);
      showToast("success", "Links updated successfully!");
    } catch (error) {
      setIsloading(false);
      console.error("Failed to update platform links", error);
      showToast("error", "Failed to update links.");
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
      {isloading && <Loader />}

      <Accordion type="multiple" collapsible defaultValue={["platformLinks"]}>
        <AccordionItem value="platformLinks" className="border-none">
          <div className="border border-[#C0C0C017] rounded-xl overflow-hidden !bg-[#303030]">

            <AccordionTrigger className="px-4 py-3 text-[14px] font-medium text-white">
              Platform Links
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
                        handleEditClick={handleEditClick}
                        openDeleteModal={openDeleteModal}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </AccordionContent>

          </div>
        </AccordionItem>
      </Accordion>

      <Footer buttonText="Platform Update" onSave={handleSave} />
    </>
  );
}
