import React, { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import braceletModal from "@/assets/pngs/bracelet-modal.png";
import { unlinkDevice } from "../../services/device";
import { showToast } from "../../store/utils/toast";
import { Loader2 } from "lucide-react";

export function ManageDevicePopup({ device, onClose, onRefresh }) {
  const [isUnlinking, setIsUnlinking] = useState(false);

  if (!device) return null;

  const handleUnlinkClick = async () => {
    if (window.confirm(`Do you really want to map this device with ${device.profile?.profile_name || 'this profile'}?`)) {
      setIsUnlinking(true);
      try {
        const response = await unlinkDevice(device.code);
        if (response.data.success) {
          showToast("success", "Device unlinked successfully!");
          if (onRefresh) onRefresh();
          onClose();
        } else {
          showToast("error", response.data.message || "Failed to unlink device.");
        }
      } catch (error) {
        console.error("Unlink error:", error);
        const msg = error.response?.data?.message || "An error occurred while unlinking.";
        showToast("error", msg);
      } finally {
        setIsUnlinking(false);
      }
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="bg-white! w-full max-w-[548px]! rounded-2xl py-5 px-7 text-black dark:bg-[#262626]! dark:text-white shadow-2xl border-none! gap-0!"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">Manage Device</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-black! dark:text-white! hover:opacity-80 text-xl bg-transparent!"
          >
            ✕
          </button>
        </div>

        {/* Device Card */}
        <div className="flex items-center gap-3 rounded-2xl">
          <img
            src={device.image ? `https://api.facile.im/uploads/${device.image}` : braceletModal}
            alt={device.device_name}
            className="w-20 h-20 object-contain rounded-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = braceletModal;
            }}
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{device.device_name}</h3>
            <p className="text-xs text-gray-500 dark:text-[#BFBFBF] mt-1">
              Code: {device.code}
            </p>
          </div>
          <span className="text-xs bg-gray-100 text-gray-700 dark:bg-[#292929] dark:text-white px-3 py-1 rounded-full h-8 flex items-center justify-center min-w-[80px]">
            {device.status}
          </span>
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-[#3C3C3C] my-4"></div>

        {/* Linked Profile Section */}
        <h3 className="text-sm text-black dark:text-white mb-2 font-semibold">
          Linked Profile
        </h3>
        <div className="bg-gray-50 dark:bg-[#3F3F3F] p-4 rounded-2xl mb-3">
          <div className="flex items-center gap-3">
            <img
              src={(device.user?.avatar || device.profile?.profile_image) ?
                `https://api.facile.im/uploads/${device.user?.avatar || device.profile?.profile_image}` :
                "/pro-image.jpg"}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/pro-image.jpg";
              }}
            />
            <div className="flex-1">
              <p className="font-semibold text-black dark:text-white">
                {device.user?.full_name || device.profile?.profile_name || "Unknown Profile"}
              </p>
              <p className="text-xs text-gray-500 dark:text-[#BFBFBF]">
                {device.user?.email || "No Type"}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-white mt-3">
            This device is currently linked to this profile
          </p>
        </div>

        {/* Unlink Button */}
        <button
          onClick={handleUnlinkClick}
          disabled={isUnlinking}
          className="deviceBtn w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-opacity-80 mb-2 flex items-center justify-center gap-2"
        >
          {isUnlinking ? <Loader2 className="w-5 h-5 animate-spin text-white!" /> : "Unlink Profile"}
        </button>

        <p className="text-center text-xs text-gray-500 dark:text-white">
          You can link this device to another profile after unlinking it.
        </p>
      </DialogContent>
    </Dialog>
  );
}
