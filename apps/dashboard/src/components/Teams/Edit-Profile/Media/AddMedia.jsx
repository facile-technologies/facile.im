import { selectLoading } from "@/app/stores/selectors/profileSelectors";
import { saveMedia } from "@/app/stores/slices/profileSlice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Loader from "@/store/utils/Loader";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AddMedia({ onClose, onSave }) {
  const profileType = useSelector((state) => state.profile.profileType);
  const loading = useSelector(selectLoading);
  const [productImage, setProductImage] = useState(null);


  const dispatch = useDispatch();

  const handleProductImageChange = (event) => {
    const file = event.target.files[0];
   
    setProductImage(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
 
  };

  const handleSave = () => {
    if (productImage) {
      const formData = new FormData();
      formData.append("media", productImage);

      dispatch(saveMedia({ profileType, formData }));
      onClose();
    }
  };
  const handleCancel = () => {
    setProductImage(null);
  };

  return (
    <>
      {loading && <Loader />}
      <Dialog open onOpenChange={onClose}>
        <div className="flex items-center justify-center m-20">
          <DialogContent
            showCloseButton={false}
            className="max-w-[640px]! w-full!  rounded-2xl p-6 shadow-xl border-0
          bg-[#F5F5F5] dark:bg-[#505050] border-[#3A3A3A]"
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-white transition"
              onClick={onClose}
            ></button>

            <h2 className="text-2xl font-semibold mb-6">Add Media</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center">
                <input
                  id="productImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProductImageChange}
                />

                <label
                  htmlFor="productImage"
                  className="w-full h-50 border-2 border-dashed border-[#E0E6EF] 
                  rounded-md flex flex-col items-center justify-center cursor-pointer"
                >
                  {productImage ? (
                    <img
                      src={URL.createObjectURL(productImage)}
                      alt="Product Preview"
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <img
                        src="/upload.svg"
                        alt=""
                        className="w-10 h-10 mb-2"
                      />
                      <p className="text-sm text-white mb-2">
                        Drop your image here, or Browse
                      </p>
                      <div className="text-[#E0E6EF]">
                        <a
                          type="submit"
                          className="px-4 py-2 bg-none border border-[#E0E6EF] text-white rounded-md"
                        >
                          Browse
                        </a>
                      </div>
                    </div>
                  )}
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="ecommerceBtn px-5 py-2 rounded-full bg-black text-white"
                >
                  Add Media
                </button>
              </div>
            </form>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
