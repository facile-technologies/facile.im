import api from '../store/api/api';


const BASE_PATH = "/v1/";


export const getUserBussinesProfile = () => {


  return api.get("v1/profile/business/me");
};

export const updateUserProfile = async (formData) => {
  return await api.put(`${BASE_PATH}profile/business/me`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true, 
  });
};
export const updateBussnieUserProfile = async (formData) => {
  return await api.put(`${BASE_PATH}profile/business/me`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};

export const getCustomLinks = async () => {
  return await api.get(`${BASE_PATH}profile/business/custom-links`);
}
export const updateCustomLinks = async (formData) => {
  return await api.post(
    `${BASE_PATH}profile/business/custom-links`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
};
export const deleteCustomLinks = async (id) => {
  return await api.delete(
    `${BASE_PATH}profile/business/custom-links/${id}`,
    {
      withCredentials: true,
    }
  );
}
export const updatedCustomLinks = async (data) => {
  return await api.put(
    `${BASE_PATH}profile/business/custom-link/editlink${id}`, 
    data,
    {
       headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
}
export const updateCustomLinksCustomization = async (data) => {
  return await api.put(
    `${BASE_PATH}profile/business/custom-links/customization`, 
    data,
    {
       headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
}

export const updateCustomLinksequence = async (data) => {
  return await api.put(
    `${BASE_PATH}profile/business/custom-links/sequence`, 
    data,
    {
       headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
}

export const updatePlatformLinks = async (data) => {
  return await api.post(`${BASE_PATH}profile/business/link`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
export const getPlatformLinks = async () => {
  return await api.get(`${BASE_PATH}profile/business/platforms`);
}

export const getContactForm = async () => {
  return await api.get(`${BASE_PATH}profile/business/contact`, {
    withCredentials: true,
  });
};

export const updateContactForm = async (data) => {
  return await api.put(`${BASE_PATH}profile/business/contact`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};

export const updateContactSavebtn = async (data) => {
  return await api.put(`${BASE_PATH}profile/business/contact/save`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};

export const getContactSavebtn = async () => {
  return await api.get(`${BASE_PATH}profile/business/contact/save`, {
    withCredentials: true,
  });
}
export const uploadMedia = async (formData) => {
  return await api.post(`${BASE_PATH}profile/business/media`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};

// 
export const deletePlatformLinks = async (id) => {
  return await api.delete(
    `${BASE_PATH}profile/business/links/deletelink/${id}`,
    {
      withCredentials: true,
    }
  );
};

export const updatePlatformLinksequence = async (data) => {
  return await api.put(`${BASE_PATH}profile/business/links/sequence`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};

export const updatePlatfromLinksCustomization = async (data) => {
  return await api.patch(
    `${BASE_PATH}profile/business/link/customization`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
};

export const updatedPlatformLinks = async (id, data) => {
  

  return await api.patch(
    `${BASE_PATH}profile/business/links/editlink/${id}`, 
    data,  
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
};