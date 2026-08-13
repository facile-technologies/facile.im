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

export default function AddCustomLinkModal({ linkData, onClose, onSave, id }) {
  const profileType = useSelector((state) => state.profile.profileType);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const fileInputRef = useRef(null);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (linkData) {
      setUrl(linkData.url || "");
      setTitle(linkData.title || linkData.name || "");
      setPreviewImg(linkData.icon || null);
    } else {
      setUrl("");
      setTitle("");
      setPreviewImg(null);
      setIconFile(null);
    }
  }, [linkData]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImg(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setIconFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImg(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("url", url);
    formData.append("title", title);
    if (iconFile) {
      formData.append("icon", iconFile);
    }

    if (id) {
      dispatch(updatedCustomLink({ profileType, data: formData, id }));
    } else {
      if (!iconFile) {
        formData.append(
          "icon",
          new File([""], "empty.png", { type: "image/png" }),
        );
      }
      dispatch(saveCustomLinks({ profileType, formData }));
      dispatch(fetchCustomLinks({ profileType }));
    }
    onSave({
      id: linkData?.id || Date.now(),
      title,
      type: "custom",
      url,
      icon: previewImg || linkData?.icon || null,
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
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-white transition"
            >
              <X size={18} />
            </a>

            <h2 className="text-black dark:text-white text-lg font-semibold mb-6">
              {linkData ? "Edit Custom Link" : "Add Custom Link"}
            </h2>

            <div className="flex gap-4">
              <div className="relative w-1/2">
                <label className="absolute -top-2 left-5 bg-[#F5F5F5] dark:bg-[#262626] text-gray-400 text-sm px-1 transition">
                  URL
                </label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
                />
              </div>

              <div className="relative w-1/2">
                <label className="absolute -top-2 left-5 bg-[#F5F5F5] dark:bg-[#262626] text-gray-400 text-sm px-1 transition">
                  Button Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
                />
              </div>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm mt-6 mb-2">
              Preview
            </p>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl h-[180px] flex items-center justify-center overflow-hidden cursor-pointer bg-[#fff] dark:bg-[#1C1C1C] transition-colors"
            >
              {!previewImg ? (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={32} />
                  <p>Drop your image here, or Browse</p>
                  <button className="px-4 py-1 rounded-lg border border-gray-500 text-sm">
                    Browse
                  </button>
                </div>
              ) : (
                <img
                  src={previewImg}
                  alt="preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="inside px-5 py-2 rounded-full bg-black text-white"
              >
                Save
              </button>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
