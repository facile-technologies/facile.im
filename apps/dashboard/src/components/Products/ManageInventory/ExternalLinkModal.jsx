import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ExternalLinkModal = ({
  open,
  onOpenChange,
  setExternalScreen,
  setExternalUrl
}) => {
  const { register, handleSubmit } = useForm();

const onSubmit = (data) => {
  setExternalUrl(data.product_url); // 👈 SAVE URL
  onOpenChange(false);
  setExternalScreen(true);
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
              Add External Link
            </DialogTitle>
            <p className="text-sm text-[#C4C4C4]">
              Enter the URL of any product to sell.
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

        <div className="relative w-full  mt-7">
          {/* Floating Label */}
          <label className="absolute -top-2 left-4 px-2 text-xs text-gray-300 bg-[#252525] rounded-full">
            Product URL
          </label>

          <Input
            {...register("product_url")}
            placeholder="https://www.linkedin.com/"
            className="
          h-14
          rounded-full
          w-full
          border
          border-white
          text-white
          placeholder:text-gray-400
          focus-visible:ring-0
          focus-visible:ring-offset-0
          focus:border-white
        "
          />
        </div>

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
            Add Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
