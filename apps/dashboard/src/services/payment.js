import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.facile.im";

const paymentAPI = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
paymentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Check if user has a Stripe Connect account and its status
 * @returns { has_account, is_active, charges_enabled, payouts_enabled, account_status }
 */
export const getConnectStatus = async () => {
  try {
    const response = await paymentAPI.get("/v1/payment/connect/status");
    return response.data;
  } catch (error) {
    console.error("Error checking connect status:", error);
    throw error;
  }
};

/**
 * Start or resume Stripe Connect onboarding
 * @returns { onboarding_url, is_active, message }
 */
export const startConnectOnboarding = async () => {
  try {
    const response = await paymentAPI.post("/v1/payment/connect/onboard");
    return response.data;
  } catch (error) {
    console.error("Error starting onboarding:", error);
    throw error;
  }
};

/**
 * Get refresh link for incomplete onboarding
 * @returns { onboarding_url }
 */
export const getRefreshLink = async () => {
  try {
    const response = await paymentAPI.post("/v1/payment/connect/refresh-link");
    return response.data;
  } catch (error) {
    console.error("Error getting refresh link:", error);
    throw error;
  }
};

/**
 * Determine UI state based on status response
 */
export const getPaymentUIState = (statusData) => {
  if (!statusData.has_account) {
    return {
      state: "NO_ACCOUNT",
      label: "Payment Settings",
      description: "Manage your stripe account and payment details",
      buttonText: "Setup Payments",
      badge: null,
    };
  }

  if (!statusData.is_active) {
    return {
      state: "PENDING",
      label: "Complete Setup",
      description: "Finish your Stripe account setup to enable payments",
      buttonText: "Complete Setup",
      badge: "pending",
    };
  }

  return {
    state: "ACTIVE",
    label: "Payments Active",
    description: "Your Stripe account is ready to receive payments",
    buttonText: null,
    badge: "success",
    statusDetails: {
      chargesEnabled: statusData.charges_enabled,
      payoutsEnabled: statusData.payouts_enabled,
      accountStatus: statusData.account_status,
    },
  };
};

export default paymentAPI;
