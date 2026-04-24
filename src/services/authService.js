// src/services/authService.js
import api from "./api";

// 🔐 LOGIN
export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// 👤 GET PROFILE
export const getProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
};