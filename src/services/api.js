import axios from "axios";

// ambil dari env
const BASE_URL = import.meta.env.VITE_API_URL;
const TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "token";

// instance axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================
// 🔐 REQUEST INTERCEPTOR
// ================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================================
// 🚨 RESPONSE INTERCEPTOR
// ================================
api.interceptors.response.use(
  (response) => {
    // langsung return data biar lebih clean di component
    return response;
  },
  (error) => {
    const status = error.response?.status;

    // ============================
    // 🔐 UNAUTHORIZED
    // ============================
    if (status === 401) {
      console.warn("Session expired, silakan login ulang");

      localStorage.removeItem(TOKEN_KEY);

      // hindari redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // ============================
    // 🚫 FORBIDDEN
    // ============================
    if (status === 403) {
      console.error("Akses ditolak (403)");
    }

    // ============================
    // 💥 SERVER ERROR
    // ============================
    if (status >= 500) {
      console.error("Terjadi kesalahan server");
    }

    // ============================
    // 🌐 NETWORK ERROR
    // ============================
    if (!error.response) {
      console.error("Tidak dapat terhubung ke server");
    }

    return Promise.reject(error);
  }
);

export default api;