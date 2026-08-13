"use client";
import { X } from "lucide-react";
import { useState } from "react";

export default function AddLinkDetailsModal({ platform, onClose, onSave }) {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const generateId = () => `platform-link-${Date.now()}`;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="w-[640px] rounded-2xl shadow-xl p-8 relative border transition-colors
                   bg-[#F5F5F5] dark:bg-[#262626] border-[#333]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </button>

        <h2 className="text-black dark:text-white text-lg font-semibold mb-8">
          Add {platform?.name} Link
        </h2>

        <div className="space-y-6">
          <div className="relative">
            <label
              className="absolute -top-2 left-5 px-1 text-gray-400 dark:text-gray-300 transition
                              bg-[#F5F5F5] dark:bg-[#262626]"
            >
              {platform?.name} username / URL
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

          <div className="relative">
            <label
              className="absolute -top-2 left-5 px-1 text-gray-400 dark:text-gray-300 transition
                              bg-[#F5F5F5] dark:bg-[#262626]"
            >
              Button Title
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder=""
              className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent
              text-black dark:text-white px-5 py-3 text-sm outline-none
              placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className=" px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({ ...platform, id: Date.now(), platform, url, label })
            }
            className="inside px-6 py-2.5 rounded-full bg-black text-white font-semibold hover:bg-[#111] disabled:opacity-40"
          >
            Add link
          </button>
        </div>
      </div>
    </div>
  );
}
