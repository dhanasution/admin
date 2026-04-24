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

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      try {
        const userData = await getProfile();
        setUser(userData);

        const laporanData = await getLaporanHarian();
        setLaporan(Array.isArray(laporanData) ? laporanData : []);

        const pegawaiData = await getPenandatangan();

        const pns = pegawaiData.filter(
          (u) => (u.kategori_pegawai || "").toLowerCase() === "pns"
        );

        setPenandatangan(pns);

      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return { user, laporan, penandatangan, loading };
};