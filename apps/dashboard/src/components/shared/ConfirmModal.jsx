import { Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";

export default function ConfirmModal({
  open,
  title = "Confirm Delete?",
  message = "Are you sure you want to delete your link? ",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <>
      <Dialog open onOpenChange={onCancel}>
        <DialogContent
          showCloseButton={false}
          className="dark:bg-[#363636] max-w-[327px]! w-full!  text-white p-6 rounded-xl border-0"
        >
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 dark:bg-[#363636] mt-4 text-white rounded-full flex items-center justify-center">
              <div className="flex justify-center">
                <Trash2
                  size={24}
                  className=" w-10 h-10 bg-[#E71616] text-white rounded-full p-2"
                />
              </div>
            </div>
          </div>

          <h3 className="text-center font-semibold text-[16px]">
            {title}
          </h3>

          <p className="text-center text-[12px]">{message}</p>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-[124px] p-2 bg-[#ffffff] text-black rounded-md flex justify-center items-center disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="w-[124px] p-2 justify-center items-center bg-[#000000] text-white rounded-md flex disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
