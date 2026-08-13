"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, PlusIcon } from "lucide-react";

import { ProductPreview } from "./ProductPreview";
import { createProduct } from "@/services/products";

export default function AddExternalProduct({ externalUrl,setView }) {
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // REQUIRED
      formData.append("type", "EXTERNAL");
      formData.append("title", data.title);

      // REQUIRED (for external)
      formData.append("product_url", data.product_url);

      // OPTIONAL
      if (data.description) formData.append("description", data.description);
      if (data.price) formData.append("price", data.price);
      if (data.currency) formData.append("currency", data.currency);

      // IMAGE (optional)
      if (data.productImage?.[0]) {
        formData.append("productImage", data.productImage[0]);
      }

      await createProduct(formData);
       setView("list");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-8  w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen bg-white dark:bg-[#303030] p-6 text-black dark:text-white rounded-[10px] space-y-6 border border-[#C0C0C017] w-full"
      >
        <h2 className="text-2xl font-semibold">Add your External Product</h2>

        {/* FILE / LINK */}
        <div className="flex justify-between p-4 border border-[#C0C0C017] rounded-2xl">
          <div>
            <h3 className="text-sm text-white font-medium">Add Product File</h3>
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
                // onSelect={() => setFileModal(true)}
              >
                <PlusIcon />
                <span>Upload File</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`border-b border-[#b4abab2e] rounded-none cursor-pointer flex items-center `}
                // onSelect={() => setLinkModal(true)}
              >
                <PlusIcon />
                <span>Add a link</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* URL & TITLE */}
        <div className="flex  gap-7 p-4 border border-[#C0C0C017] rounded-2xl">
          {/* URL */}
          <div className="w-full">
            <div>
              <h3 className="text-sm text-white font-medium">Product URL</h3>
              <p className="text-xs text-[#FFFFFFD9] mt-1">
                Add url of your product.
              </p>
            </div>
            <Input
              defaultValue={externalUrl}
              placeholder="https://www.linkedin.com/"
              {...register("url")}
              className="bg-[#373636] border border-[#C0C0C040] rounded-[10px]! mt-2 w-full"
            />
          </div>
          {/* TITLE */}
          <div className="w-full">
            <div>
              <h3 className="text-sm text-white font-medium">Product Title</h3>
              <p className="text-xs text-[#FFFFFFD9] mt-1">
                Add title for your product.
              </p>
            </div>
            <Input
              placeholder="Title"
              {...register("title")}
              className="bg-[#373636] border border-[#C0C0C040] rounded-[10px]! mt-2 w-full"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="w-full p-4 border border-[#C0C0C017] rounded-2xl">
          <div>
            <h3 className="text-sm text-white font-medium">
              Product Description
            </h3>
            <p className="text-xs text-[#FFFFFFD9] mt-1">
              Add description for your product.
            </p>
          </div>
          <Input
            placeholder="Description"
            {...register("description")}
            className="bg-[#373636] border border-[#C0C0C040] rounded-[10px]! mt-2 w-full"
          />
        </div>

        {/* PRICE */}
        <div className="p-4 border border-[#C0C0C017] rounded-2xl space-y-3">
          <div>
            <h3 className="text-sm text-white font-medium">Product Price</h3>
            <p className="text-xs text-[#FFFFFFD9] mt-1">
              Set price for your product.
            </p>
          </div>
          <div className="flex gap-7">
            <Select onValueChange={(val) => setValue("currency", val)}>
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
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-black! text-white! px-6! rounded-full! text-base! w-[124px]! h-[41px]! "
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
