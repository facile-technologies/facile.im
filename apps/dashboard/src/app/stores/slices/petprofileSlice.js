import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToast } from "@/store/utils/toast";
import {
  createmedicaldetail,
  deleteMediaclinfo,
  deleteSosContactById,
  getContactForm,
  getPetIdentification,
  getPetProfile,
  updateAddressContact,
  updateContcatCustomization,
  updateDoctorContact,
  updateEmergencyContact,
  updateInsuranceDetail,
  updateMediaclcustomization,
  updateMediaclinfo,
  updatePetIdentificationById,
  updatePetUserProfile,
  updateSosContactById,
  updateSosMedicalSequenceVisibility,
  updateSosSqeuenceVisibility,
} from "@/services/petProfileUser";
import { setUser } from "./userSlice";

// Thunks
export const fetchPETProfile = createAsyncThunk(
  "petprofile/fetch",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await getPetProfile(); // Fetch the profile
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
      return res.data; // Return the data to store in the state
    } catch (err) {
      showToast("error", "Failed to fetch profile!");
      return rejectWithValue(err.response?.data); // Handle error
    }
  },
);
export const fetchPETIdentification = createAsyncThunk(
  "petprofile/fetchIdentification",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getPetIdentification();
      const data = res.data.petIdentification; // ✅ use .petIdentification here

      return {
        identification: {
          chipped: data.chipped ?? "",
          collar: data.collar ?? "",
          specialFeature: data.special_feature ?? "",
        },
        identificationCustomization: {
          backgroundColor: data.background_color ?? "#3F3F3F",
          headerTextColor: data.header_color ?? "#FFFFFF",
          bodyTextColor: data.body_color ?? "#FFFFFF",
          title: data.header_text ?? "Identification",
        },
        identificationLayout: data.layout ?? "LIST",
      };
    } catch (err) {
      showToast("error", "Failed to fetch identification!");
      return rejectWithValue(err.response?.data);
    }
  },
);
export const savePETProfile = createAsyncThunk(
  "petprofile/save",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updatePetUserProfile(formData); // Update the profile
      showToast("success", "Profile updated successfully!"); // Show success toast
      return res.data; // Return updated data
    } catch (err) {
      showToast("error", "Failed to update profile!"); // Show error toast
      return rejectWithValue(err.response?.data); // Handle error
    }
  },
);

export const saveEmergencyContact = createAsyncThunk(
  "petprofile/saveEmergencyContact",
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
  "petprofile/fetchEmergencyContacts",
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
  "petprofile/saveDoctorContact",
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
  "petprofile/saveAddressContact",
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
  "petprofile/deleteContact",
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
  "petprofile/updateContact",
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
  "petprofile/updateContactCustomizations",
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
  "petprofile/saveMedicalDetails",
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
  "petprofile/updateMediaclinfo",
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
  "petprofile/updateMediaclcustomizations",
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
export const saveInsuranceDetails = createAsyncThunk(
  "petprofile/saveInsuranceDetails",
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
  "petprofile/saveSosSequenceVisibility",
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
  "petprofile/saveSosMedicalSequenceVisibility",
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
export const savePETIdentificationById = createAsyncThunk(
  "petprofile/saveIdentification",
  async (formData, { rejectWithValue }) => {
    try {
      // :fire: FRONTEND → BACKEND
      const payload = {
        chipped: formData.chipped,
        collar: formData.collar,
        special_feature: formData.specialFeature,
        background_color: formData.backgroundColor,
        header_color: formData.headerTextColor,
        body_color: formData.bodyTextColor,
        header_text: formData.title,
        layout: formData.layout,
      };
      const res = await updatePetIdentificationById(payload);
      showToast("success", "Identification updated successfully!");
      const data = res.data.petIdentification;
      // :fire: BACKEND → FRONTEND AGAIN
      return {
        identification: {
          chipped: data.chipped,
          collar: data.collar,
          specialFeature: data.special_feature,
        },
        identificationCustomization: {
          backgroundColor: data.background_color,
          headerTextColor: data.header_color,
          bodyTextColor: data.body_color,
          title: data.header_text,
        },
        identificationLayout: data.layout,
      };
    } catch (err) {
      showToast("error", "Failed to update identification!");
      return rejectWithValue(err.response?.data);
    }
  },
);
// Slice
const petProfileSlice = createSlice({
  name: "petprofile",
  initialState: {
    // selectedBg: "#000000",
    // blur: 50,
    user: null,
    profileActivation: false,
    profileImg: null,
    profileShape: "circle",

    profile: {
      type: "pet",
      name: "",
      pinnedNote: "",
      isPinned: true,
      gender: "",
      breed: "",
      age: "",
      color: "",
      important: "",
    },
    visibilityByType: {
      emergency: {},
      doctor: {},
      address: {},
      medical: {},
    },
    medicalInfo: [],
    medicaCustomization: {
      backgroundColor: "#3F3F3F",
      backgroundImage: null,
      headerTextColor: "#ffffff",
      bodyTextColor: "#ffffff",
      title: "",
    },
    identification: {
      chipped: "",
      collar: "",
      specialFeature: "",
    },
    identificationCustomization: {
      backgroundColor: "#3F3F3F",
      headerTextColor: "#FFFFFF",
      bodyTextColor: "#FFFFFF",
      title: "Identification",
    },
    insurnacCompanyName: "",
    insuranceID: "",
    contactInfo: [],
    emmergencyAddress: [],
    doctorContactInfo: [],
    backgroundImages: [],
    shouldRemoveBgImage: false,
    customization: {
      backgroundColor: "",
      backgroundImage: null,
      textColor: "#ffffff",
      fontFamily: "Poppins",
      fontSize: 12,
      blurLevel: 50,
      title: "",
      layout: "LIST",
    },
    ContactCustomization: {
      backgroundColor: "#3F3F3F",
      backgroundImage: null,
      headerTextColor: "#ffffff",
      bodyTextColor: "#ffffff",
    },
    identificationLayout: "LIST",
    loading: false,
    error: null,
    cropModalOpen: false,
    cropImageSrc: null,
    cropType: "profile",
    activeTab: "profile",
    cropFor: "profile",
  },
  reducers: {
    setPetProfileActivation(state, { payload }) {
      state.profileActivation = payload;
    },
    setActiveTab(state, { payload }) {
      state.activeTab = payload;
    },
    setProfileField(state, { payload }) {
      const { name, value } = payload;
      state.profile[name] = value;
    },
    // Action to update specific contact field
    setContactInfoField(state, { payload }) {
      const { name, value } = payload;
      // Update specific contact field based on name
      state.contactInfo[name] = value;
    },
    setinsuranceCompanyName(state, { payload }) {
      state.insurnacCompanyName = payload;
    },
    setInsurnaceID(state, { payload }) {
      state.insuranceID = payload;
    },

    setMedicalInfoField(state, { payload }) {
      const { id, diseaseName, description } = payload;
      const existingItemIndex = state.medicalInfo.findIndex(
        (item) => item.id === id,
      );

      if (existingItemIndex !== -1) {
        state.medicalInfo[existingItemIndex] = {
          ...state.medicalInfo[existingItemIndex],
          diseaseName,
          description,
        };
      } else {
        state.medicalInfo.push({
          id,
          diseaseName,
          description,
          isVisible: true,
        });
      }
    },
    toggleMedicalInfoVisibility(state, { payload }) {
      const { id } = payload;
      const existingItemIndex = state.medicalInfo.findIndex(
        (item) => item.id === id,
      );

      if (existingItemIndex !== -1) {
        // Toggle the visibility status
        state.medicalInfo[existingItemIndex].isVisible =
          !state.medicalInfo[existingItemIndex].isVisible;
      }
    },
    setVisibilityByType(state, { payload }) {
      const { type, id, value } = payload;
      if (!state.visibilityByType) state.visibilityByType = {};
      if (!state.visibilityByType[type]) state.visibilityByType[type] = {};
      state.visibilityByType[type][id] = value;
    },
    setMedicaDatalInfo(state, { payload }) {
      const { name, value } = payload;
      state.medicalInfo[name] = value;
    },
    setContactInfo(state, { payload }) {
      const { id, emmergencyContactName, phoneNumber, whatsAppNumber } =
        payload;
      state.contactInfo.push({
        id,
        emmergencyContactName,
        phoneNumber,
        whatsAppNumber,
        isVisible: true,
      });
    },
    toggleContactInfoVisibility(state, { payload }) {
      const { id } = payload;
      const existingItemIndex = state.contactInfo.findIndex(
        (item) => item.id === id,
      );
      if (existingItemIndex !== -1) {
        state.contactInfo[existingItemIndex].isVisible =
          !state.contactInfo[existingItemIndex].isVisible;
      }
    },
    deleteContactInfo(state, { payload }) {
      const { id } = payload;
      state.contactInfo = state.contactInfo.filter((item) => item.id !== id);
    },
    setDoctorContactInfo(state, { payload }) {
      const { id, doctorContactName, phoneNumber, whatsAppNumber } = payload;

      // Find the existing doctor contact by id
      const existingItemIndex = state.doctorContactInfo.findIndex(
        (item) => item.id === id,
      );

      if (existingItemIndex !== -1) {
        state.doctorContactInfo[existingItemIndex] = {
          ...state.doctorContactInfo[existingItemIndex],
          doctorContactName,
          phoneNumber,
          whatsAppNumber,
          isVisible: true,
        };
      } else {
        state.doctorContactInfo.push({
          id,
          doctorContactName,
          phoneNumber,
          whatsAppNumber,
          isVisible: true,
        });
      }
    },
    toggleDoctorContactInfoVisibility(state, { payload }) {
      const { id } = payload;
      const existingItemIndex = state.doctorContactInfo.findIndex(
        (item) => item.id === id,
      );
      if (existingItemIndex !== -1) {
        state.doctorContactInfo[existingItemIndex].isVisible =
          !state.doctorContactInfo[existingItemIndex].isVisible;
      }
    },
    deleteDoctorContactInfo(state, { payload }) {
      const { id } = payload;
      state.doctorContactInfo = state.doctorContactInfo.filter(
        (item) => item.id !== id,
      );
    },
    setEmmergencyAddress(state, { payload }) {
      const { id, addressDescriptio, houseNumber } = payload;
      state.emmergencyAddress.push({
        id,
        addressDescriptio,
        houseNumber,
        isVisible: true,
      });
    },
    toggleEmmergencyAddressVisibility(state, { payload }) {
      const { id } = payload;
      const existingItemIndex = state.emmergencyAddress.findIndex(
        (item) => item.id === id,
      );
      if (existingItemIndex !== -1) {
        state.emmergencyAddress[existingItemIndex].isVisible =
          !state.emmergencyAddress[existingItemIndex].isVisible;
      }
    },

    // Delete Emergency Address
    deleteEmmergencyAddress(state, { payload }) {
      const { id } = payload;
      state.emmergencyAddress = state.emmergencyAddress.filter(
        (item) => item.id !== id,
      );
    },
    // setBg(state, { payload }) {
    //   state.selectedBg = payload;
    // },
    setBg(state, { payload }) {
      state.customization.backgroundColor = payload;
      // Only clear background image when an actual color is explicitly chosen (not "none")
      if (payload && payload !== "none" && state.customization.backgroundImage) {
        state.shouldRemoveBgImage = true;
        state.customization.backgroundImage = null;
      }
    },
    setBackgroundImage(state, { payload }) {
      state.customization.backgroundImage = payload; // File OR null
    },
    setBgImage(state, action) {
      state.customization.backgroundImage = action.payload.url;
      state.shouldRemoveBgImage = false;
      state.backgroundImages.push({
        src: action.payload.url,
        file: action.payload.file,
      });
    },
    removeBgImage(state, action) {
      const removedImg = state.backgroundImages[action.payload];
      state.backgroundImages = state.backgroundImages.filter(
        (_, idx) => idx !== action.payload,
      );
      if (removedImg && state.customization.backgroundImage === removedImg.src) {
        state.customization.backgroundImage = null;
      }
    },
    selectBgImage(state, action) {
      state.customization.backgroundImage = action.payload;
      state.shouldRemoveBgImage = action.payload === null || action.payload === "none";
    },
    // setBlur(state, { payload }) {
    //   state.blur = payload;
    // },
    setBlur(state, { payload }) {
      state.customization.blurLevel = payload;
    },
    setPetLayout: (state, action) => {
      state.customization.layout = action.payload.layout;
    },

    setIdentificationField(state, { payload }) {
      const { name, value } = payload;
      state.identification[name] = value;
    },
    setIdentification(state, { payload }) {
      state.identification = { ...state.identification, ...payload };
    },
    setIdentificationCustomization(state, { payload }) {
      state.identificationCustomization = {
        ...state.identificationCustomization,
        ...payload,
      };
    },
    setIdentifucationLayout(state, { payload }) {
      state.identificationLayout = payload;
    },
    setTextColor(state, { payload }) {
      state.customization.textColor = payload;
    },
    setFontFamily(state, { payload }) {
      state.customization.fontFamily = payload;
    },
    setFontSize(state, { payload }) {
      state.customization.fontSize = payload;
    },
    setPinOn(state, { payload }) {
      state.profile.isPinned = payload;
    },
    setPinOffNote(state, { payload }) {
      state.profile.pinOffNote = payload;
    },
    setMedicalInfo(state, { payload }) {
      state.medicalInfo = { ...state.medicalInfo, ...payload };
    },
    setCustomization(state, { payload }) {
      state.customization = { ...state.customization, ...payload };
    },
    setCropModal(state, { payload }) {
      state.cropModalOpen = payload.open;
      if (payload.src !== undefined) state.cropImageSrc = payload.src;
      if (payload.type) state.cropType = payload.type;
    },
    setProfileShape: (state, action) => {
      state.profileShape = action.payload;
    },
    setContactCustomizationBackgroundColor(state, { payload }) {
      state.ContactCustomization.backgroundColor = payload;
    },
    setContactCustomizationTextColor(state, { payload }) {
      state.ContactCustomization.bodyTextColor = payload;
    },
    setContactCustomizationheadertextColor(state, { payload }) {
      state.ContactCustomization.headerTextColor = payload;
    },
    setContactCustomizationTitle(state, { payload }) {
      state.ContactCustomization.title = payload;
    },
    setContactBtnEnabled(state, { payload }) {
      state.ContactCustomization.contactBtnEnabled = payload;
    },

    setMedicalCustomizationBackgroundColor(state, { payload }) {
      state.medicaCustomization.backgroundColor = payload;
    },
    setMedicalCustomizationTextColor(state, { payload }) {
      state.medicaCustomization.bodyTextColor = payload;
    },
    setMedicalCustomizationheadertextColor(state, { payload }) {
      state.medicaCustomization.headerTextColor = payload;
    },
    setMedicalCustomizationTitle(state, { payload }) {
      state.medicaCustomization.title = payload;
    },
    setCropResult(state, { payload }) {
      const { type, url, shape } = payload;
      if (type === "profile") {
        state.profileShape = shape;
        state.profileImg = url;
      }
    },
    resetPETProfile(state) {
      state.profile = {
        type: "pet",
        pet_name: "",
        gender: "",
        age: "",
        color: "",
        breed: "",
        important_note: "",
        isPinned: true,
      };
      state.profileImg = null;
      state.profileImgPreview = null;
      state.medicalInfo = [];
      state.contactInfo = [];
      state.doctorContactInfo = [];
      state.emmergencyAddress = [];
      state.emergencyContacts = [];
      state.doctorsContacts = [];
      state.addresses = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPETProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPETProfile.fulfilled, (state, { payload }) => {
        state.loading = false;

        const img = payload?.profile?.profile_image || null;

        // ✅ Profile (PET)
        state.profile = {
          ...state.profile,
          type: "pet",
          pet_name: payload?.profile?.pet_name || "",
          gender: (payload?.profile?.gender || "").trim(),
          age: payload?.profile?.age ?? "",
          color: payload?.profile?.color || "",
          breed: payload?.profile?.breed || "",
          important_note: payload?.profile?.important_note || "",
          isPinned: payload?.profile?.note_is_pinned ?? true,
        };

        state.profileImg = img;

        // ✅ Customization (preview)
        state.customization = {
          backgroundColor:
            payload?.customization?.background_color || "#000000",
          backgroundImage: payload?.customization?.background_image || null,
          textColor: payload?.customization?.about_text_color || "#ffffff",
          fontFamily: payload?.customization?.font_family || "Poppins",
          fontSize: payload?.customization?.font_size ?? 12,
          blurLevel: payload?.customization?.background_blur ?? 50,
          layout: payload?.customization?.layout || "CARD",
        };

        // ✅ Contacts lists
        state.contactInfo = payload?.emergencyContacts || [];
        state.doctorContactInfo = payload?.doctorsContacts || [];
        state.emmergencyAddress = payload?.addresses || [];

        // ✅ Contacts customization (IMPORTANT: petContactsCustomization)
        state.ContactCustomization = {
          title:
            payload?.petContactsCustomization?.title_color ||
            "Guardian Information",
          backgroundColor:
            payload?.petContactsCustomization?.background_color || "#3F3F3F",
          headerTextColor:
            payload?.petContactsCustomization?.header_color || "#ffffff",
          bodyTextColor:
            payload?.petContactsCustomization?.body_color || "#ffffff",
          contactBtnEnabled:
            payload?.petContactsCustomization?.contact_btn_enabled ?? false,
        };

        // ✅ Medical customization (IMPORTANT: petMedicalCustomization)
        state.medicaCustomization = {
          title:
            payload?.petMedicalCustomization?.header_text ||
            "Medical Information",
          backgroundColor:
            payload?.petMedicalCustomization?.background_color || "#3F3F3F",
          headerTextColor:
            payload?.petMedicalCustomization?.header_color || "#ffffff",
          bodyTextColor:
            payload?.petMedicalCustomization?.body_color || "#ffffff",
        };

        // ✅ Medical details list (snake_case fields)
        state.medicalInfo = payload?.medicalDetails || [];

        // ✅ Identification (IMPORTANT: petIdentification + snake_case)
        const idn = payload?.petIdentification || {};
        state.identification = {
          chipped: idn?.chipped || "",
          collar: idn?.collar || "",
          specialFeature: idn?.special_feature || "",
        };

        // ✅ Identification layout from petIdentification
        state.identificationLayout = idn?.layout || "LIST";

        // ✅ Identification customization from petIdentification
        state.identificationCustomization = {
          title: idn?.header_text || "Identification",
          backgroundColor: idn?.background_color || "#3F3F3F",
          headerTextColor: idn?.header_color || "#ffffff",
          bodyTextColor: idn?.body_color || "#ffffff",
        };

        // ✅ Insurance (empty array in your response)
        const insList = payload?.medicalInsurances || [];
        const latestInsurance =
          insList.length > 0
            ? insList.reduce((latest, curr) => {
                const latestTime = new Date(
                  latest.updatedAt || latest.createdAt || 0,
                ).getTime();
                const currTime = new Date(
                  curr.updatedAt || curr.createdAt || 0,
                ).getTime();
                return currTime > latestTime ? curr : latest;
              })
            : null;

        state.insurnacCompanyName = latestInsurance?.insurance_company || "";
        state.insuranceID = latestInsurance?.insurance_id || "";

        // Optional
        state.userProfile = payload?.userProfile || null;
      })

      .addCase(fetchPETProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // ✅ Add new fetchPETIdentification cases
      .addCase(fetchPETIdentification.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPETIdentification.fulfilled, (state, { payload }) => {
        state.loading = false;

        // Directly assign the properties returned from the thunk
        state.identification = payload.identification;
        state.identificationCustomization = payload.identificationCustomization;
        state.identificationLayout = payload.identificationLayout;
      })

      .addCase(fetchPETIdentification.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(savePETProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(savePETProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.profile = { ...state.profiles, ...payload.profile };
        state.profile = { ...state.profile, ...payload.profile };
        state.medicalInfo = payload.medicalInfo;
        state.contactInfo = payload.contactInfo;
        // state.customization = payload.customization;
        // state.customization.layout = payload.customization?.layout || "LIST";
        state.customization = {
          backgroundColor:
            payload?.customization?.background_color ??
            state.customization.backgroundColor,
          backgroundImage:
            payload?.customization?.background_image ??
            state.customization.backgroundImage,
          textColor:
            payload?.customization?.about_text_color ??
            state.customization.textColor,
          fontFamily:
            payload?.customization?.font_family ??
            state.customization.fontFamily,
          fontSize:
            payload?.customization?.font_size ?? state.customization.fontSize,
          blurLevel:
            payload?.customization?.background_blur ??
            state.customization.blurLevel,
          layout: payload?.customization?.layout ?? state.customization.layout,
        };

        // state.layout = payload.layout;
        if (payload.identification) {
          state.identification = {
            ...state.identification,
            ...payload.identification,
          };
        }
        if (payload.identificationLayout) {
          state.identificationLayout = payload.identificationLayout;
        }
      })
      .addCase(savePETProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(savePETIdentificationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(savePETIdentificationById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.identification = payload.identification;
        state.identificationCustomization = payload.identificationCustomization;
        state.identificationLayout = payload.identificationLayout;
      })

      .addCase(savePETIdentificationById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
    builder
      .addCase(fetchEmergencyContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmergencyContacts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.contactInfo = payload;
      })
      .addCase(fetchEmergencyContacts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(saveEmergencyContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveEmergencyContact.fulfilled, (state, { payload }) => {
        state.loading = false;
        const newContact = {
          id: payload.contact.id,
          contact_name: payload.contact.contact_name,
          phone_number: payload.contact.phone_number,
          whatsapp_number: payload.contact.whatsapp_number,
          sequence: payload.contact.sequence,
          is_visible: payload.contact.is_visible,
        };
        state.contactInfo.push(newContact);
      })
      .addCase(saveEmergencyContact.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
    builder
      .addCase(saveDoctorContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveDoctorContact.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.doctorContactInfo.push(payload.contact);
      })
      .addCase(saveDoctorContact.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
    builder
      .addCase(saveAddressContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveAddressContact.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.emmergencyAddress.push(payload.address);
      })
      .addCase(saveAddressContact.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
    builder
      .addCase(deleteSosContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSosContact.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { type, id } = payload;

        if (type === "emergency") {
          state.emmergencyAddress = state.emmergencyAddress.filter(
            (contact) => contact.id !== id,
          );
        } else if (type === "doctor") {
          state.doctorContactInfo = state.doctorContactInfo.filter(
            (contact) => contact.id !== id,
          );
        } else if (type === "address") {
          state.emmergencyAddress = state.emmergencyAddress.filter(
            (contact) => contact.id !== id,
          );
        }
      })
      .addCase(deleteSosContact.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateConatcbyID.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateConatcbyID.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { type, id, data } = payload;

        if (type === "doctor") {
          state.doctorContactInfo = state.doctorContactInfo.map((contact) =>
            contact.id === id ? { ...contact, ...data } : contact,
          );
        } else if (type === "emergency") {
          state.contactInfo = state.contactInfo.map((contact) =>
            contact.id === id ? { ...contact, ...data } : contact,
          );
        } else if (type === "address") {
          state.emmergencyAddress = state.emmergencyAddress.map((contact) =>
            contact.id === id ? { ...contact, ...data } : contact,
          );
        }
      });
    builder
      .addCase(updateContcatCustomizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContcatCustomizations.fulfilled, (state, { payload }) => {
        state.loading = false;
        const data = payload?.petContactsCustomization || payload;
        state.ContactCustomization = {
          title: data?.title_color ?? state.ContactCustomization.title,
          backgroundColor: data?.background_color ?? state.ContactCustomization.backgroundColor,
          headerTextColor: data?.header_color ?? state.ContactCustomization.headerTextColor,
          bodyTextColor: data?.body_color ?? state.ContactCustomization.bodyTextColor,
          contactBtnEnabled: data?.contact_btn_enabled ?? state.ContactCustomization.contactBtnEnabled,
        };
      })
      .addCase(updateContcatCustomizations.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
    builder
      .addCase(saveMedicalDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveMedicalDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.medicalInfo.push(payload.contact);
      })
      .addCase(saveMedicalDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateMediaclinfobyID.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { id, data } = payload;
        state.medicalInfo = state.medicalInfo.map((contact) =>
          contact.id === id ? { ...contact, ...data } : contact,
        );
      })
      .addCase(updateMediaclinfobyID.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateMedicalCustomizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMedicalCustomizations.fulfilled, (state, { payload }) => {
        state.loading = false;
        const data = payload?.petMedicalCustomization || payload;
        const prev = state.medicaCustomization;
        state.medicaCustomization = {
          title: data?.header_text ?? data?.title_color ?? prev.title,
          backgroundColor: data?.background_color ?? prev.backgroundColor,
          headerTextColor: data?.header_color ?? prev.headerTextColor,
          bodyTextColor: data?.body_color ?? prev.bodyTextColor,
          contactBtnEnabled: data?.contact_btn_enabled ?? prev.contactBtnEnabled,
        };
      })
      .addCase(updateMedicalCustomizations.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteMedicalInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMedicalInfo.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { type, id } = payload;
        state.medicalInfo = state.medicalInfo.filter(
          (contact) => contact.id !== id,
        );
      })
      .addCase(deleteMedicalInfo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(saveInsuranceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveInsuranceDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.insurnacCompanyName =
          payload?.response?.insurance_company ??
          payload.request.insurance_company;

        state.insuranceID =
          payload?.response?.insurance_id ?? payload.request.insurance_id;
      })
      .addCase(saveInsuranceDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(saveSosMedicalSequenceVisibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        saveSosMedicalSequenceVisibility.fulfilled,
        (state, { payload }) => {
          state.loading = false;

          const map = new Map(
            (payload.details || []).map((d) => [
              d.id,
              { sequence: d.sequence, is_visible: d.is_visible },
            ]),
          );
          state.medicalInfo = (state.medicalInfo || []).map((m) => {
            const upd = map.get(m.id);
            if (!upd) return m;
            return {
              ...m,
              sequence: upd.sequence,
              is_visible: upd.is_visible,
            };
          });
          state.medicalInfo.sort(
            (a, b) => (a.sequence ?? 9999) - (b.sequence ?? 9999),
          );
        },
      )
      .addCase(
        saveSosMedicalSequenceVisibility.rejected,
        (state, { payload }) => {
          state.loading = false;
          state.error = payload;
        },
      );
  },
});

export const {
  setPetProfileActivation,
  setActiveTab,
  setProfileField,
  setMedicalInfo,
  setContactInfo,
  setCustomization,
  setPetLayout,
  setCropModal,
  setCropResult,
  setBg,
  setBackgroundImage,
  setPinOffNote,
  setPinOn,
  setTextColor,
  setFontFamily,
  setBlur,
  setProfileShape,
  setContactInfoField,
  setEmmergencyAddress,
  setDoctorContactInfo,
  setContactCustomizationBackgroundColor,
  setContactCustomizationTextColor,
  setContactCustomizationheadertextColor,
  setContactCustomizationTitle,
  setContactBtnEnabled,
  setMedicalInfoField,
  setMedicaDatalInfo,
  setMedicalCustomizationBackgroundColor,
  setMedicalCustomizationTextColor,
  setMedicalCustomizationheadertextColor,
  setMedicalCustomizationTitle,
  setInsurnaceID,
  setinsuranceCompanyName,
  setIdentifucationLayout,
  setIdentificationField,
  setIdentification,
  setIdentificationCustomization,
  toggleMedicalInfoVisibility,
  toggleContactInfoVisibility,
  toggleDoctorContactInfoVisibility,
  toggleEmmergencyAddressVisibility,
  deleteContactInfo,
  deleteDoctorContactInfo,
  deleteEmmergencyAddress,
  setFontSize,
  setVisibilityByType,
  resetPETProfile,
  setBgImage,
  removeBgImage,
  selectBgImage,
} = petProfileSlice.actions;

export default petProfileSlice.reducer;
