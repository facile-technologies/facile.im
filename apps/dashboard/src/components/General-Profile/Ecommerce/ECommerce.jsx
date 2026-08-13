import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddEcommerceProduct from "./AddProduct";
import { Eye, Pencil, Trash2, Instagram, Pipette } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import {
  addProduct,
  setProductLayout,
  setProducts,
  setbuyBtnBgColor,
  setbuyBtnTextColor,
  setcustomColorCustomization,
  setproductCardTextColor,
  setproductCardbgColor,
  toggleVisibility,
} from "@/app/stores/slices/profileSlice";
import ConfirmModal from "../../shared/ConfirmModal";
import ColorPickerPopUp from "../../shared/ColorPicker";
import { useTheme } from "@/context/Themcontext";
import {
  deleteProduct,
  getProductsByID,
  productCustomization,
  productCustomizationSettings,
} from "@/services/products";
import { useNavigate } from "react-router-dom";

export default function ECommerceSection() {
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [activeTabMain, setActiveTabMain] = useState("Add Products");
  const [activeTab, setActiveTab] = useState("Background");
  const [buttonTab, setButtonTab] = useState("Background");
  const [showCardColorPicker, setShowCardColorPicker] = useState(false);
  const [showButtonColorPicker, setShowButtonColorPicker] = useState(false);
  const [currentCardColor, setCurrentCardColor] = useState("#ffffff");
  const [currentButtonColor, setCurrentButtonColor] = useState("#ffffff");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  console.log(isDarkMode, "isDarkMode");

  const getContrastColor = (hexcolor) => {
    if (
      !hexcolor ||
      hexcolor === "gradient" ||
      hexcolor === "transparent" ||
      hexcolor === "none"
    )
      return isDarkMode ? "white" : "black";
    const cleanedHex = hexcolor.replace("#", "");
    const r = parseInt(cleanedHex.substr(0, 2), 16) || 255;
    const g = parseInt(cleanedHex.substr(2, 2), 16) || 255;
    const b = parseInt(cleanedHex.substr(4, 2), 16) || 255;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  const productCardbgColor = useSelector(
    (state) => state.profile.productCardbgColor,
  );
  const productCardTextColor = useSelector(
    (state) => state.profile.productCardTextColor,
  );
  const buyBtnBgColor = useSelector((state) => state.profile.buyBtnBgColor);
  const buyBtnTextColor = useSelector((state) => state.profile.buyBtnTextColor);

  const getActiveCardColor = () => {
    return activeTab.toLowerCase() === "background"
      ? productCardbgColor
      : productCardTextColor;
  };

  const getActiveButtonColor = () => {
    return buttonTab.toLowerCase() === "background"
      ? buyBtnBgColor
      : buyBtnTextColor;
  };

  const isSelectedCard = (color) => {
    const active = getActiveCardColor();
    return active === color;
  };

  const isSelectedButton = (color) => {
    const active = getActiveButtonColor();
    return active === color;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productLayout = useSelector((state) => state.profile.productLayout);
  const products = useSelector((state) => state.profile.products);

  const handleSaveProduct = (productData) => {
    dispatch(addProduct(productData));
    dispatch(setProductLayout("carousal"));
    setShowAddProductPopup(false);
  };
  const handleVisibilityToggle = async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    // optimistic UI
    dispatch(toggleVisibility(id));

    try {
      await updateProductSettings(product);
    } catch (err) {
      console.error(err);

      // rollback if API fails
      dispatch(toggleVisibility(id));
    }
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
  // const handleDelete = () => {
  //   if (linkToDelete) {
  //     onDelete(linkToDelete);
  //     closeDeleteModal();
  //   }
  //   setIsModalOpen(false);
  // };
  const handleDelete = async () => {
    if (!linkToDelete) return;

    try {
      setDeleteLoading(true);
      const profileID = localStorage.getItem("userProfileID");

      await deleteProduct({
        product_id: linkToDelete,
        profile_ids: [profileID],
      });

      // ✅ remove from redux instantly (no refetch needed)
      const updatedProducts = products.filter((p) => p.id !== linkToDelete);

      dispatch(setProducts(updatedProducts));

      setIsModalOpen(false);
      setLinkToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };
  const closeDeleteModal = () => {
    setShowDelete(false);
    setLinkId(null);
  };

  const layoutPreviews = [
    {
      id: "carousal",
      label: "carousal",
      previewRenderer: () => (
        <div className="flex justify-center gap-2 w-full px-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-600" />
              <div className="h-1.5 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "cards",
      label: "Cards",
      previewRenderer: () => (
        <div className="flex flex-col gap-2 w-full px-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-gray-100 dark:bg-[#3A3A3A] p-2 rounded-lg w-full"
            >
              <div className="w-6 h-6 rounded bg-gray-300 dark:bg-gray-600" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="h-2 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
                <div className="h-1.5 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsByID();

        const { products, customization } = res.DATA;

        // ✅ map API → UI format
        const formattedProducts = products.map((p) => ({
          id: p.id,
          productTitle: p.title,
          productImage: p.image_url || "/placeholder.png",
          productPrice: p.price,
          productLink:
            p.type === "EXTERNAL" ? p.product_url : p.files?.[0]?.url || "",
          isVisible: p.is_visible,
          type: p.type,
          sequence: p.sequence,
        }));

        // ✅ store in redux
        dispatch(setProducts(formattedProducts));

        // ✅ customization
        if (customization) {
          dispatch(setProductLayout(customization.layout.toLowerCase()));
          dispatch(setbuyBtnBgColor(customization.button_bg_color));
          dispatch(setbuyBtnTextColor(customization.button_text_color));
          dispatch(setproductCardbgColor(customization.main_color));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const updateProductSettings = async (product) => {
    try {
      const profileID = localStorage.getItem("userProfileID");

      await productCustomizationSettings({
        user_profile_id: profileID,
        product_id: product.id,
        is_visible: !product.isVisible,
        sequence: product.sequence || 1,
      });
    } catch (err) {
      console.error("Failed to update product settings", err);
    }
  };

  const saveCustomization = async (override = {}) => {
    try {
      const profileID = localStorage.getItem("userProfileID");

      await productCustomization({
        user_profile_id: profileID,
        layout: (override.layout || productLayout).toUpperCase(), // ✅ FIX
        main_color: override.main_color || productCardbgColor,
        button_bg_color: override.button_bg_color || buyBtnBgColor,
        button_text_color: override.button_text_color || buyBtnTextColor,
        is_visible: true,
        sequence: 1,
      });
    } catch (err) {
      console.error("Customization save failed", err);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full max-w-[1100px] mx-auto">
      <div
        className={`flex flex-col gap-4 rounded-2xl p-4 w-full max-w-[1100px] transition-colors border ${
          isDarkMode
            ? "bg-[#303030] border-transparent"
            : "bg-white border-gray-100 shadow-sm"
        }`}
      >
        <ConfirmModal
          open={isModalOpen}
          onConfirm={handleDelete}
          onCancel={() => setIsModalOpen(false)}
          loading={deleteLoading}
        />
        <Tabs
          value={activeTabMain}
          onValueChange={setActiveTabMain}
          className="w-full"
        >
          <div
            className={`rounded-full overflow-hidden w-full h-11 flex items-center ${
              isDarkMode ? "bg-[#3F3F3F]" : "bg-gray-100"
            }`}
          >
            <TabsList className="flex w-full rounded-full cursor-pointer h-full border-none p-0 bg-transparent">
              {["Add Products", "Customize Products Style"].map((tab) => (
                <TabsTrigger
                  asChild
                  key={tab}
                  value={tab}
                  className="rounded-full"
                >
                  <a
                    type="button"
                    className={`flex-1 text-center text-sm font-medium rounded-full transition-all flex items-center justify-center h-full ${
                      isDarkMode
                        ? "text-gray-400 data-[state=active]:bg-black data-[state=active]:text-white"
                        : "text-gray-500 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                    }`}
                  >
                    {tab}
                  </a>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="mt-4 w-full">
            {activeTabMain === "Add Products" ? (
              <>
                {/* Top Card */}
                <div className="flex flex-col gap-0  rounded-2xl px-6 py-4  border border-[#C0C0C017] w-full max-w-[700px]">
                  <h2 className="dark:text-white text-black text-[16px] font-bold">
                    Manage Ecommerce
                  </h2>
                  <div className="flex items-center justify-between w-full">
                    <p className="dark:text-white text-black opacity-70 text-[15px]">
                      Start adding products by choosing an option below.
                    </p>
                    <a
                      type="button"
                      onClick={() => navigate("/products/manage-inventory")}
                      className="bg-black h-11 text-white text-sm px-4 py-3 rounded-3xl"
                    >
                      + Add Product
                    </a>
                  </div>
                </div>

                {/* Products List */}
                {products.length > 0 && (
                  <div className="space-y-4 mt-4">
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
                                item.isVisible
                                  ? "text-white"
                                  : "text-red-400 opacity-50"
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
                {/* Add Product Popup */}
                {showAddProductPopup && (
                  <AddEcommerceProduct
                    onClose={() => setShowAddProductPopup(false)}
                    onSave={handleSaveProduct}
                  />
                )}
              </>
            ) : (
              <>
                {products.length > 0 && (
                  <div>
                    <h2 className="text-black dark:text-white mb-4">
                      Product Customization
                    </h2>
                    <div className="flex flex-col gap-0 dark:bg-[#3F3F3F] p-4 rounded-2xl mb-3">
                      <h2 className="text-black dark:text-white mb-4">
                        Select Product Layout
                      </h2>
                      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {layoutPreviews.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => dispatch(setProductLayout(l.id))}
                        className={`cursor-pointer rounded-[11px] p-1 transition-all border ${productLayout === l.id
                            ? "border-2 border-black dark:border-white shadow-lg"
                            : "border-transparent"
                          } flex justify-center items-center`}
                      >
                        {l.id === "carousal" &&
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
                  </div> */}
                      <div className="flex flex-wrap gap-6 mt-3">
                        {layoutPreviews.map((s) => (
                          <button
                            type="button"
                            key={s.id}
                            onClick={() => {
                              dispatch(setProductLayout(s.id));
                              saveCustomization({ layout: s.id });
                            }}
                            className={`flex flex-col items-center gap-3 p-3 rounded-[11px] transition-all !bg-transparent ${
                              productLayout?.toLowerCase() ===
                              s.id?.toLowerCase()
                                ? "border-2 dark:border-white border-black"
                                : "border border-transparent"
                            }`}
                          >
                            <div className="w-[140px] h-[100px] dark:bg-[#2A2A2A] bg-[#FFFFFF] rounded-lg p-2 py-4 flex flex-col items-center justify-center overflow-hidden">
                              {s.previewRenderer()}
                            </div>
                            <span
                              className={`text-xs font-bold tracking-wider ${
                                isDarkMode ? "text-white!" : "text-gray-600!"
                              }`}
                            >
                              {s.label}
                            </span>
                          </button>
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
                        <button
                          onClick={() => {
                            setCurrentCardColor(getActiveCardColor());
                            setShowCardColorPicker(true);
                          }}
                          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 transition shadow-sm"
                          style={{
                            backgroundColor: getActiveCardColor(),
                            color: getContrastColor(getActiveCardColor()),
                          }}
                        >
                          <Pipette size={14} color="currentColor" />
                        </button>
                        {colors.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              if (activeTab.toLowerCase() === "background") {
                                dispatch(setproductCardbgColor(c));
                                saveCustomization({ main_color: c });
                              } else {
                                dispatch(setproductCardTextColor(c));
                              }
                            }}
                            style={{ backgroundColor: c }}
                            className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-105 ${
                              isSelectedCard(c)
                                ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                                : "border-black/10 dark:border-white/10 hover:scale-110"
                            }`}
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
                        <button
                          onClick={() => {
                            setCurrentButtonColor(getActiveButtonColor());
                            setShowButtonColorPicker(true);
                          }}
                          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 transition shadow-sm"
                          style={{
                            backgroundColor: getActiveButtonColor(),
                            color: getContrastColor(getActiveButtonColor()),
                          }}
                        >
                          <Pipette size={14} color="currentColor" />
                        </button>
                        {colors.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              if (buttonTab.toLowerCase() === "background") {
                                dispatch(setbuyBtnBgColor(c));
                                saveCustomization({ button_bg_color: c });
                              } else {
                                dispatch(setbuyBtnTextColor(c));
                                saveCustomization({ button_text_color: c });
                              }
                            }}
                            style={{ backgroundColor: c }}
                            className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-105 ${
                              isSelectedButton(c)
                                ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                                : "border-black/10 dark:border-white/10 hover:scale-110"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {showCardColorPicker && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                    <div className="relative">
                      <ColorPickerPopUp
                        currentColor={currentCardColor}
                        onSelect={(newColor) => {
                          setCurrentCardColor(newColor);
                          if (activeTab.toLowerCase() === "background") {
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
                          if (buttonTab.toLowerCase() === "background") {
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
              </>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
