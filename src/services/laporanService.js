import api from "./api";
import axios from "axios";

const unwrap = (res) => res?.data?.data || [];

export const getLaporanHarian = async (bulan, tahun, kategori) => {
  const res = await api.get("/laporan-opd/harian", {
    params: { bulan, tahun, kategori },
  });
  console.log("RESPONSE HARIAN:", res.data);
  return res.data?.data || [];
};


export const getLaporanBulanan = async (bulan, tahun, kategori) => {
  const res = await api.get("/laporan-opd/bulanan", {
    params: { bulan, tahun, kategori },
  });

  return res.data?.data || [];
  console.log("FULL RESPONSE BULANAN:", res.data);
};

export const getProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data?.data || null;
};

export const getPenandatangan = async () => {
  const res = await api.get("/users/pegawai-opd");
  return res.data?.data || [];
};


{/* ================= TAMBAHAN PERBAIKAN REKAP PENGURANGAN ================= */}
export const getLaporanRekapPersen = async (bulan, tahun) => {
  const res = await api.get("/laporan-opd/rekap-persen", {
    params: { bulan, tahun },
  });



  return res.data?.data || [];
};

export const getLaporanTPP = async (bulan, tahun) => {
  const res = await api.get("/laporan-opd/rekap-akhir", {
    params: { bulan, tahun },
  });

  return res.data?.data || [];
};