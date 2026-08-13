
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import {
  getConnectStatus,
  startConnectOnboarding,
  getPaymentUIState,
} from "@/services/payment";

const PaymentSettings = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentUIState, setPaymentUIState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setupInProgress, setSetupInProgress] = useState(false);

  // Fetch payment status on mount
  useEffect(() => {
    fetchPaymentStatus();
  }, []);

  const fetchPaymentStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const statusData = await getConnectStatus();
      setPaymentStatus(statusData);
      setPaymentUIState(getPaymentUIState(statusData));
    } catch (err) {
      setError("Failed to load payment status. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    try {
      setSetupInProgress(true);
      setError(null);
      const data = await startConnectOnboarding();

      if (data.is_active) {
        // Already active - refresh status
        fetchPaymentStatus();
      } else if (data.onboarding_url) {
        // Redirect to Stripe onboarding
        window.location.href = data.onboarding_url;
      }
    } catch (err) {
      setError("Failed to start Stripe onboarding. Please try again.");
      console.error(err);
      setSetupInProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#262626] p-10 rounded-[10px]">
      <div className="mb-14 px-4 text-left">
        <h1 className="text-2xl font-bold mb-2 text-white">Payment Settings</h1>
        <p className="text-sm text-gray-400 font-medium">
          Manage your payment methods and Stripe account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        {/* Stripe Connect Card */}
        <Card className="bg-[#303030] border border-[#ffffff10] rounded-[24px] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Stripe Connect
              </h2>
              <p className="text-sm text-gray-400">
                Accept payments from customers worldwide
              </p>
            </div>
            <CreditCard className="w-10 h-10 text-blue-500" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Status Badge */}
          {paymentStatus && (
            <div className="mb-8">
              {paymentUIState?.state === "ACTIVE" && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-400">
                      Account Active
                    </p>
                    <p className="text-xs text-green-400/70">
                      Your Stripe account is ready to receive payments
                    </p>
                  </div>
                </div>
              )}

              {paymentUIState?.state === "PENDING" && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-400">
                      Setup In Progress
                    </p>
                    <p className="text-xs text-yellow-400/70">
                      Complete your Stripe account setup to enable payments
                    </p>
                  </div>
                </div>
              )}

              {paymentUIState?.state === "NO_ACCOUNT" && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-400">
                      Not Connected
                    </p>
                    <p className="text-xs text-blue-400/70">
                      Connect your Stripe account to start selling
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-gray-400 text-sm">Loading payment settings...</p>
              </div>
            </div>
          )}

          {/* Account Details (if active) */}
          {!loading && paymentUIState?.state === "ACTIVE" && paymentStatus && (
            <div className="bg-[#262626] rounded-lg p-4 mb-8 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Charges Enabled</span>
                <span
                  className={`text-sm font-semibold ${
                    paymentStatus.charges_enabled
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {paymentStatus.charges_enabled ? "✓ Yes" : "✗ No"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Payouts Enabled</span>
                <span
                  className={`text-sm font-semibold ${
                    paymentStatus.payouts_enabled
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {paymentStatus.payouts_enabled ? "✓ Yes" : "✗ No"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Account Status</span>
                <span className="text-sm font-semibold text-white uppercase tracking-wide">
                  {paymentStatus.account_status}
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!loading && paymentUIState?.buttonText && (
            <Button
              onClick={handleConnectStripe}
              disabled={setupInProgress}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 font-bold flex items-center justify-center gap-2 transition-all"
            >
              {setupInProgress ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  {paymentUIState.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}

          {!loading && paymentUIState?.state === "ACTIVE" && (
            <Button
              onClick={handleConnectStripe}
              variant="outline"
              className="w-full bg-transparent border border-[#ffffff20] text-white hover:bg-[#ffffff05] rounded-full h-12 font-bold transition-all"
            >
              Manage Account
            </Button>
          )}
        </Card>

        {/* Information Card */}
        <Card className="bg-[#303030] border border-[#ffffff10] rounded-[24px] p-8 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-6">How It Works</h3>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Connect Your Stripe Account
                </h4>
                <p className="text-xs text-gray-400">
                  Link your Stripe account to start accepting payments from customers
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Set Up Your Products
                </h4>
                <p className="text-xs text-gray-400">
                  Add your digital products or services with pricing information
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Start Selling
                </h4>
                <p className="text-xs text-gray-400">
                  Your customers can now purchase your products and you receive payments instantly
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#ffffff10]">
            <p className="text-xs text-gray-500 mb-4">
              Questions? Check out Stripe's documentation:
            </p>
            <a
              href="https://stripe.com/docs/connect"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              Learn more about Stripe Connect
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSettings;
