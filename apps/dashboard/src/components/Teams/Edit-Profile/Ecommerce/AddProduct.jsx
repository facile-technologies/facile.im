import { selectLoading } from "@/app/stores/selectors/profileSelectors";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Loader from "@/store/utils/Loader";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function AddEcommerceProduct({ onClose, onSave }) {
  const loading = useSelector(selectLoading);
  const [productLink, setProductLink] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);

  const handleProductImageChange = (event) => {
    const file = event.target.files[0];
    setProductImage(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
 
  };

  const generateId = () => `product-${Date.now()}`;

  const handleCancel = () => {
    setProductLink("");
    setProductTitle("");
    setProductPrice("");
    setProductImage(null);
  };
  const handleSave = () => {
    const newProduct = {
      id: generateId(),
      productLink,
      productTitle,
      productPrice,
      productImage,
      isVisible: true,
    };
    onSave(newProduct);
    onClose();
  };

  return (
    <>
      {loading && <Loader />}
      <Dialog open onOpenChange={onClose}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[650px]! w-full! rounded-2xl p-6 shadow-xl border-0
          bg-[#F5F5F5] dark:bg-[#262626] border-[#3A3A3A]"
        >
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-white transition"
            onClick={onClose}
          ></button>

          <h2 className="text-2xl font-semibold mb-6">Add Ecommerce Product</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label
                className="absolute -top-2 left-5 bg-[#F5F5F5] dark:bg-[#262626] 
                text-gray-400 text-sm px-1"
              >
                Product Link
              </label>
              <input
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
                className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555]
                  bg-transparent text-black dark:text-white px-5 py-3 text-sm 
                  outline-none focus:border-white transition"
              />
            </div>
            <div className="relative">
              <label
                className="absolute -top-2 left-5 bg-[#F5F5F5] dark:bg-[#262626] 
                text-gray-400 text-sm px-1"
              >
                Product Title
              </label>
              <input
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555]
                  bg-transparent text-black dark:text-white px-5 py-3 text-sm 
                  outline-none focus:border-white transition"
              />
            </div>
            <div className="relative w-full">
              <label
                className="absolute -top-2 left-5 bg-[#F5F5F5] dark:bg-[#262626] 
                text-gray-400 text-sm px-1"
              >
                Price
              </label>

              <div
                className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] 
                bg-transparent flex items-center px-3 py-3"
              >
                <span className="text-sm text-gray-400 pr-3 border-r border-[#5A5A5A]">
                  USD
                </span>
                <input
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full bg-transparent text-black dark:text-white 
                    px-3 text-sm outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
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
                className="w-full h-40 border-2 border-dashed border-[#E0E6EF] 
                  rounded-md flex flex-col items-center justify-center cursor-pointer"
              >
                {productImage ? (
                  <img
                    src={productImage}
                    alt="Product Preview"
                    className="h-full w-full object-cover rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <img src="/upload.svg" alt="" className="w-10 h-10 mb-2" />
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
                Add Product
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
