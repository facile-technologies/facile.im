"use client";

import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";

export default function AddCustomLinkModal({ onClose, onSave }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const thumbnailInputRef = useRef(null);
  const iconInputRef = useRef(null);

  const handleThumbnailUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleIconUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setIconPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({
      id: Date.now(),
      name: title,
      title: title,
      type: "custom",
      url,
      icon: iconPreview,
      thumbnail: thumbnailPreview,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200]">
      <div
        className="w-[650px] relative rounded-2xl p-6 shadow-xl border transition-colors
                    bg-[#F5F5F5] dark:bg-[#262626] border-[#3A3A3A]"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <h2 className="text-black dark:text-white text-lg font-semibold mb-6">
          Add Custom Link
        </h2>

        {/* Inputs in one row */}
        <div className="flex gap-4">
          {/* URL Field */}
          <div className="relative w-1/2">
            <label className="absolute -top-2 left-5 bg-[#F5F5F5] dark:bg-[#262626] text-gray-400 text-sm px-1 transition">
              URL
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder=""
              className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent 
                         text-black dark:text-white px-5 py-3 text-sm outline-none 
                         placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
            />
          </div>

          {/* Title Field */}
          <div className="relative w-1/2">
            <label className="absolute -top-2 left-5 bg-[#F5F5F5] dark:bg-[#262626] text-gray-400 text-sm px-1 transition">
              Button Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=""
              className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent 
                         text-black dark:text-white px-5 py-3 text-sm outline-none 
                         placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
            />
          </div>
        </div>

        {/* Preview Area */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-6 mb-2">
          Preview
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Click on preview to upload thumbnail</p>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => thumbnailInputRef.current.click()}
          className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl h-[180px] 
                     flex items-center justify-center overflow-hidden cursor-pointer 
                     bg-[#fff] dark:bg-[#1C1C1C] transition-colors"
        >
          {!thumbnailPreview ? (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Upload size={32} />
              <p>Drop your image here, or Browse</p>
              <button className="px-4 py-1 rounded-lg border border-gray-500 text-sm">
                Browse
              </button>
            </div>
          ) : (
            <img
              src={thumbnailPreview}
              alt="preview"
              className="w-full h-full object-contain p-4"
            />
          )}
        </div>

        <div
          onClick={() => iconInputRef.current.click()}
          className="mt-4 w-full rounded-xl border border-[#5A5A5A] dark:border-[#555] bg-transparent 
                       p-4 flex items-center justify-between cursor-pointer transition-all hover:border-white"
        >
          <span className="text-sm text-gray-400">
            Upload link icon
          </span>
          <div className="flex items-center gap-2">
            {iconPreview ? (
              <img src={iconPreview} alt="icon preview" className="w-6 h-6 object-contain rounded-md" />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={thumbnailInputRef}
          onChange={handleThumbnailUpload}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          ref={iconInputRef}
          onChange={handleIconUpload}
          className="hidden"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-black text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
