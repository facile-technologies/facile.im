export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/login',
  },
  NFC: {
    GET_CODES: '/admin/nfc',
    DEVICES: '/admin/devices',
    GENERATE: '/admin/nfc/generate',
  },
  USERS: {
    GET_ALL: '/admin/users',
  },
  PLANS: {
    GET_ALL: '/admin/plans',
  },
  PLATFORMS: {
    GET_ALL: '/admin/platforms',
  },
  DASHBOARD: {
    GET_STATS: '/admin/dashboard',
  },
  TEAMS: {
    GET_ALL: '/admin/teams',
  }
};
