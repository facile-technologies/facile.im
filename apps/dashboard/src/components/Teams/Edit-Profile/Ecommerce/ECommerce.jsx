import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddEcommerceProduct from "./AddProduct";
import { Eye, Pencil, Trash2, Instagram } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import {
  addProduct,
  setProductLayout,
  setbuyBtnBgColor,
  setbuyBtnTextColor,
  setcustomColorCustomization,
  setproductCardTextColor,
  setproductCardbgColor,
  toggleVisibility,
} from "@/app/stores/slices/profileSlice";
import ConfirmModal from "../../shared/ConfirmModal";
import ColorPickerPopUp from "../../shared/ColorPicker";

export default function ECommerceSection() {
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("Background");
  const [buttonTab, setButtonTab] = useState("Background");
  const [showCardColorPicker, setShowCardColorPicker] = useState(false);
  const [showButtonColorPicker, setShowButtonColorPicker] = useState(false);
  const [currentCardColor, setCurrentCardColor] = useState("#ffffff");
  const [currentButtonColor, setCurrentButtonColor] = useState("#ffffff");

  const dispatch = useDispatch();
  const productLayout = useSelector((state) => state.profile.productLayout);
  const products = useSelector((state) => state.profile.products);


  const handleSaveProduct = (productData) => {
    dispatch(addProduct(productData));
    dispatch(setProductLayout("carousel"));
    setShowAddProductPopup(false);
  };
  const handleVisibilityToggle = (id) => {
    dispatch(toggleVisibility(id));
  };
  const colors = [
    "#ffffff",
    "#a3a8b8",
    "#7b849b",
    "#000000",
    "#e67e22",
    "#f1c40f",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  const openDeleteModal = (linkId) => {
    setLinkToDelete(linkId);
    setIsModalOpen(true);
  };
  const handleDelete = () => {
    if (linkToDelete) {
      onDelete(linkToDelete);
      closeDeleteModal();
    }
    setIsModalOpen(false);
  };
  const closeDeleteModal = () => {
    setShowDelete(false);
    setLinkId(null);
  };

  const layoutPreviews = [
    {
      id: "carousel",
      label: "Carousel",
      render: () => (
        <div className="w-14 h-14 bg-gradient-to-br from-accent to-[#6ea0ff] rounded-xl flex flex-col items-center justify-center p-1 text-white">
          {products[0] ? (
            <>
              <img
                src={products[0].productImage}
                alt=""
                className="w-6 h-6 mb-0.5"
              />
              <p className="text-[9px] truncate w-full text-center">
                {products[0].productTitle}
              </p>
            </>
          ) : (
            <Instagram className="w-5 h-5 text-white/60" />
          )}
        </div>
      ),
    },
    {
      id: "card",
      label: "Card",
      render: () => (
        <div className="w-14 h-14 bg-white/10 rounded-xl p-1 flex flex-col items-start gap-1 text-white">
          {products[0] ? (
            <>
              <img
                src={products[0].productImage}
                alt=""
                className="w-6 h-6 rounded"
              />
              <p className="text-[8px] truncate font-medium">
                {products[0].productTitle}
              </p>
            </>
          ) : (
            <Instagram className="w-5 h-5 text-white/60" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-10 w-full max-w-[1100px] mx-auto">
      <ConfirmModal
        open={isModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
      {/* Top Card */}
      <div className="flex flex-col gap-0 dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl px-6 py-4  border border-[#C0C0C017] w-full max-w-[700px]">
        <h2 className="dark:text-white text-black text-[16px] font-bold">
          Manage Ecommerce
        </h2>
        <div className="flex items-center justify-between w-full">
          <p className="dark:text-white text-black opacity-70 text-[15px]">
            Add or Edit Ecommerce Links
          </p>
          <a
            type="button"
            onClick={() => setShowAddProductPopup(true)}
            className="bg-black h-11 text-white text-sm px-4 py-3 rounded-3xl"
          >
            + Add Product
          </a>
        </div>
      </div>

      {/* Products List */}
      {products.length > 0 && (
        <div className="space-y-4">
          {products.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between w-full max-w-[700px] gap-4 p-4 rounded-2xl bg-[#F5F5F5] dark:bg-[#3F3F3F]"
            >
              {/* Product Image */}
              <img
                src={item.productImage}
                className="w-14 h-14 rounded-md object-cover"
                alt=""
              />
              {/* Info */}
              <div className="flex-1">
                <p className="font-medium text-black dark:text-white">
                  {item.productTitle}
                </p>
                <p className="text-sm opacity-60 text-black dark:text-white">
                  {item.productLink}
                </p>
                <p className="text-sm opacity-60 text-black dark:text-white">
                  ${item.productPrice} USD
                </p>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-3 text-gray-300">
                <a
                  type="button"
                  onClick={() => handleVisibilityToggle(item.id)}
                  className="p-2 bg-[#ffffff]/10 hover:bg-[#4A4A4A] rounded-2xl"
                >
                  <Eye
                    size={18}
                    className={
                      item.isVisible ? "text-white" : "text-red-400 opacity-50"
                    }
                  />
                </a>
                <a
                  type="button"
                  className="p-2 bg-[#ffffff]/10 hover:bg-[#4A4A4A] rounded-2xl"
                >
                  <Pencil size={18} className="text-white" />
                </a>
                <a
                  type="button"
                  onClick={() => openDeleteModal(item.id)}
                  className="p-2  bg-[#ffffff]/10 hover:bg-[#4A4A4A] transition rounded-2xl"
                >
                  <Trash2 size={18} className="text-white" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      {products.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="ecommerce-product-custom">
            <AccordionTrigger>
              E-commerce Product Customization
            </AccordionTrigger>
            <AccordionContent>
              <div className="dark:bg-[#303030] bg-white rounded-2xl p-4 sm:p-6 border border-[#C0C0C017]">
                <div className="flex flex-col gap-0 dark:bg-[#3F3F3F] p-4 rounded-2xl mb-3">
                  <h2 className="text-black dark:text-white mb-4">
                    Select Product Layout
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {layoutPreviews.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => dispatch(setProductLayout(l.id))}
                        className={`cursor-pointer rounded-[11px] p-1 transition-all border ${
                          productLayout === l.id
                            ? "border-2 border-black dark:border-white shadow-lg"
                            : "border-transparent"
                        } flex justify-center items-center`}
                      >
                        {l.id === "carousel" &&
                          products &&
                          products.length > 0 && (
                            <div className="flex flex-col items-center justify-center gap-1 w-full">
                              <div className="flex gap-3 sm:gap-5 rounded-[11px] w-full sm:w-[150px] dark:bg-[#2A2A2A] bg-[#FFFFFF] sm:p-2">
                                {products.slice(0, 4).map((product) => (
                                  <div
                                    key={product.id || product.productTitle}
                                    className="rounded-lg flex flex-col items-center justify-center min-w-[30px]"
                                  >
                                    <img
                                      src={product.productImage}
                                      alt={product.productTitle}
                                      className="w-8 h-8 object-cover rounded"
                                    />
                                    <span className="text-[8px] mt-1 text-white text-center truncate">
                                      {product.productTitle}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <span className="text-[16px] mt-1 text-white text-center truncate">
                                {l.label}
                              </span>
                            </div>
                          )}

                        {l.id === "card" && products && products.length > 0 && (
                          <div className="flex flex-col items-center gap-1 w-full">
                            <div className="flex gap-3 sm:gap-5 mt-2 rounded-[11px] w-full sm:w-[150px] dark:bg-[#2A2A2A] bg-[#FFFFFF] sm:p-2">
                              <div className="flex flex-col gap-2 mt-2 w-full">
                                {products.map((product) => (
                                  <div
                                    key={product.id || product.productTitle}
                                    className="flex items-center gap-2"
                                  >
                                    <img
                                      src={product.productImage}
                                      alt={product.productTitle}
                                      className="w-6 h-6 rounded object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[9px] font-medium text-white truncate">
                                        {product.productTitle}
                                      </p>
                                      <p className="text-[7px] text-gray-400 truncate">
                                        ${product.productPrice} USD
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <span className="text-[16px] mt-1 text-white text-center truncate">
                              {l.label}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="dark:bg-[#3F3F3F] p-4 rounded-2xl">
                  <h3 className="dark:text-white text-black text-[16px] font-semibold mb-1">
                    Color Customization
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center border border-[#EAECF04A] dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full mt-4 mb-5">
                    {["Background", "Name"].map((tab) => (
                      <a
                        type="button"
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 text-center py-2 text-sm rounded-full transition
                        ${
                          activeTab === tab
                            ? "bg-black text-white font-medium"
                            : "dark:text-white/60 text-black/60 dark:hover:text-white"
                        }`}
                      >
                        {tab}
                      </a>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-4 flex-wrap">
                    {colors.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          setCurrentCardColor(c);
                          setShowCardColorPicker(true);
                          if (activeTab === "background") {
                            dispatch(setproductCardbgColor(c));
                          } else if (activeTab === "name") {
                            dispatch(setproductCardTextColor(c));
                          }
                        }}
                        style={{ backgroundColor: c }}
                        className="w-8 h-8 rounded-full cursor-pointer border border-white/20"
                      />
                    ))}
                  </div>
                </div>

                <div className="dark:bg-[#3F3F3F] p-4 rounded-2xl mt-4">
                  <h3 className="dark:text-white text-black text-[16px] font-semibold mb-1">
                    Button Customization
                  </h3>
                  <p className="dark:text-white text-black opacity-50 text-[12px] mb-4">
                    Customize form button
                  </p>
                  <input
                    value="Buy Now"
                    readOnly
                    className="w-full dark:bg-[#373636] dark:text-white text-white px-4 py-3 rounded-xl border border-[#5B5B5B] outline-none"
                  />
                  <div className="flex flex-col sm:flex-row items-center border border-[#EAECF04A] dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full mt-4 mb-5">
                    {["Background", "Name"].map((tab) => (
                      <a
                        type="button"
                        key={tab}
                        onClick={() => setButtonTab(tab)}
                        className={`flex-1 text-center py-2 text-sm rounded-full transition
                        ${
                          buttonTab === tab
                            ? "bg-black text-white font-medium"
                            : "dark:text-white/60 text-black/60 dark:hover:text-white"
                        }`}
                      >
                        {tab}
                      </a>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-4 flex-wrap">
                    {colors.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          setCurrentButtonColor(c);
                          setShowButtonColorPicker(true);
                          if (buttonTab === "Background") {
                            dispatch(setbuyBtnBgColor(c));
                          } else if (buttonTab === "name") {
                            dispatch(setbuyBtnTextColor(c));
                          }
                        }}
                        style={{ backgroundColor: c }}
                        className="w-8 h-8 rounded-full cursor-pointer border border-white/20"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Add Product Popup */}
      {showAddProductPopup && (
        <AddEcommerceProduct
          onClose={() => setShowAddProductPopup(false)}
          onSave={handleSaveProduct}
        />
      )}
      {showCardColorPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="relative">
            <ColorPickerPopUp
              currentColor={currentCardColor}
              onSelect={(newColor) => {
                setCurrentCardColor(newColor);
                if (activeTab === "Background") {
                  dispatch(setproductCardbgColor(newColor));
                } else {
                  dispatch(setproductCardTextColor(newColor));
                }
              }}
              onClose={() => setShowCardColorPicker(false)}
            />
            <button
              onClick={() => setShowCardColorPicker(false)}
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-7 h-7 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {showButtonColorPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="relative">
            <ColorPickerPopUp
              currentColor={currentButtonColor}
              onSelect={(newColor) => {
                setCurrentButtonColor(newColor);
                if (buttonTab === "background") {
                  dispatch(setbuyBtnBgColor(newColor));
                } else {
                  dispatch(setbuyBtnTextColor(newColor));
                }
              }}
              onClose={() => setShowButtonColorPicker(false)}
            />
            <button
              onClick={() => setShowButtonColorPicker(false)}
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-7 h-7 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
