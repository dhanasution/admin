import axios from "axios";

// ================================
// 🌐 ENV CONFIG
// ================================
const API_URL = import.meta.env.VITE_API_URL;
const ASSET_URL = import.meta.env.VITE_ASSET_URL;

const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "token";

// ================================
// 🚀 AXIOS INSTANCE
// ================================
const api = axios.create({
  baseURL: API_URL,
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
    let token = localStorage.getItem(TOKEN_KEY);

    // handle kalau token pernah di-JSON.stringify
    try {
      token = JSON.parse(token);
    } catch {}

    // ⛔ jangan kirim token ke endpoint login
    if (token && !config.url?.includes("/auth/login")) {
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
    // ⚠️ JANGAN ubah ke response.data dulu (biar login tidak error)
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || "Terjadi kesalahan";

    if (status === 401) {
      console.warn("Session expired");

      localStorage.removeItem(TOKEN_KEY);

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      console.error("Akses ditolak (403)");
    }

    if (status >= 500) {
      console.error("Server error");
    }

    if (!error.response) {
      console.error("Tidak dapat terhubung ke server");
    }

    // kirim error yang lebih clean
    return Promise.reject({
      ...error,
      message,
    });
  }
);

// ================================
// 🖼️ HELPER URL FILE / FOTO
// ================================
export const getAssetUrl = (path) => {
  if (!path) return "";

  return path.startsWith("http")
    ? path
    : `${ASSET_URL}/${path}`;
};

// ================================
// 📦 EXPORT CONFIG (opsional)
// ================================
export const CONFIG = {
  API_URL,
  ASSET_URL,
  TIMEOUT,
  TOKEN_KEY,
};

export default api;