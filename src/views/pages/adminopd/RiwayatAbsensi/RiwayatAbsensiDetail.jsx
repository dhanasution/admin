import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "src/services/api";
import {
  BULAN_LIST,
  getNamaBulan,
  getBulanSekarang,
  getTahunSekarang,
} from "src/utils/bulan";

import getRowsSummary from "./utils/summaryRows";
import printAbsensi from "./utils/printAbsensi";

import { getAssetUrl } from "src/services/api";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CFormSelect,
  CFormLabel,
  CFormInput,
  CRow,
  CCol,
  CBadge,
  CButton,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
} from "@coreui/react";



const RiwayatAbsensiDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const nama = location.state?.nama || "-";

  const [bulan, setBulan] = useState(getBulanSekarang());
  const [tahun, setTahun] = useState(getTahunSekarang());

  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [profil, setProfil] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const printRef = useRef();

  const [showFoto, setShowFoto] = useState(false);
  const [fotoUrl, setFotoUrl] = useState("");

  const openFoto = (path) => {
    setFotoUrl(getAssetUrl(path));
    setShowFoto(true);
  };

  // =========================
  // SUMMARY
  // =========================
  const rowsSummary = getRowsSummary(summary);
  const half = Math.ceil(rowsSummary.length / 2);

  // =========================
  // PRINT
  // =========================
  const handlePrint = () => {
    const rowsSummary = getRowsSummary(summary);

    printAbsensi({
      data,
      summary,
      rowsSummary,
      profil,
      nama,
      id,
      bulan,
      tahun,
      getNamaBulan,
    });
  };

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [detailRes, summaryRes, profilRes] = await Promise.all([
        api.get(
          `/rekap/rekap-bulanan-admin/${id}?bulan=${bulan}&tahun=${tahun}`
        ),
        api.get(
          `/rekap/rekap-summary-admin/${id}?bulan=${bulan}&tahun=${tahun}`
        ),
        api.get(`/rekap/pegawai/profil/${id}`),
      ]);


      setData(Array.isArray(detailRes.data) ? detailRes.data : []);

      // object aman
      setSummary(summaryRes.data || {});

      // tergantung struktur backend kamu
      setProfil(profilRes.data?.data || profilRes.data || {});


    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data");
      setData([]);
      setSummary({});
      setProfil({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, bulan, tahun]);

  // =========================
  // BADGE STATUS
  // =========================
  const badgeStatus = (text) => {
    if (!text) return <CBadge color="secondary">-</CBadge>;

    const val = text.toLowerCase();

    if (val.includes("hadir"))
      return <CBadge color="success">{text}</CBadge>;
    if (val.includes("izin"))
      return <CBadge color="warning">{text}</CBadge>;
    if (val.includes("sakit"))
      return <CBadge color="info">{text}</CBadge>;
    if (val.includes("alpha") || val.includes("alfa"))
      return <CBadge color="danger">{text}</CBadge>;
    if (val.includes("cuti"))
      return <CBadge color="primary">{text}</CBadge>;

    return <CBadge color="secondary">{text}</CBadge>;
  };

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader>
        <h5>Rekapitulasi Absensi Pegawai</h5>
      </CCardHeader>

      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}

        {/* FILTER */}
        <div className="no-print">
          <CRow className="mb-4 align-items-end">

            {/* KIRI */}
            <CCol md={3}>
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Kembali
              </CButton>
            </CCol>

            {/* KANAN */}
            <CCol md={9}>
              <CRow className="g-2 justify-content-end align-items-end">

                {/* BULAN */}
                <CCol md={3}>
                  <CFormSelect
                    value={bulan}
                    onChange={(e) => setBulan(Number(e.target.value))}
                  >
                    {BULAN_LIST.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                {/* TAHUN */}
                <CCol md={2}>
                  <CFormInput
                    type="number"
                    min="2020"
                    max="2100"
                    step="1"
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                    placeholder="Tahun"
                  />
                </CCol>

                {/* TAMPILKAN */}
                <CCol md="auto">
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={fetchData}
                  >
                    Tampilkan
                  </CButton>
                </CCol>

                {/* CETAK */}
                <CCol md="auto">
                  <CButton color="primary" onClick={handlePrint}>
                    Cetak
                  </CButton>
                </CCol>

              </CRow>
            </CCol>

          </CRow>
        </div>

        {/* CONTENT */}
        <div ref={printRef}>
          {/* PROFIL */}
          <CCard className="mb-4 shadow-sm">
            <CCardHeader>
              <strong>Profil Pegawai</strong>
            </CCardHeader>

            <CCardBody className="p-0">
              <CTable bordered striped responsive className="mb-0">
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell width="250">
                      NAMA
                    </CTableDataCell>
                    <CTableDataCell>{profil.nama || nama}</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>
                      NIP
                    </CTableDataCell>
                    <CTableDataCell>{profil.nip || id}</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>
                      GOLONGAN
                    </CTableDataCell>
                    <CTableDataCell>
                      {profil.golongan || "-"}
                    </CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>
                      ESELON
                    </CTableDataCell>
                    <CTableDataCell>{profil.eselon || "-"}</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>
                      STATUS PEGAWAI
                    </CTableDataCell>
                    <CTableDataCell>
                      {profil.status_pegawai || "-"}
                    </CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell >
                      UNOR INDUK
                    </CTableDataCell>
                    <CTableDataCell>
                      {profil.unor_induk || "-"}
                    </CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>
                      UNOR
                    </CTableDataCell>
                    <CTableDataCell>{profil.unor || "-"}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          {/* RINCIAN */}
          <CCard className="mb-4 shadow-sm border-0">
            <CCardHeader className="bg-light fw-semibold">
              <strong>Rincian Absensi</strong>
            </CCardHeader>

            <CCardBody className="p-0">
              {loading ? (
                <div className="text-center p-4">
                  <CSpinner />
                </div>
              ) : (
                <CTable
                  striped
                  hover
                  responsive
                  className="mb-0 align-middle"
                  style={{ fontSize: "14px" }}
                >
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell className="text-center" width="60">No</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Tanggal</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Masuk</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Pulang</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Terlambat</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Cepat Pulang</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {data.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={7} className="text-center py-4 text-muted">
                          Tidak ada data
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      data.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell className="text-center fw-semibold">
                            {index + 1}
                          </CTableDataCell>

                          <CTableDataCell className="text-center">
                            {item.tanggal}
                          </CTableDataCell>

                          {/* MASUK */}
                          <CTableDataCell className="text-center">
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                background: item.filepath_masuk ? "#e7f1ff" : "transparent",
                                color: item.filepath_masuk ? "#0d6efd" : "#6c757d",
                                fontWeight: 500,
                                cursor: item.filepath_masuk ? "pointer" : "default",
                                transition: "0.2s",
                              }}
                              onClick={() => openFoto(item.filepath_masuk)}
                              onMouseOver={(e) => {
                                if (item.filepath_masuk) {
                                  e.target.style.background = "#d0e2ff";
                                }
                              }}
                              onMouseOut={(e) => {
                                if (item.filepath_masuk) {
                                  e.target.style.background = "#e7f1ff";
                                }
                              }}
                              title={item.filepath_masuk ? "Klik untuk lihat foto" : ""}
                            >
                              {item.jam_absen_masuk || "-"}
                            </span>
                          </CTableDataCell>

                          {/* KELUAR */}
                          <CTableDataCell className="text-center">
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                background: item.filepath_keluar ? "#e7f1ff" : "transparent",
                                color: item.filepath_keluar ? "#0d6efd" : "#6c757d",
                                fontWeight: 500,
                                cursor: item.filepath_keluar ? "pointer" : "default",
                                transition: "0.2s",
                              }}
                              onClick={() => openFoto(item.filepath_keluar)}
                              onMouseOver={(e) => {
                                if (item.filepath_keluar) {
                                  e.target.style.background = "#d0e2ff";
                                }
                              }}
                              onMouseOut={(e) => {
                                if (item.filepath_keluar) {
                                  e.target.style.background = "#e7f1ff";
                                }
                              }}
                              title={item.filepath_keluar ? "Klik untuk lihat foto" : ""}
                            >
                              {item.jam_absen_keluar || "-"}
                            </span>
                          </CTableDataCell>

                          {/* TERLAMBAT */}
                          <CTableDataCell className="text-center">
                            {item.terlambat_menit > 0 ? (
                              <span className="text-danger fw-semibold">
                                {item.terlambat_menit} menit
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </CTableDataCell>

                          {/* CEPAT PULANG */}
                          <CTableDataCell className="text-center">
                            {item.cepat_pulang_menit > 0 ? (
                              <span className="text-warning fw-semibold">
                                {item.cepat_pulang_menit} menit
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </CTableDataCell>

                          {/* STATUS */}
                          <CTableDataCell className="text-center">
                            {badgeStatus(item.keterangan)}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>

          {/* REKAP */}
          <CCard className="mb-4 shadow-sm">
            <CCardHeader>
              <strong>Rekap Kehadiran</strong>
            </CCardHeader>

            <CCardBody className="p-0">
              <CTable bordered striped responsive className="mb-0">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Keterangan</CTableHeaderCell>
                    <CTableHeaderCell width="90" className="text-center">
                      Jumlah
                    </CTableHeaderCell>
                    <CTableHeaderCell>Keterangan</CTableHeaderCell>
                    <CTableHeaderCell width="90" className="text-center">
                      Jumlah
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {Array.from({ length: half }).map((_, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>
                        {rowsSummary[i]?.[0]}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {rowsSummary[i]?.[1]}
                      </CTableDataCell>

                      <CTableDataCell>
                        {rowsSummary[i + half]?.[0] || "-"}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {rowsSummary[i + half]?.[1] || 0}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </div>
        <CModal
        visible={showFoto}
        onClose={() => setShowFoto(false)}
        size="lg"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Foto Absensi</CModalTitle>
        </CModalHeader>

        <CModalBody className="text-center">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt="Foto Absensi"
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
          ) : (
            <div className="text-muted">Tidak ada foto</div>
          )}
        </CModalBody>
      </CModal>
      </CCardBody>
    </CCard>
  );
};

export default RiwayatAbsensiDetail;