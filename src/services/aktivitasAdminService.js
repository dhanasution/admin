import api from "./api";



// GET semua aktivitas
export const getAktivitasAdmin = (params) => {
  return api.get("/admin/aktivitas", {
    params 
  });
};

// CREATE intervensi
export const createAktivitas = (data) => {
  return api.post("/admin/aktivitas", data);
};

// UPDATE
export const updateAktivitas = (id, data) => {
  return api.put(`/admin/aktivitas/${id}`, data);
};

// DELETE
export const deleteAktivitas = (id) => {
  return api.delete(`/admin/aktivitas/${id}`);
};


// UNLOCK

export const unlockAktivitas = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/aktivitas/unlock`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }
  );

  return res.json();
};


// LOCK
export const lockAktivitas = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/aktivitas/unlock`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }
  );

  return res.json();
};