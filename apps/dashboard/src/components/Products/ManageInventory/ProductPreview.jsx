import React from "react";
import { Button } from "@/components/ui/button";

export const ProductPreview = () => {
  return (
    <div className="bg-zinc-900 text-white rounded-2xl p-4 w-full max-w-sm shadow-lg h-fit">
      {/* Image */}
      <div className="w-full h-56 rounded-xl overflow-hidden mb-4">
        <img
        
          alt="product"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title + Price */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Product Name</h3>
        <span className="text-lg font-semibold">$5</span>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 leading-relaxed mb-4">
        This product includes everything you need to get started right away.
        It’s designed to offer clear value, easy access, and a smooth experience
        for anyone who purchases it. All details, features, and delivery
        instructions will be provided instantly after checkout.
      </p>

      {/* Button */}
      <Button className="rounded-full bg-black text-white hover:bg-zinc-800">
        Buy Now
      </Button>
    </div>
  );
};
