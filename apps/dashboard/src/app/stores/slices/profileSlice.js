import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserProfile,
  deleteCustomLinks,
  deletePlatformLinks,
  getContactForm,
  getContactSavebtn,
  getCustomLinks,
  getExistingBusinessPlatformLinks,
  getPlatformLinks,
  getUserProfile,
  updateContactForm,
  updateContactSavebtn,
  updateContactStatus,
  updateSaveContactStatus,
  updateCustomLinks,
  updateCustomLinksCustomization,
  updateCustomLinksequence,
  updatedCustomLinks,
  updatedPlatformLinks,
  updatePlatformLinks,
  updatePlatformLinksequence,
  updatePlatfromLinksCustomization,
  updateUserProfile,
  updateMediaSequenceAndLayout,
  uploadMedia,
  deleteMediaAPI,
} from "@/services/user";
import { showToast } from "@/store/utils/toast";
import { setUser } from "./userSlice";
import { mapProfileViewResponseToState } from "@/lib/profileMapper";

export const createProfile = createAsyncThunk(
  "profile/create",
  async (
    { profileType, formData },
    { dispatch, rejectWithValue, getState },
  ) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    console.log(isTemplatePage, "isTemplatePagesdfsfsdfdsf");

    try {
      const res = await createUserProfile(
        profileType,
        formData,
        isTemplatePage,
      );
      console.log(res, "res");
      if (isTemplatePage) {
        console.log("THUNK RUNNING");
        localStorage.setItem("templateID", res?.data?.data?.template?.id);
        showToast("success", "Template created successfully");
        localStorage.setItem("templateMode", "edit");
      } else {
        localStorage.setItem("userProfileID", res.data.userProfile.id);
        showToast("success", "Profile created successfully");
        localStorage.setItem("profileMode", "edit");
      }

      dispatch(fetchProfile({ profileType, isTemplatePage }));

      return res.data;
    } catch (err) {
      showToast("error", "Failed to create profile");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async ({ profileType }, { dispatch, rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await getUserProfile(profileType, isTemplatePage);

      const {
        profile,
        customization,
        customLinks,
        linkCustomization,
        links,
        customLinkCustomization,
        media,
        mediaCustomization,
        contact,
        contactFields,
        saveContact,
        user,
      } = res.data;
      console.log(profile, "testing");

      //  sync user slice
      if (user) {
        dispatch(
          setUser({
            id: user.id,
            username: user.username,
            full_name: user.full_name,
          }),
        );
      }
      // Map the API response to LivePreview-ready state
      const mappedProfileState = mapProfileViewResponseToState(
        res.data,
        profileType,
      );

      return {
        profile,
        customization,
        customLinks,
        linkCustomization,
        links,
        customLinkCustomization,
        media,
        mediaCustomization,
        contact,
        contactFields,
        saveContact,
        mappedProfileState,
      };
    } catch (err) {
      showToast(
        "error",
        `Failed to fetch ${isTemplatePage ? "template!" : "profile!"}`,
      );
      return rejectWithValue(err.response?.data);
    }
  },
);
export const saveProfile = createAsyncThunk(
  "profile/save",
  async ({ profileType, formData }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      // const api =
      //   profileType === "business"
      //     ? updateBussnieUserProfile
      //     : updateUserProfile;

      // const res = await api(formData);
      const res = await updateUserProfile(
        profileType,
        formData,
        isTemplatePage,
      );
      showToast(
        "success",
        `${isTemplatePage ? "Template" : "Profile"} updated successfully!`,
      );
      return res.data;
    } catch (err) {
      console.log(err?.response?.data?.message, "err");

      showToast(
        "error",
        err?.response?.data?.message ||
          `Failed to update ${isTemplatePage ? "template!" : "profile!"}`,
      );
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchCustomLinks = createAsyncThunk(
  "profile/fetchCustomLinks",
  async ({ profileType }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await getCustomLinks(profileType, isTemplatePage);
      return res.data;
    } catch (err) {
      showToast("error", "Failed to fetch custom links!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveCustomLinks = createAsyncThunk(
  "profile/saveCustomLinks",
  async ({ profileType, formData }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await updateCustomLinks(
        profileType,
        formData,
        isTemplatePage,
      );
      return {
        customLink: res.data.customLink,
        customLinkCustomization: res.data.customLinkCustomization,
      };
    } catch (err) {
      showToast("error", "Failed to update custom links");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const savePlatfromLinks = createAsyncThunk(
  "profile/savePlatfromLinks",
  async ({ profileType, payload }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await updatePlatformLinks(
        profileType,
        payload,
        isTemplatePage,
      );
      return res.data;
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to update platform links",
      );
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchPlatformLinks = createAsyncThunk(
  "profile/fetchPlatformLinks",
  async ({ profileType }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");

    try {
      const res = await getPlatformLinks(profileType, isTemplatePage);
      return res.data;
    } catch (err) {
      showToast("error", "Failed to fetch platform links!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchExistingBusinessPlatformLinks = createAsyncThunk(
  "profile/fetchExistingBusinessPlatformLinks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getExistingBusinessPlatformLinks();
      return Array.isArray(res?.data?.platforms) ? res.data.platforms : [];
    } catch (err) {
      showToast("error", "Failed to fetch business platform catalog!");
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updatePlatformLinkSequence = createAsyncThunk(
  "profile/updateProfileLinkSequence",
  async ({ profileType, links }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");

    try {
      const payload = {
        links: links.map((link, index) => ({
          id: link.id,
          is_visible: link.isVisible ?? true,
          sequence: index + 1,
        })),
      };

      const res = await updatePlatformLinksequence(
        profileType,
        payload,
        isTemplatePage,
      );
      return payload;
    } catch (err) {
      showToast("error", "Sequence update failed");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchContactForm = createAsyncThunk(
  "profile/fetchContactForm",
  async ({ profileType }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await getContactForm(profileType, isTemplatePage);
      return res.data;
    } catch (err) {
      showToast("error", "Failed to fetch contact form!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const toggleContactStatus = createAsyncThunk(
  "profile/toggleContactStatus",
  async ({ profileType, is_enabled }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await updateContactStatus(
        profileType,
        is_enabled,
        isTemplatePage,
      );
      showToast(
        "success",
        `Contact form ${is_enabled ? "enabled" : "disabled"}`,
      );
      return { is_enabled };
    } catch (err) {
      showToast("error", "Failed to update contact status");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const toggleSaveContactStatus = createAsyncThunk(
  "profile/toggleSaveContactStatus",
  async ({ profileType, is_enabled }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await updateSaveContactStatus(
        profileType,
        is_enabled,
        isTemplatePage,
      );
      showToast(
        "success",
        `Save Contact ${is_enabled ? "enabled" : "disabled"}`,
      );
      return { is_enabled };
    } catch (err) {
      showToast("error", "Failed to update save contact status");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveContactForm = createAsyncThunk(
  "profile/saveContactForm",
  async ({ profileType, data }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await updateContactForm(profileType, data, isTemplatePage);
      showToast("success", "Contact form saved!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to save contact form!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveContactButtonSettings = createAsyncThunk(
  "profile/saveContactButtonSettings",
  async ({ profileType, data }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await updateContactSavebtn(profileType, data, isTemplatePage);
      showToast("success", "Save Contact button updated successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update Save Contact button!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchContactButtonSettings = createAsyncThunk(
  "profile/fetchContactButtonSettings",
  async ({ profileType }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await getContactSavebtn(profileType, isTemplatePage);
      return res.data;
    } catch (err) {
      showToast("error", "Failed to fetch Save Contact button settings!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveCustomLinkCustomization = createAsyncThunk(
  "profile/saveCustomLinkCustomization",
  async ({ profileType, customizationData }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await updateCustomLinksCustomization(
        profileType,
        customizationData,
        isTemplatePage,
      );
      return res.data.customLinkCustomization;
    } catch (err) {
      showToast("error", "Failed to save custom link customization!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const savePlatfromLinkCustomization = createAsyncThunk(
  "profile/savePlatfromLinkCustomization",
  async (
    { profileType, platfromcustomizationData },
    { rejectWithValue, getState },
  ) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");

    try {
      const res = await updatePlatfromLinksCustomization(
        profileType,
        platfromcustomizationData,
        isTemplatePage,
      );
      return res.data.platformLinkCustomization;
    } catch (err) {
      showToast("error", "Failed to save platform link customization!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveMedia = createAsyncThunk(
  "profile/saveMedia",
  async ({ profileType, formData }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await uploadMedia(profileType, formData, isTemplatePage);
      showToast("success", "Profile updated successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update profile");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateMediaCustomization = createAsyncThunk(
  "profile/updateMediaCustomization",
  async ({ profileType, layout, media }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const payload = {
        layout,
        media,
        // Some backends name this `media_sequence`; sending both is harmless.
        media_sequence: media,
      };
      const res = await updateMediaSequenceAndLayout(
        profileType,
        payload,
        isTemplatePage,
      );
      showToast("success", "Media updated successfully!");
      return res.data ?? payload;
    } catch (err) {
      showToast("error", "Failed to update media");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteMediaAsync = createAsyncThunk(
  "profile/deleteMediaAsync",
  async ({ profileType, mediaId }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await deleteMediaAPI(profileType, mediaId, isTemplatePage);
      return res.data;
    } catch (err) {
      showToast("error", "Failed to delete media");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateCustomLinkSequence = createAsyncThunk(
  "profile/updateCustomLinkSequence",
  async ({ profileType, links }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const payload = {
        links: links?.map((link, index) => ({
          id: link.id,
          is_visible: link.isVisible ?? true,
          sequence: index + 1,
        })),
      };

      const res = await updateCustomLinksequence(
        profileType,
        payload,
        isTemplatePage,
      );
      return payload;
    } catch (err) {
      console.error(err);
      showToast("error", "Sequence update failed gdfgf");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteCustomLink = createAsyncThunk(
  "profile/deleteCustomLinks",
  async ({ profileType, linkToDelete }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await deleteCustomLinks(
        profileType,
        linkToDelete,
        isTemplatePage,
      );
      return linkToDelete;
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete custom link!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deletePlatformLink = createAsyncThunk(
  "profile/deletePlatformLinks",
  async ({ profileType, linkToDelete }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await deletePlatformLinks(
        profileType,
        linkToDelete,
        isTemplatePage,
      );

      return linkToDelete;
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete platform link!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updatedCustomLink = createAsyncThunk(
  "profile/updatedCustomLinks",
  async ({ profileType, data, id }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");

    try {
      const res = await updatedCustomLinks(
        profileType,
        data,
        id,
        isTemplatePage,
      );
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update custom link!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updatedPlatfromLink = createAsyncThunk(
  "profile/updatedPlatfromLink",
  async ({ profileType, payload, id }, { rejectWithValue, getState }) => {
    const pathname = getState().pagePath.pathname;
    console.log(pathname, "pathname");

    const isTemplatePage = pathname.includes("template");
    try {
      const res = await updatedPlatformLinks(
        profileType,
        id,
        payload,
        isTemplatePage,
      );
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update platform link!");
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const initialState = {
  profileType:
    typeof window !== "undefined"
      ? localStorage.getItem("profileType") || "personal"
      : "personal",
  user: null,
  profile: {
    id: null,
    user_id: null,
    first_name: "",
    last_name: "",
    business_name: "",
    username: "",
    bio: "",
    profile_image: null,
    banner: null,
    logo: null,
    last_username_update: null,
  },
  customization: {
    id: null,
    user_profile_id: null,
    profile_id: null,
    about_text_color: "#ffffff",
    font_family: "Arial",
    font_size: 12,
    background_color: "#000000",
    background_image: null,
    background_blur: 10,
    layout: "DEFAULT",
    created_at: null,
    updated_at: null,
  },
  customLinkCustomization: {
    layout: "ICONS",
    background_color: "#ffffff",
    title_color: "#000000",
  },
  platformLinkCustomization: {
    layout: "ICONS",
    background_color: "#ffffff",
    title_color: "#000000",
  },
  fields: [],
  profile_image: null,
  logo: null,
  banner: null,
  profileShape: "circle",
  linkStyle: "icons",
  iconStyle: "DEFAULT",
  customLinkStyle: "CAROUSAL",
  linkColor: "",
  titleColor: "",
  backgroundColor: "#000000",
  customtitleColor: "",
  custombackgroundColor: "",
  casualBg: "gradient",
  platformLinks: [],
  businessExistingPlatformLinks: [],
  businessExistingPlatformLinksLoading: false,
  customLinks: [],
  leadCapture: false,
  emailToggle: false,
  emailLayout: "left",
  products: [],
  productLayout: "carousel",
  medias: [],
  mediaLayout: "carousel",
  emailBtnBgColor: "",
  emailBtnTextColor: "",
  saveContact: false,
  saveBtntext: "Save Contact",
  saveBtnBgColor: "",
  saveBtnTextColor: "",
  productCardbgColor: "",
  productCardTextColor: "",
  buyBtnBgColor: "",
  buyBtnTextColor: "",
  emailFormTitle: "",
  emailSuccessMessage: "",
  emailFormDescription: "",
  emailBtnText: "",
  buttonCornerRadius: 0, // Legacy/Combined
  newsletterButtonRadius: 16,
  saveBtnBBorderRadius: 16,
  platformLinkBackGroundColor: "#ffffff",
  platformNameTextColor: "#000000",
  platformUrlTextColor: "#ffffff",
  loading: false,
  cropModalOpen: false,
  cropImageSrc: null,
  cropType: "round",
  cropFor: "",
  activeTab: "about",
  userActiveProfiles: [],
  template_name: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileType(state, { payload }) {
      state.profileType = payload;
    },
    setActiveTab(state, { payload }) {
      state.activeTab = payload;
    },
    setuserActiveProfiles(state, { payload }) {
      state.userActiveProfiles = payload;
    },
    setLinkStyle: (state, action) => {
      const payload = action.payload;
      if (typeof payload === "string") {
        state.linkStyle = payload;
      } else if (payload && typeof payload === "object") {
        if (payload.id) state.linkStyle = payload.id;
        if (payload.casualBg !== undefined) state.casualBg = payload.casualBg;
      }
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProfileShape: (state, action) => {
      state.profileShape = action.payload;
    },
    setSavebtntext(state, { payload }) {
      state.saveBtntext = payload;
    },
    setEmailBtnText(state, { payload }) {
      state.emailBtnText = payload;
    },
    reorderCustomLinks(state, action) {
      state.customLinks = action.payload;
    },
    setIconStyle: (state, action) => {
      state.iconStyle = action.payload;
    },
    setCropResult(state, { payload }) {
      const { type, file, shape } = payload;

      if (type === "profile") {
        state.profile_image = file;
        state.profileShape = shape;
      }

      if (type === "logo") {
        state.logo = file;
        state.logoShape = shape;
      }

      if (type === "banner") {
        state.banner = file;
        state.bannerShape = shape;
      }
    },

    setuser(state, action) {
      state.profile.username = action.payload.username;
    },
    setEmailFormTitle: (state, action) => {
      state.emailFormTitle = action.payload;
    },
    setEmailFormDescription: (state, action) => {
      state.emailFormDescription = action.payload;
    },
    setEmailSuccessMessage: (state, action) => {
      state.emailSuccessMessage = action.payload;
    },
    setButtonCornerRadius: (state, action) => {
      // Keep for backward compatibility if needed, but we'll use specific ones now
      state.buttonCornerRadius = action.payload;
      state.newsletterButtonRadius = action.payload;
      state.saveBtnBBorderRadius = action.payload;
    },
    setNewsletterButtonRadius: (state, action) => {
      state.newsletterButtonRadius = action.payload;
    },
    setSaveContactButtonRadius: (state, action) => {
      state.saveBtnBBorderRadius = action.payload;
    },
    setPlatformCustomization: (state, action) => {
      const { backgroundColor, nameTextColor, urlTextColor, iconStyle } =
        action.payload;
      state.platformLinkBackGroundColor =
        backgroundColor || state.platformLinkBackGroundColor;
      state.platformNameTextColor =
        nameTextColor || state.platformNameTextColor;
      state.platformUrlTextColor = urlTextColor || state.platformUrlTextColor;
      if (iconStyle) state.iconStyle = iconStyle;
    },
    addProduct: (state, action) => {
      state.products.push({
        ...action.payload,
        isVisible: true,
      });
    },

    addField: (state, action) => {
      const p = action.payload || {};
      const field_type = (p.field_type || p.type || "").toUpperCase();
      if (!field_type) return;

      // Uniqueness check: keep standard fields unique, but allow multiples for "CUSTOM"
      const existing =
        field_type !== "CUSTOM" &&
        state.fields.find((f) => f.field_type === field_type);
      if (existing) {
        existing.is_enabled = true;
        existing.label = p.label ?? existing.label;
        existing.placeholder = p.placeholder ?? existing.placeholder;
        return;
      }

      const maxSort = state.fields.reduce(
        (m, f) => Math.max(m, f.sort_order ?? 0),
        0,
      );

      state.fields.push({
        id: p.id ?? Date.now(),
        field_type,
        label: p.label ?? "",
        placeholder: p.placeholder ?? "",
        is_enabled: p.is_enabled ?? true,
        sort_order: p.sort_order ?? maxSort + 1,
      });
    },

    removeField: (state, action) => {
      const id = action.payload?.id ?? action.payload;
      state.fields = (state.fields || []).filter((f) => f.id !== id);
    },

    setFieldEnabled: (state, { payload }) => {
      const ft = (payload.field_type || "").toUpperCase();
      const enabled = !!payload.is_enabled;
      if (!ft) return;

      const f = state.fields.find((x) => x.field_type === ft);

      if (f) {
        f.is_enabled = enabled;
        return;
      }
      if (enabled) {
        const maxSort = state.fields.reduce(
          (m, x) => Math.max(m, x.sort_order ?? 0),
          0,
        );
        state.fields.push({
          id: Date.now(),
          field_type: ft,
          label: payload.label ?? ft,
          placeholder: payload.placeholder ?? "",
          is_enabled: true,
          sort_order: maxSort + 1,
        });
      }
    },

    updateFieldOrder: (state, action) => {
      state.fields = action.payload;
    },

    setProductLayout: (state, action) => {
      state.productLayout = action.payload;
    },
    setproductCardbgColor: (state, action) => {
      state.productCardbgColor = action.payload;
    },
    setbuyBtnBgColor: (state, action) => {
      state.buyBtnBgColor = action.payload;
    },
    setbuyBtnTextColor: (state, action) => {
      state.buyBtnTextColor = action.payload;
    },
    setproductCardTextColor: (state, action) => {
      state.productCardTextColor = action.payload;
    },
    setMedias: (state, action) => {
      state.medias = action.payload;
    },
    addMedia: (state, action) => {
      state.medias.push(action.payload);
    },
    setMediaLayout: (state, action) => {
      state.mediaLayout = action.payload;
    },
    setLeadCapture: (state, action) => {
      state.leadCapture = action.payload;
    },
    toggleProductVisibility: (state, action) => {
      const id = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.isVisible = !product.isVisible;
      }
    },

    setEmailToggle: (state, action) => {
      state.emailToggle = action.payload;
    },
    setEmailLayout: (state, action) => {
      state.emailLayout = action.payload;
    },
    setSaveContact: (state, action) => {
      state.saveContact = action.payload;
    },
    setEmailBtnBgColor: (state, action) => {
      state.emailBtnBgColor = action.payload;
    },
    setEmailBtnTextColor: (state, action) => {
      state.emailBtnTextColor = action.payload;
    },

    setSaveBtnBgColor: (state, action) => {
      state.saveBtnBgColor = action.payload;
    },
    setSaveBtnTextColor: (state, action) => {
      state.saveBtnTextColor = action.payload;
    },
    // toggleBusinessProfile(state, action) {
    //   state.isBusinessProfile = action.payload;
    // },

    setColorCustomization: (state, action) => {
      const { colorType, colorValue } = action.payload;
      if (colorType === "url") {
        state.linkColor = colorValue;
      } else if (colorType === "name") {
        state.titleColor = colorValue;
      } else if (colorType === "background") {
        state.backgroundColor = colorValue;
      }
    },
    setcustomColorCustomization: (state, action) => {
      const { colorType, colorValue } = action.payload;
      if (colorType === "name") {
        state.customtitleColor = colorValue;
      } else if (colorType === "background") {
        state.custombackgroundColor = colorValue;
      }
    },
    setcustomLinkstyle: (state, action) => {
      const payload = action.payload;
      if (typeof payload === "string") {
        state.customLinkStyle = payload;
      }
      if (payload && typeof payload === "object") {
        if (payload.id) state.customLinkStyle = payload.id;
      }
    },
    setCropModal(state, { payload }) {
      state.cropModalOpen = payload.open;
      if (payload.src !== undefined) state.cropImageSrc = payload.src;
      if (payload.type) state.cropType = payload.type;
      if (payload.for) state.cropFor = payload.for;
    },
    setCropResult(state, { payload }) {
      const { type, url } = payload;
      if (type === "profile") state.profile_image = url;
      if (type === "logo") state.logo = url;
      if (type === "banner") state.banner = url;
    },
    setProfileField(state, { payload }) {
      const { name, value } = payload;
      state.profile[name] = value;
    },
    setContactFieldValue: (state, { payload }) => {
      const { id, value } = payload;
      const field = (state.fields || []).find((f) => f.id === id);
      if (field) field.placeholder = value;
    },
    setFieldLabel: (state, { payload }) => {
      const { id, label } = payload;
      const field = (state.fields || []).find((f) => f.id === id);
      if (field) field.label = label;
    },
    toggleVisibility: (state, action) => {
      const id = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.isVisible = !product.isVisible;
      }
    },
    toggleLinkVisibility: (state, action) => {
      const id = action.payload;
      const link = state.platformLinks.find((p) => p.id === id);
      if (link) {
        link.isVisible = !link.isVisible;
      }
    },
    addPlatformLink: (state, action) => {
      const { username, platform_name } = action.payload;
      state.platformLinks.push({
        username,
        platform_name,
      });
    },
    removePlatformLink: (state, action) => {
      state.platformLinks.splice(action.payload, 1);
    },
    setPlatformLinks: (state, action) => {
      state.platformLinks = action.payload;
    },

    addCustomLink: (state, { payload }) => {
      const { platform_name, username } = payload;
      state.customLinks.push({ platform_name, username });
    },
    removeCustomLink: (state, action) => {
      state.customLinks.splice(action.payload, 1);
    },
    setCustomLinks: (state, action) => {
      state.customLinks = action.payload;
    },

    setCustomlink: (state, { payload }) => {
      const { id, url, title, icon, isVisible } = payload;
      state.customLinks.push({ id, url, title, icon, isVisible: true });
    },

    setBg(state, { payload }) {
      state.customization.background_color = payload;
    },
    setbackGroundImage(state, { payload }) {
      state.customization.background_image = payload;
    },
    setBlur(state, { payload }) {
      state.customization.background_blur = payload;
    },
    setTextColor(state, { payload }) {
      state.customization.about_text_color = payload;
    },
    setFontFamily(state, { payload }) {
      state.customization.font_family = payload;
    },
    setFontSize(state, { payload }) {
      state.customization.font_size = payload;
    },

    setProfileViewData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetProfileState: (state, action) => {
      return {
        ...initialState,
        profileType: action.payload || state.profileType,
      };
    },
    hydrateProfile: (state, action) => {
      return {
        ...initialState,
        profileType: action.payload?.profileType || state.profileType,
        ...action.payload,
      };
    },
    deleteMedia: (state, action) => {
      const id = action.payload?.mediaId || action.payload;
      state.medias = state.medias.filter((m) => m.id !== id);
    },

    toggleMediaVisibility: (state, action) => {
      const id = action.payload;
      const media = state.medias.find((m) => m.id === id);
      if (media) {
        media.isVisible = media.isVisible === false ? true : false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Optional: update state with returned profile
        if (action.payload?.profile) {
          state.profile = action.payload.profile;
        }
      })
      .addCase(createProfile.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;

        const {
          profile,
          customization,
          customLinks,
          linkCustomization,
          links,
          customLinkCustomization,
          media,
          mediaCustomization,
          contact,
          contactFields,
          saveContact,
          mappedProfileState, // <- NEW
        } = action.payload;

        if (profile) {
          state.profile = profile;

          // 🔒 keep redux in sync with backend
          if (profile.profile_type) {
            state.profileType = profile.profile_type;
          }
        }

        if (customization) state.customization = customization;
        if (customLinks) state.customLinks = customLinks;
        if (customLinkCustomization)
          state.customLinkCustomization = customLinkCustomization;
        if (media) state.medias = media;
        const contactData = contact || {};
        state.emailToggle = contactData.is_enabled ?? state.emailToggle;
        state.emailFormTitle = contactData.title ?? state.emailFormTitle;
        state.emailFormDescription =
          contactData.description ?? state.emailFormDescription;
        state.emailLayout = contactData.layout === "CARD" ? "right" : "left";
        state.emailBtnBgColor =
          contactData.button_bg_color ?? state.emailBtnBgColor;
        state.emailBtnTextColor =
          contactData.button_text_color ?? state.emailBtnTextColor;
        state.newsletterButtonRadius =
          contactData.button_corner_radius ?? state.newsletterButtonRadius;
        state.buttonCornerRadius =
          contactData.button_corner_radius ?? state.buttonCornerRadius;
        state.emailSuccessMessage =
          contactData.success_message ?? state.emailSuccessMessage;
        state.emailBtnText = contactData.button_text ?? state.emailBtnText;
        if (contactFields) state.contactFields = contactFields;
        if (saveContact) {
          state.saveContact = !!saveContact.is_enabled;
          state.saveBtntext = saveContact.button_text ?? state.saveBtntext;
          state.saveBtnBgColor =
            saveContact.button_bg_color ?? state.saveBtnBgColor;
          state.saveBtnTextColor =
            saveContact.button_text_color ?? state.saveBtnTextColor;
          state.saveBtnBBorderRadius =
            saveContact.button_corner_radius ?? state.saveBtnBBorderRadius;
          state.buttonCornerRadius =
            saveContact.button_corner_radius ?? state.buttonCornerRadius;
        }
        if (media) {
          state.medias = media.map((m) => ({
            id: m.id,
            url: m.media_url,
            sequence: m.sequence,
            isVisible: m.is_visible ?? true,
          }));
        }
        // 🔑 merge the mapped state so LivePreview fields are hydrated
        if (mappedProfileState) {
          Object.assign(state, mappedProfileState);
        }
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(saveProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;

        const { profile, customization } = action.payload ?? {};
        if (profile) {
          state.profile = { ...state.profile, ...profile };

          if (profile.profile_type) {
            state.profileType = profile.profile_type;
          }
        }

        if (customization)
          state.customization = { ...state.customization, ...customization };
      })
      .addCase(saveProfile.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(fetchCustomLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomLinks.fulfilled, (state, action) => {
        state.loading = false;
        let payloadLinks =
          action.payload.customLinks ||
          action.payload.customLink ||
          action.payload.links ||
          action.payload.data;
        if (Array.isArray(action.payload)) payloadLinks = action.payload;

        if (Array.isArray(payloadLinks)) {
          state.customLinks = payloadLinks.map((l) => ({
            ...l,
            isVisible: l.isVisible ?? l.is_visible ?? true,
          }));
        } else if (
          payloadLinks == null &&
          !Array.isArray(action.payload.customLinks)
        ) {
          // fallback if nothing matches, preserve existing links or clear if explicitly empty
          if (
            action.payload.customLinks === undefined &&
            Object.keys(action.payload).length > 0
          ) {
            // probably a weird response format, don't wipe
          }
        } else {
          state.customLinks = [];
        }

        state.customLinkCustomization =
          action.payload.customLinkCustomization ??
          state.customLinkCustomization;
      })
      .addCase(fetchCustomLinks.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(saveCustomLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveCustomLinks.fulfilled, (state, action) => {
        state.loading = false;
        const { customLink, customLinkCustomization } = action.payload ?? {};
        if (customLink) {
          state.customLinks.push({
            ...customLink,
            isVisible: customLink.isVisible ?? customLink.is_visible ?? true,
          });
        }
        if (customLinkCustomization)
          state.customLinkCustomization = customLinkCustomization;
      })
      .addCase(saveCustomLinks.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(fetchExistingBusinessPlatformLinks.pending, (state) => {
        state.businessExistingPlatformLinksLoading = true;
      })
      .addCase(
        fetchExistingBusinessPlatformLinks.fulfilled,
        (state, action) => {
          state.businessExistingPlatformLinksLoading = false;
          state.businessExistingPlatformLinks = action.payload ?? [];
        },
      )
      .addCase(fetchExistingBusinessPlatformLinks.rejected, (state) => {
        state.businessExistingPlatformLinksLoading = false;
      });

    builder.addCase(fetchPlatformLinks.fulfilled, (state, action) => {
      state.loading = false;

      const { links = [], linkCustomization } = action.payload;
      state.platformLinks = links.map((link) => {
        const pl = link.PlatformLink || {};

        const svgToDataUrl = (svgString) => {
          if (!svgString || !svgString.trim().startsWith("<svg"))
            return svgString;
          try {
            const encoded = btoa(unescape(encodeURIComponent(svgString)));
            return `data:image/svg+xml;base64,${encoded}`;
          } catch (e) {
            return svgString;
          }
        };

        return {
          id: link.id,
          username: link.username || "",
          url: link.url || "",
          title: link.title || pl.name,
          name: pl.name || "Link",
          icon: svgToDataUrl(pl.default_icon),
          icons: {
            DEFAULT: svgToDataUrl(pl.default_icon),
            BLACK: svgToDataUrl(pl.black_icon),
            STROKED: svgToDataUrl(pl.stroked_icon),
            COLORED: svgToDataUrl(pl.colored_icon),
            WHITE: svgToDataUrl(pl.white_icon),
          },
          isVisible: link.is_visible ?? true,
          platform_link_id: link.platform_link_id,
        };
      });
      if (linkCustomization) {
        state.platformLinkCustomization = {
          layout: linkCustomization.layout || "ICONS",
          background_color: linkCustomization.background_color || "#ffffff",
          title_color: linkCustomization.title_color || "#000000",
          link_color: linkCustomization.link_color || "#0000ee",
        };
      }
    });
    builder.addCase(savePlatfromLinks.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload;

      const newLink = payload?.platformLink ?? payload;
      if (!newLink) return;

      const idx = state.platformLinks.findIndex(
        (l) => l.id === newLink.id || l.platform_name === newLink.platform_name,
      );

      const linkData = {
        ...newLink,
        title: newLink.title || newLink.platform_name,
        isVisible: true,
      };

      if (idx >= 0) {
        state.platformLinks[idx] = { ...state.platformLinks[idx], ...linkData };
      } else {
        state.platformLinks.push(linkData);
      }
    });
    builder
      .addCase(fetchContactForm.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload || {};
        const contactData = data.contact || {};
        const fieldsData = data.fields || [];
        state.emailFormTitle = contactData.title ?? state.emailFormTitle;
        state.emailFormDescription =
          contactData.description ?? state.emailFormDescription;
        state.emailLayout = contactData.layout === "CARD" ? "right" : "left";
        state.emailBtnBgColor =
          contactData.button_bg_color ?? state.emailBtnBgColor;
        state.emailBtnTextColor =
          contactData.button_text_color ?? state.emailBtnTextColor;
        state.newsletterButtonRadius =
          contactData.button_corner_radius ?? state.newsletterButtonRadius;
        state.buttonCornerRadius =
          contactData.button_corner_radius ?? state.buttonCornerRadius;
        state.emailSuccessMessage =
          contactData.success_message ?? state.emailSuccessMessage;
        state.emailBtnText = contactData.button_text ?? state.emailBtnText;
        state.fields = fieldsData
          .map((f, i) => ({
            id: f.id ?? Date.now() + i,
            field_type: (f.field_type ?? "").toUpperCase(),
            label: f.label ?? "",
            placeholder: f.placeholder ?? "",
            is_enabled: f.is_enabled ?? true,
            sort_order: f.sort_order ?? i + 1,
          }))
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        state.emailToggle = contactData.is_enabled ?? state.emailToggle;
      })
      .addCase(saveContactForm.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload || {};
        const contactData = data.contact || {};
        const fieldsData = data.fields || [];

        // Update contact specific state
        state.emailFormTitle = contactData.title ?? state.emailFormTitle;
        state.emailFormDescription =
          contactData.description ?? state.emailFormDescription;
        state.emailLayout = contactData.layout === "CARD" ? "right" : "left";
        state.emailBtnBgColor =
          contactData.button_bg_color ?? state.emailBtnBgColor;
        state.emailBtnTextColor =
          contactData.button_text_color ?? state.emailBtnTextColor;
        state.emailBtnText = contactData.button_text ?? state.emailBtnText;
        state.emailSuccessMessage =
          contactData.success_message ?? state.emailSuccessMessage;
        state.newsletterButtonRadius =
          contactData.button_corner_radius ?? state.newsletterButtonRadius;
        state.buttonCornerRadius =
          contactData.button_corner_radius ?? state.buttonCornerRadius;
        state.emailToggle = contactData.is_enabled ?? state.emailToggle;

        // Update fields with backend IDs
        state.fields = fieldsData
          .map((f, i) => ({
            id: f.id,
            field_type: (f.field_type ?? "").toUpperCase(),
            label: f.label ?? "",
            placeholder: f.placeholder ?? "",
            is_enabled: f.is_enabled ?? true,
            sort_order: f.sort_order ?? i + 1,
          }))
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      })
      .addCase(saveContactForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveContactForm.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchContactForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContactForm.rejected, (state) => {
        state.loading = false;
        showToast("error", "Failed to fetch contact form!");
      });
    builder
      .addCase(fetchContactButtonSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContactButtonSettings.fulfilled, (state, action) => {
        state.loading = false;
        const { saveContact } = action.payload || {};

        if (saveContact) {
          state.saveBtntext = saveContact.button_text ?? state.saveBtntext;
          state.saveBtnBgColor =
            saveContact.button_bg_color ?? state.saveBtnBgColor;
          state.saveBtnTextColor =
            saveContact.button_text_color ?? state.saveBtnTextColor;
          state.saveBtnBBorderRadius =
            saveContact.button_corner_radius ?? state.saveBtnBBorderRadius;
          state.buttonCornerRadius =
            saveContact.button_corner_radius ?? state.buttonCornerRadius;
          state.saveContact = !!saveContact.is_enabled;
        }
      })
      .addCase(fetchContactButtonSettings.rejected, (state) => {
        state.loading = false;
        showToast("error", "Failed to fetch Save Contact button settings!");
      });

    builder
      .addCase(saveContactButtonSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveContactButtonSettings.fulfilled, (state, action) => {
        state.loading = false;
        const {
          button_text,
          button_corner_radius,
          button_bg_color,
          button_text_color,
          is_enabled,
        } = action.payload || {};
        state.saveBtntext = button_text ?? state.saveBtntext;
        state.saveBtnBgColor = button_bg_color ?? state.saveBtnBgColor;
        state.saveBtnTextColor = button_text_color ?? state.saveBtnTextColor;
        state.saveBtnBBorderRadius =
          button_corner_radius ?? state.saveBtnBBorderRadius;
        state.buttonCornerRadius =
          button_corner_radius ?? state.buttonCornerRadius;
        state.saveContact =
          is_enabled !== undefined ? !!is_enabled : state.saveContact;
      })
      .addCase(saveContactButtonSettings.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(saveCustomLinkCustomization.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveCustomLinkCustomization.fulfilled, (state, action) => {
        state.loading = false;
        const customLinkCustomization = action.payload;
        state.customLinkCustomization = customLinkCustomization;
      })
      .addCase(saveCustomLinkCustomization.rejected, (state) => {
        state.loading = false;
        showToast("error", "Failed to save custom link customization!");
      });
    builder
      .addCase(savePlatfromLinkCustomization.pending, (state) => {
        state.loading = true;
      })
      .addCase(savePlatfromLinkCustomization.fulfilled, (state, action) => {
        state.loading = false;
        const platformLinkCustomization = action.payload;

        if (platformLinkCustomization) {
          state.platformLinkBackGroundColor =
            platformLinkCustomization.background_color || "#ffffff";
          state.platformNameTextColor =
            platformLinkCustomization.title_color || "#000000";
          state.platformUrlTextColor =
            platformLinkCustomization.link_color || "#ffffff";
          if (platformLinkCustomization.layout) {
            state.linkStyle = platformLinkCustomization.layout.toLowerCase();
          }
        }
      })
      .addCase(savePlatfromLinkCustomization.rejected, (state) => {
        state.loading = false;
        showToast("error", "Failed to save custom link customization!");
      });

    builder
      .addCase(saveMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveMedia.fulfilled, (state, action) => {
        state.loading = false;
        const { media, mediaCustomization } = action.payload ?? {};

        if (Array.isArray(media)) {
          media.forEach((m) => {
            const formatted = {
              id: m.id,
              url: m.media_url,
              sequence: m.sequence,
            };

            const exists = state.medias.some((x) => x.id === formatted.id);

            if (!exists) {
              state.medias.push(formatted);
            }
          });
        }

        if (mediaCustomization?.layout) {
          state.mediaLayout = mediaCustomization.layout.toLowerCase();
        }
      })
      .addCase(saveMedia.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateMediaCustomization.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMediaCustomization.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMediaCustomization.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(deleteCustomLink.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCustomLink.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.customLinks = state.customLinks.filter(
          (link) => link.id !== deletedId,
        );
      })
      .addCase(deleteCustomLink.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(updatedCustomLink.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatedCustomLink.fulfilled, (state, action) => {
        state.loading = false;
        const updatedLink = action.payload;
        state.customLinks = state.customLinks.map((link) =>
          link.id === updatedLink.id ? updatedLink : link,
        );
      })
      .addCase(updatedCustomLink.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(deletePlatformLink.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePlatformLink.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.platformLinks = state.platformLinks.filter(
          (link) => link.id !== deletedId,
        );
      })
      .addCase(deletePlatformLink.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(deleteMediaAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMediaAsync.fulfilled, (state, action) => {
        state.loading = false;

        const media = action.payload.media || [];

        // ✅ Use backend as source of truth
        state.medias = media.map((m) => ({
          id: m.id,
          url: m.media_url,
          sequence: m.sequence,
          isVisible: m.is_visible ?? true,
        }));
      })
      .addCase(deleteMediaAsync.rejected, (state) => {
        state.loading = false;
      });

    builder.addCase(toggleContactStatus.fulfilled, (state, action) => {
      state.emailToggle = action.payload.is_enabled;
    });
    builder.addCase(toggleSaveContactStatus.fulfilled, (state, action) => {
      state.saveContact = action.payload.is_enabled;
    });
  },
});
export const {
  setProfileType,
  setActiveTab,
  setCropModal,
  setCropResult,
  setProfileField,
  setBg,
  setBlur,
  setTextColor,
  setFontFamily,
  setLinkStyle,
  addPlatformLink,
  removePlatformLink,
  setPlatformLinks,
  addCustomLink,
  removeCustomLink,
  setIconStyle,
  setColorCustomization,
  setcustomColorCustomization,
  setCustomLinks,
  setCustomlink,
  setcustomLinkstyle,
  setLeadCapture,
  setEmailLayout,
  setSaveContact,
  setProducts,
  addProduct,

  setProductLayout,
  setMediaLayout,
  addMedia,
  setMedias,
  setEmailToggle,
  setEmailBtnBgColor,
  setEmailBtnTextColor,
  setSaveBtnBgColor,
  setSaveBtnTextColor,
  setproductCardTextColor,
  setproductCardbgColor,
  setbuyBtnBgColor,
  setbuyBtnTextColor,
  toggleVisibility,
  toggleLinkVisibility,
  setProfileShape,
  addField,
  removeField,
  updateFieldOrder,
  setEmailFormTitle,
  setEmailFormDescription,
  setEmailSuccessMessage,
  setButtonCornerRadius,
  setPlatformCustomization,
  setFontSize,
  setbackGroundImage,
  setuser,
  setFieldEnabled,
  setContactFieldValue,
  setFieldLabel,
  setSavebtntext,
  reorderCustomLinks,
  // toggleBusinessProfile,
  setEmailBtnText,
  setNewsletterButtonRadius,
  setSaveContactButtonRadius,
  setuserActiveProfiles,
  setProfileViewData,
  resetProfileState,
  hydrateProfile,
  deleteMedia,
  toggleMediaVisibility,
} = profileSlice.actions;

export default profileSlice.reducer;
