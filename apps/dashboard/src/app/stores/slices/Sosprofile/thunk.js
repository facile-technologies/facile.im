import {
  createmedicaldetail,
  deleteMediaclinfo,
  deleteSosContactById,
  getContactForm,
  getSosProfile,
  updateAddressContact,
  updateContcatCustomization,
  updateDoctorContact,
  updateEmergencyContact,
  updateInsuranceDetail,
  updateMediaclcustomization,
  updateMediaclinfo,
  updateSosContactById,
  updateSosMedicalSequenceVisibility,
  updateSosSqeuenceVisibility,
  updateSosUserProfile,
} from "@/services/sosuser";
import { showToast } from "@/store/utils/toast";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser } from "../userSlice";

export const fetchSOSProfile = createAsyncThunk(
  "sosprofile/fetch",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await getSosProfile();
      //  sync user slice
      if (res?.data?.user) {
        dispatch(
          setUser({
            id: res?.data?.user.id,
            username: res?.data?.user.username,
            full_name: res?.data?.user.full_name,
          }),
        );
      }
      return res.data;
    } catch (err) {
      showToast("error", "Failed to fetch profile!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveSOSProfile = createAsyncThunk(
  "sosprofile/save",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateSosUserProfile(formData);
      showToast("success", "Profile updated successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update profile!");
      return rejectWithValue(err.response?.data);
    }
  },
);
export const saveEmergencyContact = createAsyncThunk(
  "sosprofile/saveEmergencyContact",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateEmergencyContact(formData);
      showToast("success", "Emergency contact added successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to add emergency contact!");
      return rejectWithValue(err.response?.data);
    }
  },
);
export const fetchEmergencyContacts = createAsyncThunk(
  "sosprofile/fetchEmergencyContacts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getContactForm();
      return res.data;
    } catch (err) {
      showToast("error", "Failed to fetch emergency contacts!");
      return rejectWithValue(err.response?.data);
    }
  },
);
export const saveDoctorContact = createAsyncThunk(
  "sosprofile/saveDoctorContact",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateDoctorContact(formData);
      showToast("success", "Doctor contact added successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to add doctor contact!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveAddressContact = createAsyncThunk(
  "sosprofile/saveAddressContact",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateAddressContact(formData);
      showToast("success", "Address added successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to add address!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteSosContact = createAsyncThunk(
  "sosprofile/deleteContact",
  async ({ type, id }, { rejectWithValue }) => {
    try {
      const res = await deleteSosContactById(type, id);
      showToast(
        "success",
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } contact deleted successfully!`,
      );
      return { type, id };
    } catch (err) {
      showToast("error", `Failed to delete ${type} contact!`);
      return rejectWithValue(err.response?.data);
    }
  },
);
export const updateConatcbyID = createAsyncThunk(
  "sosprofile/updateContact",
  async ({ type, id, data }, { rejectWithValue }) => {
    try {
      const res = await updateSosContactById(type, id, data);
      showToast(
        "success",
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } contact updated successfully!`,
      );
      return res.data;
    } catch (err) {
      showToast("error", `Failed to update ${type} contact!`);
      return rejectWithValue(err.response?.data);
    }
  },
);
export const updateContcatCustomizations = createAsyncThunk(
  "sosprofile/updateContactCustomizations",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateContcatCustomization(data);
      showToast("success", "Contact customization updated successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update contact customization!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveMedicalDetails = createAsyncThunk(
  "sosprofile/saveMedicalDetails",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createmedicaldetail(data);
      showToast("success", "Medical details updated successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update medical details!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateMediaclinfobyID = createAsyncThunk(
  "sosprofile/updateMediaclinfo",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateMediaclinfo(data, id);
      showToast("success", "Medical details updated successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update medical details!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateMedicalCustomizations = createAsyncThunk(
  "sosprofile/updateMediaclcustomizations",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateMediaclcustomization(data);
      showToast("success", "Medical customization updated successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update medical customization!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteMedicalInfo = createAsyncThunk(
  "sosprofile/deleteMedicalInfo",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteMediaclinfo(id);
      showToast("success", "Medical info deleted successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to delete medical info!");
      return rejectWithValue(err.response?.data);
    }
  },
);
export const saveInsuranceDetails = createAsyncThunk(
  "sosprofile/saveInsuranceDetails",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateInsuranceDetail(data);
      showToast("success", "Medical details updated successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update medical details!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveSosSequenceVisibility = createAsyncThunk(
  "sosprofile/saveSosSequenceVisibility",
  async ({ type, contacts }, { rejectWithValue }) => {
    try {
      const payload = { contacts };

      const res = await updateSosSqeuenceVisibility(type, payload);

      showToast("success", "Contacts updated successfully!");
      return { type, contacts, response: res.data };
    } catch (err) {
      showToast("error", "Failed to update contacts!");
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const saveSosMedicalSequenceVisibility = createAsyncThunk(
  "sosprofile/saveSosMedicalSequenceVisibility",
  async ({ details }, { rejectWithValue }) => {
    try {
      const payload = { details };
      const res = await updateSosMedicalSequenceVisibility(payload);

      showToast("success", "Medical details updated successfully!");
      return { details, response: res.data };
    } catch (err) {
      showToast("error", "Failed to update medical details!");
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);
