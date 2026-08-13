import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, CreditCard, User, ShieldCheck, Zap, ArrowUp, ArrowDown, RefreshCw, CalendarDays, Sparkles, X } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { cancelSubscription, getDashboardData, getPlans, changeSubscriptionPlan, createCheckoutSession } from '@/services/user';
import { setDashboardData } from '@/app/stores/slices/dashboardSlice';
import { showToast } from "@/store/utils/toast";
import { useEffect } from 'react';
import { Check } from "lucide-react";
import { getConnectStatus, getPaymentUIState } from '@/services/payment';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('subscription');
  const dispatch = useDispatch();
  const dashboardData = useSelector((state) => state.dashboard?.data);
  const userPlan = dashboardData?.userPlan;

  const [plansLoading, setPlansLoading] = useState(true);
  const [allPlans, setAllPlans] = useState([]);
  const [currentDetailedPlan, setCurrentDetailedPlan] = useState(null);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentUIState, setPaymentUIState] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlans();
        const responseData = response.data?.data;
        const plans = Array.isArray(responseData) ? responseData : (responseData?.plans || response.data?.plans || []);
        const currentId = response.data?.current_plan_id || response.data?.data?.current_plan_id;

        setAllPlans(plans);
        if (currentId) {
          setCurrentPlanId(currentId);
          const detail = plans.find(p => (p.id == currentId || p._id == currentId || p.ID == currentId));
          setCurrentDetailedPlan(detail);
        }
      } catch (error) {
        console.error("Error fetching plans in Settings:", error);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Fetch payment status
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        setLoadingPayment(true);
        const statusData = await getConnectStatus();
        setPaymentStatus(statusData);
        setPaymentUIState(getPaymentUIState(statusData));
      } catch (error) {
        console.error("Error fetching payment status:", error);
      } finally {
        setLoadingPayment(false);
      }
    };

    fetchPaymentStatus();
  }, []);

  const handleChangePlan = async (plan) => {
    const planId = plan.id || plan._id || plan.ID;
    if (!planId) {
      showToast('error', 'Plan ID is missing.');
      return;
    }
    setProcessingPlanId(planId);
    try {
      // Try dedicated change-plan endpoint first; fall back to new checkout session
      let redirectUrl = null;
      try {
        const res = await changeSubscriptionPlan({ planId });
        redirectUrl = res?.data?.url || res?.data?.data?.url;
        if (res?.data?.status === 'success' || res?.data?.STATUS === 'SUCCESS') {
          if (!redirectUrl) {
            showToast('success', 'Plan changed successfully!');
            const dashResponse = await getDashboardData();
            if (dashResponse?.data?.status === 'success') {
              dispatch(setDashboardData(dashResponse.data.data));
            }
            setShowChangePlan(false);
            setProcessingPlanId(null);
            return;
          }
        }
      } catch {
        // change-plan endpoint not available; fall through to checkout
      }

      if (!redirectUrl) {
        const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
        const checkoutRes = await createCheckoutSession({
          planId,
          successUrl: `${baseUrl}/billing/success`,
          cancelUrl: `${baseUrl}/billing/cancel`,
        });
        redirectUrl = checkoutRes?.data?.url;
        if (!redirectUrl) {
          showToast('error', checkoutRes?.data?.MESSAGE || 'Failed to initiate plan change.');
          return;
        }
      }

      window.location.href = redirectUrl;
    } catch (error) {
      showToast('error', error?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setProcessingPlanId(null);
    }
  };

  // All plans except the current one and the free plan
  const switchablePlans = useMemo(() => {
    if (!allPlans.length) return [];
    return allPlans.filter(p => {
      const pId = p.id || p._id || p.ID;
      if (pId == currentPlanId) return false;
      const pTitle = (p.title || p.name || '').toLowerCase();
      if (pTitle === 'free') return false;
      return true;
    });
  }, [allPlans, currentPlanId]);

  const getPlanChangeType = (plan) => {
    const currentPrice = parseFloat(currentDetailedPlan?.price || 0);
    const planPrice = parseFloat(plan.price || 0);
    if (planPrice > currentPrice) return 'upgrade';
    if (planPrice < currentPrice) return 'downgrade';
    return 'switch';
  };

  const getNextBillingDate = () => {
    // 1. Check for explicit end dates in dashboard data
    const endDateStr = userPlan?.end_date || userPlan?.endDate || userPlan?.expiry_date;
    if (endDateStr) return new Date(endDateStr);
    
    // 2. Fallback: Calculate from start date + duration
    const startDateStr = userPlan?.start_date || userPlan?.startDate || userPlan?.createdAt || 
                         userPlan?.updatedAt || currentDetailedPlan?.createdAt || currentDetailedPlan?.updatedAt;
    if (!startDateStr) return null;
    
    const date = new Date(startDateStr);
    const duration = (userPlan?.duration || currentDetailedPlan?.duration || "").toLowerCase();
    
    if (duration.includes("month")) {
      date.setDate(date.getDate() + 30);
    } else if (duration.includes("year") || duration.includes("annual")) {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setDate(date.getDate() + 30);
    }
    return date;
  };

  const nextDate = useMemo(() => getNextBillingDate(), [userPlan, currentDetailedPlan]);
  const formattedEndDate = nextDate
    ? nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  const isPremium = useMemo(() => (
    userPlan && (userPlan.name || userPlan.title) && (userPlan.name || userPlan.title).toLowerCase() !== 'free'
  ), [userPlan]);

  const handleCancelClick = async () => {
    setIsCanceling(true);
    try {
      const response = await cancelSubscription();
      if (response?.data?.status === 'success' || response?.status === 200 || response?.data?.STATUS === 'SUCCESS') {
        showToast("success", "Subscription successfully marked for cancellation.");
        const dashResponse = await getDashboardData();
        if (dashResponse?.data?.status === "success") {
          dispatch(setDashboardData(dashResponse.data.data));
        }
      } else {
        showToast("error", response?.data?.message || response?.data?.MESSAGE || "Failed to cancel subscription.");
      }
    } catch (e) {
      console.error(e);
      showToast("error", e?.response?.data?.message || "Failed to cancel subscription.");
    } finally {
      setIsCanceling(false);
    }
  };

  const menuItems = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'subscription', name: 'Subscription', icon: CreditCard },
    { id: 'payment', name: 'Stripe Connect', icon: Zap },
    { id: 'privacy', name: 'Privacy Policy', icon: ShieldCheck },
  ];

  return (
    <div className="flex h-full min-h-[calc(100vh-100px)] gap-6 p-4 md:p-8">
      {/* Sub-Sidebar */}
      <aside className="w-64 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-6 px-4 text-gray-900 dark:text-white">Settings</h2>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-medium
                  ${isActive
                    ? "bg-gray-200 text-gray-900 dark:bg-[#3F3F3F] dark:text-white shadow-lg"
                    : "!text-gray-500 !bg-transparent hover:text-gray-800 hover:bg-gray-100 dark:text-[#FFFFFF99] dark:bg-transparent dark:hover:text-white dark:hover:bg-[#3F3F3F]"
                  }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'subscription' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <header>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Subscription</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your plan and billing details.</p>
              </header>

              {plansLoading ? (
                <div className="flex flex-col justify-center items-center h-64 w-full gap-4">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <p className="text-lg opacity-70 text-gray-800 dark:text-white">Loading subscription details...</p>
                </div>
              ) : (isPremium || (currentDetailedPlan && (currentDetailedPlan.name || currentDetailedPlan.title)?.toLowerCase() !== 'free')) ? (
                <>
                  {/* ── Hero Plan Card ── */}
                  <div className="relative overflow-hidden rounded-[28px] p-px bg-linear-to-br from-blue-500/40 via-blue-600/20 to-transparent shadow-2xl">
                    <div className="relative rounded-[27px] bg-blue-50 dark:bg-[#1E1A2E] p-8 overflow-hidden">
                      {/* Background glow */}
                      <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-800/10 rounded-full blur-3xl pointer-events-none" />

                      {/* Top row */}
                      <div className="relative flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-500/20 p-3 rounded-2xl border border-blue-500/20">
                            <Sparkles className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-blue-600 dark:text-blue-300/70 font-semibold uppercase tracking-widest mb-0.5">Current Plan</p>
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                              {userPlan?.name || userPlan?.title || currentDetailedPlan?.title || currentDetailedPlan?.name}
                            </h4>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border ${
                          (userPlan?.status === 'CANCELED' || userPlan?.status === 'CANCELLED')
                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                        }`}>
                          {userPlan?.status || 'Active'}
                        </span>
                      </div>

                      {/* Stats row */}
                      <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {currentDetailedPlan?.price != null && (
                          <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-blue-100 dark:border-white/5">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Price</p>
                            <p className="text-gray-900 dark:text-white font-bold text-xl">
                              ${currentDetailedPlan.price}
                              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-1">
                                /{(currentDetailedPlan.duration || '').toLowerCase().includes('year') ? 'yr' : 'mo'}
                              </span>
                            </p>
                          </div>
                        )}
                        <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-blue-100 dark:border-white/5">
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                            {(userPlan?.status === 'CANCELED' || userPlan?.status === 'CANCELLED') ? 'Access Until' : 'Next Billing'}
                          </p>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                            <p className="text-gray-900 dark:text-white font-bold text-sm">{formattedEndDate}</p>
                          </div>
                        </div>
                        {currentDetailedPlan?.duration && (
                          <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-blue-100 dark:border-white/5">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Billing Cycle</p>
                            <p className="text-gray-900 dark:text-white font-bold text-sm capitalize">{currentDetailedPlan.duration}</p>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      {currentDetailedPlan?.features?.length > 0 && (
                        <div className="relative mb-6">
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-3 tracking-wider">Included Features</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {currentDetailedPlan.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <div className="bg-blue-100 dark:bg-blue-500/10 p-1 rounded-full shrink-0">
                                  <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {currentDetailedPlan?.description && (
                        <p className="relative text-gray-500 dark:text-gray-500 text-xs leading-relaxed mb-6 border-t border-blue-100 dark:border-white/5 pt-4">
                          {currentDetailedPlan.description}
                        </p>
                      )}

                      {/* Actions — active subscription */}
                      {(userPlan?.status !== 'CANCELED' && userPlan?.status !== 'CANCELLED') && (
                        <div className="relative flex flex-wrap items-center gap-3 pt-4 border-t border-blue-100 dark:border-white/5">
                          <Button
                            onClick={() => setShowChangePlan(v => !v)}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 h-10 font-bold transition-all flex items-center gap-2"
                          >
                            <RefreshCw size={14} />
                            {showChangePlan ? 'Hide Plans' : 'Change Plan'}
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full px-6 h-10 font-bold transition-all"
                              >
                                Cancel Subscription
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-3xl p-8 max-w-md">
                              <AlertDialogHeader>
                                <div className="bg-red-50 dark:bg-red-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                                  <AlertCircle className="text-red-500 w-6 h-6" />
                                </div>
                                <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Cancel Subscription?</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                  You will lose your premium features at the end of the current billing cycle on{' '}
                                  <span className="text-gray-900 dark:text-white font-bold">{formattedEndDate}</span>.
                                  This action cannot be undone automatically, but you can always re-subscribe later.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-8 flex gap-3">
                                <AlertDialogCancel className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-white border-gray-200 dark:border-white/10 rounded-full h-12 font-bold transition-colors!">
                                  Keep Plan
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleCancelClick}
                                  disabled={isCanceling}
                                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full h-12 font-bold shadow-lg shadow-red-600/20"
                                >
                                  {isCanceling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Cancellation'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}

                      {/* Actions — cancelled subscription */}
                      {(userPlan?.status === 'CANCELED' || userPlan?.status === 'CANCELLED') && (
                        <div className="relative pt-4 border-t border-blue-100 dark:border-white/5">
                          <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-4 mb-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Subscription Cancelled</p>
                              <p className="text-xs text-orange-600/80 dark:text-orange-400/70 mt-0.5">
                                You'll keep access to premium features until <span className="font-bold">{formattedEndDate}</span>. Choose a plan below to continue after that date.
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => window.location.href = `${import.meta.env.BASE_URL}pricing-plan`}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-10 font-bold transition-all flex items-center gap-2"
                          >
                            <Sparkles size={14} />
                            Choose a New Plan
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Change Plan Panel ── */}
                  {showChangePlan && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-base font-bold text-gray-900 dark:text-white">Available Plans</h5>
                          <p className="text-xs text-gray-500 mt-0.5">Select a plan to upgrade or downgrade to.</p>
                        </div>
                        <button
                          onClick={() => setShowChangePlan(false)}
                          className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 bg-transparent"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {switchablePlans.length === 0 ? (
                        <div className="bg-[#2A2A2A] border border-white/5 rounded-2xl p-10 text-center">
                          <p className="text-gray-500 text-sm">No other plans available to switch to.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {switchablePlans.map((plan) => {
                            const planId = plan.id || plan._id || plan.ID;
                            const changeType = getPlanChangeType(plan);
                            const isProcessing = processingPlanId === planId;
                            const featuresList = Array.isArray(plan.features)
                              ? plan.features
                              : typeof plan.features === 'string'
                              ? (() => { try { return JSON.parse(plan.features); } catch { return [plan.features]; } })()
                              : [];

                            const typeColors = {
                              upgrade:   { badge: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/25', glow: 'from-green-600/20', btn: 'bg-green-600 hover:bg-green-700', ring: 'hover:border-green-400/50 dark:hover:border-green-500/40' },
                              downgrade: { badge: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/25', glow: 'from-orange-600/15', btn: 'bg-orange-500 hover:bg-orange-600', ring: 'hover:border-orange-400/50 dark:hover:border-orange-400/40' },
                              switch:    { badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/25', glow: 'from-blue-600/15', btn: 'bg-blue-600 hover:bg-blue-700', ring: 'hover:border-blue-400/50 dark:hover:border-blue-500/40' },
                            };
                            const tc = typeColors[changeType];

                            return (
                              <div
                                key={planId}
                                className={`relative overflow-hidden bg-white dark:bg-[#222222] border border-gray-200 dark:border-white/5 rounded-2xl flex flex-col transition-all duration-200 ${tc.ring}`}
                              >
                                {/* Card gradient accent */}
                                <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${tc.glow} to-transparent`} />

                                <div className="p-5 flex flex-col gap-4 flex-1">
                                  {/* Plan header */}
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="text-gray-900 dark:text-white font-bold text-base leading-tight">{plan.title || plan.name}</p>
                                      <p className="text-gray-500 font-semibold text-sm mt-0.5">
                                        <span className="text-gray-900 dark:text-white text-lg font-bold">${plan.price}</span>
                                        <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">
                                          /{(plan.duration || '').toLowerCase().includes('year') ? 'yr' : 'mo'}
                                        </span>
                                      </p>
                                    </div>
                                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${tc.badge}`}>
                                      {changeType === 'upgrade' && <ArrowUp size={10} />}
                                      {changeType === 'downgrade' && <ArrowDown size={10} />}
                                      {changeType.charAt(0).toUpperCase() + changeType.slice(1)}
                                    </span>
                                  </div>

                                  {/* Features */}
                                  {featuresList.length > 0 && (
                                    <ul className="space-y-1.5 flex-1">
                                      {featuresList.slice(0, 5).map((feat, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                          <Check size={11} className="text-green-500 dark:text-green-400 shrink-0 mt-0.5" />
                                          <span>{feat}</span>
                                        </li>
                                      ))}
                                      {featuresList.length > 5 && (
                                        <li className="text-xs text-gray-400 dark:text-gray-600 pl-4">+{featuresList.length - 5} more features</li>
                                      )}
                                    </ul>
                                  )}

                                  {/* CTA */}
                                  <button
                                    onClick={() => handleChangePlan(plan)}
                                    disabled={isProcessing}
                                    className={`w-full h-10 rounded-xl text-sm font-bold transition-all text-white flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${tc.btn}`}
                                  >
                                    {isProcessing ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <>
                                        {changeType === 'upgrade' && <ArrowUp size={13} />}
                                        {changeType === 'downgrade' && <ArrowDown size={13} />}
                                        {changeType === 'upgrade' ? 'Upgrade' : changeType === 'downgrade' ? 'Downgrade' : 'Switch'} to this plan
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                /* ── No Subscription State ── */
                <div className="relative overflow-hidden rounded-[28px] bg-blue-50 dark:bg-[#1E1A2E] border border-blue-200 dark:border-blue-500/10 p-12 text-center flex flex-col items-center shadow-2xl">
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative bg-blue-100 dark:bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border border-blue-300 dark:border-blue-500/20">
                    <CreditCard className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="relative text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Subscription</h4>
                  <p className="relative text-gray-600 dark:text-gray-400 text-sm mb-8 max-w-sm leading-relaxed">
                    You're on the Free plan. Upgrade to unlock Teams, Analytics, advanced links, and much more.
                  </p>
                  <Button
                    className="relative bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 h-12 rounded-full shadow-lg shadow-blue-600/25 transition-all"
                    onClick={() => window.location.href = `${import.meta.env.BASE_URL}pricing-plan`}
                  >
                    <Sparkles size={15} className="mr-2" />
                    View Pricing Plans
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'account' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h3>
                <p className="text-gray-500 dark:text-gray-400">Manage your personal information and preferences.</p>
              </header>
              <Card className="bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-white/5 rounded-[28px] p-12 text-center shadow-xl">
                <p className="text-gray-500 dark:text-gray-400">Account settings features coming soon...</p>
              </Card>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stripe Connect</h3>
                <p className="text-gray-500 dark:text-gray-400">Manage your payment account and connection status.</p>
              </header>

              {loadingPayment ? (
                <div className="flex flex-col justify-center items-center h-64 w-full gap-4">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <p className="text-lg opacity-70 text-gray-800 dark:text-white">Loading payment details...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  <Card className="bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-white/5 rounded-[28px] p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Connection Status</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current status of your Stripe Connect account</p>
                      </div>
                      <CreditCard className="w-10 h-10 text-blue-500" />
                    </div>

                    {/* Status Badge */}
                    {paymentStatus && (
                      <div className="mb-8">
                        {paymentUIState?.state === "ACTIVE" && (
                          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-600 dark:text-green-500 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-green-700 dark:text-green-400">Account Active</p>
                              <p className="text-xs text-green-600/70 dark:text-green-400/70">Your Stripe account is ready to receive payments</p>
                            </div>
                          </div>
                        )}

                        {paymentUIState?.state === "PENDING" && (
                          <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">Setup In Progress</p>
                              <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70">Complete your Stripe account setup to enable payments</p>
                            </div>
                          </div>
                        )}

                        {paymentUIState?.state === "NO_ACCOUNT" && (
                          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Not Connected</p>
                              <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Connect your Stripe account to start selling products</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Account Details */}
                    {paymentUIState?.state === "ACTIVE" && paymentStatus && (
                      <div className="bg-gray-50 dark:bg-black/20 rounded-lg p-4 mb-8 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Charges Enabled</span>
                          <span className={`text-sm font-semibold ${paymentStatus.charges_enabled ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                            {paymentStatus.charges_enabled ? "✓ Yes" : "✗ No"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Payouts Enabled</span>
                          <span className={`text-sm font-semibold ${paymentStatus.payouts_enabled ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                            {paymentStatus.payouts_enabled ? "✓ Yes" : "✗ No"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                            {paymentStatus.account_status}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-4">
                      <Button
                        onClick={() => window.location.href = `${import.meta.env.BASE_URL}payment-settings`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 font-bold transition-all"
                      >
                        Manage Payment Settings
                      </Button>
                    </div>
                  </Card>

                  {/* Info Card */}
                  <Card className="bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-white/5 rounded-[28px] p-8 shadow-xl">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">About Stripe Connect</h4>
                    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        Stripe Connect allows you to accept payments directly from customers. Your funds are transferred securely to your bank account.
                      </p>
                      <p>
                        Once connected, you'll be able to:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Accept credit cards and digital wallets</li>
                        <li>Receive instant payment notifications</li>
                        <li>Withdraw funds to your bank account</li>
                        <li>Access detailed payment analytics</li>
                      </ul>
                      <p className="text-xs text-gray-500 pt-4 border-t border-gray-200 dark:border-white/5">
                        For more information, visit <a href="https://stripe.com/docs/connect" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Stripe Connect documentation</a>
                      </p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h3>
                <p className="text-gray-500 dark:text-gray-400">Learn how we handle your data and privacy.</p>
              </header>
              <Card className="bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-white/5 rounded-[28px] p-12 text-center shadow-xl">
                <p className="text-gray-500 dark:text-gray-400">Privacy policy details coming soon...</p>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;