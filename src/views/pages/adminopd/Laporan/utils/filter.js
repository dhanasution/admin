// src/utils/filter.js
export const filterPNS = (data) =>
  data.filter((row) => {
    const nip = String(row.nip || "").trim();
    const kategori = (row.kategori_pegawai || "").toLowerCase();
    return nip.length === 18 && !kategori.includes("pppk");
  });

export const filterPPPK = (data) =>
  data.filter((row) => {
    const nip = String(row.nip || "").trim();
    const kategori = (row.kategori_pegawai || "").toLowerCase();
    return nip.length !== 18 || kategori.includes("pppk");
  });