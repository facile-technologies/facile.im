import React, { useEffect, useState, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const REDIRECT_DELAY = 5; // seconds

export default function PurchaseSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(REDIRECT_DELAY);
  const [profilePath, setProfilePath] = useState("/");
  const timerRef = useRef(null);

  const heading =
    searchParams.get("heading") || "Thank you! Check your email for your purchase details.";
  const subheading = searchParams.get("subheading") || "";

  useEffect(() => {
    // Move pending purchase from sessionStorage to localStorage
    try {
      const pending = sessionStorage.getItem("pendingPurchase");
      if (pending) {
        const purchaseInfo = JSON.parse(pending);
        if (purchaseInfo.profilePath) setProfilePath(purchaseInfo.profilePath);
        const existing = JSON.parse(localStorage.getItem("purchasedProducts") || "[]");
        const alreadyExists = existing.some((p) => p.productId === purchaseInfo.productId);
        if (!alreadyExists) {
          existing.push({ ...purchaseInfo, purchasedAt: Date.now() });
          localStorage.setItem("purchasedProducts", JSON.stringify(existing));
        }
        sessionStorage.removeItem("pendingPurchase");
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          navigate(profilePath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [profilePath, navigate]);

  const handleGoNow = () => {
    clearInterval(timerRef.current);
    navigate(profilePath);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#1A1A1A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-green-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="bg-white dark:bg-[#2A2A2A] rounded-3xl p-10 max-w-md w-full shadow-2xl relative z-10 border border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-200 dark:border-green-500/30">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-2xl font-bold text-black dark:text-white mb-3 tracking-tight leading-snug">
          {heading}
        </h1>

        {subheading && (
          <p className="text-gray-500 dark:text-gray-300 font-medium text-sm leading-relaxed mb-2">
            {subheading}
          </p>
        )}

        <p className="text-gray-400 dark:text-gray-500 text-xs mt-6 mb-4">
          Redirecting to your profile in <span className="font-black text-black dark:text-white">{countdown}s</span>...
        </p>

        <button
          onClick={handleGoNow}
          className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-black rounded-2xl text-sm hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Go to Profile Now
        </button>
      </div>
    </div>
  );
}
