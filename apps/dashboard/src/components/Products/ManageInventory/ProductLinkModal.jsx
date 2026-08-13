import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Trash2 } from "lucide-react";

export const ProductLinkModal = ({ open, onOpenChange, onAdd }) => {
  
  const { register, handleSubmit } = useForm();

  const [preview, setPreview] = React.useState(null);

  // Handle preview image
  const handlePreviewUpload = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const onSubmit = (data) => {
    onAdd({
      name: data.title,
      type: "LINK",
      url: data.url,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-white! w-full max-w-[548px]! rounded-2xl py-5 px-7 text-black dark:bg-[#262626]! dark:text-white shadow-2xl border-none! gap-0! "
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <DialogTitle className="text-lg font-semibold">
              Add Product
            </DialogTitle>
            <p className="text-sm text-[#C4C4C4]">
              Add link to publish your product.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-black! dark:text-white! hover:opacity-80 text-xl bg-transparent!"
          >
            ✕
          </button>
        </div>

        <div className="relative w-full  mt-7">
          {/* Floating Label */}
          <label className="absolute -top-2 left-4 px-2 text-xs text-gray-300 bg-[#252525] rounded-full">
            Title
          </label>

          <Input
            {...register("title")}
            placeholder="Product Title"
            className="
          h-14
          rounded-full
          w-full
          border
          border-white
          text-white
          placeholder:text-gray-400
          focus-visible:ring-0
          focus-visible:ring-offset-0
          focus:border-white
        "
          />
        </div>
        <div className="relative w-full  mt-7">
          {/* Floating Label */}
          <label className="absolute -top-2 left-4 px-2 text-xs text-gray-300 bg-[#252525] rounded-full">
            URL
          </label>

          <Input
            {...register("url")}
            placeholder="https://www.linkedin.com/"
            className="
          h-14
          rounded-full
          w-full
          border
          border-white
          text-white
          placeholder:text-gray-400
          focus-visible:ring-0
          focus-visible:ring-offset-0
          focus:border-white
        "
          />
        </div>

        {/* Preview Section */}
        <div className="space-y-3 mt-4">
          <div>
            <h3 className="text-md">Preview</h3>
            <p className="text-sm text-[#C4C4C4]">
              Upload preview image of your product
            </p>
          </div>

          <div className="border border-dashed  border-white rounded-xl h-40 flex items-center justify-center relative overflow-hidden">
            {!preview ? (
              <label className="flex flex-col items-center gap-2 cursor-pointer text-zinc-400">
                <Upload className="w-5 h-5" />
                <span className="text-sm">Drop your image here, or Browse</span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePreviewUpload(e.target.files[0])}
                />
              </label>
            ) : (
              <>
                <img src={preview} className="w-full h-full object-cover" />

                <button
                  onClick={() => setPreview(null)}
                  className="absolute bg-[#2A2A2A]! text-white! px-4 py-2 rounded-full text-sm"
                >
                  Delete Image
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="secondary"
            className="rounded-full font-semibold!"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            className="rounded-full bg-black! text-white! font-semibold!"
            onClick={handleSubmit(onSubmit)}
          >
            Add Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
