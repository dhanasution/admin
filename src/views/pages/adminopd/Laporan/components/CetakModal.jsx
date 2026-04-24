import React, { useEffect, useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormSelect,
  CFormInput,
  CRow,
  CCol,
  CAlert,
  CFormLabel
} from "@coreui/react";


import { BULAN_LIST } from "../../../../../utils/bulan";

const CetakModal = ({
  visible,
  onClose,
  data = [],
  penandaList = [],
  onSubmit,
}) => {

  // ================= STATE =================
  const [pegawai, setPegawai] = useState("");
  const [nip, setNip] = useState("");

  const [selectedBulan, setSelectedBulan] = useState("");
  const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear());
  const [selectedPenanda, setSelectedPenanda] = useState(null);

  const [listPegawai, setListPegawai] = useState([]);

  // ✅ ERROR STATE (LOCAL ONLY)
  const [errorMessage, setErrorMessage] = useState("");

  // ================= AUTO HIDE ERROR =================
  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  // ================= LIST PEGAWAI =================
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) {
      setListPegawai([]);
      return;
    }

    const unique = {};

    data.forEach((d) => {
      if (d?.nama && !unique[d.nama]) {
        unique[d.nama] = d.nip;
      }
    });

    setListPegawai(
      Object.keys(unique).map((n) => ({
        nama: n,
        nip: unique[n],
      }))
    );
  }, [data]);

  // ================= AUTO NIP =================
  useEffect(() => {
    const found = listPegawai.find((p) => p.nama === pegawai);
    setNip(found?.nip || "");
  }, [pegawai, listPegawai]);

  // ================= RESET SAAT MODAL DIBUKA =================
  useEffect(() => {
    if (visible) {
      setPegawai("");
      setNip("");
      setSelectedBulan("");
      setSelectedTahun(new Date().getFullYear());
      setSelectedPenanda(null);
      setErrorMessage("");
    }
  }, [visible]);

  // ================= VALIDASI & SUBMIT =================
  const handleSubmit = async () => {
  if (!selectedBulan || !selectedTahun) {
    setErrorMessage("Bulan dan tahun wajib dipilih");
    return;
  }

  if (!selectedPenanda) {
    setErrorMessage("Penandatangan wajib dipilih");
    return;
  }

  setErrorMessage("");

  const result = await onSubmit({
    bulan: selectedBulan,
    tahun: selectedTahun,
    pegawai,
    nip,
    penandatangan: selectedPenanda
  });

  if (result?.error) {
    setErrorMessage(result.error);
    return;
  }

  if (result?.info) {
    setErrorMessage(result.info);
    return;
  }

  if (result?.success) {
    setErrorMessage("Laporan berhasil digenerate");

    setTimeout(() => {
      setErrorMessage("");
      onClose();
    }, 1500);
  }
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Filter Cetak Laporan</CModalTitle>
      </CModalHeader>

      <CModalBody>

        {/* ✅ ALERT AUTO HIDE */}
        {errorMessage && (
          <CAlert color="danger">
            {errorMessage}
          </CAlert>
        )}

        <CRow className="g-4">

          {/* BULAN */}
          <CCol md={12}>
            <CFormLabel>Bulan</CFormLabel>
            <CFormSelect
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
            >
              <option value="">Pilih Bulan</option>
              {BULAN_LIST.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          {/* TAHUN */}
          <CCol md={12}>
            <CFormLabel>Tahun</CFormLabel>
            <CFormInput
              type="number"
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
            />
          </CCol>

          {/* PENANDATANGAN */}
          <CCol md={12}>
            <CFormLabel>Penandatangan</CFormLabel>
            <CFormSelect
              value={selectedPenanda?.id || ""}
              onChange={(e) => {
                const found = penandaList.find(
                  (p) => p.id == e.target.value
                );
                setSelectedPenanda(found || null);
              }}
            >
              <option value="">
                {penandaList.length
                  ? "Pilih Penandatangan"
                  : "Data penandatangan kosong"}
              </option>

              {penandaList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          {/* NIP */}
          <CCol md={12}>
            <CFormLabel>NIP</CFormLabel>
            <CFormInput
              value={selectedPenanda?.nip || ""}
              disabled
              placeholder="NIP otomatis muncul"
            />
          </CCol>

        </CRow>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Batal
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Cetak Laporan
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default CetakModal;