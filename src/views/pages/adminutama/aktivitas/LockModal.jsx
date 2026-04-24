import { useState, useEffect } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormSelect,
  CSpinner
} from "@coreui/react";

import { lockAktivitas } from "../../../../services/aktivitasAdminService";
import { toast } from "react-toastify";

export default function LockModal({ open, onClose, selected }) {
  const [form, setForm] = useState({
    user_id: "",
    tanggal: "",
    alasan: ""
  });

  const [loading, setLoading] = useState(false);

  // 🔥 SET DATA SAAT MODAL DIBUKA
  useEffect(() => {
    if (open && selected) {
      setForm({
        user_id: selected.user_id || "",
        tanggal: "",
        alasan: ""
      });
    }
  }, [open, selected]);

  // 🔥 RESET SAAT MODAL DITUTUP
  const handleClose = () => {
    setForm({
      user_id: "",
      tanggal: "",
      alasan: ""
    });
    onClose();
  };

  const handleLock = async () => {
    if (!form.user_id || !form.tanggal) {
      toast.warning("Tanggal wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        user_id: form.user_id,
        tanggal: form.tanggal,
        alasan: form.alasan
      };

      console.log("PAYLOAD LOCK:", payload); // DEBUG

      const res = await lockAktivitas(payload);

      if (!res?.success) {
        throw new Error(res?.message || "Gagal lock");
      }

      toast.success("Berhasil lock");
      handleClose();

    } catch (err) {
      console.error("ERROR LOCK:", err);
      toast.error(err.message || "Gagal lock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CModal visible={open} onClose={handleClose} alignment="center">
      
      <CModalHeader>
        <CModalTitle>Lock Aktivitas Pegawai</CModalTitle>
      </CModalHeader>

      <CModalBody>

        {/* 🔹 INFO PEGAWAI */}
        {selected && (
          <div className="mb-3 p-2 border rounded bg-light">
            <div><strong>{selected.nama}</strong></div>
            <div className="text-muted">NIP: {selected.nip}</div>
          </div>
        )}

        {/* 🔹 FORM */}
        <CFormInput
          label="User ID"
          value={form.user_id}
          readOnly
          className="mb-3"
        />

        <CFormInput
          type="date"
          label="Tanggal"
          value={form.tanggal}
          onChange={(e) =>
            setForm({ ...form, tanggal: e.target.value })
          }
          className="mb-3"
        />

        <CFormSelect
          label="Alasan Lock"
          value={form.alasan}
          onChange={(e) =>
            setForm({ ...form, alasan: e.target.value })
          }
        >
          <option value="">-- Pilih Alasan --</option>
          <option value="Validasi data belum lengkap">Validasi data belum lengkap</option>
          <option value="Kesalahan input aktivitas">Kesalahan input aktivitas</option>
          <option value="Pelanggaran ketentuan">Pelanggaran ketentuan</option>
          <option value="Penutupan periode">Penutupan periode</option>
          <option value="Kebijakan instansi">Kebijakan instansi</option>
        </CFormSelect>

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
          onClick={handleLock}
          disabled={loading}
        >
          {loading ? <CSpinner size="sm" /> : "Lock"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}