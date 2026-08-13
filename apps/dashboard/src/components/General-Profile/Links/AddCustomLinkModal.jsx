"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomLinks,
  saveCustomLinks,
  updatedCustomLink,
} from "@/app/stores/slices/profileSlice";

import { Button } from "@/components/ui/button";
import Loader from "@/store/utils/Loader";
import { selectLoading } from "@/app/stores/selectors/profileSelectors";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTheme } from "@/context/Themcontext";

export default function AddCustomLinkModal({ linkData, onClose, onSave, id }) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const profileType = useSelector((state) => state.profile.profileType);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [iconFile, setIconFile] = useState(null);

  const thumbnailInputRef = useRef(null);
  const iconInputRef = useRef(null);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (linkData) {
      setUrl(linkData.url || "");
      setTitle(linkData.title || linkData.name || "");
      setThumbnailPreview(linkData.thumbnail || linkData.icon || null);
      setIconPreview(linkData.icon || null);
    } else {
      setUrl("");
      setTitle("");
      setThumbnailPreview(null);
      setThumbnailFile(null);
      setIconPreview(null);
      setIconFile(null);
    }
  }, [linkData]);

  const handleThumbnailUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleIconUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setIconPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("url", url);
    formData.append("title", title);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    if (iconFile) {
      formData.append("icon", iconFile);
    }

    if (id) {
      dispatch(updatedCustomLink({ profileType, data: formData, id }));
    } else {
      if (!iconFile && !thumbnailFile) {
        // Fallback for empty placeholder if needed by backend
        formData.append("icon", new File([""], "empty.png", { type: "image/png" }));
      }
      dispatch(saveCustomLinks({ profileType, formData })).then(() => {
        dispatch(fetchCustomLinks({ profileType }));
      });
    }

    onSave({
      id: linkData?.id || Date.now(),
      title,
      type: "custom",
      url,
      icon: iconPreview || linkData?.icon || null,
      thumbnail: thumbnailPreview || linkData?.thumbnail || null,
    });

    onClose();
  };

  return (
    <>
      {loading && <Loader />}
      <Dialog open onOpenChange={onClose}>
        <div className="flex items-start justify-center mt-10">
          <DialogContent
            showCloseButton={false}
            className="max-w-[650px]! w-full! rounded-2xl p-6 shadow-xl border-0 transition-colors bg-[#F5F5F5] dark:bg-[#262626] border-[#3A3A3A]"
          >
            <a
              type="button"
              onClick={onClose}
              className={`absolute top-4 right-4 transition p-1 rounded-full ${isDarkMode ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-black hover:bg-gray-100"
                }`}
            >
              <X size={18} />
            </a>

            <h2 className="text-black dark:text-white text-lg font-semibold mb-6">
              {linkData ? "Edit Custom Link" : "Add Custom Link"}
            </h2>

            <div className="flex gap-4">
              <div className="relative w-1/2">
                <label className={`absolute -top-2 left-5 px-1 text-xs font-semibold transition-colors rounded-sm ${isDarkMode ? "bg-[#262626] text-gray-400" : "bg-white text-gray-500"
                  }`}>
                  URL
                </label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className={`w-full rounded-full border px-5 py-3 text-sm outline-none transition-all ${isDarkMode
                    ? "bg-transparent text-white border-[#5A5A5A] focus:border-white"
                    : "bg-white text-black border-gray-200 focus:border-black/20 focus:shadow-sm"
                    }`}
                />
              </div>

              <div className="relative w-1/2">
                <label className={`absolute -top-2 left-5 px-1 text-xs font-semibold transition-colors rounded-sm ${isDarkMode ? "bg-[#262626] text-gray-400" : "bg-white text-gray-500"
                  }`}>
                  Button Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter link title"
                  className={`w-full rounded-full border px-5 py-3 text-sm outline-none transition-all ${isDarkMode
                    ? "bg-transparent text-white border-[#5A5A5A] focus:border-white"
                    : "bg-white text-black border-gray-200 focus:border-black/20 focus:shadow-sm"
                    }`}
                />
              </div>
            </div>

            <p className="text-white dark:text-white text-sm mt-6 -mb-2">
              Preview
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Click on preview to upload thumbnail</p>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => thumbnailInputRef.current.click()}
              className={`border-2 border-dashed rounded-xl h-[180px] flex items-center justify-center overflow-hidden cursor-pointer transition-all ${isDarkMode
                ? "border-gray-600 bg-[#1C1C1C] hover:border-gray-500"
                : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/50"
                }`}
            >
              {!thumbnailPreview ? (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={32} />
                  <p className="text-sm">Drop your image here, or Browse</p>
                  <button className={`mt-2 px-6 py-1.5 rounded-full border text-sm font-medium transition-colors ${isDarkMode ? "border-gray-500 text-gray-300 hover:bg-white/5" : "border-gray-300 text-gray-600 hover:bg-white"
                    }`}>
                    Browse Files
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
              className={`mt-4 w-full rounded-xl border p-4 flex items-center justify-between cursor-pointer transition-all ${isDarkMode
                ? "bg-[#1C1C1C] border-[#5A5A5A] hover:border-white"
                : "bg-gray-50 border-gray-200 hover:border-gray-300"
                }`}>
              <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
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
                    className={isDarkMode ? "text-white" : "text-black"}
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

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={onClose}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md active:scale-95 ${isDarkMode
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-black text-white hover:bg-gray-800"
                  }`}
              >
                Save Changes
              </button>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
