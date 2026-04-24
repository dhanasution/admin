import api from "./api";


// ================================
// 👷 GET PEGAWAI
// ================================
export const getPegawai = async () => {
  const res = await api.get("/pegawai");

  const data = res.data;

  console.log("RAW RESPONSE:", data);

  return Array.isArray(data) ? data : [];
};

// ================================
// ❌ DELETE PEGAWAI
// ================================
export const deletePegawai = async (id) => {
  const res = await api.delete(`/pegawai/${id}`);
  return res.data;
};


// ================================
// UPDATE ATASAN PEGAWAI
// ================================
export const updateAtasan = (id, data) =>
  api.put(`/pegawai/${id}/atasan`, data);


export const searchPegawai = (keyword) => {
  return api.get(`/pegawai/search?q=${keyword}`);
};