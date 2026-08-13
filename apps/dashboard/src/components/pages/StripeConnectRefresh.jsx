import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { getRefreshLink } from "@/services/payment";

const StripeConnectRefresh = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const handleRefresh = async () => {
      try {
        // Get refresh link from backend
        const data = await getRefreshLink();

        if (data.onboarding_url) {
          // Auto-redirect to Stripe onboarding
          window.location.href = data.onboarding_url;
        } else {
          setStatus("success");
        }
      } catch (error) {
        setStatus("error");
        console.error("Stripe Connect refresh error:", error);
      }
    };

    handleRefresh();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#262626] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="bg-[#303030] border border-[#ffffff10] rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader className="w-12 h-12 text-blue-500 animate-spin" />
            <h2 className="text-xl font-bold text-white">
              Redirecting to Stripe
            </h2>
            <p className="text-sm text-gray-400 text-center">
              Please wait while we prepare your setup...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <h2 className="text-xl font-bold text-white">All Set!</h2>
            <p className="text-sm text-gray-400 text-center">
              Your Stripe account is ready to go.
            </p>
            <button
              onClick={() => navigate("/payment-settings")}
              className="mt-6 w-full bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-full transition-all"
            >
              Back to Payment Settings
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-white">Error</h2>
            <p className="text-sm text-gray-400 text-center">
              An error occurred. Please try again.
            </p>
            <button
              onClick={() => navigate("/payment-settings")}
              className="mt-6 w-full bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-full transition-all"
            >
              Back to Payment Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeConnectRefresh;
