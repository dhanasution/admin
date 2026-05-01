import React, { useState, useEffect } from "react";
import api from "src/services/api";
import { toast } from "react-toastify";

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CSpinner,
  CCard,
  CCardBody,
} from "@coreui/react";

const initialForm = {
  nip_baru: "",
  nama: "",
  jenis_kelamin: "",
  tgl_lahir: "",
  tempat_lahir: "",
  email: "",
  no_hp: "",
  alamat: "",

  jenis_pegawai_nama: "PNS",
  status_pegawai: "AKTIF",

  unor_induk_id: "",
  unor_induk_nama: "",

  unor_id: "",
  unor_nama: "",

  jabatan_nama: "",
  kelas_jabatan: "",
  gol_ruang_akhir: "",
  tmt_pns: "",

  role: "pegawai",
};

export default function TambahPegawaiModal({
  visible,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [opdList, setOpdList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [form, setForm] = useState(initialForm);

  const inputClass = "mb-3";

  useEffect(() => {
    if (visible) {
      resetForm();
      loadOpd();
    }
  }, [visible]);

  const resetForm = () => {
    setForm(initialForm);
    setUnitList([]);
    setLoading(false);
  };

  const loadOpd = async () => {
    try {
      const res = await api.get("/pegawai/unit");
      setOpdList(res.data?.data || []);
    } catch {
      toast.error("Gagal memuat daftar OPD");
    }
  };

  useEffect(() => {
    console.log("OPD DIPILIH:", form.unor_induk_id);

    if (!form.unor_induk_id) {
      setUnitList([]);
      return;
    }

    loadUnit(form.unor_induk_id);
  }, [form.unor_induk_id]);

   const loadUnit = async (opdId) => {
    try {
      console.log("LOAD UNIT OPD:", opdId);

      const res = await api.get(`/pegawai/unit?opd=${opdId}`);

      console.log("HASIL UNIT:", res.data);

      setUnitList(res.data?.data || []);
    } catch (err) {
      console.error("ERROR LOAD UNIT:", err);
      setUnitList([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectOpd = (e) => {
    const value = e.target.value;

    const selected = opdList.find(
      (x) => String(x.id) === String(value)
    );

    console.log("SELECTED OPD:", selected); // 🔥 debug

    setForm((prev) => ({
      ...prev,
      unor_induk_id: value || "", // pastikan tidak undefined
      unor_induk_nama: selected?.nama_unit || "",
      unor_id: "",
      unor_nama: "",
    }));
  };

  const handleSelectUnit = (e) => {
    const value = e.target.value;
    const selected = unitList.find((x) => String(x.id) === String(value));

    setForm((prev) => ({
      ...prev,
      unor_id: value,
      unor_nama: selected?.nama_unit || "",
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!form.nip_baru || !form.nama) {
      toast.error("NIP dan Nama wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/pegawai/create-manual", form);

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || "Gagal menambah pegawai");
      }

      toast.success(res.data.message || "Berhasil menambah pegawai");

      onSuccess?.();
      handleClose();

    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err.message ||
        "Gagal menambah pegawai"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      size="xl"
      alignment="center"
      backdrop="static"
      scrollable
    >
      <CModalHeader>
        <CModalTitle>Tambah Pegawai Baru</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CRow className="g-3">
          {/* LEFT */}
          <CCol md={6}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardBody>
                <div className="fw-semibold text-primary mb-3">
                  Data Identitas
                </div>

                <CFormInput label="NIP" name="nip_baru" value={form.nip_baru} onChange={handleChange} className={inputClass} />
                <CFormInput label="Nama Lengkap" name="nama" value={form.nama} onChange={handleChange} className={inputClass} />

                <CRow>
                  <CCol md={6}>
                    <CFormSelect label="Jenis Kelamin" name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} className={inputClass}>
                      <option value="">Pilih</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormInput type="date" label="Tanggal Lahir" name="tgl_lahir" value={form.tgl_lahir} onChange={handleChange} className={inputClass} />
                  </CCol>
                </CRow>

                <CFormInput label="Tempat Lahir" name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} className={inputClass} />
                
                <CFormInput label="No HP" name="no_hp" value={form.no_hp} onChange={handleChange} className={inputClass} />
                <CFormTextarea label="Alamat" rows={3} name="alamat" value={form.alamat} onChange={handleChange} />
              </CCardBody>
            </CCard>
          </CCol>

          {/* RIGHT */}
          <CCol md={6}>
            <CCard className="border-0 shadow-sm h-100">
              <CCardBody>
                <div className="fw-semibold text-success mb-3">
                  Data Kepegawaian
                </div>

                {/* OPD */}
                <div className="border rounded p-3 mb-3 bg-light">
                  <CFormSelect label="Unor Induk" value={form.unor_induk_id} onChange={handleSelectOpd} className={inputClass}>
                    <option value="">Pilih OPD</option>
                    {opdList.map((item, i) => (
                      <option key={i} value={item.id}>
                        {item.nama_unit}
                      </option>
                    ))}
                  </CFormSelect>

                    <CFormInput
                      label="Unor"
                      name="unor_nama"
                      value={form.unor_nama}
                      onChange={handleChange}
                      rows={2}
                      className={inputClass}
                      placeholder="Masukkan nama unit kerja"
                    />
                </div>

                {/* JABATAN */}
                <div className="border rounded p-3 mb-3">
                  <CFormInput label="Jabatan" name="jabatan_nama" value={form.jabatan_nama} onChange={handleChange} className={inputClass} />

                  <CRow>
                    <CCol md={6}>
                      <CFormInput label="Kelas Jabatan" name="kelas_jabatan" value={form.kelas_jabatan} onChange={handleChange} />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput label="Golongan" name="gol_ruang_akhir" value={form.gol_ruang_akhir} onChange={handleChange} />
                    </CCol>
                  </CRow>
                </div>

                <CFormInput type="date" label="TMT PNS" name="tmt_pns" value={form.tmt_pns} onChange={handleChange} className={inputClass} />

                <CFormSelect label="Role Sistem" name="role" value={form.role} onChange={handleChange}>
                  <option value="pegawai">Pegawai</option>
                  <option value="admin_opd">Admin OPD</option>
                  <option value="admin_utama">Admin Utama</option>
                </CFormSelect>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CModalBody>

            <CModalFooter>
        <CButton
          color="secondary"
          onClick={handleClose}
          disabled={loading}
        >
          Batal
        </CButton>

        <CButton
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CSpinner size="sm" />
          ) : (
            "Simpan"
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}