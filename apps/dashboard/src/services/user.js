import api from "../store/api/api";

const getProfileId = () => localStorage.getItem("userProfileID");
const getTemplateId = () => localStorage.getItem("templateID");

const baseProfilePath = (profileType) => `/v1/profile/${profileType}`;
const baseTemplatePath = () => `/v1/template`;

export const createUserProfile = async (
  profileType,
  payload,
  isTemplatePage,
) => {
  return await api.post(
    isTemplatePage
      ? `${baseTemplatePath()}/create-template`
      : `${baseProfilePath(profileType)}/create-profile`,
    payload,
    {
      withCredentials: true,
    },
  );
};

export const getUserProfile = (profileType, isTemplatePage) => {
  return api.get(
    isTemplatePage
      ? `${baseTemplatePath()}/get-template/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/get-profile/${getProfileId()}`,
  );
};

export const updateUserProfile = async (
  profileType,
  formData,
  isTemplatePage,
) => {
  return await api.put(
    isTemplatePage
      ? `${baseTemplatePath()}/update-template/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/update-profile/${getProfileId()}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    },
  );
};

export const getPlatformLinks = async (profileType, isTemplatePage) => {
  return await api.get(
    isTemplatePage
      ? `${baseTemplatePath()}/link/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/link/${getProfileId()}`,
  );
};

export const updatePlatformLinks = async (
  profileType,
  data,
  isTemplatePage,
) => {
  return await api.post(
    isTemplatePage
      ? `${baseTemplatePath()}/link/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/link/${getProfileId()}`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
};

export const updatedPlatformLinks = async (
  profileType,
  id,
  data,
  isTemplatePage,
) => {
  return await api.patch(
    isTemplatePage
      ? `${baseTemplatePath()}/${getTemplateId()}/links/${id}`
      : `${baseProfilePath(profileType)}/${getProfileId()}/links/${id}`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
};
export const deletePlatformLinks = async (profileType, id, isTemplatePage) => {
  return await api.delete(
    isTemplatePage
      ? `${baseTemplatePath()}/${getTemplateId()}/links/${id}`
      : `${baseProfilePath(profileType)}/${getProfileId()}/links/${id}`,
    {
      withCredentials: true,
    },
  );
};

export const updatePlatfromLinksCustomization = async (
  profileType,
  data,
  isTemplatePage,
) => {
  return await api.patch(
    isTemplatePage
      ? `${baseTemplatePath()}/link/customization/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/link/customization/${getProfileId()}`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
};
export const updatePlatformLinksequence = async (
  profileType,
  data,
  isTemplatePage,
) => {
  return await api.put(
    isTemplatePage
      ? `${baseTemplatePath()}/links/sequence/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/links/sequence/${getProfileId()}`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
};

export const getCustomLinks = async (profileType, isTemplatePage) => {
  return await api.get(
    isTemplatePage
      ? `${baseTemplatePath()}/custom-link/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/custom-link/${getProfileId()}`,
  );
};
export const updateCustomLinks = async (
  profileType,
  formData,
  isTemplatePage,
) => {
  return await api.post(
    isTemplatePage
      ? `${baseTemplatePath()}/custom-link/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/custom-link/${getProfileId()}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    },
  );
};
export const updatedCustomLinks = async (
  profileType,
  data,
  id,
  isTemplatePage,
) => {
  return await api.patch(
    isTemplatePage
      ? `${baseTemplatePath()}/${getTemplateId()}/custom-link/${id}`
      : `${baseProfilePath(profileType)}/${getProfileId()}/custom-link/${id}`,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    },
  );
};
export const deleteCustomLinks = async (profileType, id, isTemplatePage) => {
  return await api.delete(
    isTemplatePage
      ? `${baseTemplatePath()}/${getTemplateId()}/custom-link/${id}`
      : `${baseProfilePath(profileType)}/${getProfileId()}/custom-link/${id}`,
    {
      withCredentials: true,
    },
  );
};

export const updateCustomLinksCustomization = async (
  profileType,
  data,
  isTemplatePage,
) => {
  return await api.patch(
    isTemplatePage
      ? `${baseTemplatePath()}/custom-link/customization/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/custom-link/customization/${getProfileId()}`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
};
export const updateCustomLinksequence = async (
  profileType,
  data,
  isTemplatePage,
) => {
  return await api.put(
    isTemplatePage
      ? `${baseTemplatePath()}/custom-link/sequence/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/custom-link/sequence/${getProfileId()}`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
};

export const getExistingBusinessPlatformLinks = async () => {
  return await api.get(`/v1/profile/business/existing-links`, {
    withCredentials: true,
  });
};

export const getContactForm = async (profileType, isTemplatePage) => {
  return await api.get(
    isTemplatePage
      ? `${baseTemplatePath()}/contact/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/contact/${getProfileId()}`,
    {
      withCredentials: true,
    },
  );
};

export const updateContactForm = async (profileType, data, isTemplatePage) => {
  return await api.put(
    isTemplatePage
      ? `${baseTemplatePath()}/contact/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/contact/${getProfileId()}`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
};

export const updateContactSavebtn = async (
  profileType,
  data,
  isTemplatePage,
) => {
  return await api.put(
    isTemplatePage
      ? `${baseTemplatePath()}/contact/save/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/contact/save/${getProfileId()}`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
};

export const updateContactStatus = async (
  profileType,
  isEnabled,
  isTemplatePage,
) => {
  return await api.patch(
    isTemplatePage
      ? `${baseTemplatePath()}/contact/status/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/contact/status/${getProfileId()}`,
    { is_enabled: isEnabled },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
};

export const updateSaveContactStatus = async (
  profileType,
  isEnabled,
  isTemplatePage,
) => {
  return await api.patch(
    isTemplatePage
      ? `${baseTemplatePath()}/contact/save/status/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/contact/save/status/${getProfileId()}`,
    { is_enabled: isEnabled },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
};

export const getContactSavebtn = async (profileType, isTemplatePage) => {
  return await api.get(
    isTemplatePage
      ? `${baseTemplatePath()}/contact/save/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/contact/save/${getProfileId()}`,
    {
      withCredentials: true,
    },
  );
};
export const uploadMedia = async (profileType, formData, isTemplatePage) => {
  return await api.post(
    isTemplatePage
      ? `${baseTemplatePath()}/media/${getTemplateId()}`
      : `${baseProfilePath(profileType)}/media/${getProfileId()}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    },
  );
};

// Updates media layout + sequence (no file upload).
export const updateMediaSequenceAndLayout = async (
  profileType,
  data,
  isTemplatePage,
) => {
  return await api.put(
    isTemplatePage
      ? `${baseTemplatePath()}/media`
      : `${baseProfilePath(profileType)}/media`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
};

export const deleteMediaAPI = async (profileType, mediaId, isTemplatePage) => {
  return await api.delete(
    isTemplatePage
      ? `${baseTemplatePath()}/media/${mediaId}`
      : `${baseProfilePath(profileType)}/media/${mediaId}`,
    {
      withCredentials: true,
    },
  );
};

export const assignTemplate = async (data) => {
  return await api.post(`/v1/template/assign-template/2`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
export const unAssignTemplate = async (data) => {
  return await api.post(`/v1/template/unassign-template/2`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};

export const getDashboardData = (context) => {
  return api.get(`/v1/dashboard`, {
    params: context ? { context } : undefined,
  });
};

export const getUserProfiles = (context) => {
  return api.get(`/v1/user/profiles`, {
    params: context ? { context } : undefined,
  });
};

export const deleteUserProfile = async (userProfileId) => {
  return await api.delete(`/v1/user/profile/${userProfileId}`, {
    withCredentials: true,
  });
};

export const getAllPlatformLinks = async () => {
  return await api.get(`v1/profile/business/existing-links`);
};

const REFERRER_SOURCE_MAP = [
  { pattern: /instagram\.com/i,  source: "instagram" },
  { pattern: /facebook\.com|fb\.com/i, source: "facebook" },
  { pattern: /linkedin\.com/i,  source: "linkedin" },
  { pattern: /tiktok\.com/i,    source: "tiktok" },
  { pattern: /snapchat\.com/i,  source: "snapchat" },
  { pattern: /pinterest\.com/i, source: "pinterest" },
  { pattern: /twitter\.com|x\.com/i, source: "x" },
  { pattern: /whatsapp\.com|wa\.me/i, source: "whatsapp" },
];

export const detectSource = () => {
  const referrer = document.referrer;
  if (!referrer) return "direct";
  for (const { pattern, source } of REFERRER_SOURCE_MAP) {
    if (pattern.test(referrer)) return source;
  }
  return "other";
};

export const getPublicProfile = (username, source = "direct") => {
  return api.get(`/v1/profile/public/${username}`, { params: { source } });
};

export const resolveProfileTypeByCode = (code) => {
  return api.get(`/v1/profile/public/resolve/${code}`);
};

export const recordProfileClick = (userProfileId, payload = {}) => {
  return api.post(`/v1/profile/public/profile-clicks/${userProfileId}`, payload);
};

export const getUserAnalytics = (userProfileId, filter = "today") => {
  return api.get(`/v1/profile/business/user-analytics/${userProfileId}`, { params: { filter } });
};

export const getLiveUserAnalytics = (userProfileId) => {
  return api.get(`/v1/profile/business/live-user-analytics/${userProfileId}`);
};

export const getSosPublicProfile = (username) => {
  return api.get(`/v1/profile/public/rescue/sos/${username}`);
};

export const getPetPublicProfile = (username) => {
  return api.get(`/v1/profile/public/rescue/pet/${username}`);
};

export const productCheckout = (payload) => {
  return api.post(`/v1/payment/product/checkout`, payload);
};

export const getPurchases = (context = "facile", page = 1, limit = 10) => {
  return api.get(`/v1/payment/connect/purchases`, {
    params: { context, page, limit },
  });
};

export const getBalance = () => {
  return api.get(`/v1/payment/connect/balance`);
};

export const getTransactions = (limit = 10, startingAfter = null) => {
  const params = { limit };
  if (startingAfter) params.starting_after = startingAfter;
  return api.get(`/v1/payment/connect/transactions`, { params });
};

export const requestWithdraw = (body = {}) => {
  return api.post(`/v1/payment/connect/withdraw`, body, { withCredentials: true });
};

export const getSalesAnalytics = (context = 'facile', period = 'this_month') => {
  return api.get(`/v1/payment/connect/analytics`, { params: { context, period } });
};

export const getContacts = async (params) => {
  return await api.get(`/v1/contacts`, {
    params,
    withCredentials: true,
  });
};

export const getPlans = async () => {
  return await api.get(`/v1/user/plans`, {
    withCredentials: true,
  });
};

export const createCheckoutSession = async (data) => {
  return await api.post(`/v1/payment/create-checkout-session`, data, {
    withCredentials: true,
  });
};

export const cancelSubscription = async () => {
  return await api.post(`/v1/payment/cancel-subscription`, {}, {
    withCredentials: true,
  });
};

export const changeSubscriptionPlan = async (data) => {
  return await api.post(`/v1/payment/change-plan`, data, {
    withCredentials: true,
  });
};
