"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GripVertical, Eye, EyeOff, Trash2 } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import {
  addMedia,
  setMediaLayout,
  setMedias,
  updateMediaCustomization,
  deleteMedia,
  toggleMediaVisibility,
  deleteMediaAsync,
} from "@/app/stores/slices/profileSlice";
import AddMedia from "./AddMedia";
import Footer from "@/components/shared/Footer";
import ConfirmModal from "@/components/shared/ConfirmModal";

function SortableMediaItem({ item, handleVisibilityToggle, openDeleteModal }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

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

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(item.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between w-full max-w-[700px] gap-4 p-2 rounded-2xl transition-all border ${
        isDragging
          ? "scale-[1.02] shadow-xl z-50 ring-2 ring-black dark:ring-white"
          : ""
      } ${
        item.isVisible !== false
          ? isDarkMode
            ? "bg-[#3F3F3F] border-transparent"
            : "bg-[#F5F5F5] border-gray-100 shadow-sm"
          : isDarkMode
            ? "bg-[#2A2A2A] border-transparent opacity-60"
            : "bg-gray-100 border-gray-200 opacity-60"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder media"
          className={`cursor-grab active:cursor-grabbing p-1 transition-colors ${
            isDarkMode
              ? "!text-[#D9D9D9] hover:text-white"
              : "text-gray-400 hover:text-gray-700"
          } !bg-transparent`}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="relative group">
          <img
            src={item.url}
            alt="media"
            className={`w-24 h-24 rounded-md object-cover transition-opacity ${
              item.isVisible === false ? "opacity-30" : "opacity-100"
            }`}
          />
          {item.isVisible === false && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <EyeOff className="w-8 h-8 text-gray-500 opacity-50" text- />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleVisibilityToggle(item.id)}
          className={`p-2 transition rounded-xl shadow-sm ${
            isDarkMode
              ? "!bg-[#4D4D4D] hover:bg-white/20"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          title={item.isVisible === false ? "Show media" : "Hide media"}
        >
          {item.isVisible !== false ? (
            <Eye
              className={`w-5 h-5 ${isDarkMode ? "text-white" : "text-gray-700"}`}
            />
          ) : (
            <EyeOff
              className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => openDeleteModal(item.id)}
          className={`p-2 transition rounded-xl shadow-sm ${
            isDarkMode
              ? "!bg-[#4D4D4D] hover:bg-white/20"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          title="Delete media"
        >
          <Trash2
            size={18}
            className={isDarkMode ? "text-white" : "text-gray-700"}
          />
        </button>
      </div>
    </div>
  );
}

export default function MediaSection() {
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const dispatch = useDispatch();

  const profileType = useSelector((state) => state.profile.profileType);
  const mediaLayout = useSelector((state) => state.profile.mediaLayout);
  const medias = useSelector((state) => state.profile.medias) ?? [];
  const selectedMediaLayout =
    mediaLayout === "carousel" ? "carousel" : mediaLayout;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleSaveProduct = (productData) => {
    dispatch(addMedia(productData));
    dispatch(setMediaLayout("carousel"));
    setShowAddProductPopup(false);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const oldIndex = medias.findIndex((m) => String(m.id) === activeId);
    const newIndex = medias.findIndex((m) => String(m.id) === overId);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(medias, oldIndex, newIndex).map((m, idx) => ({
      ...m,
      sequence: idx + 1,
    }));

    dispatch(setMedias(reordered));
  };

  const handleVisibilityToggle = (mediaId) => {
    dispatch(toggleMediaVisibility(mediaId));
  };

  const openDeleteModal = (mediaId) => {
    setMediaToDelete(mediaId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (mediaToDelete) {
      dispatch(deleteMediaAsync({ profileType, mediaId: mediaToDelete }));
    }
    setIsModalOpen(false);
    setMediaToDelete(null);
  };

  const handleUpdateMediaCustomization = () => {
    const apiLayout =
      selectedMediaLayout === "carousel"
        ? "CAROUSAL"
        : selectedMediaLayout === "card"
          ? "CARDS"
          : String(selectedMediaLayout || "").toUpperCase();

    const mediaPayload = medias.map((m, idx) => ({
      id: m.id,
      sequence: m.sequence ?? idx + 1,
      is_visible: m.isVisible !== false,
    }));

    dispatch(
      updateMediaCustomization({
        profileType,
        layout: apiLayout,
        media: mediaPayload,
      }),
    );
  };

  const layoutPreviews = [
    {
      id: "carousel",
      label: "Carousel",
      render: () => (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex items-center gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg ${isDarkMode ? "bg-[#3C3C3C]" : "bg-[#D7D7D7]"}`}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "card",
      label: "Cards",
      render: () => (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col gap-3 w-[120px]">
            <div
              className={`h-7 rounded-lg ${isDarkMode ? "bg-[#3C3C3C]" : "bg-[#D7D7D7]"}`}
            />
            <div
              className={`h-7 rounded-lg ${isDarkMode ? "bg-[#3C3C3C]" : "bg-[#D7D7D7]"}`}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-10 w-full">
      <ConfirmModal
        open={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
        message="Are you sure you want to delete this media item?"
      />

      {/* Top Card */}
      <div className="flex items-center justify-between dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl px-6 py-4 border border-[#C0C0C017] w-full max-w-[700px]">
        {/* Left Content */}
        <div className="flex flex-col">
          <h2
            className={`${isDarkMode ? "!text-white" : "!text-black"} text-[16px] font-bold`}
          >
            Manage Media
          </h2>
          <p
            className={`${isDarkMode ? "!text-white" : "!text-black"} opacity-70 text-[14px]`}
          >
            Add or Edit Media
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => setShowAddProductPopup(true)}
          className={`${isDarkMode ? "!bg-black !text-white" : "!bg-black !text-white"}  text-sm px-6 py-2 rounded-full`}
        >
          + Add Media
        </button>
      </div>

      {/* Media List */}
      {medias.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={medias.map((m) => String(m.id))}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {medias.map((item) => (
                <SortableMediaItem
                  key={item.id}
                  item={item}
                  handleVisibilityToggle={handleVisibilityToggle}
                  openDeleteModal={openDeleteModal}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Layout Customization */}
      {medias.length > 0 && (
        <div className="w-full max-w-[700px]">
          <Accordion type="single" collapsible>
            <AccordionItem value="media-custom">
              <AccordionTrigger>Media Customization</AccordionTrigger>

              <AccordionContent>
                <div
                  className={`rounded-2xl p-4 sm:p-6 border transition-all ${
                    isDarkMode
                      ? "bg-[#303030] border-[#C0C0C017]"
                      : "bg-white border-gray-100 shadow-sm"
                  }`}
                >
                  <div
                    className={`mt-2 p-4 rounded-2xl transition-colors ${
                      isDarkMode
                        ? "bg-[#3A3A3A]"
                        : "bg-gray-50/50 border border-gray-100"
                    }`}
                  >
                    <h2
                      className={`mb-3 font-medium ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Select Media Layout
                    </h2>

                    <div className="flex flex-wrap gap-6 mt-3">
                      {layoutPreviews.map((l) => (
                        <button
                          type="button"
                          key={l.id}
                          onClick={() => dispatch(setMediaLayout(l.id))}
                          className={`flex flex-col items-center gap-3 p-3 rounded-[11px] transition-all !bg-transparent ${
                            selectedMediaLayout === l.id
                              ? "border-2 dark:border-white border-black"
                              : "border border-transparent"
                          }`}
                        >
                          <div className="w-[140px] h-[100px] dark:bg-[#2A2A2A] bg-[#FFFFFF] rounded-lg p-2 py-4 flex flex-col items-center justify-center overflow-hidden">
                            {l.render()}
                          </div>
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isDarkMode ? "text-white" : "text-gray-600"
                            }`}
                          >
                            {l.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Footer onSave={handleUpdateMediaCustomization} />
        </div>
      )}

      {/* Add Media Popup */}
      {showAddProductPopup && (
        <AddMedia
          onClose={() => setShowAddProductPopup(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
