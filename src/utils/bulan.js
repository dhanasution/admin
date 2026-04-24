// src/utils/bulan.js

// ================= LIST BULAN =================
export const BULAN_LIST = [
  { label: "Januari", value: 1 },
  { label: "Februari", value: 2 },
  { label: "Maret", value: 3 },
  { label: "April", value: 4 },
  { label: "Mei", value: 5 },
  { label: "Juni", value: 6 },
  { label: "Juli", value: 7 },
  { label: "Agustus", value: 8 },
  { label: "September", value: 9 },
  { label: "Oktober", value: 10 },
  { label: "November", value: 11 },
  { label: "Desember", value: 12 },
];

// ================= GET NAMA BULAN =================
export const getNamaBulan = (bulan) => {
  const nomorBulan = Number(bulan);

  const found = BULAN_LIST.find(
    (item) => item.value === nomorBulan
  );

  return found ? found.label : "-";
};

// ================= GET BULAN SEKARANG =================
export const getBulanSekarang = () => {
  return new Date().getMonth() + 1;
};

// ================= GET TAHUN SEKARANG =================
export const getTahunSekarang = () => {
  return new Date().getFullYear();
};

// ================= FORMAT 2 DIGIT =================
// jika backend butuh 01,02,03 dst
export const getBulan2Digit = (bulan) => {
  return String(Number(bulan)).padStart(2, "0");
};

// ================= OPTIONS TAHUN =================
export const getListTahun = (
  start = 2024,
  end = new Date().getFullYear() + 1
) => {
  const result = [];

  for (let i = start; i <= end; i++) {
    result.push(i);
  }

  return result;
};