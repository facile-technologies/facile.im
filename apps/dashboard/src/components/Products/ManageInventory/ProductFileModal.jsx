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

export const ProductFileModal = ({ open, onOpenChange, onAdd }) => {
  const { handleSubmit } = useForm();

  const [preview, setPreview] = React.useState(null);
  const [productFile, setProductFile] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);

  // Handle preview image
  const handlePreviewUpload = (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    setImageFile(file); // ✅ STORE REAL FILE
  };

  // Handle product file (pdf etc)
  const handleProductFile = (file) => {
    if (!file) return;
    setProductFile(file);
  };

  const onSubmit = () => {
    onAdd({
      file: productFile,
      image: imageFile, // ✅ REAL FILE
      preview,
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
              Add at least one file to publish your product.
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

        {/* Upload File */}
        <label className="border border-white rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800 transition mt-5">
          <Upload className="w-5 h-5" />
          <span className="text-sm">Upload File</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleProductFile(e.target.files[0])}
          />
        </label>

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

        {/* Product File List */}
        {productFile && (
          <div className="mt-3">
            <h3 className="text-md">Product Files</h3>
            <div className="border border-white rounded-xl p-3 flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-xs">
                  PDF
                </div>

                <div>
                  <p className="text-sm">{productFile.name}</p>
                  <p className="text-xs text-zinc-400">
                    {(productFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <button
                className="bg-[#2A2A2A]! w-9 h-9 flex justify-center items-center rounded-full"
                onClick={() => setProductFile(null)}
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

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
