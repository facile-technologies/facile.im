import api from "../store/api/api";

const BASE_PATH = "/v1/";

export const getSosProfile = () => {
  return api.get("v1/profile/sos/me");
};

export const updateSosUserProfile = async (formData) => {
  return await api.put(`${BASE_PATH}profile/sos/me`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true, 
  });
};
export const updateSosCustomization = async (data) => {
  return await api.put(`${BASE_PATH}profile/sos/customization`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
}
export const getSosCustomization = () => {
  return api.get(`${BASE_PATH}profile/sos/customization`);
};

export const getContactForm = async () => {
  return await api.get(`${BASE_PATH}profile/sos/contacts`, {
    withCredentials: true,
  });
};
export const updateEmergencyContact = async (data) => {
  return await api.post(`${BASE_PATH}profile/sos/contacts/emergency`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
}
export const updateDoctorContact = async (data) => {
  return await api.post(`${BASE_PATH}profile/sos/contacts/doctor`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
}
export const updateAddressContact = async (data) => {
  return await api.post(`${BASE_PATH}profile/sos/contacts/address`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
}
export const updateSosContactSequence = async (type, data) => {
  if (!['emergency', 'doctor', 'address'].includes(type)) {
    throw new Error("Invalid type. Use 'emergency', 'doctor', or 'address'.");
  }
  return await api.patch(`${BASE_PATH}profile/sos/contacts/${type}`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
};

export const updateSosContactById = async (type, id, data) => {
  if (!['emergency', 'doctor', 'address'].includes(type)) {
    throw new Error("Invalid type. Use 'emergency', 'doctor', or 'address'.");
  }
  if (!id) {
    throw new Error("ID is required for updating contact.");
  }
  return await api.patch(
    `${BASE_PATH}profile/sos/contacts/${type}/${id}`,
    data, 
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, 
    }
  );
};

export const deleteSosContactById = async (type, id) => {
  if (!['emergency', 'doctor', 'address'].includes(type)) {
    throw new Error("Invalid type. Use 'emergency', 'doctor', or 'address'.");
  }
  if (!id) {
    throw new Error("ID is required for deleting contact.");
  }
  return await api.delete(`${BASE_PATH}profile/sos/contacts/${type}/${id}`, {
    withCredentials: true,
  });
};

export const updateContcatCustomization = async (data) => {
  return await api.put(`${BASE_PATH}profile/sos/contacts/customization`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
};

export const createmedicaldetail = async (data) => {
  return await api.post(`${BASE_PATH}profile/sos/medical/details`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
};

export const updateMediaclinfo = async (data, id) => {
  return await api.patch(`${BASE_PATH}profile/sos/medical/details/${id}`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};

export const deleteMediaclinfo = async (id) => {
  return await api.delete(`${BASE_PATH}profile/sos/medical/details/${id}`, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
};


export const updateMediaclcustomization = async (data) => {
  return await api.patch(`${BASE_PATH}profile/sos/medical/customization`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
};

export const updateInsuranceDetail = async (data) => {
  return await api.patch(`${BASE_PATH}profile/sos/medical/insurance`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
};

export const updateSosSqeuenceVisibility = async (type, data) => {
  if (!["emergency", "doctor", "address"].includes(type)) {
    throw new Error("Invalid type. Use 'emergency', 'doctor', or 'address'.");
  }

  return await api.patch(`${BASE_PATH}profile/sos/contacts/${type}`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
export const updateSosMedicalSequenceVisibility = async (data) => {
  return await api.patch(`${BASE_PATH}profile/sos/medical/details/customize`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};


