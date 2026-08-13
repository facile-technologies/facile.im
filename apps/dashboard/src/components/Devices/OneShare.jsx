import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { updateOneShare } from "../../services/device";
import { showToast } from "../../store/utils/toast";
import { Loader2 } from "lucide-react";

export function OneShare({ device, onClose, onRefresh }) {
  const [oneShareURL, setOneShareURL] = useState(device?.one_share_url || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleOneShareURLChange = (e) => {
    setOneShareURL(e.target.value);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    const isEmpty = !oneShareURL.trim();

    const payload = {
      code: device.code,
      one_share_active: !isEmpty,
      one_share_url: isEmpty ? "" : oneShareURL.trim()
    };

    try {
      const response = await updateOneShare(payload);
      if (response.data.success) {
        showToast("success", isEmpty ? "OneShare disabled." : "OneShare link updated!");
        if (onRefresh) onRefresh();
        onClose();
      } else {
        showToast("error", response.data.message || "Failed to update OneShare.");
      }
    } catch (error) {
      console.error("OneShare update error:", error);
      const msg = error.response?.data?.message || "An error occurred.";
      showToast("error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="bg-white! w-full max-w-[640px]! rounded-[20px] py-7 px-5 text-black dark:bg-[#262626]! dark:text-white shadow-2xl border-none! gap-0!"
      >
        {/* Header */}
        <div className="mb-6 w-full">
          <div className="flex justify-between items-center w-full ">
            <h2 className="text-lg font-bold text-left text-black dark:text-white">Setup OneShare</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-black! dark:text-white! hover:opacity-80 text-xl bg-transparent!"
            >
              ✕
            </button>
          </div>
          <p className="text-left text-xs text-gray-500 dark:text-white mt-1">
            Paste your OneShare link below to connect your profile
          </p>
        </div>

        <div className="relative">
          <label className="absolute -top-2 left-5 px-1 text-gray-600 dark:text-white text-[12px] transition bg-white dark:bg-[#262626]">
            Enter Link
          </label>
          <input
            type="text"
            name="oneShareURL"
            value={oneShareURL}
            onChange={handleOneShareURLChange}
            disabled={isLoading}
            className="w-full rounded-full border border-gray-200 dark:border-[#5A5A5A] bg-gray-50 dark:bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-400 dark:placeholder-gray-500 transition focus:border-gray-300 dark:focus:border-white"
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-sm px-8 py-2.5 rounded-full bg-gray-100 text-black hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition border border-gray-200 dark:border-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="text-sm ecommerceBtn px-8 py-2.5 rounded-full bg-white text-black font-semibold hover:opacity-90 transition flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-black!" /> : (device?.one_share_active ? "Update Link" : "Add Link")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
