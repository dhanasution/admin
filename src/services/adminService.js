import api from "./api";

// ================================
// 👥 GET USERS
// ================================
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

// ================================
// 🔄 UPDATE ROLE USER
// ================================
export const updateUserRole = async (payload) => {
  const res = await api.put("/users/role", payload);
  return res.data;
};

// ================================
// 🏢 GET OPD LIST
// ================================
export const getOpdList = async () => {
  const res = await api.get("/opd");
  return res.data;
};