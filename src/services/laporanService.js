import api from "./api";

// ================= HELPER =================
const unwrap = (res) => res?.data?.data || [];




// helper biar param tidak null
const buildParams = (params) => {
  const cleaned = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== "" && params[key] !== null) {
      cleaned[key] = params[key];
    }
  });
  return cleaned;
};

// ================= HARIAN =================

export const getLaporanHarian = async (bulan, tahun, kategori, opd_id) => {
  const res = await api.get("/laporan-opd/harian", {
    params: buildParams({ bulan, tahun, kategori, opd_id }),
  });
  return unwrap(res);
};


// ================= BULANAN =================
export const getLaporanBulanan = async (bulan, tahun, kategori, opd_id) => {
  const res = await api.get("/laporan-opd/bulanan", {
    params: buildParams({ bulan, tahun, kategori, opd_id }),
  });
  return unwrap(res);
};

// ================= REKAP PERSEN =================
export const getLaporanRekapPersen = async (bulan, tahun, opd_id) => {
  const res = await api.get("/laporan-opd/rekap-persen", {
    params: buildParams({ bulan, tahun, opd_id }),
  });
  return unwrap(res);
};

// ================= TPP =================

export const getLaporanTPP = async (bulan, tahun, opd_id) => {
  const res = await api.get("/laporan-opd/rekap-akhir", {
    params: buildParams({ bulan, tahun, opd_id }),
  });
  return unwrap(res);
};

// ================= PROFILE =================
export const getProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data?.data || null;
};

// ================= PENANDATANGAN =================

export const getPenandatangan = async (opd_id) => {
  if (!opd_id) return []; // 🔥 cegah request kosong

  const res = await api.get("/laporan/penandatangan", {
    params: { opd_id },
  });

  return res.data?.data || [];
};