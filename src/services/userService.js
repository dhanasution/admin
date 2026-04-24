import api from "./api";

// ================================
// 📥 GET USERS
// ================================
export const getUsers = async () => {
  const res = await api.get("/users");

  const data = res.data;

  // handle berbagai bentuk response backend
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;

  return [];
};

// ================================
// ➕ CREATE USER
// ================================
export const createUser = async (payload) => {
  const res = await api.post("/users", payload);
  return res.data;
};

// ================================
// ✏️ UPDATE USER
// ================================
export const updateUser = async (id, payload) => {
  const res = await api.put(`/users/${id}`, payload);
  return res.data;
};

// ================================
// ❌ DELETE USER
// ================================
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

// ================================
// 🔐 CHANGE PASSWORD
// ================================
export const changePassword = async (id, password) => {
  const res = await api.put(`/users/${id}/password`, { password });
  return res.data;
};