import React, { useEffect, useState } from "react";
import api from "src/services/api";

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
} from "@coreui/react";

export default function PegawaiForm({ data, onClose, onSuccess }) {
  const isEdit = !!data;

  const [kategoriList, setKategoriList] = useState([]);
  const [atasanList, setAtasanList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nip: "",
    nama: "",
    unor: "",
    jabatan: "",
    kategori_pegawai_id: "",
    role: "pegawai",
    atasan_id: "",
  });

  // ================= RESET + LOAD DATA =================
  useEffect(() => {
    if (data) {
      setForm({
        nip: data.nip || "",
        nama: data.nama || "",
        unor: data.unor || "",
        jabatan: data.jabatan || "",
        kategori_pegawai_id: data.kategori_pegawai_id || "",
        role: data.role || "pegawai",
        atasan_id: data.atasan_id || "",
      });
    } else {
      setForm({
        nip: "",
        nama: "",
        unor: "",
        jabatan: "",
        kategori_pegawai_id: "",
        role: "pegawai",
        atasan_id: "",
      });
    }
  }, [data]);

  // ================= KATEGORI =================
  useEffect(() => {
    const loadKategori = async () => {
      try {
        const res = await api.get("/kategori-pegawai");
        setKategoriList(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadKategori();
  }, []);

  // ================= ATASAN =================
  useEffect(() => {
    const loadAtasan = async () => {
      try {
        const res = await api.get("/pegawai");
        const list = res.data?.data || [];

        // hanya pegawai yang sudah punya akun
        const filtered = list.filter((p) => p.user_id);

        setAtasanList(filtered);
      } catch (err) {
        console.error("LOAD ATASAN ERROR:", err);
      }
    };

    loadAtasan();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        kategori_pegawai_id: form.kategori_pegawai_id,
        role: form.role,
        atasan_id: form.atasan_id || null,
      };

      const id = data?.id || data?.user_id;

      if (isEdit) {
        await api.put(`/pegawai/${id}`, payload);
      } else {
        await api.post(`/pegawai`, form);
      }

      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CModal visible onClose={onClose} alignment="center" size="lg">

      <CModalHeader>
        <CModalTitle>
          {isEdit ? "Edit Pegawai" : "Tambah Pegawai"}
        </CModalTitle>
      </CModalHeader>

      <CForm onSubmit={handleSubmit}>

        <CModalBody>
          <CRow className="g-3">

            {/* NIP */}
            <CCol md={6}>
              <CFormInput label="NIP" value={form.nip} disabled />
            </CCol>

            {/* NAMA */}
            <CCol md={6}>
              <CFormInput label="Nama" value={form.nama} disabled />
            </CCol>

            {/* UNIT */}
            <CCol md={6}>
              <CFormInput label="Unit" value={form.unor} disabled />
            </CCol>

            {/* JABATAN */}
            <CCol md={6}>
              <CFormInput label="Jabatan" value={form.jabatan} disabled />
            </CCol>

            {/* KATEGORI */}
            <CCol md={6}>
              <CFormSelect
                name="kategori_pegawai_id"
                value={form.kategori_pegawai_id}
                onChange={handleChange}
              >
                <option value="">-- Pilih Kategori --</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kategori}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* ROLE */}
            <CCol md={6}>
              <CFormSelect
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="pegawai">Pegawai</option>
                <option value="admin_opd">Admin OPD</option>
              </CFormSelect>
            </CCol>

            {/* ATASAN */}
            <CCol md={12}>
              <CFormSelect
                name="atasan_id"
                value={form.atasan_id || ""}
                onChange={handleChange}
              >
                <option value="">-- Pilih Atasan --</option>

                {atasanList
                  .filter((a) => a.user_id !== data?.user_id)
                  .map((a) => (
                    <option key={a.user_id} value={a.user_id}>
                      {a.nama} - {a.jabatan}
                    </option>
                  ))}
              </CFormSelect>
            </CCol>

          </CRow>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Batal
          </CButton>

          <CButton color="primary" type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </CButton>
        </CModalFooter>

      </CForm>

    </CModal>
  );
}