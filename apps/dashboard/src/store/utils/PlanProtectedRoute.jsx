import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Restricts a route to users who have an active, non-free paid plan.
 * Falls back to localStorage-persisted subscriptionPlan so the check
 * works immediately on direct URL entry (no loading flash).
 *
 * Usage:
 *   <PlanProtectedRoute requiredFeature="sales_analytics">
 *     <SalesAnalytics />
 *   </PlanProtectedRoute>
 *
 * Props:
 *   requiredFeature (optional) — if provided, the user's plan must include
 *     this feature string (case-insensitive) in its features array.
 *   redirectTo (optional, default "/pricing-plan") — where to send the user.
 */
const PlanProtectedRoute = ({ children, requiredFeature = null, redirectTo = "/pricing-plan" }) => {
  const subscriptionPlan = useSelector((state) => state.user?.subscriptionPlan);
  const dashboardPlan    = useSelector((state) => state.dashboard?.data?.userPlan);

  // Prefer Redux subscriptionPlan (persisted), fall back to dashboard data
  const plan = subscriptionPlan || dashboardPlan;

  // No plan at all → redirect
  if (!plan) {
    return <Navigate to={redirectTo} replace />;
  }

  const planName = (plan.name || plan.title || plan.plan_name || "").toLowerCase();
  const status   = (plan.status || "").toUpperCase();

  // Free plan → redirect
  if (planName === "free") {
    return <Navigate to={redirectTo} replace />;
  }

  // Cancelled/expired: only block if the end_date has also passed (or there is no end_date)
  if (status === "CANCELED" || status === "CANCELLED" || status === "EXPIRED") {
    const endDate = plan.end_date || plan.endDate || plan.expiry_date;
    const stillActive = endDate && new Date(endDate) > new Date();
    if (!stillActive) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Feature-level check (optional)
  if (requiredFeature) {
    const allowedFeatures = (plan.features || []).map((f) => f.toLowerCase());
    if (!allowedFeatures.includes(requiredFeature.toLowerCase())) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
};

export default PlanProtectedRoute;
