import { createSlice } from "@reduxjs/toolkit";
import * as thunks from "./Sosprofile/thunk";
import { reducers } from "./Sosprofile/reducers";

const sosProfileSlice = createSlice({
  name: "sosprofile",
  initialState: {
    selectedBg: "#000000",
    blur: 50,
    user: null,
    profileActivation: false,
    profileImg: null,
    profileImgPreview: null,
    profileShape: "circle",
    layout: "CARD",
    profile: {
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
    },
    medicalInfo: [],
    contactInfo: [],
    doctorContactInfo: [],
    emmergencyAddress: [],
    customization: {
      backgroundColor: "#000000",
      backgroundImage: null,
      textColor: "#ffffff",
      fontFamily: "Poppins",
      blurLevel: 50,
      layout: "LIST",
    },
    visibilityByType: {
      emergency: {},
      doctor: {},
      address: {},
      medical: {},
    },
    loading: false,
    error: null,
    cropModalOpen: false,
    cropImageSrc: null,
    cropType: "profile",
    activeTab: "profile",
    backgroundImages: [],
    shouldRemoveBgImage: false,
  },
  reducers,
  extraReducers: (builder) => {
    builder
      .addCase(thunks.fetchSOSProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(thunks.fetchSOSProfile.fulfilled, (state, { payload }) => {
        const img = payload?.profile?.profile_image || null;
        const insList = payload.medicalInsurances || [];
        state.loading = false;
        state.profile = {
          ...state.profile,
          type: "sos",
          firstName: payload.profile.first_name,
          lastName: payload.profile.last_name,
          gender: payload.profile.gender,
          birthday: payload.profile.dob,
          height: payload.profile.height,
          weight: payload.profile.weight,
          bloodGroup: payload.profile.blood_group,
          important: payload.profile.important_note,
          isPinned: payload.profile.note_is_pinned,
          username: payload.profile.username,
          profileImg: img,
          layout: state.layout,
        };
        state.profileImg = img;
        state.customization = { ...payload.customization };
        state.contactInfo = payload.emergencyContacts || [];
        state.doctorContactInfo = payload.doctorsContacts || [];
        state.emmergencyAddress = payload.addresses || [];
        state.userProfile = payload.userProfile;
        state.backgroundImages = [];
        state.shouldRemoveBgImage = false;
        state.blur = Number(payload.customization.background_blur) ?? 50;
        state.customization = {
          backgroundColor: payload.customization.background_color,
          backgroundImage: payload.customization.background_image || null,
          textColor: payload.customization.about_text_color || "#000000",
          fontFamily: payload.customization.font_family || "Poppins",
          blurLevel: Number(payload.customization.background_blur) ?? 50,
          layout: payload.customization.layout || "LIST",
        };
        state.ContactCustomization = {
          backgroundColor:
            payload.sosContactsCustomization.background_color || "#ffffff",
          headerTextColor:
            payload.sosContactsCustomization.header_color || "#000000",
          bodyTextColor:
            payload.sosContactsCustomization.body_color || "#000000",
          title: payload.sosContactsCustomization.title_color || "SOS Contacts",
          contactBtnEnabled: payload.sosContactsCustomization.contact_btn_enabled ?? true,
        };
        state.emergencyContacts = payload.emergencyContacts || [];
        state.doctorsContacts = payload.doctorsContacts || [];
        state.addresses = payload.addresses || [];
        state.medicaCustomization = {
          headerText: payload.sosMedicalCustomization.header_text || "",
          backgroundColor:
            payload.sosMedicalCustomization.background_color || "#ffffff",
          headerColor:
            payload.sosMedicalCustomization.header_color || "#000000",
          bodyColor: payload.sosMedicalCustomization.body_color || "#000000",
        };
        state.medicalInfo = payload.medicalDetails || [];
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
      })
      .addCase(thunks.fetchSOSProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(thunks.saveSOSProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(thunks.saveSOSProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.shouldRemoveBgImage = false;
        state.blur = Number(payload.customization?.background_blur) ?? 50;
        state.profile = {
          firstName: payload.profile.first_name,
          lastName: payload.profile.last_name,
          gender: payload.profile.gender,
          birthday: payload.profile.dob,
          height: payload.profile.height,
          weight: payload.profile.weight,
          bloodGroup: payload.profile.blood_group,
          important: payload.profile.important_note,
          isPinned: payload.profile.note_is_pinned,
          username: payload.profile.username,
          profileImg: payload.profile.profile_image || null,
        };
        state.customization = {
          backgroundColor: payload.customization.background_color || "#ffffff",
          backgroundImage: payload.customization.background_image || null,
          textColor: payload.customization.about_text_color || "#000000",
          fontFamily: payload.customization.font_family || "Poppins",
          blurLevel: Number(payload.customization.background_blur) ?? 50,
          layout: payload.customization.layout || "LIST",
        };

        state.ContactCustomization = {
          backgroundColor: payload?.sosContactsCustomization?.background_color,
          headerTextColor: payload?.sosContactsCustomization?.header_color,
          bodyTextColor: payload?.sosContactsCustomization?.body_color,
          title: payload?.sosContactsCustomization?.title_color,
        };

        state.emergencyContacts = payload.emergencyContacts || [];
        state.doctorsContacts = payload.doctorsContacts || [];
        state.addresses = payload.addresses || [];
        state.medicaCustomization = {
          headerText: payload?.sosMedicalCustomization?.header_text || "",
          backgroundColor:
            payload?.sosMedicalCustomization?.background_color || "#ffffff",
          headerColor:
            payload?.sosMedicalCustomization?.header_color || "#000000",
          bodyColor: payload?.sosMedicalCustomization?.body_color || "#000000",
        };

        state.medicalInfo = payload.medicalDetails || [];
        const insList = payload.medicalInsurances || [];

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
      })
      .addCase(thunks.saveSOSProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(thunks.saveEmergencyContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(thunks.saveEmergencyContact.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.contactInfo.push(payload.contact);
      })
      .addCase(thunks.saveEmergencyContact.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(thunks.fetchEmergencyContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        thunks.fetchEmergencyContacts.fulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.contactInfo = payload;
        },
      )
      .addCase(thunks.fetchEmergencyContacts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(thunks.saveDoctorContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(thunks.saveDoctorContact.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.doctorContactInfo.push(payload.contact);
      })
      .addCase(thunks.saveDoctorContact.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(thunks.saveAddressContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(thunks.saveAddressContact.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.emmergencyAddress.push(payload.address);
      })
      .addCase(thunks.saveAddressContact.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(thunks.deleteSosContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(thunks.deleteSosContact.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { type, id } = payload;

        if (type === "emergency") {
          state.contactInfo = state.contactInfo.filter(
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
      .addCase(thunks.deleteSosContact.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(thunks.updateConatcbyID.pending, (state) => {
        state.loading = true;
      })
      .addCase(thunks.updateConatcbyID.fulfilled, (state, { payload }) => {
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
      })
      .addCase(thunks.updateConatcbyID.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(thunks.updateContcatCustomizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        thunks.updateContcatCustomizations.fulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.ContactCustomization = {
            title: payload.sosContactsCustomization.title_color,
            backgroundColor: payload.sosContactsCustomization.background_color,
            headerTextColor: payload.sosContactsCustomization.header_color,
            bodyTextColor: payload.sosContactsCustomization.body_color,
            contactBtnEnabled: payload.sosContactsCustomization.contact_btn_enabled,
          };
        },
      )
      .addCase(
        thunks.updateContcatCustomizations.rejected,
        (state, { payload }) => {
          state.error = payload;
          state.loading = false;
        },
      );

    builder
      .addCase(thunks.saveMedicalDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(thunks.saveMedicalDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.medicalInfo.push(payload.contact);
      })
      .addCase(thunks.saveMedicalDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(thunks.updateMediaclinfobyID.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { id, data } = payload;
        state.medicalInfo = state.medicalInfo.map((contact) =>
          contact.id === id ? { ...contact, ...data } : contact,
        );
      })
      .addCase(thunks.updateMediaclinfobyID.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(
        thunks.updateMedicalCustomizations.fulfilled,
        (state, { payload }) => {
          state.medicaCustomization = {
            title: payload.title_color,
            backgroundColor: payload.background_color,
            headerTextColor: payload.header_color,
            bodyTextColor: payload.body_color,
            contactBtnEnabled: payload.contact_btn_enabled,
          };
        },
      )
      .addCase(
        thunks.updateMedicalCustomizations.rejected,
        (state, { payload }) => {
          state.error = payload;
        },
      );

    builder
      .addCase(thunks.deleteMedicalInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(thunks.deleteMedicalInfo.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { type, id } = payload;
        state.medicalInfo = state.medicalInfo.filter(
          (contact) => contact.id !== id,
        );
      })
      .addCase(thunks.deleteMedicalInfo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(thunks.saveInsuranceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.saveInsuranceDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.insurnacCompanyName =
          payload?.medicalInsurance?.insurance_company ?? state.insurnacCompanyName;
        state.insuranceID =
          payload?.medicalInsurance?.insurance_id ?? state.insuranceID;
      })
      .addCase(thunks.saveInsuranceDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    builder
      .addCase(thunks.saveSosMedicalSequenceVisibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        thunks.saveSosMedicalSequenceVisibility.fulfilled,
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
        thunks.saveSosMedicalSequenceVisibility.rejected,
        (state, { payload }) => {
          state.loading = false;
          state.error = payload;
        },
      );
  },
});

export const {
  setProfileActivation,
  setActiveTab,
  setProfileField,
  setMedicalInfo,
  setContactInfo,
  setCustomization,
  setLayout,
  setCropModal,
  setCropResult,
  setBg,
  setBgImage,
  removeBgImage,
  selectBgImage,
  setPinOffNote,
  setPinOn,
  setTextColor,
  setFontFamily,
  setBlur,
  setProfileShape,
  setContactInfoField,
  setEmmergencyAddress,
  setDoctorcontactInfo,
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
  setVisibilityByType,
  setProfileImage,
  resetSOSProfile,
} = sosProfileSlice.actions;

export default sosProfileSlice.reducer;
