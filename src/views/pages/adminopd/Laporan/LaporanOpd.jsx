import { useState, useMemo, useEffect } from "react";

import {
  CToast,
  CToastBody,
  CToaster,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CRow,
  CCol,
  CFormSelect
} from "@coreui/react";

import api from "../../../../services/api";

import { filterPNS, filterPPPK } from "./utils/filter";

import { generateLaporanPDF } from "./utils/pdfHelper";
import {
  getLaporanHarian,
  getLaporanBulanan,
  getLaporanRekapPersen,
  getLaporanTPP
} from "../../../../services/laporanService";

import { useLaporanOpd } from "../../../../hooks/useLaporanOpd";

import CetakModal from "./components/CetakModal.jsx";
import CetakTable from "./components/CetakTable.jsx";

const LaporanOpd = () => {
  const {
    user,
    laporan,
    penandatangan,
    loading,
    selectedOpd,
    handleSelectOpd
  } = useLaporanOpd();

  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [modeCetak, setModeCetak] = useState("");
  const [kategoriCetak, setKategoriCetak] = useState("");

  const [opdList, setOpdList] = useState([]);

  const [toast, setToast] = useState(null);

  const isAdminUtama = user?.role === "admin_utama";

  const finalOpdId = isAdminUtama
  ? Number(selectedOpd)
  : Number(user?.opd_id);

const selectedOpdData = useMemo(() => {
  return opdList.find(
    (opd) => Number(opd.id) === Number(finalOpdId)
  );
}, [opdList, finalOpdId]);

const selectedOpdNama = isAdminUtama
  ? selectedOpdData?.nama_opd?.trim() || "Nama OPD"
  : user?.nama_opd?.trim() || "Nama OPD";

const selectedOpdAlias = isAdminUtama
  ? selectedOpdData?.alias?.trim() || selectedOpdNama
  : user?.alias?.trim() || selectedOpdNama;



  // ================= TOAST =================
  const showToast = (message, color = "primary") => {
    setToast(
      <CToast
        autohide
        delay={3000}
        color={color}
        className="shadow border-0 text-white"
      >
        <CToastBody>{message}</CToastBody>
      </CToast>
    );
  };

  // ================= FETCH OPD =================
  useEffect(() => {
    const fetchOpd = async () => {
      try {
        const res = await api.get("/opd");
        const data = res.data?.data || res.data || [];
        setOpdList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setOpdList([]);
      }
    };

    if (isAdminUtama) fetchOpd();
  }, [isAdminUtama]);

  // ================= FILTER LAPORAN =================
  const dataValid = useMemo(() => {
    return Array.isArray(laporan)
      ? laporan.filter((r) => r.tanggal !== null)
      : [];
  }, [laporan]);

  const dataPNS = useMemo(() => filterPNS(dataValid), [dataValid]);
  const dataNonPNS = useMemo(() => filterPPPK(dataValid), [dataValid]);

  // ================= HANDLE CETAK =================
  const handleCetak = (data, title, mode, kategori) => {
    if (isAdminUtama && !finalOpdId) {
      showToast("Silakan pilih OPD terlebih dahulu", "danger");
      return;
    }

    setSelectedData(data || []);
    setSelectedTitle(title);
    setModeCetak(mode);
    setKategoriCetak(kategori);
    setShowModal(true);
  };

  // ================= GENERATE PDF =================
  const generatePDF = async ({ bulan, tahun, penandatangan: penandaSelected }) => {
    try {
      if (!finalOpdId) {
        showToast("OPD belum dipilih", "danger");
        return { error: "OPD belum dipilih" };
      }

      let data = [];

      if (modeCetak === "harian") {
        data = await getLaporanHarian(bulan, tahun, kategoriCetak, finalOpdId);
      } else if (modeCetak === "bulanan") {
        data = await getLaporanBulanan(bulan, tahun, kategoriCetak, finalOpdId);
      } else if (modeCetak === "rekappersen") {
        data = await getLaporanRekapPersen(bulan, tahun, finalOpdId);
      } else if (modeCetak === "tpptotal") {
        data = await getLaporanTPP(bulan, tahun, finalOpdId);
      }

      if (!data || data.length === 0) {
        showToast("Data tidak ditemukan", "warning");
        return { info: "Data tidak ditemukan" };
      }

      
      generateLaporanPDF({
        data,
        bulan,
        tahun,
        penandatangan: penandaSelected,
        penandaList: penandatangan,
        user,
        selectedTitle,
        modeCetak,
        selectedOpd: finalOpdId,
        selectedOpdNama,
        selectedOpdAlias
      });



      showToast("Laporan berhasil digenerate", "success");

      return { success: true };

    } catch (err) {
      console.error(err);
      showToast("Gagal generate laporan", "danger");
      return { error: "Gagal generate laporan" };
    }
  };

  if (loading) return <CSpinner />;

  return (
    <>
      <CCard className="shadow-sm border-0">
        {/* HEADER */}
        <CCardHeader className="bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-semibold">Cetak Laporan OPD</h5>
          
            </div>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* FILTER OPD */}
          {isAdminUtama && (
            <div
              className="mb-4 p-3 rounded-3"
              style={{
                background: "#f8f9fa",
                border: "1px solid #e9ecef"
              }}
            >
              <CRow className="align-items-end">
                <CCol md={4}>
                  <label className="form-label fw-semibold mb-1">
                    Pilih OPD
                  </label>

                  <CFormSelect
                    value={selectedOpd || ""}
                    onChange={(e) => handleSelectOpd(e.target.value)}
                    className="shadow-sm"
                  >
                    <option value="">-- Pilih OPD --</option>
                    {opdList.map((opd) => (
                      <option key={opd.id} value={opd.id}>
                        {opd.nama_opd}
                      </option>
                    ))}
                  </CFormSelect>

                  {!selectedOpd && (
                    <small className="text-muted">
                      Silakan pilih OPD untuk menampilkan data laporan
                    </small>
                  )}
                </CCol>
              </CRow>
            </div>
          )}

          {/* TABLE */}
          <div className="mt-2">
            <CetakTable
              dataPNS={dataPNS}
              dataNonPNS={dataNonPNS}
              laporan={laporan}
              onCetak={handleCetak}
            />
          </div>

          {/* MODAL */}
          <CetakModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            data={selectedData}
            title={selectedTitle}
            modeCetak={modeCetak}
            kategori={kategoriCetak}
            penandaList={penandatangan}
            onSubmit={generatePDF}
          />
        </CCardBody>
      </CCard>

      {/* 🔥 TOASTER (WAJIB) */}
      <CToaster placement="top-end">
        {toast}
      </CToaster>
    </>
  );
};

export default LaporanOpd;