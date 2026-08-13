import React from "react";
import { XCircle } from "lucide-react";

export default function PurchaseCancel() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#1A1A1A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="bg-white dark:bg-[#2A2A2A] rounded-3xl p-10 max-w-md w-full shadow-2xl relative z-10 border border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-200 dark:border-red-500/30">
          <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-black dark:text-white mb-3 tracking-tight">
          Payment cancelled.
        </h1>

        <p className="text-gray-500 dark:text-gray-300 font-medium text-sm leading-relaxed">
          You can try again anytime.
        </p>
      </div>
    </div>
  );
}
