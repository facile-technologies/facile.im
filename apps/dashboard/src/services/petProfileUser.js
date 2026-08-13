import api from "../store/api/api";

const BASE_PATH = "/v1/";

export const getPetProfile = () => {
  return api.get("v1/profile/pet/me");
};

export const updatePetUserProfile = async (formData) => {
  return await api.put(`${BASE_PATH}profile/pet/me`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};
export const updatePetCustomization = async (data) => {
  return await api.put(`${BASE_PATH}profile/pet/customization`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
export const getPetCustomization = () => {
  return api.get(`${BASE_PATH}profile/pet/customization`);
};

export const getContactForm = async () => {
  return await api.get(`${BASE_PATH}profile/pet/contacts`, {
    withCredentials: true,
  });
};
export const updateEmergencyContact = async (data) => {
  return await api.post(`${BASE_PATH}profile/pet/contacts/emergency`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
export const updateDoctorContact = async (data) => {
  return await api.post(`${BASE_PATH}profile/pet/contacts/doctor`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
export const updateAddressContact = async (data) => {
  return await api.post(`${BASE_PATH}profile/pet/contacts/address`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
export const updatePetContactSequence = async (type, data) => {
  if (!["emergency", "doctor", "address"].includes(type)) {
    throw new Error("Invalid type. Use 'emergency', 'doctor', or 'address'.");
  }
  return await api.patch(`${BASE_PATH}profile/pet/contacts/${type}`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};

export const updatePetContactById = async (type, id) => {
  if (!["emergency", "doctor", "address"].includes(type)) {
    throw new Error("Invalid type. Use 'emergency', 'doctor', or 'address'.");
  }
  if (!id) {
    throw new Error("ID is required for deleting contact.");
  }
  return await api.patch(`${BASE_PATH}profile/pet/contacts/${type}/${id}`, {
    withCredentials: true,
  });
};
export const deleteSosContactById = async (type, id) => {
  if (!['emergency', 'doctor', 'address'].includes(type)) {
    throw new Error("Invalid type. Use 'emergency', 'doctor', or 'address'.");
  }
  if (!id) {
    throw new Error("ID is required for deleting contact.");
  }
  return await api.delete(`${BASE_PATH}profile/pet/contacts/${type}/${id}`, {
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
    `${BASE_PATH}profile/pet/contacts/${type}/${id}`,
    data, 
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, 
    }
  );
};

export const getPetIdentification = () => {
  return api.get(`${BASE_PATH}profile/pet/identification`);
};

export const updatePetIdentificationById = async (data) => {
  // data should contain your identification customization payload
  return await api.patch(`${BASE_PATH}profile/pet/identification`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};

export const updateContcatCustomization = async (data) => {
  return await api.put(`${BASE_PATH}profile/pet/contacts/customization`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
};

export const createmedicaldetail = async (data) => {
  return await api.post(`${BASE_PATH}profile/pet/medical/details`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
};

export const updateMediaclinfo = async (data, id) => {
  return await api.patch(`${BASE_PATH}profile/pet/medical/details/${id}`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};

export const deleteMediaclinfo = async (id) => {
  return await api.delete(`${BASE_PATH}profile/pet/medical/details/${id}`, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
};


export const updateMediaclcustomization = async (data) => {
  return await api.patch(`${BASE_PATH}profile/pet/medical/customization`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
};

export const updateInsuranceDetail = async (data) => {
  return await api.patch(`${BASE_PATH}profile/pet/medical/insurance`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true, 
  });
};

export const updateSosSqeuenceVisibility = async (type, data) => {
  if (!["emergency", "doctor", "address"].includes(type)) {
    throw new Error("Invalid type. Use 'emergency', 'doctor', or 'address'.");
  }

  return await api.patch(`${BASE_PATH}profile/pet/contacts/${type}`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
export const updateSosMedicalSequenceVisibility = async (data) => {
  return await api.patch(`${BASE_PATH}profile/pet/medical/details/customize`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};


