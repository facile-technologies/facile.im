import React from "react";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BillingCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#1A1A1A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-red-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="bg-white dark:bg-[#2A2A2A] rounded-3xl p-10 max-w-md w-full shadow-2xl relative z-10 border border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-200 dark:border-red-500/30">
          <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2 tracking-tight">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 font-medium text-sm mb-8 leading-relaxed opacity-90">
          Your checkout process was cancelled. You haven't been charged. You can resume your upgrade whenever you're ready.
        </p>

        <div className="w-full flex tracking-tight flex-col gap-3">
          <button
            onClick={() => navigate("/pricing-plan")}
            className="w-full h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-base hover:opacity-90 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg"
          >
           <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
          <button
            onClick={() => navigate("/home")}
            className="w-full h-14 bg-gray-100 dark:bg-[#1A1A1A] text-gray-800 dark:text-gray-200 rounded-2xl font-bold text-base border border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-[#333333] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
