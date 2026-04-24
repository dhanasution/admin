import { useState, useMemo } from "react";
import { CCard, CCardBody, CCardHeader, CSpinner } from "@coreui/react";

import { filterPNS, filterPPPK } from "./utils/filter";

import { generateLaporanPDF } from "./utils/pdfHelper";
import { getLaporanHarian, getLaporanBulanan, getLaporanRekapPersen, getLaporanTPP } from "../../../../services/laporanService";


import { useLaporanOpd } from "../../../../hooks/useLaporanOpd";

import CetakModal from "./components/CetakModal.jsx";
import CetakTable from "./components/CetakTable.jsx";



const LaporanOpd = () => {
  const { user, laporan, penandatangan, loading, error } = useLaporanOpd();

  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [modeCetak, setModeCetak] = useState("");
  const [kategoriCetak, setKategoriCetak] = useState("");


  // ================= MEMO =================


  const dataValid = useMemo(
    () =>
      Array.isArray(laporan)
        ? laporan.filter((r) => r.tanggal !== null)
        : [],
    [laporan]
  );

  const dataPNS = useMemo(() => filterPNS(dataValid), [dataValid]);
  const dataNonPNS = useMemo(() => filterPPPK(dataValid), [dataValid]);

  // ================= HANDLE CETAK =================
  const handleCetak = (data, title, mode, kategori) => {
   

    setSelectedData(data || []);
    setSelectedTitle(title);
    setModeCetak(mode);
    setKategoriCetak(kategori);
    setShowModal(true);
  };

  // ================= GENERATE PDF (FIXED) =================
  const generatePDF = async ({ bulan, tahun, penandatangan }) => {
  try {

    if (!bulan || !tahun) {
      return { error: "Bulan dan tahun wajib dipilih" };
    }

    if (!kategoriCetak) {
      return { error: "Kategori tidak valid" };
    }

    let data = [];


    if (modeCetak === "harian") {
      data = await getLaporanHarian(bulan, tahun, kategoriCetak);

    } else if (modeCetak === "bulanan") {
      data = await getLaporanBulanan(bulan, tahun, kategoriCetak);

    } else if (modeCetak === "rekappersen") {
      data = await getLaporanRekapPersen(bulan, tahun);

    } else if (modeCetak === "tpptotap") {
      data = await getLaporanTPP(bulan, tahun);
    }



    if (!data || data.length === 0) {
      const periodeText = new Date(tahun, bulan - 1).toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
      });

      return {
        info: `Tidak ada data ${modeCetak} (${kategoriCetak}) pada ${periodeText}`
      };
    }

    generateLaporanPDF({
      data,
      bulan,
      tahun,
      penandatangan,
      user,
      selectedTitle,
      isBulanan: modeCetak !== "harian",
      modeCetak
    });

    return { success: true };

  } catch (err) {
    console.error(err);
    return { error: "Gagal generate laporan" };
  }
};
  // ================= LOADING =================
  if (loading) return <CSpinner />;

  return (
    <CCard>
      <CCardHeader>
        <h5>Menu Cetak Laporan</h5>
      </CCardHeader>

      <CCardBody>
        {error && <div className="text-danger mb-2">{error}</div>}

        <CetakTable
          dataPNS={dataPNS}
          dataNonPNS={dataNonPNS}
          laporan={laporan}
          onCetak={handleCetak}
        />

        <CetakModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          data={selectedData}
          title={selectedTitle}
          mode={modeCetak}
          kategori={kategoriCetak}
          penandaList={penandatangan}
          onSubmit={generatePDF}

        />   

      </CCardBody>
    </CCard>
  );
};

export default LaporanOpd;