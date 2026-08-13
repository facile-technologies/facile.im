import { createSelector } from "@reduxjs/toolkit";

export const selectPetProfileState = (state) => state.petprofile;

export const selectPetProfile = createSelector(
  selectPetProfileState,
  (pet) => pet.profile
);

export const selectPetPreviewCustom = createSelector(
  selectPetProfileState,
  (pet) => ({
    backgroundColor: pet.customization.backgroundColor,
    backgroundImage: pet.customization.backgroundImage,
    blur: pet.customization.blurLevel,
    textColor: pet.customization.textColor,
    fontFamily: pet.customization.fontFamily,
    fontSize: pet.customization.fontSize,
  })
);

export const selectPetProfileImg = createSelector(
  selectPetProfileState,
  (pet) => pet.profileImg
);

export const selectPetBackgroundImg = createSelector(
  selectPetProfileState,
  (pet) => pet.customization.backgroundImage
);

export const selectPetIsPinned = createSelector(
  selectPetProfileState,
  (pet) => pet.profile.isPinned
);

export const selectPetCropImageSrc = createSelector(
  selectPetProfileState,
  (pet) => pet.cropImageSrc
);

export const selectPetMedicalInfo = createSelector(
  selectPetProfileState,
  (pet) => pet.medicalInfo
);

export const selectPetContactInfo = createSelector(
  selectPetProfileState,
  (pet) => pet.contactInfo
);

export const selectPetCustomization = createSelector(
  selectPetProfileState,
  (pet) => pet.customization
);

export const selectPetLayout = createSelector(
  selectPetProfileState,
  (pet) => pet.layout
);

export const selectPetLoading = createSelector(
  selectPetProfileState,
  (pet) => pet.loading
);

export const selectPetError = createSelector(
  selectPetProfileState,
  (pet) => pet.error
);

export const selectPetCrop = createSelector(
  selectPetProfileState,
  (s) => ({
    cropModalOpen: s.cropModalOpen,
    cropImageSrc: s.cropImageSrc,
    cropType: s.cropType,
    cropFor: s.cropFor,
  })
);
