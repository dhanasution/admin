// src/utils/format.js
export const formatRupiah = (val) =>
  `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

export const formatPersen = (val) =>
  `${Number(val || 0).toFixed(2)}%`;

export const formatDurasi = (durasi) => {
  if (!durasi) return "0 jam";
  const jam = Math.floor(durasi);
  const menit = Math.round((durasi - jam) * 60);
  return menit === 0 ? `${jam} jam` : `${jam} jam ${menit} menit`;
};

export const capitalizeWords = (text = "") =>
  text
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");