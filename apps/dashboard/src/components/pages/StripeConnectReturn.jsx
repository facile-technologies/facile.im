import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { getConnectStatus } from "@/services/payment";

const StripeConnectReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleStripeReturn = async () => {
      try {
        // Small delay to allow backend to process Stripe callback
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check updated status
        const statusData = await getConnectStatus();

        if (statusData.is_active) {
          setStatus("success");
          setMessage("Your Stripe account is ready! You can now accept payments.");
        } else {
          setStatus("pending");
          setMessage(
            "Setup is still pending. Stripe may take a moment to verify your details."
          );
        }

        // Redirect to payment settings after 2 seconds
        setTimeout(() => {
          navigate("/payment-settings");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred while checking your account status");
        console.error("Stripe Connect return error:", error);
      }
    };

    handleStripeReturn();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#262626] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="bg-[#303030] border border-[#ffffff10] rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader className="w-12 h-12 text-blue-500 animate-spin" />
            <h2 className="text-xl font-bold text-white">
              Checking Your Account
            </h2>
            <p className="text-sm text-gray-400 text-center">
              Please wait while we verify your Stripe account...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <h2 className="text-xl font-bold text-white">Success!</h2>
            <p className="text-sm text-gray-400 text-center">{message}</p>
            <p className="text-xs text-gray-500">
              Redirecting to payment settings...
            </p>
          </div>
        )}

        {status === "pending" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="w-12 h-12 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">Setup In Progress</h2>
            <p className="text-sm text-gray-400 text-center">{message}</p>
            <p className="text-xs text-gray-500">
              Redirecting to payment settings...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-white">Error</h2>
            <p className="text-sm text-gray-400 text-center">{message}</p>
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

export default StripeConnectReturn;
