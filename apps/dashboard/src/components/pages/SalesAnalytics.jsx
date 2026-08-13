import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import {
  Check,
  ChevronDown,
  Download,
  Globe,
  MousePointerClick,
  Users,
} from "lucide-react";

import { StatCard } from "../Analytics/StatCard";
import ViewLiveChart from "../Analytics/ViewLiveChart";
import GeographicsChart from "../Analytics/GeographicsChart";
import ProductAnalyticsTable from "../Analytics/ProductAnalyticsTable";
import { getBalance, getSalesAnalytics } from "@/services/user";
import WithdrawDialog from "@/components/shared/WithdrawDialog";

const PERIOD_MAP = {
  "This Month": "this_month",
  "This Week":  "this_week",
  "Last Month": "last_month",
};

const SalesAnalytics = () => {
  const navigate = useNavigate();

  // Balance
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Analytics
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [activeContext, setActiveContext] = useState("facile");

  const fetchBalance = () => {
    setBalanceLoading(true);
    getBalance()
      .then((res) => {
        if (res.data?.STATUS === "SUCCESS") setBalance(res.data.data);
      })
      .catch(() => {})
      .finally(() => setBalanceLoading(false));
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchAnalytics = useCallback(() => {
    setAnalyticsLoading(true);
    getSalesAnalytics(activeContext, PERIOD_MAP[selectedPeriod])
      .then((res) => {
        if (res.data?.STATUS === "SUCCESS") setAnalytics(res.data.data);
      })
      .catch(() => {})
      .finally(() => setAnalyticsLoading(false));
  }, [activeContext, selectedPeriod]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const availableEntry = balance?.available?.[0];
  const availableDisplay = availableEntry
    ? `${availableEntry.currency?.toUpperCase()} ${Number(availableEntry.amount).toFixed(2)}`
    : "—";
  const pendingEntry = balance?.pending?.[0];
  const pendingDisplay = pendingEntry
    ? `${pendingEntry.currency?.toUpperCase()} ${Number(pendingEntry.amount).toFixed(2)} pending`
    : null;

  const summary = analytics?.summary || {};
  const realTimeActivity = analytics?.real_time_activity || {};
  const geographic = analytics?.geographic || [];
  const products = analytics?.products || [];

  // Build sparkline series per stat card from real_time_activity
  const toSparkline = (series = []) =>
    series.map((pt) => ({ value: Number(pt.value) }));

  return (
    <div className="min-h-screen bg-[#262626] p-10 text-white rounded-[10px]">
      <div className="flex items-center justify-between gap-1 mb-4">
        <div className="w-full">
          <h2 className="text-2xl font-semibold">Hey, Hamza</h2>
          <p className="text-sm text-gray-600 dark:text-[#FFFFFFA3] ">
            Placeholder text
          </p>
        </div>
        <div className="flex justify-end items-center  gap-3 w-full ">
          {/* Context Tabs */}
          <Tabs value={activeContext} onValueChange={setActiveContext} className="max-w-[320px]! w-full! ">
            <TabsList className="bg-[#3F3F3F]! rounded-full p-0 h-11 w-full flex border border-[#ffffff10] shadow-inner overflow-hidden">
              <TabsTrigger
                value="facile"
                className="flex-1 rounded-full px-4 text-xs font-semibold h-full transition-all data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-gray-500! dark:text-white! border-none! shadow-none!"
              >
                Facile
              </TabsTrigger>
              <TabsTrigger
                value="teams"
                className="flex-1 rounded-full px-4 text-xs font-semibold h-full transition-all data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-gray-500! dark:text-white! border-none! shadow-none!"
              >
                Facile Teams
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-xl bg-[#FAFAFA] dark:bg-[#3F3F3F]! text-black dark:text-white! max-w-[150px]! w-full! h-[55px] shadow-sm border-none!"
              asChild
            >
              <Button className="w-full h-full flex justify-between px-4">
                {selectedPeriod}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={"bg-[#3F3F3F]! text-white! w-[142px]! border-none! "}
            >
              {Object.keys(PERIOD_MAP).map((label, i, arr) => (
                <DropdownMenuItem
                  key={label}
                  className={`${i < arr.length - 1 ? "border-b border-[#b4abab2e]" : ""} rounded-none cursor-pointer flex items-center justify-between ${selectedPeriod === label ? "font-semibold" : ""}`}
                  onSelect={() => setSelectedPeriod(label)}
                >
                  <span>{label}</span>
                  {selectedPeriod === label && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="bg-[#FFFFFF] dark:bg-[#3F3F3F] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 transition-colors shadow-sm">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-[#FFFFFF99]">Available Balance</p>
          <h3 className="text-3xl font-bold text-black dark:text-white mt-1">
            {balanceLoading ? <span className="inline-block h-8 w-28 rounded-md bg-[#4F4F4F] animate-pulse" /> : availableDisplay}
          </h3>
          {!balanceLoading && pendingDisplay && (
            <p className="text-xs text-[#FFFFFF60] mt-1">{pendingDisplay}  ( Waiting for approval from stripe )</p>
          )}
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button
            onClick={() => setShowWithdraw(true)}
            className="flex-1 md:flex-none bg-black! hover:bg-black/90! text-white! rounded-full px-8 h-12 font-medium transition-all shadow-md"
          >
            Withdraw Amount
          </Button>
          <Button
            onClick={() => navigate("/products/sales-analytics/transactions")}
            className="flex-1 md:flex-none bg-white! hover:bg-gray-50! text-black! border-none! rounded-full px-8 h-12 font-medium transition-all shadow-sm"
          >
            View Transactions
          </Button>
        </div>
      </div>

      <div className="grid gap-4  md:grid-cols-2 xl:grid-cols-4 mb-3 ">
        <StatCard
          title="Views"
          value={analyticsLoading ? "—" : (summary.views ?? "—")}
          percentage={summary.views_change ?? ""}
          icon={Users}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#b7f28e"
          gradientId="contactsGradient"
          data={toSparkline(realTimeActivity.views)}
        />

        <StatCard
          title="Total Orders"
          value={analyticsLoading ? "—" : (summary.total_orders ?? "—")}
          percentage={summary.orders_change ?? ""}
          icon={MousePointerClick}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#86efac"
          gradientId="viewsGradient"
          data={toSparkline(realTimeActivity.orders)}
        />

        <StatCard
          title="Conversion"
          value={analyticsLoading ? "—" : (summary.conversion ?? "—")}
          percentage={summary.conversion_change ?? ""}
          icon={Globe}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#E2CA9E"
          gradientId="interactionGradient"
          data={toSparkline(realTimeActivity.conversions)}
        />

        <StatCard
          title="Earnings"
          value={analyticsLoading ? "—" : (summary.earnings != null ? `$${Number(summary.earnings).toFixed(2)}` : "—")}
          percentage={summary.earnings_change ?? ""}
          icon={Download}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#E2B69E"
          gradientId="downloadGradient"
          data={toSparkline(realTimeActivity.earnings)}
        />
      </div>
      <div className="flex justify-between gap-5">
        <div className="w-full">
          <ViewLiveChart realTimeActivity={realTimeActivity} />
        </div>
        <div className="max-w-[371px] w-full">
          <GeographicsChart geographic={geographic} />
        </div>
      </div>

      <div className="mt-6 w-full">
        <ProductAnalyticsTable products={products} />
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

export default SalesAnalytics;
