
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ArrowUpRight, Calendar, ReceiptText } from "lucide-react";
import { getBalance, getTransactions } from "@/services/user";
import WithdrawDialog from "@/components/shared/WithdrawDialog";

const statusStyles = {
  complete:   "bg-[#1C2C1C] text-[#4ADE80]",
  pending:    "bg-[#1C242C] text-[#60A5FA]",
  failed:     "bg-[#2C1C1C] text-[#F87171]",
};

function BalanceSkeleton() {
  return (
    <div className="bg-[#3F3F3F] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between mb-12 gap-4 shadow-sm animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-36 rounded bg-[#4F4F4F]" />
        <div className="h-7 w-24 rounded bg-[#4F4F4F]" />
      </div>
      <div className="h-12 w-36 rounded-full bg-[#4F4F4F]" />
    </div>
  );
}

function SkeletonRow({ alt }) {
  return (
    <div className={`grid grid-cols-5 gap-4 items-center p-4 px-6 rounded-2xl ${alt ? "bg-[#3F3F3F]" : "bg-transparent"}`}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`h-4 rounded-md bg-linear-to-r from-[#4F4F4F] via-[#5A5A5A] to-[#4F4F4F] bg-size-[200%_100%] animate-shimmer ${i === 4 ? "ml-auto w-16" : "w-3/4"}`}
        />
      ))}
    </div>
  );
}

const LIMIT = 10;

const TransactionsHistory = () => {
  const navigate = useNavigate();

  // Balance state
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchBalance = () => {
    setBalanceLoading(true);
    getBalance()
      .then((res) => {
        if (res.data?.STATUS === "SUCCESS") setBalance(res.data.data);
      })
      .catch(() => {})
      .finally(() => setBalanceLoading(false));
  };

  // Fetch balance
  useEffect(() => {
    fetchBalance();
  }, []);

  // Fetch transactions (cursor-based)
  const fetchTransactions = useCallback(async (afterCursor = null, reset = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setTxLoading(true);
    setError(null);
    try {
      const res = await getTransactions(LIMIT, afterCursor);
      const result = res.data;
      if (result.STATUS === "SUCCESS") {
        setTransactions((prev) => reset ? result.data : [...prev, ...result.data]);
        setHasMore(result.pagination?.has_more ?? false);
        setCursor(result.pagination?.next_cursor ?? null);
      } else {
        setError("Failed to load transactions.");
      }
    } catch {
      setError("Failed to load transactions.");
    } finally {
      setTxLoading(false);
      setInitialLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTransactions(null, true);
  }, [fetchTransactions]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current && hasMore && cursor) {
          fetchTransactions(cursor, false);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, cursor, fetchTransactions]);

  // Balance display
  const availableEntry = balance?.available?.[0];
  const availableAmount = availableEntry
    ? `${availableEntry.currency?.toUpperCase()} ${Number(availableEntry.amount).toFixed(2)}`
    : "—";
  const pendingEntry = balance?.pending?.[0];
  const pendingAmount = pendingEntry
    ? `${pendingEntry.currency?.toUpperCase()} ${Number(pendingEntry.amount).toFixed(2)}`
    : null;

  return (
    <div className="min-h-screen bg-[#262626] p-10 text-white rounded-[10px]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full transition-all bg-transparent!"
        >
          <ArrowLeft className="w-8 h-8 text-white" />
        </button>
        <h1 className="text-2xl font-bold">Transaction History</h1>
      </div>

      {/* Balance Section */}
      {balanceLoading ? (
        <BalanceSkeleton />
      ) : (
        <div className="bg-[#3F3F3F] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between mb-12 gap-4 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-400">Available Balance</p>
            <p className="text-2xl font-bold text-white mt-1">{availableAmount}</p>
            {pendingAmount && (
              <p className="text-xs text-[#FFFFFF60] mt-1">{pendingAmount}  ( Waiting for approval from stripe )</p>
            )}
          </div>
          <Button
            onClick={() => setShowWithdraw(true)}
            className="bg-black! hover:bg-black/90! text-white! rounded-full px-12 h-12 font-bold transition-all shadow-md"
          >
            Withdraw Amount
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="w-full px-2">
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 mb-4 px-6">
          <div className="text-sm font-medium text-[#FFFFFF99]">Transaction ID</div>
          <div className="text-sm font-medium text-[#FFFFFF99]">Transaction Type</div>
          <div className="text-sm font-medium text-[#FFFFFF99]">Date</div>
          <div className="text-sm font-medium text-[#FFFFFF99] text-center">Status</div>
          <div className="text-sm font-medium text-[#FFFFFF99] text-right">Amount</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-3">
          {initialLoading ? (
            [...Array(8)].map((_, i) => <SkeletonRow key={i} alt={i % 2 === 0} />)
          ) : error ? (
            <div className="text-center py-16 text-red-400 font-semibold">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#FFFFFF40]">
              <ReceiptText size={48} strokeWidth={1.2} />
              <p className="text-sm font-semibold">No transactions found</p>
            </div>
          ) : (
            transactions.map((tx, idx) => {
              const isCredit = Number(tx.amount) >= 0;
              const statusKey = (tx.status || "").toLowerCase();
              const badgeClass = statusStyles[statusKey] || "bg-[#2C2C2C] text-white";
              const formattedDate = tx.date
                ? new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "—";
              const amountDisplay = `${isCredit ? "+" : ""}${(tx.currency || "USD").toUpperCase()} ${Number(tx.amount).toFixed(2)}`;
              const netDisplay = tx.net != null
                ? `Net: ${(tx.currency || "USD").toUpperCase()} ${Number(tx.net).toFixed(2)}`
                : null;

              return (
                <div
                  key={tx.transaction_id ?? idx}
                  className={`grid grid-cols-5 gap-4 items-center transition-colors rounded-2xl p-4 px-6 ${
                    idx % 2 === 0 ? "bg-[#3F3F3F] shadow-sm" : "bg-transparent"
                  }`}
                >
                  <div className="text-sm font-medium text-[#FFFFFF99] truncate">
                    {tx.transaction_id || "—"}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full shrink-0 ${isCredit ? "bg-green-500/20" : "bg-red-500/20"}`}>
                      {isCredit ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <span className="font-semibold text-sm text-white whitespace-nowrap">{tx.type_label || "—"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[#FFFFFF99] text-sm">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="truncate">{formattedDate}</span>
                  </div>

                  <div className="flex justify-center">
                    <Badge className={`${badgeClass} border-none rounded-full px-4 py-1 text-[11px] font-bold tracking-tight whitespace-nowrap`}>
                      {tx.status || "—"}
                    </Badge>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-bold ${isCredit ? "text-green-400" : "text-red-400"}`}>
                      {amountDisplay}
                    </span>
                    {/* {netDisplay && (
                      <span className="text-[10px] text-gray-400 font-medium mt-0.5">{netDisplay}</span>
                    )} */}
                  </div>
                </div>
              );
            })
          )}

          {/* Loading more */}
          {!initialLoading && txLoading && (
            [...Array(3)].map((_, i) => <SkeletonRow key={`more-${i}`} alt={(transactions.length + i) % 2 === 0} />)
          )}
        </div>

        {/* Scroll sentinel */}
        <div ref={sentinelRef} className="h-4" />

        {/* End of list */}
        {!txLoading && !initialLoading && transactions.length > 0 && !hasMore && (
          <p className="text-center text-[#FFFFFF30] text-xs mt-6">All transactions loaded</p>
        )}
      </div>

      <WithdrawDialog
        open={showWithdraw}
        onOpenChange={setShowWithdraw}
        availableEntry={availableEntry}
        onSuccess={fetchBalance}
      />
    </div>
  );
};

export default TransactionsHistory;
