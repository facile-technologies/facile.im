export const reducers = {
  setProfileActivation(state, { payload }) {
    state.profileActivation = payload;
  },
  setActiveTab(state, { payload }) {
    state.activeTab = payload;
  },
  setProfileField(state, { payload }) {
    const { name, value } = payload;
    state.profile[name] = value;
  },
  setContactInfoField(state, { payload }) {
    const { name, value } = payload;
    state.contactInfo[name] = value;
  },
  setProfileImage(state, action) {
    state.profileImgPreview = action.payload.previewUrl;
    state.profileImg = action.payload.file;
  },

  setinsuranceCompanyName(state, { payload }) {
    state.insurnacCompanyName = payload;
  },
  setInsurnaceID(state, { payload }) {
    state.insuranceID = payload;
  },
  setMedicalInfoField(state, { payload }) {
    state.medicalInfo.push(payload);
  },
  setMedicaDatalInfo(state, { payload }) {
    const { name, value } = payload;
    state.medicalInfo[name] = value;
  },
  setContactInfo(state, { payload }) {
    state.contactInfo.push(payload);
  },
  setContactInfoField(state, { payload }) {
    const { name, value } = payload;
    state.contactInfo[name] = value;
  },
  setDoctorcontactInfo(state, { payload }) {
    const { name, value } = payload;
    state.doctorContactInfo.push(payload);
  },
  setEmmergencyAddress(state, { payload }) {
    state.emmergencyAddress.push(payload);
  },
  setBg(state, { payload }) {
    state.customization.backgroundColor = payload;
  },
  setBgImage(state, action) {
    state.customization.backgroundImage = action.payload.url;
    state.backgroundImages.push({
      src: action.payload.url,
      file: action.payload.file,
    });
  },
  removeBgImage(state, action) {
    const removedImg = state.backgroundImages[action.payload];
    const updatedImages = state.backgroundImages.filter(
      (_, idx) => idx !== action.payload,
    );
    state.backgroundImages = updatedImages;
    // Clear the active background if it was the removed image
    if (removedImg && state.customization.backgroundImage === removedImg.src) {
      state.customization.backgroundImage = null;
    }
  },
  selectBgImage(state, action) {
    state.customization.backgroundImage = action.payload;
    // Track whether the user explicitly removed the background image
    state.shouldRemoveBgImage = action.payload === null || action.payload === "none";
  },
  setBlur(state, { payload }) {
    state.blur = payload;
    state.customization.blurLevel = Number(payload);
  },
  setLayout(state, { payload }) {
    state.layout = payload;
    state.customization.layout = payload;
  },

  setTextColor(state, { payload }) {
    state.customization.textColor = payload;
  },
  setFontFamily(state, { payload }) {
    state.customization.fontFamily = payload;
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
  setVisibilityByType(state, { payload }) {
    const { type, id, value } = payload;
    if (!state.visibilityByType) state.visibilityByType = {};
    if (!state.visibilityByType[type]) state.visibilityByType[type] = {};
    state.visibilityByType[type][id] = value;
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
    state.medicaCustomization.headerText = payload;
  },
  setCropResult(state, { payload }) {
    const { type, url, shape } = payload;
    if (type === "profile") {
      state.profileShape = shape;
      state.profileImg = url;
    }
  },
  resetSOSProfile(state) {
    state.profile = {
      type: "sos",
      firstName: "",
      lastName: "",
      pinnedNote: "",
      isPinned: true,
      gender: "",
      birthday: "",
      height: "",
      weight: "",
      bloodGroup: "",
      important: "",
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
    state.medicalDetails = [];
    state.loading = false;
    state.error = null;
  },
};
