import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Package,
  Eye,
  Plus,
  UsersRound,
  Smartphone,
  Link2,
  MoreHorizontal,
  Lock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import braceletDevice from "@/assets/pngs/Bracelet-Device.png";
import productImag from "@/assets/pngs/product-imag.png";
import profilesIcon from "@/assets/svgs/profiles-icon.svg";
import productsIcon from "@/assets/svgs/products-icon.svg";
import contactsIcon from "@/assets/svgs/contacts-icon.svg";
import oneshareIcon from "@/assets/svgs/oneshare-icon.svg";
import { getDashboardData, getUserProfiles } from "@/services/user";
import {
  setDashboardData,
  setLoading,
  setError,
} from "@/app/stores/slices/dashboardSlice";
import { setSubscriptionPlan } from "@/app/stores/slices/userSlice";
import SelectProfileTypeModal from "@/components/shared/SelectProfileTypeModal";
import Loader from "@/store/utils/Loader";
import defaultUserImage from "@/assets/pngs/default-user-3.jpg";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showProfileTypeModal, setShowProfileTypeModal] = useState(false);
  const [existingRescueTypes, setExistingRescueTypes] = useState([]);
  const { user, profileMode } = useSelector((state) => state.user);
  const isRescue = profileMode === "rescue";
  const { data: dashboardData, loading } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      dispatch(setLoading(true));
      try {
        const response = await getDashboardData(
          isRescue ? "rescue" : undefined,
        );
        if (response.data.status === "success") {
          const dashData = response.data.data;
          dispatch(setDashboardData(dashData));
          // Also save subscription plan to global state for sidebar
          if (dashData?.userPlan) {
            dispatch(setSubscriptionPlan(dashData.userPlan));
          }
        }
      } catch (err) {
        dispatch(setError(err.message));
      }
    };
    fetchDashboard();
  }, [dispatch, isRescue]);

  useEffect(() => {
    if (!isRescue) return;
    const fetchProfileTypes = async () => {
      try {
        const res = await getUserProfiles("rescue");
        if (res.data?.status === "success") {
          const types = (res.data.data || []).map((p) => p.type?.toLowerCase());
          setExistingRescueTypes(types);
        }
      } catch {}
    };
    fetchProfileTypes();
  }, [isRescue]);

  const hasSos = existingRescueTypes.includes("sos");
  const hasPet = existingRescueTypes.includes("pet");
  const allRescueTypesExist = isRescue && hasSos && hasPet;
  const excludeRescueTypes = isRescue ? existingRescueTypes : [];

  const firstName = user?.full_name?.split(" ")[0] || user?.username || "User";

  const profileCount = dashboardData?.profiles?.total_count || 0;
  const previewAvatars = dashboardData?.profiles?.preview_avatars || [];
  const products = dashboardData?.products || [];
  const chartData = dashboardData?.analytics?.chart_data || [];
  const devices = dashboardData?.devices || [];
  const contacts = dashboardData?.contacts || [];
  const team = dashboardData?.team || [];
  const allowedFeatures = (dashboardData?.userPlan?.features || []).map((f) =>
    f.toLowerCase(),
  );

  if (loading && !dashboardData) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#262626] p-10 text-black dark:text-white selection:bg-black/10 dark:selection:bg-white/20 rounded-[10px]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-black dark:text-white  mb-1">
          Welcome {firstName},
        </h1>
        <p className="text-sm text-gray-600 dark:text-[#FFFFFFA3]">
          Complete the steps below to start collaborating
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Section (Column 1-8) */}
        <div
          className={`${isRescue ? "lg:col-span-12" : "lg:col-span-8"} ${isRescue ? "grid grid-cols-1 lg:grid-cols-2" : "flex flex-col"} gap-4`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Profiles Card */}
            {profileCount === 0 ? (
              <div
                className={`${isRescue ? "md:col-span-12" : "md:col-span-12 lg:col-span-5"} border border-gray-200 dark:border-white/5 rounded-[24px] shadow-sm min-h-[220px] relative overflow-hidden flex flex-col items-start p-6 bg-white dark:bg-transparent`}
              >
                <div className="absolute inset-0 flex items-center justify-start px-12 -translate-y-4 pointer-events-none opacity-80 select-none">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full border-2 border-white dark:border-[#2A2A2A] overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-lg blur-[0.5px]"
                      >
                        <img
                          src={`https://i.pravatar.cc/150?u=${i + 20}`}
                          alt=""
                          className="w-full h-full object-cover grayscale brightness-125 dark:brightness-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="absolute inset-0 z-0 dark:hidden"
                  style={{
                    background: "rgba(0, 0, 0, 0.05)",
                    backdropFilter: "blur(1.8px)",
                  }}
                ></div>
                <div
                  className="absolute inset-0 z-0 hidden dark:block"
                  style={{
                    background: "rgba(0, 0, 0, 0.25)",
                    backdropFilter: "blur(1.8px)",
                  }}
                ></div>

                <div className="relative z-10 h-full w-full flex flex-col items-start gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-black dark:text-white tracking-tight leading-tight">
                      Create and manage multiple profiles
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-[90%]">
                    Quickly set up profiles and organized in one place.
                  </p>
                  <div className="w-full mt-auto">
                    <div className="relative group w-full">
                      <button
                        onClick={
                          !allRescueTypesExist
                            ? () => setShowProfileTypeModal(true)
                            : undefined
                        }
                        disabled={allRescueTypesExist}
                        className="w-full h-12 rounded-full bg-white! dark:bg-black! text-black! dark:text-white! border border-gray-200 dark:border-white/10 font-bold text-sm tracking-tight transition-all active:scale-[0.98] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-90"
                      >
                        Create New Profile
                      </button>
                      {allRescueTypesExist && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-gray-800 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          You have created all profiles
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`${isRescue ? "md:col-span-12" : "md:col-span-12 lg:col-span-5"} bg-white dark:bg-[#303030] border border-gray-200 dark:border-white/5 rounded-[24px] p-6 shadow-sm min-h-[220px] flex flex-col items-start`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] flex items-center justify-center">
                    <img
                      src={profilesIcon}
                      alt="profiles"
                      className="w-5 h-5 dark:brightness-100 brightness-0"
                    />
                  </div>
                  <span className="font-bold text-base text-black dark:text-white tracking-tight">
                    Profiles
                  </span>
                </div>

                <div className="flex items-center -space-x-3 mb-4">
                  {previewAvatars.slice(0, 3).map((avatar, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-white dark:border-[#2A2A2A] overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg"
                    >
                      <img
                        src={avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {profileCount > 3 && (
                    <div className="w-12 h-12 rounded-full border-2 border-white dark:border-[#2A2A2A] bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-xs shadow-lg">
                      +{profileCount - 3}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-700 dark:text-white font-medium opacity-90 mb-6">
                  You have created {profileCount} Profile
                  {profileCount !== 1 ? "s" : ""}
                </p>

                <div className="w-full flex justify-center mt-auto">
                  <div className="relative group">
                    <button
                      onClick={
                        !allRescueTypesExist
                          ? () => setShowProfileTypeModal(true)
                          : undefined
                      }
                      disabled={allRescueTypesExist}
                      className="px-14 h-12 rounded-full font-bold text-sm tracking-tight transition-all active:scale-[0.98] shadow-xl border border-gray-200 dark:border-white/10 bg-gray-200 text-gray-800 hover:enabled:bg-gray-300 dark:bg-[#1A1A1A] dark:text-white dark:hover:enabled:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create New Profile
                    </button>
                    {allRescueTypesExist && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-gray-800 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        You have created all profiles
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Products Card */}
            {!isRescue && products.length > 0 ? (
              <div className="md:col-span-12 lg:col-span-7 bg-white dark:bg-[#303030] border border-gray-200 dark:border-white/5 rounded-[24px] p-6 shadow-sm min-h-[220px]">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] flex items-center justify-center">
                      <img
                        src={productsIcon}
                        alt="products"
                        className="w-5 h-5 dark:brightness-100 brightness-0"
                      />
                    </div>
                    <span className="font-bold text-base text-black dark:text-white tracking-tight">
                      Products
                    </span>
                  </div>
                  <button className="p-2 bg-gray-50 dark:bg-[#303030]! hover:bg-gray-100 dark:hover:bg-[#4A4A4A] transition rounded-2xl border border-gray-200 dark:border-white/5">
                    <Eye size={18} className="text-black dark:text-white!" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium">
                  Organize and track your product inventory
                </p>

                <div className="grid grid-cols-4 gap-3">
                  {products.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="relative aspect-square rounded-[18px] overflow-hidden group cursor-pointer border border-gray-200 dark:border-white/5"
                    >
                      <img
                        src={product.image || productImag}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-3">
                        <span className="text-[12px] font-bold text-white tracking-tight">
                          {product.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`${isRescue ? "hidden" : "md:col-span-12 lg:col-span-7"} border border-gray-200 dark:border-white/5 rounded-[24px] shadow-sm min-h-[220px] relative overflow-hidden flex flex-col items-start p-6 bg-white dark:bg-[#303030]`}
              >
                <div className="absolute inset-0 flex items-center justify-start gap-4 pointer-events-none opacity-40 select-none scale-100 px-8 -translate-y-4">
                  <div className="grid grid-cols-4 gap-4 w-full">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-[18px] overflow-hidden border border-gray-200 dark:border-white/10 blur-[2.5px]"
                      >
                        <img
                          src={productImag}
                          alt=""
                          className="w-full h-full object-cover grayscale brightness-75 dark:brightness-100"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="absolute inset-0 z-0 dark:hidden"
                  style={{
                    background: "rgba(0, 0, 0, 0.05)",
                    backdropFilter: "blur(1.8px)",
                  }}
                ></div>
                <div
                  className="absolute inset-0 z-0 hidden dark:block"
                  style={{
                    background: "rgba(0, 0, 0, 0.25)",
                    backdropFilter: "blur(1.8px)",
                  }}
                ></div>

                <div className="relative z-10 h-full w-full flex flex-col items-start gap-1">
                  <h2 className="text-[19px] font-bold text-black dark:text-white tracking-tight leading-tight mb-1">
                    Sell and manage your sales
                  </h2>
                  <p className="text-[12px] text-gray-600 dark:text-gray-300 font-medium leading-tight mb-8 opacity-90 max-w-[320px]">
                    Add, update, and track your sales products with ease.
                  </p>

                  <div className="w-full mt-auto flex justify-center">
                    <button
                      onClick={() => navigate("/edit-profile")}
                      className="px-16 h-[46px] rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-tight hover:opacity-90 transition-all active:scale-[0.98] shadow-2xl"
                    >
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* View Analytics Card */}
          {!isRescue && (
            <div className="bg-white dark:bg-[#303030] border border-gray-200 dark:border-white/3 rounded-[24px] p-6 shadow-sm relative overflow-hidden">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-black dark:text-white tracking-tight leading-none mb-1.5">
                  View Analytics
                </h2>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  Track performance metrics and insights
                </p>
              </div>

              <div className="h-[280px] w-full -ml-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#88888820"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      axisLine={{ stroke: "#88888840", strokeWidth: 1 }}
                      tickLine={false}
                      tick={{ fill: "#888", fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={{ stroke: "#88888840", strokeWidth: 1 }}
                      tickLine={false}
                      tick={{ fill: "#888", fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip
                      cursor={{ stroke: "#88888820", strokeWidth: 1 }}
                      contentStyle={{
                        backgroundColor: "var(--bg-color)",
                        border: "1px solid #88888840",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{
                        color: "var(--text-color)",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="purple"
                      stroke="#5F4BFF"
                      strokeWidth={4}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#5F4BFF" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pink"
                      stroke="#FF2E92"
                      strokeWidth={4}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#FF2E92" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {!allowedFeatures.includes("analytics") && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                  <div
                    className="absolute inset-0 z-0 dark:block hidden"
                    style={{
                      background: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(2.7px)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 z-0 dark:hidden block"
                    style={{
                      background: "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(2.7px)",
                    }}
                  ></div>
                  <div className="absolute top-6 right-6 z-30">
                    <Lock
                      size={24}
                      className="text-black dark:text-white opacity-90"
                    />
                  </div>
                  <div className="relative z-10 flex flex-col items-center mt-4">
                    <h3 className="text-[20px] font-bold text-black dark:text-white tracking-tight leading-tight mb-2">
                      Unlock Analytics
                    </h3>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium leading-tight mb-8 max-w-[280px] opacity-90">
                      View key metrics, activity trends, and growth insights at
                      a glance.
                    </p>
                    <button
                      onClick={() => navigate("/pricing-plan")}
                      className="px-14 h-[44px] rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-tight hover:opacity-90 transition-all active:scale-[0.98] shadow-2xl"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Devices Section */}
          <div className="bg-white dark:bg-[#303030] border border-gray-200 dark:border-white/3 rounded-[24px] p-6 shadow-sm relative overflow-hidden">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-black dark:text-white tracking-tight leading-none mb-1.5">
                Devices
              </h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                Configure and monitor connected devices
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {devices.length > 0
                ? devices.map((device, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-[#2A2A2A] rounded-[24px] overflow-hidden group cursor-pointer border border-gray-200 dark:border-white/5 flex flex-col items-center relative h-[180px]"
                    >
                      <div className="absolute top-4 left-4 z-10">
                        <span className="text-[10px] font-bold px-3 py-1 bg-white/40 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-full text-black dark:text-gray-200 backdrop-blur-sm shadow-xs">
                          Linked
                        </span>
                      </div>
                      <div className="flex-1 flex items-center justify-center p-2 mt-2">
                        <img
                          src={device.image || braceletDevice}
                          alt="device"
                          className="w-[170px] h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 dark:from-black via-transparent to-transparent dark:opacity-90 opacity-40"></div>
                      <div className="absolute bottom-4 w-full text-center z-10">
                        <span className="text-sm font-bold text-black dark:text-white tracking-tight">
                          {device.name || "facile Bracelet"}
                        </span>
                      </div>
                    </div>
                  ))
                : [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-[#2A2A2A] rounded-[24px] overflow-hidden group border border-gray-200 dark:border-white/5 flex flex-col items-center relative h-[180px] opacity-20 grayscale"
                    >
                      <div className="flex-1 flex items-center justify-center p-2 mt-2">
                        <img
                          src={braceletDevice}
                          alt="device"
                          className="w-[170px] h-auto object-contain"
                        />
                      </div>
                    </div>
                  ))}
            </div>

            {(devices.length === 0 || !allowedFeatures.includes("devices")) && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                <div
                  className="absolute inset-0 z-0 dark:block hidden"
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(2.7px)",
                  }}
                ></div>
                <div
                  className="absolute inset-0 z-0 dark:hidden block"
                  style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(2.7px)",
                  }}
                ></div>
                {!allowedFeatures.includes("devices") && (
                  <div className="absolute top-6 right-6 z-30">
                    <div className="bg-white/20 dark:bg-black/20 p-2 rounded-full backdrop-blur-sm border border-black/5 dark:border-white/5">
                      <Lock size={24} className="text-black dark:text-white" />
                    </div>
                  </div>
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="text-[19px] font-bold text-black dark:text-white tracking-tight leading-tight mb-2">
                    {!allowedFeatures.includes("devices")
                      ? "Unlock Devices"
                      : "Manage your connected devices"}
                  </h3>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium leading-tight mb-8 max-w-[300px] opacity-90">
                    {!allowedFeatures.includes("devices")
                      ? "Upgrade to view, add, and monitor all linked devices from one place."
                      : "View, add, and monitor all linked devices from one place."}
                  </p>
                  <div className="w-full flex justify-center">
                    <button
                      onClick={() =>
                        navigate(
                          !allowedFeatures.includes("devices")
                            ? "/pricing-plan"
                            : "/devices",
                        )
                      }
                      className="px-14 h-[44px] rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-tight hover:opacity-90 transition-all active:scale-[0.98] shadow-2xl"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section (Column 9-12) */}
        {!isRescue && (
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Contacts Card */}
            <div className="bg-white dark:bg-[#303030] border border-gray-200 dark:border-white/3 rounded-[24px] p-6 flex flex-col gap-6 shadow-sm relative overflow-hidden text-black dark:text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#1A1A1A] flex items-center justify-center border border-gray-200 dark:border-white/5">
                    <img
                      src={contactsIcon}
                      alt="contacts"
                      className="w-4 h-4 dark:brightness-100 brightness-0"
                    />
                  </div>
                  <span className="font-bold text-sm tracking-wide text-black dark:text-gray-200">
                    Contacts
                  </span>
                </div>
                <button className="p-2 bg-gray-50 dark:bg-[#303030]! hover:bg-gray-100 dark:hover:bg-[#4A4A4A] transition rounded-2xl border border-gray-200 dark:border-white/5">
                  <Eye size={18} className="text-black dark:text-white!" />
                </button>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium -mt-4">
                Organize and track your Contacts
              </p>

              <div className="flex flex-col gap-5">
                {contacts.length > 0
                  ? contacts.map((contact, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 group cursor-pointer"
                      >
                        <div className="w-11 h-11 rounded-full overflow-hidden shadow-sm border border-gray-100 dark:border-transparent">
                          <img
                            src={
                              contact.avatar ||
                              `https://i.pravatar.cc/150?u=${i + 20}`
                            }
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-sm font-bold text-black dark:text-gray-200 truncate leading-none mb-1 ">
                            {contact.name || "Talha"}{" "}
                            <span className="font-normal text-gray-500 dark:text-gray-400">
                              shared his information with you
                            </span>
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                    ))
                  : [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 group cursor-pointer opacity-20 grayscale"
                      >
                        <div className="w-11 h-11 rounded-full overflow-hidden shadow-sm bg-gray-300 dark:bg-gray-700"></div>
                        <div className="flex-1 overflow-hidden">
                          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    ))}
              </div>

              {(contacts.length === 0 ||
                !allowedFeatures.includes("contacts")) && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                  <div
                    className="absolute inset-0 z-0 dark:block hidden"
                    style={{
                      background: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(2.7px)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 z-0 dark:hidden block"
                    style={{
                      background: "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(2.7px)",
                    }}
                  ></div>
                  {!allowedFeatures.includes("contacts") && (
                    <div className="absolute top-6 right-6 z-30">
                      <div className="bg-white/20 dark:bg-black/20 p-2 rounded-full backdrop-blur-sm border border-black/5 dark:border-white/5">
                        <Lock
                          size={24}
                          className="text-black dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <h3 className="text-[19px] font-bold text-black dark:text-white tracking-tight leading-tight mb-2">
                      {!allowedFeatures.includes("contacts")
                        ? "Unlock Contacts"
                        : "People you've connected with"}
                    </h3>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium leading-tight mb-8 max-w-[240px] opacity-90">
                      {!allowedFeatures.includes("contacts")
                        ? "Upgrade to view and manage contacts who have saved or interacted with your profile."
                        : "View and manage contacts who have saved or interacted with your profile."}
                    </p>
                    <button
                      onClick={() =>
                        navigate(
                          !allowedFeatures.includes("contacts")
                            ? "/pricing-plan"
                            : "/contacts",
                        )
                      }
                      className="px-14 h-[44px] rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-tight hover:opacity-90 transition-all active:scale-[0.98] shadow-2xl"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Team Card */}
            <div className="bg-white dark:bg-[#303030] border border-gray-200 dark:border-white/3 rounded-[24px] p-6 flex flex-col gap-6 shadow-sm relative overflow-hidden text-black dark:text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#1A1A1A] flex items-center justify-center border border-gray-200 dark:border-white/5">
                    <img
                      src={contactsIcon}
                      alt="team"
                      className="w-4 h-4 dark:brightness-100 brightness-0"
                    />
                  </div>
                  <span className="font-bold text-sm tracking-wide text-black dark:text-gray-200">
                    Team
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-50 dark:bg-[#303030]! hover:bg-gray-100 dark:hover:bg-[#4A4A4A] transition rounded-2xl border border-gray-200 dark:border-white/5">
                    <Eye size={18} className="text-black dark:text-white!" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:opacity-80 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium -mt-4">
                Manage your team efficiently and collaborate
              </p>

              <div className="flex flex-col gap-3">
                {team.length > 0
                  ? team.map((member, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-[#2A2A2A] rounded-[18px] p-4 flex items-center gap-4 border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-inner border border-white/10">
                          <img
                            src={defaultUserImage || member.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-sm font-bold text-black dark:text-white leading-none mb-1.5">
                            {member.name || "Adnan"}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate font-medium">
                            {member.email}
                          </p>
                        </div>
                        <span className="px-3.5 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full leading-none border border-green-500/20">
                          {member.status || "Active"}
                        </span>
                      </div>
                    ))
                  : [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-[#2A2A2A] rounded-[18px] p-4 flex items-center gap-4 border border-gray-200 dark:border-white/5 opacity-20 grayscale"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 shadow-inner"></div>
                        <div className="flex-1 overflow-hidden">
                          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1.5"></div>
                          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    ))}
              </div>

              {(team.length === 0 || !allowedFeatures.includes("teams")) && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                  <div
                    className="absolute inset-0 z-0 dark:block hidden"
                    style={{
                      background: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(2.7px)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 z-0 dark:hidden block"
                    style={{
                      background: "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(2.7px)",
                    }}
                  ></div>
                  {!allowedFeatures.includes("teams") && (
                    <div className="absolute top-6 right-6 z-30">
                      <div className="bg-white/20 dark:bg-black/20 p-2 rounded-full backdrop-blur-sm border border-black/5 dark:border-white/5">
                        <Lock
                          size={24}
                          className="text-black dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <h3 className="text-[20px] font-bold text-black dark:text-white tracking-tight leading-tight mb-2">
                      {!allowedFeatures.includes("teams")
                        ? "Unlock Teams"
                        : "Start Creating Teams"}
                    </h3>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium leading-tight mb-8 max-w-[260px] opacity-90">
                      {!allowedFeatures.includes("teams")
                        ? "Collaborate better by upgrading your plan to unlock team management features."
                        : "Create your first team to start collaborating and managing effectively."}
                    </p>
                    <div className="w-full flex justify-center">
                      <button
                        onClick={() =>
                          navigate(
                            !allowedFeatures.includes("teams")
                              ? "/pricing-plan"
                              : "/teams",
                          )
                        }
                        className="px-14 h-[44px] rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-tight hover:opacity-90 transition-all active:scale-[0.98] shadow-2xl"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Social Link Card */}
            <div className="bg-white dark:bg-[#303030] border border-gray-200 dark:border-white/5 rounded-[24px] p-6 flex flex-col gap-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1A1A1A] flex items-center justify-center border border-gray-200 dark:border-white/5">
                    <img
                      src={oneshareIcon}
                      alt="oneshare"
                      className="w-5 h-5 dark:brightness-100 brightness-0"
                    />
                  </div>
                  <span className="font-bold text-base tracking-tight text-black dark:text-white">
                    oneshare link
                  </span>
                </div>
                <button className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:opacity-80 transition-colors shadow-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium -mt-4 opacity-70">
                Setup your oneshare link
              </p>

              <div className="relative group">
                <label className="absolute -top-2 left-6 px-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-[#303030] z-10 transition-all group-focus-within:text-black dark:group-focus-within:text-white">
                  Enter Link
                </label>
                <div className="w-full h-14 rounded-full border border-gray-200 dark:border-white/20 bg-transparent flex items-center px-6 transition-all group-focus-within:border-gray-400 dark:group-focus-within:border-white/40">
                  <input
                    type="text"
                    className="w-full bg-transparent text-sm text-black dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button className="h-11 px-8 bg-gray-100 dark:bg-white text-black font-bold rounded-full text-sm hover:bg-gray-200 dark:hover:bg-white/90 transition-all active:scale-[0.95] shadow-sm">
                  Cancel
                </button>
                <button className="h-11 px-8 bg-black! text-white! font-bold rounded-full text-sm hover:opacity-90 transition-all active:scale-[0.95] border border-gray-200 dark:border-white/5 shadow-sm">
                  Add link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <SelectProfileTypeModal
        isOpen={showProfileTypeModal}
        onClose={() => setShowProfileTypeModal(false)}
        excludeTypes={excludeRescueTypes}
      />
    </div>
  );
}
