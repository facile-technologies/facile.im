"use client";

import { selectLoading } from "@/app/stores/selectors/profileSelectors";
import {
  savePlatfromLinks,
  updatedPlatfromLink,
  fetchPlatformLinks,
} from "@/app/stores/slices/profileSlice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Loader from "@/store/utils/Loader";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AddLinkDetailsModal({ platform, onClose, onSave }) {
  const profileType = useSelector((state) => state.profile.profileType);
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);

  const [username, setUsername] = useState("");
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (!platform) {
      setUsername("");
      setLabel("");
      return;
    }
    let userHandle = platform.username || "";
    if (!userHandle && platform.url) {
      try {
        const urlObj = new URL(platform.url);
        let path = urlObj.pathname.slice(1);
        userHandle = path.split("/")[0].split("?")[0];
      } catch {
        userHandle = platform.url.replace(/^https?:\/\//i, "").split("/")[0];
      }
    }

    setUsername(userHandle);
    setLabel(platform.title || platform.platform_name || platform.name || "");
  }, [platform]);

  const isDisabled = !username.trim();
  const getPreviewUrl = () => {
    if (!username.trim()) return "";

    const handle = username.trim().replace(/^@/, "");

    const baseUrl =
      platform?.base_url ||
      `https://${(platform?.key || platform?.name || "").toLowerCase()}.com/`;

    return `${baseUrl.replace(/\/+$/, "")}/${handle}`;
  };

  const handleSave = async () => {
    if (!username.trim()) return;

    const cleanUsername = username.trim().replace(/^@/, "");

    const payload = {
      username: cleanUsername,
      platform_name: label.trim() || platform?.name || "Link",
    };

    let resultAction;

    if (platform?.id) {
      resultAction = await dispatch(
        updatedPlatfromLink({profileType, payload, id: platform.id })
      );
    } else {
     
      
      resultAction = await dispatch(
        savePlatfromLinks({ profileType, payload })
      );
    }

    const success = platform?.id
      ? updatedPlatfromLink.fulfilled.match(resultAction)
      : savePlatfromLinks.fulfilled.match(resultAction);

    if (success) {
      dispatch(fetchPlatformLinks({profileType}));
      onSave?.();
      onClose();
    } else {
      alert("Failed to save link. Please try again.");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Dialog open onOpenChange={onClose}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[640px]! w-full! rounded-2xl shadow-xl p-8  border-0 transition-colors bg-[#F5F5F5] dark:bg-[#262626] border-[#333]"
        >
          <a
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-white transition"
          >
            <X size={18} />
          </a>

          <h2 className="text-black dark:text-white text-lg font-semibold mb-8">
            {platform?.id ? `Edit ${platform?.name}` : `Add ${platform?.name}`}{" "}
            Link
          </h2>

          <div className="space-y-6">
            <div className="relative">
              <label className="absolute -top-2 left-5 px-1 text-gray-400 dark:text-gray-300 bg-[#F5F5F5] dark:bg-[#262626]">
                Username
              </label>
              <input
                type="text"
                placeholder="@username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none"
                autoFocus
              />
              {username.trim() && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-5">
                  Full link:{" "}
                  <span className="font-medium">{getPreviewUrl()}</span>
                </p>
              )}
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-5 px-1 text-gray-400 dark:text-gray-300 bg-[#F5F5F5] dark:bg-[#262626]">
                Button Title (optional)
              </label>
              <input
                placeholder={platform?.name || "Link"}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              Cancel
            </button>

            <button
              disabled={isDisabled}
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-black text-white font-semibold hover:bg-[#111] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {platform?.id ? "Update" : "Add"} Link
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
