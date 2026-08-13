import { createSelector } from "@reduxjs/toolkit";

export const selectProfileState = (state) => state.profile;

export const selectActiveTab = createSelector(selectProfileState, (s) => s.activeTab);
export const selectUser = createSelector(selectProfileState, (s) => s.user);
export const selectProfile = createSelector(selectProfileState, (s) => s.profile);

export const selectImages = createSelector(selectProfileState, (s) => ({
   profile_image: s. profile_image,
  logo: s.logo,
  banner: s.banner,
}));
export const selectCustomization = createSelector(selectProfileState, (s) => ({
  id: s.customization.id,
  user_profile_id: s.customization.user_profile_id,
  profile_id: s.customization.profile_id,
  about_text_color: s.customization.about_text_color,
  font_family: s.customization.font_family,
  font_size: s.customization.font_size,
  background_color: s.customization.background_color,
  background_image: s.customization.background_image,
  background_blur: s.customization.background_blur,
  layout: s.customization.layout,
  created_at: s.customization.created_at,
  updated_at: s.customization.updated_at,
}));
export const selectCustom = createSelector(selectProfileState, (s) => ({
  selectedBg: s.selectedBg,
  blur: s.blur,
  textColor: s.textColor,
  fontFamily: s.fontFamily,
}));
export const selectCrop = createSelector(selectProfileState, (s) => ({
  cropModalOpen: s.cropModalOpen,
  cropImageSrc: s.cropImageSrc,
  cropType: s.cropType,
  cropFor: s.cropFor,
}));
export const selectLoading = createSelector(selectProfileState, (s) => s.loading);