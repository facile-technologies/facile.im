import api from '../store/api/api';


const BASE_PATH = "/v1/user/";

export const checkUsername = (username) => {
  return api.get(`${BASE_PATH}check-username?username=${username}`);
};

export const signup = (data) => {
  return api.post(`${BASE_PATH}signup`, data);
};

export const verifyOtp = (data) => {
  return api.post(`${BASE_PATH}verify-otp`, data);
};

export const login = (data) => {
  return api.post(`${BASE_PATH}login`, data);
};

export const forgotPassword = (data) => {
  return api.post(`${BASE_PATH}forget-password-otp`, data);
};

export const resetPasswordOtp = (data) => {
  return api.post(`${BASE_PATH}verify-forget-password-otp`, data);
};

export const resetPassowrd = (data) => {
  return api.post(`${BASE_PATH}reset-forget-password`, data);
};

export const resendOtp = (data) => {
  return api.post(`${BASE_PATH}resend-register-otp`, data);
};
