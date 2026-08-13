import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  PlusCircle,
  Smartphone,
  ExternalLink,
  ChevronDown,
  PackageOpen,
  Inbox,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { getConnectStatus, getPaymentUIState } from "@/services/payment";
import { getProducts, mapProductToProfiles } from "@/services/products";
import { getUserProfiles } from "@/services/user";
import { showToast } from "@/store/utils/toast";

// Empty State View Component
const EmptyInventory = ({ onCreateNew }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in duration-700 bg-[#1a1a1a]/40 rounded-[40px] border border-dashed border-[#ffffff15] mx-4">
    <div className="bg-[#262626] p-8 rounded-full mb-8 shadow-2xl border border-[#ffffff05]">
      <PackageOpen className="w-16 h-16 text-gray-600" strokeWidth={1.5} />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">
      Your Inventory is empty
    </h3>
    <p className="text-gray-500 max-w-[320px] mb-10 font-medium leading-relaxed">
      You haven't added any products yet. Start your journey by creating your
      first digital product or link.
    </p>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white! hover:bg-gray-100! text-black! rounded-full px-12 h-14 font-bold flex items-center gap-3 shadow-2xl transition-all scale-105">
          <Plus className="w-6 h-6" />
          Add your first Product
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#303030]! text-white! border border-[#ffffff10] rounded-2xl overflow-hidden shadow-2xl p-2 w-[240px]">
        <DropdownMenuItem
          onClick={onCreateNew}
          className="cursor-pointer flex items-center gap-3 p-3 rounded-xl hover:bg-[#ffffff10] transition-colors group"
        >
          <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
            <Smartphone className="w-4 h-4 text-blue-400" />
          </div>
          <span className="font-semibold text-sm">Add Digital Product</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onCreateNew}
          className="cursor-pointer flex items-center gap-3 p-3 rounded-xl hover:bg-[#ffffff10] transition-colors group"
        >
          <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
            <ExternalLink className="w-4 h-4 text-accent" />
          </div>
          <span className="font-semibold text-sm">Add External Link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

const profiles = [
  {
    id: 1,
    name: "Person 1",
    type: "Business Profile",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  },
];

const InventoryList = ({ onCreateNew, setExternalLinkModal }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentUIState, setPaymentUIState] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [mappingProduct, setMappingProduct] = useState(false);
  const navigate = useNavigate();

  // Fetch products (extracted so it can be called after mapping too)
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setProductsError(null);
      const data = await getProducts();

      if (data.STATUS === "SUCCESS" && Array.isArray(data.DATA)) {
        // Format products for display
        const formattedProducts = data.DATA.map((product) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          price: `$${product.price}`,
          salePrice: product.sale_price ? `$${product.sale_price}` : null,
          isOnSale: product.is_on_sale,
          type:
            product.type === "DIGITAL" ? "Digital Product" : "External Link",
          image:
            product.image_url ||
            (product.type === "DIGITAL"
              ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D"
              : "https://plus.unsplash.com/premium_photo-1678739395192-bfdd13322d34?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFnfGVufDB8fDB8fHww"),
          productUrl: product.product_url,
          ctaText: product.cta_text,
          currency: product.currency,
          profiles: product.profiles || [], // Include mapped profiles
        }));
        setProducts(formattedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductsError("Failed to load products");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const isEmpty = products.length === 0;

  // Fetch payment status on component mount
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const statusData = await getConnectStatus();
        setPaymentStatus(statusData);
        setPaymentUIState(getPaymentUIState(statusData));
      } catch (error) {
        console.error("Error fetching payment status:", error);
      } finally {
        setLoadingPayment(false);
      }
    };

    fetchPaymentStatus();
  }, []);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setSelectedProfiles([]); // reset until profiles load
    fetchProfiles(product.profiles || []);
  };

  const fetchProfiles = async (alreadyMappedProfiles = []) => {
    try {
      setLoadingProfiles(true);
      const response = await getUserProfiles();

      const profilesData = response.data?.data || [];

      if (profilesData.length > 0) {
        const profileList = profilesData.map((profile) => ({
          id: profile.id,
          name: profile.name || profile.profile_name || "Unnamed Profile",
          type: profile.type || profile.profile_type || "Unknown",
          image:
            profile.image_url || profile.profile_image || profile.image || null,
        }));
        setProfiles(profileList);

        // Pre-select profiles that are already mapped to this product
        // Match product.profiles[].id against profileList[].id
        const mappedIds = alreadyMappedProfiles.map((p) => p.id);
        const preSelected = profileList
          .filter((p) => mappedIds.includes(p.id))
          .map((p) => p.id);
        setSelectedProfiles(preSelected);
      } else {
        setProfiles([]);
        setSelectedProfiles([]);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      showToast("error", "Failed to load profiles");
      setProfiles([]);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const toggleProfileSelection = (profileId) => {
    setSelectedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId],
    );
  };

  const handleAddProduct = async () => {
    if (selectedProfiles.length === 0) {
      showToast("error", "Please select at least one profile");
      return;
    }

    try {
      setMappingProduct(true);
      const response = await mapProductToProfiles(
        selectedProduct.id,
        selectedProfiles,
      );

      if (response.STATUS === "SUCCESS") {
        showToast("success", "Product mapped to profiles successfully!");
        setIsModalOpen(false);
        setSelectedProfiles([]);
        // Re-fetch products so profiles mapping is up to date
        fetchProducts();
      } else {
        showToast("error", response.MESSAGE || "Failed to map product");
      }
    } catch (error) {
      console.error("Error mapping product:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to map product",
      );
    } finally {
      setMappingProduct(false);
    }
  };

  const handleSetupPayments = async () => {
    // Will be handled in PaymentSettings page
    navigate("/payment-settings");
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-500">
      {/* Setup Payments Banner - Only show when products exist */}
      {!isEmpty && (
        <div className="bg-[#111111] border border-[#ffffff08] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {paymentUIState?.label || "Setup Payments"}
            </h2>
            <p className="text-sm text-gray-400 font-medium">
              {paymentUIState?.description ||
                "Set up your payment methods to sell your products"}
            </p>
          </div>
          <Button
            onClick={handleSetupPayments}
            className="bg-white! hover:bg-gray-100! text-black! rounded-full px-10 h-11 font-bold transition-all shadow-md"
            disabled={loadingPayment}
          >
            {paymentUIState?.buttonText || "Setup Payments"}
          </Button>
        </div>
      )}

      {/* Manage Inventory Header */}
      {!isEmpty && (
        <div className="flex items-center justify-between gap-4 px-1">
          <h1 className="text-2xl font-bold text-white">Manage Inventory</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-black! hover:bg-black/80! text-white! rounded-full px-8 h-11 font-bold flex items-center gap-2 border border-[#ffffff10] shadow-xl">
                <Plus className="w-5 h-5" />
                Create new Product
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#303030]! text-white! border border-[#ffffff10] rounded-2xl overflow-hidden shadow-2xl p-2 w-[220px]">
              <DropdownMenuItem
                onClick={onCreateNew}
                className="cursor-pointer flex items-center gap-3 p-3 rounded-xl hover:bg-[#ffffff10] transition-colors group"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-semibold text-sm">
                  Add Digital Product
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  onCreateNew();
                  setExternalLinkModal(true);
                }}
                className="cursor-pointer flex items-center gap-3 p-3 rounded-xl hover:bg-[#ffffff10] transition-colors group"
              >
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <ExternalLink className="w-4 h-4 text-accent" />
                </div>
                <span className="font-semibold text-sm">Add External Link</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Main Content Area */}
      {loadingProducts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-[#3F3F3F] rounded-[24px] overflow-hidden border border-transparent"
            >
              <div className="h-[240px] bg-gradient-to-r from-[#4F4F4F] via-[#5F5F5F] to-[#4F4F4F] bg-[length:200%_100%] animate-shimmer" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gradient-to-r from-[#4F4F4F] via-[#5F5F5F] to-[#4F4F4F] bg-[length:200%_100%] animate-shimmer rounded-md" />
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-[#4F4F4F] via-[#5F5F5F] to-[#4F4F4F] bg-[length:200%_100%] animate-shimmer rounded-md w-3/4" />
                  <div className="h-4 bg-gradient-to-r from-[#4F4F4F] via-[#5F5F5F] to-[#4F4F4F] bg-[length:200%_100%] animate-shimmer rounded-md w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : productsError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 font-semibold">{productsError}</p>
        </div>
      ) : isEmpty ? (
        <EmptyInventory onCreateNew={onCreateNew} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-[#3F3F3F] rounded-[24px] overflow-hidden shadow-2xl border border-transparent hover:border-[#ffffff10] transition-all duration-300"
            >
              <div className="relative h-[240px] w-full overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.isOnSale && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    On Sale
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#3F3F3F99] backdrop-blur-md text-[10px] font-bold text-white px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                    {product.type}
                  </span>
                </div>
                <div className="absolute top-14 right-4">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="bg-white rounded-full p-1 shadow-lg transform transition-transform hover:scale-110 active:scale-90 text-black outline-none border-none cursor-pointer"
                  >
                    <PlusCircle
                      className="w-6 h-6 fill-white"
                      strokeWidth={1}
                    />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white truncate">
                    {product.title}
                  </h3>
                  <div className="flex flex-col items-end shrink-0">
                    {product.isOnSale && product.salePrice ? (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          {product.price}
                        </span>
                        <span className="text-lg font-bold text-green-400">
                          {product.salePrice}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-white">
                        {product.price}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Your Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="bg-[#303030]! border-none! text-white! max-w-[480px]! rounded-[32px]! p-8 shadow-2xl"
          closeButtonClassName="!text-white opacity-100! bg-transparent! hover:bg-transparent!"
        >
          <DialogHeader className="">
            <DialogTitle className="text-xl font-bold text-white">
              Add your product
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="bg-[#3F3F3F] rounded-3xl overflow-hidden mb-8 border border-[#ffffff08] shadow-lg">
              <div className="relative h-[220px]">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#3F3F3F99] backdrop-blur-md text-[9px] font-bold text-white px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                    {selectedProduct.type}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base font-bold text-white">
                    {selectedProduct.title}
                  </h3>
                  <span className="text-base font-bold text-white">
                    {selectedProduct.price}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  {selectedProduct.description}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white px-1">
              Select Profiles to Map
            </h4>

            {loadingProfiles ? (
              <div className="space-y-2 max-h-[300px]">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-[#262626] rounded-lg border border-[#ffffff08]"
                  >
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-[#4F4F4F] via-[#5F5F5F] to-[#4F4F4F] bg-[length:200%_100%] animate-shimmer" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4F4F4F] via-[#5F5F5F] to-[#4F4F4F] bg-[length:200%_100%] animate-shimmer" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gradient-to-r from-[#4F4F4F] via-[#5F5F5F] to-[#4F4F4F] bg-[length:200%_100%] animate-shimmer rounded-md w-1/2" />
                      <div className="h-3 bg-gradient-to-r from-[#4F4F4F] via-[#5F5F5F] to-[#4F4F4F] bg-[length:200%_100%] animate-shimmer rounded-md w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : profiles.length === 0 ? (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-400">
                  No profiles found. Create a profile first.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {profiles.map((profile) => {
                  const isSelected = selectedProfiles.includes(profile.id);
                  return (
                    <label
                      key={profile.id}
                      onClick={() => toggleProfileSelection(profile.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 group
                        ${
                          isSelected
                            ? "bg-white/10 border-white/40 shadow-lg shadow-white/10"
                            : "bg-[#262626] border-[#ffffff08] hover:border-[#ffffff15] hover:bg-[#2d2d2d]"
                        }
                      `}
                    >
                      {/* Custom Checkbox */}
                      <div
                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
                          ${
                            isSelected
                              ? "bg-white border-white shadow-lg shadow-white/30"
                              : "border-[#ffffff30] group-hover:border-[#ffffff50]"
                          }
                        `}
                      >
                        {isSelected && (
                          <Check
                            className="w-3.5 h-3.5 text-black animate-in fade-in zoom-in duration-200"
                            strokeWidth={3}
                          />
                        )}
                      </div>

                      {/* Profile Info */}
                      <div className="flex items-center gap-3 flex-1">
                        {profile.image ? (
                          <img
                            src={profile.image}
                            alt={profile.name}
                            className={`w-9 h-9 rounded-full object-cover transition-all duration-200
                              ${isSelected ? "ring-2 ring-white/60 ring-offset-1 ring-offset-[#303030]" : "border border-white/10"}
                            `}
                          />
                        ) : (
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-accent flex items-center justify-center text-xs font-bold text-white transition-all duration-200
                              ${isSelected ? "ring-2 ring-white/60 ring-offset-1 ring-offset-[#303030]" : ""}
                            `}
                          >
                            {profile.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col flex-1">
                          <span className="text-sm font-semibold text-white">
                            {profile.name}
                          </span>
                          <span
                            className={`text-[10px] uppercase transition-colors duration-200 ${isSelected ? "text-white/60" : "text-gray-500"}`}
                          >
                            {profile.type}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setIsModalOpen(false)}
              disabled={mappingProduct}
              className="bg-white! hover:bg-gray-100! text-black! rounded-full h-11 px-8 font-bold shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddProduct}
              disabled={
                mappingProduct ||
                selectedProfiles.length === 0 ||
                loadingProfiles
              }
              className="bg-black! hover:bg-zinc-800! text-white! rounded-full h-11 px-8 font-bold shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              {mappingProduct ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>Add</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryList;
