import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL  || "https://api.facile.im",
  headers: {
    "Content-Type": "application/json",
    
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginPath = window.location.pathname === "/login";
    const isLoginRequest = error.config?.url?.includes("/login") || error.config?.url?.includes("v1/user/login");

    if (error.response?.status === 401 && !isLoginPath && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      window.location.href = `${import.meta.env.BASE_URL}login`;
    }
    return Promise.reject(error);
  }
);

export default api;
