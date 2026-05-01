import { useEffect, useState } from "react";

import {
  getProfile,
  getLaporanHarian,
  getPenandatangan,
} from "../services/laporanService";

export const useLaporanOpd = () => {
  const [user, setUser] = useState(null);
  const [laporan, setLaporan] = useState([]);
  const [penandatangan, setPenandatangan] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedOpd, setSelectedOpd] = useState(null);

  // ================= INIT =================
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      try {
        const userData = await getProfile();
        setUser(userData);

        // ADMIN OPD → AUTO LOAD
        if (userData?.role === "admin_opd" && userData?.opd_id) {
          setSelectedOpd(userData.opd_id);

          fetchLaporan(userData.opd_id);
          fetchPenandatangan(userData.opd_id);
        }

      } catch (err) {
        console.error("INIT ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // ================= FETCH LAPORAN =================
  const fetchLaporan = async (opdId, kategori = "pns") => {
    if (!opdId) return;

    try {
      setLoading(true);

      const data = await getLaporanHarian(
        new Date().getMonth() + 1,
        new Date().getFullYear(),
        kategori,
        opdId
      );

      setLaporan(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH LAPORAN ERROR:", err);
      setLaporan([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH PENANDATANGAN =================
  const fetchPenandatangan = async (opdId) => {
    if (!opdId) {
      setPenandatangan([]);
      return;
    }

    try {
      const data = await getPenandatangan(opdId);

      console.log("PENANDATANGAN FINAL:", data);

      setPenandatangan(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("ERROR PENANDATANGAN:", err);
      setPenandatangan([]);
    }
  };

  // ================= HANDLE PILIH OPD =================
  const handleSelectOpd = (opdId) => {
    setSelectedOpd(opdId);

    fetchLaporan(opdId);
    fetchPenandatangan(opdId); // 🔥 WAJIB
  };

  return {
    user,
    laporan,
    penandatangan,
    loading,
    selectedOpd,
    handleSelectOpd,
  };
};