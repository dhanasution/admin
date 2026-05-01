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
  modeCetak, // Mode dari parent (tpptotal, harian, bulanan, rekappersen)
  penandaList = [],
  onSubmit,
  selectedOpd,

}) => {
  // ================= STATE =================
  const [selectedBulan, setSelectedBulan] = useState("");
  const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear());
  
  // State untuk 1 penandatangan (Mode Biasa)
  const [selectedPenanda, setSelectedPenanda] = useState(null);

  // State untuk 3 penandatangan (Khusus mode tpptotal)
  const [penandaKiri, setPenandaKiri] = useState(null);
  const [penandaTengah, setPenandaTengah] = useState(null);
  const [penandaKanan, setPenandaKanan] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  // ================= AUTO HIDE ERROR =================
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  // ================= RESET SAAT MODAL DIBUKA =================
  useEffect(() => {
    if (visible) {
      setSelectedBulan("");
      setSelectedTahun(new Date().getFullYear());
      setSelectedPenanda(null);
      setPenandaKiri(null);
      setPenandaTengah(null);
      setPenandaKanan(null);
      setErrorMessage("");
    }
  }, [visible]);

    useEffect(() => {
    setSelectedPenanda(null);
    setPenandaKiri(null);
    setPenandaTengah(null);
    setPenandaKanan(null);
  }, [selectedOpd]);

  // ================= VALIDASI & SUBMIT =================
  const handleSubmit = async () => {
    if (!selectedBulan || !selectedTahun) {
      setErrorMessage("Bulan dan tahun wajib dipilih");
      return;
    }

    let payloadPenandatangan;

    if (modeCetak === "tpptotal") {
      // Validasi 3 penandatangan
      if (!penandaKiri || !penandaTengah || !penandaKanan) {
        setErrorMessage("Ketiga penandatangan wajib dipilih untuk mode TPP");
        return;
      }
      payloadPenandatangan = {
        kiri: penandaKiri,
        tengah: penandaTengah,
        kanan: penandaKanan
      };
    } else {
      // Validasi 1 penandatangan
      if (!selectedPenanda) {
        setErrorMessage("Penandatangan wajib dipilih");
        return;
      }
      payloadPenandatangan = selectedPenanda;
    }

    setErrorMessage("");

    const result = await onSubmit({
      bulan: selectedBulan,
      tahun: selectedTahun,
      penandatangan: payloadPenandatangan
    });

    if (result?.error) setErrorMessage(result.error);
    if (result?.info) setErrorMessage(result.info);
    
    if (result?.success) {
      setErrorMessage("Laporan berhasil digenerate");
      setTimeout(() => {
        setErrorMessage("");
        onClose();
      }, 1500);
    }
  };

  // Reusable Select Component untuk kerapian
  const PenandaSelectField = ({ label, value, onChange }) => (
  <CCol md={12} className="mb-2">
    <CFormLabel>{label}</CFormLabel>

    <CFormSelect
      key={penandaList.length} // 🔥 PENTING: paksa re-render saat data berubah
      value={value?.id ?? ""}
      onChange={(e) => {
        const val = e.target.value;

        const found = penandaList.find((p) => String(p.id) === String(val));

        onChange(found || null);
      }}
    >
      <option value="">Pilih {label}</option>

      {penandaList.length === 0 ? (
        <option disabled>Loading / Tidak ada data</option>
      ) : (
        penandaList.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nama} - {p.jabatan_nama || p.jabatan || "-"}
          </option>
        ))
      )}
    </CFormSelect>

    {/* DEBUG VISUAL */}
    <div style={{ fontSize: "10px", color: "#999" }}>
      total: {penandaList.length}
    </div>

    {value && (
      <div className="mt-1" style={{ fontSize: "11px", color: "#666" }}>
        <div>
          <strong>Jabatan:</strong>{" "}
          {value?.jabatan_nama || value?.jabatan || "-"}
        </div>
        <div>
          <strong>NIP:</strong> {value?.nip || "-"}
        </div>
      </div>
    )}
  </CCol>
);

  return (
    <CModal visible={visible} onClose={onClose} size={modeCetak === "tpptotal" ? "lg" : undefined}>
      <CModalHeader>
        <CModalTitle>Filter Cetak - {modeCetak?.toUpperCase()}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        {errorMessage && (
          <CAlert color={errorMessage.includes("berhasil") ? "success" : "danger"}>
            {errorMessage}
          </CAlert>
        )}

        <CRow className="g-3">
          <CCol md={6}>
            <CFormLabel>Bulan</CFormLabel>
            <CFormSelect
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
            >
              <option value="">Pilih Bulan</option>
              {BULAN_LIST.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={6}>
            <CFormLabel>Tahun</CFormLabel>
            <CFormInput
              type="number"
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
            />
          </CCol>

          <hr className="my-4" />

          {/* MODE KONDISIONAL PENANDATANGAN */}
          {modeCetak === "tpptotal" ? (
            <>
              <CCol md={12}><h6 className="fw-bold">Pengaturan Penandatangan (3 Orang)</h6></CCol>
              <PenandaSelectField label="Disetujui Oleh" value={penandaKiri} onChange={setPenandaKiri} />
              <PenandaSelectField label="Mengetahui PPTK" value={penandaTengah} onChange={setPenandaTengah} />
              <PenandaSelectField label="Dibayar Oleh" value={penandaKanan} onChange={setPenandaKanan} />
            </>
          ) : (
            <PenandaSelectField label="Penandatangan Laporan" value={selectedPenanda} onChange={setSelectedPenanda} />
          )}
        </CRow>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Batal</CButton>
        <CButton color="primary" onClick={handleSubmit}>Cetak Laporan</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default CetakModal;