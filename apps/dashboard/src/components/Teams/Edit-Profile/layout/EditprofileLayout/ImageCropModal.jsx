"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/store/utils/cropImage";
import Loader from "@/store/utils/Loader";
import { selectLoading } from "@/app/stores/selectors/profileSelectors";
import { useSelector } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ImageCropModal({
  isOpen,
  onClose,
  image,
  shape,
  type,
  onCropComplete,
  croppedFile,
  onShapeChange,
}) {
  const loading = useSelector(selectLoading);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [localShape, setLocalShape] = useState(shape);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    setLocalShape(shape);
  }, [shape]);

  const onCropCompleteInternal = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImageFile = await getCroppedImg(
        image,
        croppedAreaPixels,
        localShape
      );
      onCropComplete(croppedImageFile, localShape);
      onClose();
    } catch (e) {
      console.error("Cropping failed:", e);
    }
  };

  if (!isOpen) return null;
  const aspect = type === "banner" ? 3 : localShape === "rectangle" ? 2 : 1;

  const cropShape = localShape === "circle" ? "round" : "rect";

  return (
    <>
      {loading && <Loader />}
      <Dialog
        open
        onOpenChange={onClose}
        className=" flex items-start justify-center mt-10  pt-6"
      >
        <DialogContent
          showCloseButton={false}
          className="bg-white dark:bg-[#2A2A2A] rounded-xl p-6 max-w-[360px]! w-full! flex flex-col items-center gap-4 border-0 "
        >
          <div
            className={`w-full max-w-[360px] h-[120px] ${
              type === "banner" ? "h-[200px]" : "h-[200px]"
            } relative bg-gray-200 rounded-lg overflow-hidden`}
          >
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={cropShape}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropCompleteInternal}
              classes={{
                containerClassName: "cropper-container",
                mediaClassName: "cropper-media",
              }}
            />
          </div>
          <div className="flex justify-center gap-2">
            {["circle", "rectangle", "square"].map((s) => (
              <button
                type="button"
                key={s}
                className={`cropper-btn px-3 py-1 rounded capitalize transition-colors ${
                  localShape.toLowerCase() === s.toLowerCase() ? "selected" : ""
                }`}
                onClick={() => {
                  setLocalShape(s.toLowerCase());
                  onShapeChange?.(s.toLowerCase());
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full mt-2"
          />
          <div className="flex gap-2 mt-4 ">
            <Button
              onClick={handleSave}
              onMouseEnter={() => setHoveredBtn("crop")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                backgroundColor: hoveredBtn === "crop" ? "#000000" : "white",
                color: hoveredBtn === "crop" ? "white" : "#000000",
                border: "none",
                borderRadius: "5px",
                transition: "all 0.3s ease-in-out",
              }}
            >
              Crop
            </Button>

            <Button
              onClick={onClose}
              onMouseEnter={() => setHoveredBtn("cancel")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                backgroundColor: hoveredBtn === "cancel" ? "#000000" : "white",
                color: hoveredBtn === "cancel" ? "white" : "#000000",
                border: "none",
                borderRadius: "5px",
                transition: "all 0.3s ease-in-out",
              }}
            >
              Cancel
            </Button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cross-btn absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
