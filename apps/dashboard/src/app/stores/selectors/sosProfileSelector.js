import { createSelector } from "@reduxjs/toolkit";

export const selectSOSProfileState = (state) => state.sosprofile;

// PURE profile object
export const selectSOSProfile = createSelector(
  selectSOSProfileState,
  (sosprofile) => sosprofile.profile
);

// Customization bundle for the preview
export const selectSOSPreviewCustom = createSelector(
  selectSOSProfileState,
  (sosprofile) => ({
    selectedBg: sosprofile.customization.backgroundColor,
    blur: sosprofile.blur,
    textColor: sosprofile.customization.textColor,
    fontFamily: sosprofile.customization.fontFamily,
  })
);

export const selectSOSProfileImg = createSelector(
  selectSOSProfileState,
  (sosprofile) => sosprofile.profileImg
);

export const selectSOSBackgroundImg = createSelector(
  selectSOSProfileState,
  (sosprofile) => sosprofile.customization.backgroundImage
);

export const selectSOSIsPinned = createSelector(
  selectSOSProfileState,
  (sosprofile) => sosprofile.profile.isPinned
);

export const selectSOSCropImageSrc = createSelector(
  selectSOSProfileState,
  (sosprofile) => sosprofile.cropImageSrc
);

// You can keep these if needed:
export const selectSOSMedicalInfo = createSelector(
  selectSOSProfileState,
  (sosprofile) => sosprofile.medicalInfo
);

export const selectSOSContactInfo = createSelector(
  selectSOSProfileState,
  (sosprofile) => sosprofile.contactInfo
);

export const selectSOSCustomization = createSelector(
  selectSOSProfileState,
  (sosprofile) => sosprofile.customization
);

export const selectSOSLayout = createSelector(
  selectSOSProfileState,
  (sosprofile) => sosprofile.layout
);

export const selectSOSLoading = createSelector(
  selectSOSProfileState,
  (sosprofile) => sosprofile.loading
);

export const selectSOSError = createSelector(
  selectSOSProfileState,
  (sosprofile) => sosprofile.error
);
export const selectCrop = createSelector(selectSOSProfileState, (s) => ({
  cropModalOpen: s.cropModalOpen,
  cropImageSrc: s.cropImageSrc,
  cropType: s.cropType,
  cropFor: s.cropFor,
}));
