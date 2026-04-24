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

      setData(detailRes.data || []);
      setSummary(summaryRes.data || {});
      setProfil(profilRes.data?.data || {});
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
          <CCard className="mb-4 shadow-sm">
            <CCardHeader>
              <strong>Rincian Absensi</strong>
            </CCardHeader>

            <CCardBody className="p-0">
              {loading ? (
                <div className="text-center p-4">
                  <CSpinner />
                </div>
              ) : (
                <CTable striped bordered hover responsive className="mb-0">
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell className="text-center">No</CTableHeaderCell>
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
                        <CTableDataCell
                          colSpan={7}
                          className="text-center"
                        >
                          Tidak ada data
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      data.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                          <CTableDataCell className="text-center">{item.tanggal}</CTableDataCell>
                          <CTableDataCell className="text-center">
                            {item.jam_absen_masuk || "-"}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {item.jam_absen_keluar || "-"}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {item.terlambat_menit > 0
                              ? `${item.terlambat_menit} menit`
                              : "-"}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {item.cepat_pulang_menit > 0
                              ? `${item.cepat_pulang_menit} menit`
                              : "-"}
                          </CTableDataCell>
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
      </CCardBody>
    </CCard>
  );
};

export default RiwayatAbsensiDetail;