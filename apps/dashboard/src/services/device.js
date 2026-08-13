import api from "../store/api/api";

export const getDevices = async (isTeam = false, context) => {
  const params = {};
  if (isTeam) params.view = "team";
  if (context) params.context = context;
  return await api.get("/v1/device", { params: Object.keys(params).length ? params : undefined });
};

export const generateDeviceCode = async () => {
  return await api.post("/v1/device/generate-code");
};

export const getProfilesByCode = async (code) => {
  return await api.get(`/v1/device/profiles/${code}`);
};

export const activateDevice = async (code, profileId) => {
  return await api.post(`/v1/activate/${code}`, { profile_id: profileId });
};

export const checkActivationStatus = async (code) => {
  return await api.get(`/v1/device/status/${code}`);
};

export const activatePhysicalDevice = async (deviceCode, profileId) => {
  return await api.post("/v1/device/activate", {
    code: deviceCode,
    user_profile_id: profileId,
  });
};

export const unlinkDevice = async (deviceCode) => {
  return await api.post("/v1/device/unlink", {
    code: deviceCode,
  });
};

export const updateOneShare = async (payload) => {
  return await api.patch("/v1/device/one-share", payload);
};
