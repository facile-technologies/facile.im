"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/store/utils/cropImage";
import Loader from "@/store/utils/Loader";
import { selectPetLoading } from "@/app/stores/selectors/petProfileSelector";
import { useSelector } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ImageCropModal({
  isOpen,
  onClose,
  image,
  shape,
  onCropComplete,
  onShapeChange,
}) {
  const loading = useSelector(selectPetLoading);
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

  // const handleSave = async () => {
  //   try {
  //     const croppedImage = await getCroppedImg(
  //       image,
  //       croppedAreaPixels,
  //       localShape
  //     );
  //     onCropComplete(croppedImage, localShape);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const handleSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(
        image,
        croppedAreaPixels,
        localShape,
      );

      // Convert Blob -> base64 for live preview
      const reader = new FileReader();
      reader.readAsDataURL(croppedBlob);
      reader.onloadend = () => {
        const base64data = reader.result;
        // Pass both base64 and Blob
        onCropComplete(base64data, localShape, croppedBlob);
      };
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;
  const aspect =
    localShape === "Rectangle"
      ? 2 // wide rect for oval
      : 1; // circle & square are 1:1

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
          className="bg-white dark:bg-[#2A2A2A] rounded-xl p-6 w-[360px] max-w-[90%] flex flex-col items-center gap-4  border-0"
        >
          {/* Cropper */}
          <div className="w-[300px] h-[300px] relative bg-gray-200 rounded-lg overflow-hidden">
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
            />
          </div>

          {/* Shape Buttons */}
          <div className="flex justify-center gap-2">
            {["circle", "rectangle", "square"].map((s) => (
              <button
                key={s}
                className={`cropper-btn px-3 py-1 rounded capitalize ${
                  localShape === s ? "bg-black text-white" : "bg-gray-300"
                }`}
                onClick={() => {
                  setLocalShape(s); // update popup immediately
                  onShapeChange?.(s); // inform parent / Redux
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Zoom Slider */}
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full mt-2"
          />

          <div className="flex gap-2 mt-4">
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

          <a
            type="button"
            onClick={onClose}
            className="absolute top-0 right-0 bg-black rounded-2xl px-2 py-1  text-white"
          >
            ✕
          </a>
        </DialogContent>
      </Dialog>
    </>
  );
}
