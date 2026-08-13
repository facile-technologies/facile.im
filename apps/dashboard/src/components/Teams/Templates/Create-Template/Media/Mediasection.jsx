"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Instagram } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { addMedia, setMediaLayout } from "@/app/stores/slices/profileSlice";
import AddMedia from "./AddMedia";

export default function MediaSection() {
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const dispatch = useDispatch();

  const mediaLayout = useSelector((state) => state.profile.mediaLayout);
  const medias = useSelector((state) => state.profile.medias);

  const handleSaveProduct = (productData) => {
   

    dispatch(addMedia(productData));
    dispatch(setMediaLayout("carousel"));
    setShowAddProductPopup(false);
  };

  const layoutPreviews = [
    {
      id: "carousel",
      label: "Carousel",
      render: () => (
        <div className="w-14 h-14 bg-gradient-to-br from-accent to-[#6ea0ff] rounded-xl flex items-center justify-center p-1 text-white">
          {medias[0] ? (
            <img src={medias[0].url} alt="" className="w-6 h-6 mb-0.5" />
          ) : (
            <Instagram className="w-5 h-5 text-white/60" />
          )}
        </div>
      ),
    },
    {
      id: "card",
      label: "Card",
      render: () => (
        <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center p-1 text-white">
          {medias[0] ? (
            <img src={medias[0].url} alt="" className="w-6 h-6 rounded" />
          ) : (
            <Instagram className="w-5 h-5 text-white/60" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-10 w-full max-w-[1100px] mx-auto">
      {/* Top Card */}
      <div className="flex flex-col dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl px-6 py-4 border border-[#C0C0C017] w-full max-w-[700px]">
        <h2 className="dark:text-white text-black text-[16px] font-bold">
          Manage Media
        </h2>
        <div className="flex items-center justify-between w-full">
          <p className="dark:text-white text-black opacity-70 text-[15px]">
            Add or Edit Media
          </p>
          <button
            onClick={() => setShowAddProductPopup(true)}
            className=" inside bg-black h-11 text-white text-sm px-4 py-3 rounded-3xl"
          >
            + Add Media
          </button>
        </div>
      </div>

      {/* Media List */}
      {medias.length > 0 && (
        <div className="space-y-4">
          {medias.map((item) => {
        

            return (
              <div
                key={item.id}
                className="flex items-center justify-between w-full max-w-[700px] gap-4 p-4 rounded-2xl bg-[#F5F5F5] dark:bg-[#3F3F3F]"
              >
                <img
                  src={item.url}
                  alt="media image"
                  className="w-25 h-25 rounded-md object-cover"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Layout Customization */}
      {medias.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="media-custom">
            <AccordionTrigger>Media Customization</AccordionTrigger>
            <AccordionContent>
              <div className="dark:bg-[#303030] bg-white rounded-2xl p-4 sm:p-6 border border-[#C0C0C017]">
                <h2 className="text-black dark:text-white mb-2">
                  Select Media Layout
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {layoutPreviews.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => dispatch(setMediaLayout(l.id))}
                      className={`cursor-pointer rounded-[11px] p-1 transition-all border ${
                        mediaLayout === l.id
                          ? "border-2 border-black dark:border-white shadow-lg"
                          : "border-transparent"
                      } flex justify-center items-center`}
                    >
                      {l.render()}
                      <span className="text-[16px] mt-1 text-white text-center truncate">
                        {l.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
