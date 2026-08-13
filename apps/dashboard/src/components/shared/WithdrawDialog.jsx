import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { requestWithdraw } from "@/services/user";

const WithdrawDialog = ({ open, onOpenChange, availableEntry, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Reset state every time the dialog opens
  useEffect(() => {
    if (open) {
      setAmount("");
      setSubmitting(false);
      setSuccess(null);
      setError(null);
    }
  }, [open]);

  const currency = availableEntry?.currency?.toLowerCase() || "usd";
  const currencyDisplay = (availableEntry?.currency || "USD").toUpperCase();
  const availableAmount = availableEntry ? Number(availableEntry.amount).toFixed(2) : "0.00";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const body = { currency };
    if (amount.trim() !== "") {
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed <= 0) {
        setError("Please enter a valid amount greater than 0.");
        return;
      }
      body.amount = parsed;
    }

    setSubmitting(true);
    try {
      const res = await requestWithdraw(body);
      if (res.data?.STATUS === "SUCCESS") {
        setSuccess(res.data.data);
        onSuccess?.();
      } else {
        setError(res.data?.MESSAGE || "Withdrawal failed. Please try again.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.MESSAGE || "Withdrawal failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const arrivalDate = success?.arrival_date
    ? new Date(success.arrival_date * 1000).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="rounded-3xl bg-[#1f1f1f] text-white border-none max-w-[420px] p-0 overflow-hidden"
      >
        {/* ── Header ── */}
        <div className="bg-[#2C2C2C] px-8 py-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-accent/15 p-2.5 rounded-xl">
              <Wallet className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Withdraw Funds</h2>
              <p className="text-xs text-gray-400 mt-0.5">Instant payout to your debit card</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-white transition p-1 bg-transparent rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-8 py-7">
          {success ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center text-center gap-5">
              <div className="bg-green-500/15 p-4 rounded-full">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Payout Initiated!</p>
                <p className="text-sm text-gray-400 mt-1">
                  {currencyDisplay} {Number(success.amount).toFixed(2)} is on its way
                </p>
              </div>
              <div className="w-full bg-[#2C2C2C] rounded-2xl p-4 space-y-3 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payout ID</span>
                  <span className="text-white font-mono text-xs truncate max-w-[180px]">
                    {success.payout_id}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Method</span>
                  <span className="text-white capitalize">{success.method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span
                    className={`capitalize font-semibold ${
                      success.status === "paid" ? "text-green-400" : "text-blue-400"
                    }`}
                  >
                    {success.status}
                  </span>
                </div>
                {arrivalDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Arrives</span>
                    <span className="text-white">{arrivalDate}</span>
                  </div>
                )}
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="w-full bg-[#3F3F3F] hover:bg-[#4A4A4A] text-white rounded-full h-12 font-semibold"
              >
                Done
              </Button>
            </div>
          ) : (
            /* ── Form State ── */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Available balance display */}
              <div className="bg-[#2C2C2C] rounded-2xl p-4 flex items-center justify-between">
                <p className="text-sm text-gray-400">Available Balance</p>
                <p className="text-base font-bold text-white">
                  {currencyDisplay} {availableAmount}
                </p>
              </div>

              {/* Amount input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Amount{" "}
                  <span className="text-gray-600 normal-case font-normal">
                    (leave empty to withdraw full balance)
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm pointer-events-none">
                    {currencyDisplay}
                  </span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={availableAmount}
                    className="w-full bg-[#2C2C2C] border border-white/10 focus:border-accent/50 outline-none rounded-xl h-12 pl-14 pr-4 text-white text-sm placeholder-gray-600 transition-colors"
                  />
                </div>
              </div>

              {/* Error banner */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent hover:opacity-90 text-white rounded-full h-12 font-bold transition-all shadow-lg shadow-accent/30"
              >
                {submitting ? "Processing..." : "Withdraw Funds"}
              </Button>
              <p className="text-center text-xs text-gray-500">
                Instant payouts typically arrive within minutes.
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawDialog;
