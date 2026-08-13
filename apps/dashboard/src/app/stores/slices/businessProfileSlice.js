import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteCustomLinks,
  deletePlatformLinks,
  getContactForm,
  getContactSavebtn,
  getCustomLinks,
  getPlatformLinks,
  getUserBussinesProfile,
  updateBussnieUserProfile,
  updateContactForm,
  updateContactSavebtn,
  updateCustomLinks,
  updateCustomLinksCustomization,
  updateCustomLinksequence,
  updatedCustomLinks,
  updatedPlatformLinks,
  updatePlatformLinks,
  updatePlatformLinksequence,
  updatePlatfromLinksCustomization,
  updateUserProfile,
  uploadMedia,
} from "@/services/businessuser";
import { showToast } from "@/store/utils/toast";

export const fetchBussinessProfile = createAsyncThunk(
  "profile/fetch",
  async (isBusinessProfile = false, { rejectWithValue }) => {
    try {
      const res = await getUserBussinesProfile(isBusinessProfile); // Pass isBusinessProfile to API

      // Return all parts of the response that need to be mapped
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
      } = res.data;

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
      };
    } catch (err) {
      showToast("error", "Failed to fetch profile!");
      return rejectWithValue(err.response?.data);
    }
  },
);
export const saveProfile = createAsyncThunk(
  "profile/save",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateUserProfile(formData);
      showToast("success", "Profile updated successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update profile");
      return rejectWithValue(err.response?.data);
    }
  },
);
export const BussinessaveProfile = createAsyncThunk(
  "profile/save",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateBussnieUserProfile(formData);
      showToast("success", "Profile updated successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update profile");
      return rejectWithValue(err.response?.data);
    }
  },
);
export const fetchCustomLinks = createAsyncThunk(
  "profile/fetchCustomLinks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCustomLinks();
      return res.data;
    } catch (err) {
      showToast("error", "Failed to fetch custom links!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveCustomLinks = createAsyncThunk(
  "profile/saveCustomLinks",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateCustomLinks(formData);
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
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updatePlatformLinks(formData);
      // Only show success toast here if you want
      // showToast("success", "Platform link saved!");
      return res.data; // This makes it fulfilled
    } catch (err) {
      // Only come here on real network/error issues
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
  async (_, { rejectWithValue }) => {
    try {
      const res = await getPlatformLinks();

      return res.data;
    } catch (err) {
      showToast("error", "Failed to fetch platform links!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updatePlatformLinkSequence = createAsyncThunk(
  "profile/updateProfileLinkSequence",
  async (links, { rejectWithValue }) => {
    try {
      const payload = {
        links: links.map((link) => ({
          id: link.id,
          is_visible: link.isVisible ?? true,
        })),
      };

      const res = await updatePlatformLinksequence(payload); // 👈 sequence API
      return payload;
    } catch (err) {
      showToast("error", "Sequence update failed");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchContactForm = createAsyncThunk(
  "profile/fetchContactForm",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getContactForm();
      return res.data;
    } catch (err) {
      showToast("error", "Failed to fetch contact form!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveContactForm = createAsyncThunk(
  "profile/saveContactForm",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateContactForm(data);
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
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateContactSavebtn(data);
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
  async (_, { rejectWithValue }) => {
    try {
      const res = await getContactSavebtn();
      return res.data;
    } catch (err) {
      showToast("error", "Failed to fetch Save Contact button settings!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveCustomLinkCustomization = createAsyncThunk(
  "profile/saveCustomLinkCustomization",
  async (customizationData, { rejectWithValue }) => {
    try {
      const res = await updateCustomLinksCustomization(customizationData);
      return res.data.customLinkCustomization;
    } catch (err) {
      showToast("error", "Failed to save custom link customization!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const savePlatfromLinkCustomization = createAsyncThunk(
  "profile/savePlatfromLinkCustomization",
  async (customizationData, { rejectWithValue }) => {
    try {
      const res = await updatePlatfromLinksCustomization(customizationData);

      return res.data.customLinkCustomization;
    } catch (err) {
      showToast("error", "Failed to save custom link customization!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const saveMedia = createAsyncThunk(
  "profile/saveMedia",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await uploadMedia(formData);
      showToast("success", "Profile updated successfully!");
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update profile");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateCustomLinkSequence = createAsyncThunk(
  "profile/updateCustomLinkSequence",
  async (links, { rejectWithValue }) => {
    try {
      const payload = {
        links: links.map((link) => ({
          id: link.id,
          is_visible: link.isVisible ?? true,
        })),
      };

      const res = await updateCustomLinksequence(payload);
      return payload;
    } catch (err) {
      showToast("error", "Sequence update failed");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteCustomLink = createAsyncThunk(
  "profile/deleteCustomLinks",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteCustomLinks(id);
      return id;
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete custom link!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deletePlatformLink = createAsyncThunk(
  "profile/deletePlatformLinks",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deletePlatformLinks(id);
      return id;
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete custom link!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updatedCustomLink = createAsyncThunk(
  "profile/updatedCustomLinks",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const res = await updatedCustomLinks(data, id);
      return res.data;
    } catch (err) {
      showToast("error", "Failed to update custom link!");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updatedPlatfromLink = createAsyncThunk(
  "profile/updatedPlatfromLink",
  async ({ payload, id }, { rejectWithValue }) => {
    try {
      const res = await updatedPlatformLinks(id, payload);
      return res.data;
    } catch (err) {
      console.error("Error updating platform link:", err);
      showToast("error", "Failed to update custom link!");
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const bussinessprofileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    profile: {
      id: null,
      user_id: null,
      business_name: "",
      last_name: "",
      username: "",
      bio: "",
      profile_image: null,
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
    profileShape: "circle",
    linkStyle: "icons",
    customLinkStyle: "CAROUSAL",
    linkColor: "",
    titleColor: "",
    backgroundColor: "#000000",
    customtitleColor: "",
    custombackgroundColor: "",
    casualBg: "gradient",
    platformLinks: [],
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
    buttonCornerRadius: 0,
    platformLinkBackGroundColor: "#000000",
    platformNameTextColor: "#ffffff",
    platformUrlTextColor: "#ffffff",
    loading: false,
    cropModalOpen: false,
    cropImageSrc: null,
    cropType: "round",
    cropFor: "",
    activeTab: "profile",
  },
  reducers: {
    setActiveTab(state, { payload }) {
      state.activeTab = payload;
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
      state.buttonCornerRadius = action.payload;
    },
    setPlatformCustomization: (state, action) => {
      const { backgroundColor, nameTextColor, urlTextColor } = action.payload;
      state.platformLinkBackGroundColor =
        backgroundColor || state.platformLinkBackGroundColor;
      state.platformNameTextColor =
        nameTextColor || state.platformNameTextColor;
      state.platformUrlTextColor = urlTextColor || state.platformUrlTextColor;
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

      // If this field_type already exists, just enable it (no duplicates)
      const existing = state.fields.find((f) => f.field_type === field_type);
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

      // if not exist and enabling -> create it
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
      state.fields = action.payload; // whole reordered list
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
    toggleBusinessProfile(state, action) {
      state.isBusinessProfile = action.payload;
    },

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
    // In bussinessprofileSlice
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
      state.customLinks.splice(action.payload, 1); // action.payload = index
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
      // Completely replace the relevant parts of the state with the mapped data
      return {
        ...state,
        ...action.payload, // payload will be the object returned from mapProfileViewResponseToState()
      };
    },
  },
  extraReducers: (builder) => {
    // fetch profile
    builder
      .addCase(fetchBussinessProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBussinessProfile.fulfilled, (state, action) => {
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
        } = action.payload;

        if (profile) state.profile = profile;
        if (customization) state.customization = customization;
        if (customLinks) state.customLinks = customLinks;
        // if (linkCustomization) state.linkCustomization = linkCustomization;
        if (links) {
          state.platformLinks = links.map((link) => {
            const pl = link.PlatformLink || {};
            let iconSrc = pl.default_icon || "";

            // ← ADD THIS: Convert raw SVG string to base64 data URL
            if (iconSrc.startsWith("<svg")) {
              try {
                const encoded = btoa(unescape(encodeURIComponent(iconSrc)));
                iconSrc = `data:image/svg+xml;base64,${encoded}`;
              } catch (e) {
                console.warn("SVG conversion failed", e);
              }
            }
            if (
              iconSrc &&
              typeof iconSrc === "string" &&
              iconSrc.trim().startsWith("<svg")
            ) {
              try {
                const encoded = btoa(unescape(encodeURIComponent(iconSrc)));
                iconSrc = `data:image/svg+xml;base64,${encoded}`;
              } catch (e) {
                console.warn("Failed to encode platform SVG icon:", e);
                iconSrc = ""; // fallback to nothing
              }
            }

            return {
              id: link.id,
              title: link.title || pl.name,
              name: pl.name || link.title,
              url: link.url,
              icon: iconSrc, // ← Now a valid image URL
              label: link.title || pl.name,
              isVisible: link.is_visible,
            };
          });
        }
        if (customLinkCustomization)
          state.customLinkCustomization = customLinkCustomization;
        if (media) state.medias = media;
        // if (mediaCustomization) state.mediaCustomization = mediaCustomization;

        const contactData = contact || {};
        state.emailFormTitle = contactData.title ?? state.emailFormTitle;
        state.emailFormDescription =
          contactData.description ?? state.emailFormDescription;
        state.emailLayout = contactData.layout === "CARD" ? "right" : "left"; // Map layout (CARD or COMPACT)
        state.emailBtnBgColor =
          contactData.button_bg_color ?? state.emailBtnBgColor;
        state.emailBtnTextColor =
          contactData.button_text_color ?? state.emailBtnTextColor;
        state.buttonCornerRadius =
          contactData.button_corner_radius ?? state.buttonCornerRadius;
        state.emailSuccessMessage =
          contactData.success_message ?? state.emailSuccessMessage;
        state.emailBtnText = contactData.button_text ?? state.emailBtnText;
        state.buttonCornerRadius =
          contactData.button_corner_radius ?? state.buttonCornerRadius;
        if (contactFields) state.contactFields = contactFields;
        if (saveContact) state.saveContact = saveContact;
        if (media) {
          state.medias = media.map((m) => ({
            id: m.id,
            url: m.media_url,
            sequence: m.sequence,
            // you can add thumbnail if backend ever provides it
          }));
        }
      })
      .addCase(fetchBussinessProfile.rejected, (state) => {
        state.loading = false;
      });

    // save profile
    builder
      .addCase(saveProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;

        const { profile, customization } = action.payload ?? {};
        if (profile) state.profile = { ...state.profile, ...profile };
        if (customization)
          state.customization = { ...state.customization, ...customization };
      })
      .addCase(saveProfile.rejected, (state) => {
        state.loading = false;
      });

    // fetch custom links
    builder
      .addCase(fetchCustomLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.customLinks = action.payload.customLinks ?? [];
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
        if (customLink) state.customLinks.push(customLink);
        if (customLinkCustomization)
          state.customLinkCustomization = customLinkCustomization;
      })
      .addCase(saveCustomLinks.rejected, (state) => {
        state.loading = false;
      });

    builder.addCase(fetchPlatformLinks.fulfilled, (state, action) => {
      state.loading = false;

      const { links = [], linkCustomization } = action.payload;

      // Map platform links correctly
      state.platformLinks = links.map((link) => {
        const pl = link.PlatformLink || {};

        let iconSrc = pl.default_icon || "";

        // Convert raw SVG string to base64 data URL if needed
        if (
          iconSrc &&
          typeof iconSrc === "string" &&
          iconSrc.trim().startsWith("<svg")
        ) {
          try {
            const encoded = btoa(unescape(encodeURIComponent(iconSrc)));
            iconSrc = `data:image/svg+xml;base64,${encoded}`;
          } catch (e) {
            console.warn("Failed to encode platform SVG icon:", e);
            iconSrc = "";
          }
        }

        return {
          id: link.id,
          username: link.username || "",
          url: link.url || "",
          title: link.title || pl.name, // ← Custom button title
          name: pl.name || "Link", // ← Platform name (for display fallback)
          icon: iconSrc,
          isVisible: link.is_visible ?? true,
          platform_link_id: link.platform_link_id, // Keep if needed elsewhere
        };
      });

      // Update customization if provided
      if (linkCustomization) {
        state.platformLinkCustomization = {
          layout: linkCustomization.layout || "ICONS",
          background_color: linkCustomization.background_color || "#ffffff",
          title_color: linkCustomization.title_color || "#000000",
          link_color: linkCustomization.link_color || "#0000ee",
        };
      }
    });

    // save platform link
    builder.addCase(savePlatfromLinks.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload;

      // ... existing code ...

      const newLink = payload?.platformLink ?? payload;
      if (!newLink) return;

      const idx = state.platformLinks.findIndex(
        (l) => l.id === newLink.id || l.platform_name === newLink.platform_name,
      );

      const linkData = {
        ...newLink,
        title: newLink.title || newLink.platform_name, // Ensure title fallback
        isVisible: true,
      };

      if (idx >= 0) {
        state.platformLinks[idx] = { ...state.platformLinks[idx], ...linkData };
      } else {
        state.platformLinks.push(linkData);
      }
    });
    // In your slice definition
    builder
      .addCase(fetchContactForm.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload || {}; // Get the response data
        const contactData = data.contact || {}; // Extract contact data
        const fieldsData = data.fields || []; // Extract fields data

        // Map contact data to Redux state
        state.emailFormTitle = contactData.title ?? state.emailFormTitle;
        state.emailFormDescription =
          contactData.description ?? state.emailFormDescription;
        state.emailLayout = contactData.layout === "CARD" ? "right" : "left"; // Map layout (CARD or COMPACT)
        state.emailBtnBgColor =
          contactData.button_bg_color ?? state.emailBtnBgColor;
        state.emailBtnTextColor =
          contactData.button_text_color ?? state.emailBtnTextColor;
        state.buttonCornerRadius =
          contactData.button_corner_radius ?? state.buttonCornerRadius;
        state.emailSuccessMessage =
          contactData.success_message ?? state.emailSuccessMessage;
        state.emailBtnText = contactData.button_text ?? state.emailBtnText;
        state.buttonCornerRadius =
          contactData.button_corner_radius ?? state.buttonCornerRadius;
        state.fields = fieldsData
          .map((f, i) => ({
            id: f.id ?? Date.now() + i, // Generate unique ID if missing
            field_type: (f.field_type ?? "").toUpperCase(), // Ensure field type is in uppercase
            label: f.label ?? "",
            placeholder: f.placeholder ?? "",
            is_enabled: f.is_enabled ?? true,
            sort_order: f.sort_order ?? i + 1,
          }))
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)); // Sort fields by sort_order

        // Check if email toggle should be enabled based on the presence of an EMAIL field
        const emailField = state.fields.some(
          (f) => f.field_type === "EMAIL" && f.is_enabled,
        );
        state.emailToggle = emailField;
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
        state.loading = true; // Start loading state when API call is pending
      })
      .addCase(fetchContactButtonSettings.fulfilled, (state, action) => {
        state.loading = false; // Stop loading once the data is fetched

        // Destructure the response to get the saveContact object
        const { saveContact } = action.payload || {};

        if (saveContact) {
          // Map the data from the API response to the Redux state
          state.saveBtntext = saveContact.button_text ?? state.saveBtntext;
          state.saveBtnBgColor =
            saveContact.button_bg_color ?? state.saveBtnBgColor;
          state.saveBtnTextColor =
            saveContact.button_text_color ?? state.saveBtnTextColor;
          state.buttonCornerRadius =
            saveContact.button_corner_radius ?? state.buttonCornerRadius;
          state.saveContact = true; // Set saveContact to true if settings are fetched
        }
      })
      .addCase(fetchContactButtonSettings.rejected, (state) => {
        state.loading = false; // Stop loading if the fetch failed
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
        } = action.payload || {};

        // Update Redux state with the saved values
        state.saveBtntext = button_text ?? state.saveBtntext;
        state.saveBtnBgColor = button_bg_color ?? state.saveBtnBgColor;
        state.saveBtnTextColor = button_text_color ?? state.saveBtnTextColor;
        state.buttonCornerRadius =
          button_corner_radius ?? state.buttonCornerRadius;
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
        state.customLinkCustomization = customLinkCustomization; // Update customization
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
        const platformLinkCustomization = action.payload; // assuming backend returns the saved object

        // Update the flat fields used in UI
        if (platformLinkCustomization) {
          state.platformLinkBackGroundColor =
            platformLinkCustomization.background_color || "#ffffff";
          state.platformNameTextColor =
            platformLinkCustomization.title_color || "#000000";
          state.platformUrlTextColor =
            platformLinkCustomization.link_color || "#ffffff";

          // Also update linkStyle if returned
          if (platformLinkCustomization.layout) {
            state.linkStyle = platformLinkCustomization.layout.toLowerCase(); // or keep as is
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
      // .addCase(saveMedia.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const { media, mediaCustomization } = action.payload ?? {};

      //   if (Array.isArray(media)) {
      //     // Save the full media array from backend
      //     state.medias = media;
      //   }

      //   if (mediaCustomization?.layout) {
      //     state.mediaLayout = mediaCustomization.layout.toLowerCase();
      //   }
      // })
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
  },
});

// EXPORT ALL ACTIONS
export const {
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
  setSavebtntext,
  reorderCustomLinks,
  toggleBusinessProfile,
  setEmailBtnText,
  setProfileViewData,
} = bussinessprofileSlice.actions;

export default bussinessprofileSlice.reducer;
