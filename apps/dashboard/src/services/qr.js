import api from "../store/api/api";

export const getQRDesign = (userProfileId) => {
  return api.get(`/v1/qr/${userProfileId}`);
};

export const updateQRDesign = async (formData) => {
  return await api.post(`/v1/qr/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};
export const downloadQRCode = (userProfileId) => {
  return api.get(`/v1/qr/download/${userProfileId}`, {
    responseType: 'blob'
  });
};
