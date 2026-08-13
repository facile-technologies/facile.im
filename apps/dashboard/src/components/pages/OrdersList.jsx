import React, { useState, useEffect, useRef, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, PackageOpen } from "lucide-react";
import { getPurchases } from "@/services/user";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.facile.im";

const statusStyles = {
  completed:   "bg-[#1C2C1C] text-[#4ADE80]",
  pending:     "bg-[#1C242C] text-[#60A5FA]",
  failed:      "bg-[#2C1C1C] text-[#F87171]",
  refunded:    "bg-[#2C2C1C] text-[#FACC15]",
  in_progress: "bg-[#1C1C2C] text-[#A78BFA]",
};

const statusLabel = {
  completed:   "Completed",
  pending:     "Pending",
  failed:      "Failed",
  refunded:    "Refunded",
  in_progress: "In Progress",
};

function SkeletonRow({ alt }) {
  return (
    <div className={`grid grid-cols-6 gap-4 items-center p-4 px-6 rounded-2xl ${alt ? "bg-[#3F3F3F]" : "bg-transparent"}`}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`h-4 rounded-md bg-gradient-to-r from-[#4F4F4F] via-[#5A5A5A] to-[#4F4F4F] bg-[length:200%_100%] animate-shimmer ${i === 5 ? "ml-auto w-16" : "w-3/4"}`}
        />
      ))}
    </div>
  );
}

const LIMIT = 10;

const OrdersList = () => {
  const [context, setContext] = useState("facile");
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  const fetchOrders = useCallback(async (ctx, pg, reset = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getPurchases(ctx, pg, LIMIT);
      const result = res.data;
      if (result.STATUS === "SUCCESS") {
        setOrders((prev) => reset ? result.data : [...prev, ...result.data]);
        setTotalPages(result.pagination?.total_pages ?? 1);
        setPage(pg);
      } else {
        setError("Failed to load orders.");
      }
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [loading]);

  // Reset and fetch when tab changes
  useEffect(() => {
    setOrders([]);
    setPage(1);
    setTotalPages(1);
    setInitialLoading(true);
    fetchOrders(context, 1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          fetchOrders(context, page + 1, false);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [loading, page, totalPages, context, fetchOrders]);

  const handleTabChange = (val) => setContext(val);

  return (
    <div className="min-h-screen bg-[#262626] p-10 text-white rounded-[10px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Order List</h1>
        <Tabs value={context} onValueChange={handleTabChange} className="max-w-[320px] w-full">
          <TabsList className="bg-[#3F3F3F]! rounded-full p-0 h-11 w-full flex border border-[#ffffff10] shadow-inner overflow-hidden">
            <TabsTrigger
              value="facile"
              className="flex-1 rounded-full px-4 text-xs font-semibold h-full transition-all data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! !text-gray-500 border-none! shadow-none!"
            >
              Facile
            </TabsTrigger>
            <TabsTrigger
              value="teams"
              className="flex-1 rounded-full px-4 text-xs font-semibold h-full transition-all data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! !text-gray-500 border-none! shadow-none!"
            >
              Facile Teams
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <div className="w-full">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 px-6 mb-4 text-sm font-medium text-[#FFFFFF99]">
          <div>Order ID</div>
          <div>Digital Product</div>
          <div>Buyer Email</div>
          <div className="text-center">Status</div>
          <div>Date</div>
          <div className="text-right">Amount</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-3">
          {initialLoading ? (
            [...Array(8)].map((_, i) => <SkeletonRow key={i} alt={i % 2 === 0} />)
          ) : error ? (
            <div className="text-center py-16 text-red-400 font-semibold">{error}</div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#FFFFFF40]">
              <PackageOpen size={48} strokeWidth={1.2} />
              <p className="text-sm font-semibold">No orders found</p>
            </div>
          ) : (
            orders.map((order, idx) => {
              const statusKey = (order.status || "").toLowerCase();
              const badgeClass = statusStyles[statusKey] || "bg-[#2C2C2C] text-white";
              const label = statusLabel[statusKey] || order.status;
              const rawDate = order.createdAt || order.created_at;
              const formattedDate = rawDate
                ? new Date(rawDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "—";
              const productTitle = order.product?.title || "—";
              const rawImage = order.product?.image_url;
              const productImage = rawImage
                ? rawImage.startsWith("http") ? rawImage : `${API_BASE}${rawImage}`
                : null;
              const amount = order.amount != null
                ? `${(order.currency || "USD").toUpperCase()} ${Number(order.amount).toFixed(2)}`
                : "—";

              return (
                <div
                  key={order.id ?? idx}
                  className={`grid grid-cols-6 gap-4 items-center p-4 px-6 rounded-2xl transition-all duration-200 ${
                    idx % 2 === 0 ? "bg-[#3F3F3F] shadow-sm" : "bg-transparent"
                  }`}
                >
                  <div className="text-sm font-medium text-[#FFFFFF99]">#{order.id}</div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-700 overflow-hidden shrink-0">
                      {productImage ? (
                        <img src={productImage} alt="product" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#FFFFFF30]">
                          <PackageOpen size={16} />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-white truncate">
                      {productTitle}
                    </span>
                  </div>

                  <div className="text-sm text-[#FFFFFF99] truncate">{order.buyer_email || "—"}</div>

                  <div className="flex justify-center">
                    <Badge className={`${badgeClass} border-none rounded-full px-4 py-1.5 text-[11px] font-bold tracking-tight whitespace-nowrap`}>
                      {label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#FFFFFF99]">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>{formattedDate}</span>
                  </div>

                  <div className="text-sm font-bold text-white text-right">{amount}</div>
                </div>
              );
            })
          )}

          {/* Loading more rows */}
          {!initialLoading && loading && (
            [...Array(3)].map((_, i) => <SkeletonRow key={`more-${i}`} alt={(orders.length + i) % 2 === 0} />)
          )}
        </div>

        {/* Scroll sentinel */}
        <div ref={sentinelRef} className="h-4" />

        {/* End of list */}
        {!loading && !initialLoading && orders.length > 0 && page >= totalPages && (
          <p className="text-center text-[#FFFFFF30] text-xs mt-6">All orders loaded</p>
        )}
      </div>
    </div>
  );
};

export default OrdersList;

