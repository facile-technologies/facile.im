"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import LivePreview from "@/components/General-Profile/layout/LivePreview";
import { ChevronDown, PlusIcon } from "lucide-react";
import { ProductFileModal } from "./ProductFileModal";
import { ProductLinkModal } from "./ProductLinkModal";
import { ExternalLinkModal } from "./ExternalLinkModal";
import InventoryList from "./InventoryList";
import { ProductPreview } from "./ProductPreview";
import AddExternalProduct from "./AddExternalProduct";
import { createProduct, updateProduct } from "@/services/products";
import { showToast } from "@/store/utils/toast";

export default function ManageInventory() {
  const { register, handleSubmit, setValue, reset, watch } = useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [externalScreen, setExternalScreen] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [externalLinkModal, setExternalLinkModal] = useState(false);
  const [view, setView] = useState("list");
  const [productFiles, setProductFiles] = useState([]);
  const [productLinks, setProductLinks] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [externalUrl, setExternalUrl] = useState("");

  const FORM_DEFAULTS = {
    title: "",
    description: "",
    price: "",
    currency: "",
    cta: "Buy Now",
    successHeading: "Thank you for your purchase",
    successSubheading: "Hope you enjoy the product!",
  };

  // Return to the list view and clear any in-progress form state.
  const backToList = () => {
    setEditingProduct(null);
    setProductFiles([]);
    setProductLinks([]);
    setImageFile(null);
    setPreviewImage(null);
    reset(FORM_DEFAULTS);
    setView("list");
  };

  // Open a blank form to create a new digital product.
  const startAdd = () => {
    setEditingProduct(null);
    reset(FORM_DEFAULTS);
    setView("add");
  };

  // Open the form prefilled with an existing product's details for editing.
  const startEdit = (product) => {
    setEditingProduct(product);
    reset({
      title: product.title || "",
      description: product.description || "",
      price: product.priceValue ?? "",
      currency: product.currency || "",
      cta: product.ctaText || "Buy Now",
      successHeading: product.successHeading || "",
      successSubheading: product.successSubheading || "",
    });
    setView("add");
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      if (editingProduct) {
        // Edit mode — update scalar fields as JSON (PATCH /v1/products/:id).
        // File / link editing is not handled here yet.
        const payload = {
          title: data.title,
          description: data.description ?? "",
          price: data.price ?? "",
          currency: data.currency ?? "",
          cta_text: data.cta ?? "",
          success_heading: data.successHeading ?? "",
          success_subheading: data.successSubheading ?? "",
        };
        const res = await updateProduct(editingProduct.id, payload);
        if (res?.STATUS && res.STATUS !== "SUCCESS") {
          showToast("error", res.MESSAGE || "Failed to update product");
          return;
        }
        showToast("success", "Product updated");
      } else {
        const formData = new FormData();

        // REQUIRED
        formData.append("type", "DIGITAL");
        formData.append("title", data.title);

        // OPTIONAL
        if (data.description) formData.append("description", data.description);
        if (data.price) formData.append("price", data.price);
        if (data.currency) formData.append("currency", data.currency);
        if (data.cta) formData.append("cta_text", data.cta);
        if (data.successHeading)
          formData.append("success_heading", data.successHeading);
        if (data.successSubheading)
          formData.append("success_subheading", data.successSubheading);

        // FILE MODE
        productFiles.forEach((file) => {
          formData.append("productFile", file);
        });

        // LINK MODE
        if (productLinks.length > 0) {
          formData.append("files", JSON.stringify(productLinks));
        }

        // IMAGES
        if (imageFile) {
          formData.append("productImage", imageFile);
        }

        await createProduct(formData);
        showToast("success", "Product created");
      }

      backToList();
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        err.response?.data?.MESSAGE ||
          err.response?.data?.message ||
          "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };
  if (view === "list") {
    return (
      <div className="min-h-screen bg-[#262626] p-4 lg:p-10 text-white rounded-[10px]">
        <InventoryList
          onCreateNew={startAdd}
          onEdit={startEdit}
          setExternalLinkModal={setExternalLinkModal}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-8  w-full">
      {externalScreen ? (
        <AddExternalProduct externalUrl={externalUrl} setView={setView} />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-h-screen bg-white dark:bg-[#303030] p-6 text-black dark:text-white rounded-[10px] space-y-6 border border-[#C0C0C017] w-full"
        >
          <h2 className="text-2xl font-semibold">
            {editingProduct
              ? "Edit your Digital Product"
              : "Add your Digital Product"}
          </h2>

          {editingProduct && (
            <div className="p-4 border border-[#C0C0C017] rounded-2xl text-xs text-[#FFFFFFD9]">
              File &amp; link editing isn't available yet — update the product
              details below and save.
            </div>
          )}

          {/* FILE / LINK */}
          {!editingProduct && (
          <div className="flex justify-between p-4 border border-[#C0C0C017] rounded-2xl">
            <div>
              <h3 className="text-sm text-white font-medium">
                Add Product File
              </h3>
              <p className="text-xs text-[#FFFFFFD9] mt-1">
                Add at least one file or link to publish your product.
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-full bg-black! text-white! max-w-[131px]! w-full! justify-start! "
                asChild
              >
                <Button>
                  <ChevronDown className=" h-4 w-4" />
                  Add Product
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={"bg-[#3F3F3F]! text-white! w-[142px]! border-none! "}
              >
                <DropdownMenuItem
                  className={`border-b border-[#b4abab2e] rounded-none cursor-pointer flex items-center `}
                  onSelect={() => setFileModal(true)}
                >
                  <PlusIcon />
                  <span>Upload File</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`border-b border-[#b4abab2e] rounded-none cursor-pointer flex items-center `}
                  onSelect={() => setLinkModal(true)}
                >
                  <PlusIcon />
                  <span>Add a link</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          )}

          {/* TITLE */}
          <div className="p-4 border border-[#C0C0C017] rounded-2xl">
            <h3 className="text-sm text-white font-medium">Product Title</h3>
            <p className="text-xs text-[#FFFFFFD9] mt-1">
              Add title for your product.
            </p>
            <Input
              placeholder="Title"
              {...register("title")}
              className="bg-[#373636] border border-[#C0C0C040] rounded-[10px]! mt-2 w-full"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="p-4 border border-[#C0C0C017] rounded-2xl">
            <h3 className="text-sm text-white font-medium">
              Product Description
            </h3>
            <p className="text-xs text-[#FFFFFFD9] mt-1">
              Add description for your product.
            </p>
            <Input
              placeholder="Description"
              {...register("description")}
              className="bg-[#373636] border border-[#C0C0C040] rounded-[10px]! mt-2 w-full"
            />
          </div>

          {/* PRICE */}
          <div className="p-4 border border-[#C0C0C017] rounded-2xl space-y-3">
            <div className="flex justify-between">
              <div>
                <h3 className="text-sm text-white font-medium">
                  Product Price
                </h3>
                <p className="text-xs text-[#FFFFFFD9] mt-1">
                  Set price for your product.
                </p>
              </div>

              <Tabs
                defaultValue="facile-teams"
                className="max-w-2xs! w-full!  "
              >
                <TabsList className=" flex w-full! rounded-full bg-[#3F3F3F]! ">
                  <TabsTrigger
                    value="facile"
                    className="flex-1 rounded-full text-base!  data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-[#FFFFFF85]! "
                  >
                    Set Price
                  </TabsTrigger>
                  <TabsTrigger
                    value="facile-teams"
                    className="flex-1 rounded-full text-base! data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent!  text-[#FFFFFF85]! border-none! "
                  >
                    Mark as on sale
                  </TabsTrigger>
                </TabsList>

                {/* Content */}
                {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                           <div className="md:col-span-2">
                             <TabsContent value="email">
                               <InviteViaEmailForm setMembers={setMembers} />
                             </TabsContent>
               
                             <TabsContent value="csv">
                               <InviteViaCsvForm setMembers={setMembers} />
                             </TabsContent>
                           </div>
               
                           <MembersPreview members={members} setMembers={setMembers} />
                         </div> */}
              </Tabs>
            </div>

            <Select
              value={watch("currency") || ""}
              onValueChange={(val) => setValue("currency", val)}
            >
              <SelectTrigger className="bg-[#373636]! border-none w-full! text-[#FFFFFFCC]! h-[50px]! rounded-[10px]!">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent
                className={"bg-[#373636]! text-white!  border-none!"}
                position="end"
              >
                <SelectItem value="USD">USD</SelectItem>
                {/* <SelectItem value="PKR">PKR</SelectItem> */}
              </SelectContent>
            </Select>

            <Input
              placeholder="$"
              type={"number"}
              {...register("price")}
              className="bg-[#373636] border-none  rounded-[10px]!  w-full"
            />
          </div>

          {/* CTA */}
          <div className="p-4 border border-[#C0C0C017] rounded-2xl">
            <h3 className="text-sm text-white font-medium">CTA Button</h3>
            <p className="text-xs text-[#FFFFFFD9] mt-1">
              Update the text of CTA Button
            </p>
            <Input
              defaultValue="Buy Now"
              {...register("cta")}
              className="bg-[#373636] border border-[#C0C0C040] rounded-[10px]! mt-2 w-full"
            />
          </div>

          {/* SUCCESS MESSAGE */}
          <div className="p-4 border border-[#C0C0C017] rounded-2xl">
            <h3 className="text-sm text-white font-medium">
              Customize success screen message
            </h3>
            <div className="mt-1">
              <label className="text-xs text-[#FFFFFFD9] ">Heading</label>
              <Input
                defaultValue="Thank you for your purchase"
                {...register("successHeading")}
                className="bg-[#373636] border border-[#C0C0C040] rounded-[10px]! mt-1.5 w-full"
              />
            </div>
            <div className="mt-2">
              <label className="text-xs text-[#FFFFFFD9] ">Subheading</label>
              <Input
                defaultValue="Hope you enjoy the product!"
                {...register("successSubheading")}
                className="bg-[#373636] border border-[#C0C0C040] rounded-[10px]! mt-1.5 w-full"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={backToList}
              disabled={submitting}
              className="bg-transparent! border border-[#C0C0C040]! text-white! px-6! rounded-full! text-base! h-[41px]! "
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-black! text-white! px-6! rounded-full! text-base! min-w-[124px]! h-[41px]! "
            >
              {submitting
                ? "Saving..."
                : editingProduct
                  ? "Save changes"
                  : "Publish product"}
            </Button>
          </div>
        </form>
      )}
      {/* <ProductPreview /> */}
      <ProductFileModal
        open={fileModal}
        onOpenChange={setFileModal}
        onAdd={(data) => {
          if (data.image) {
            setImageFile(data.image); // ✅ image file
            setPreviewImage(data.preview);
          }

          if (data.file) {
            setProductFiles((prev) => [...prev, data.file]);
          }
        }}
      />
      <ProductLinkModal
        open={linkModal}
        onOpenChange={setLinkModal}
        onAdd={(link) => {
          setProductLinks((prev) => [...prev, link]);
        }}
      />
      <ExternalLinkModal
        open={externalLinkModal}
        onOpenChange={setExternalLinkModal}
        setExternalScreen={setExternalScreen}
        setExternalUrl={setExternalUrl}
      />
    </div>
  );
}
