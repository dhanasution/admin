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

import { unlockAktivitas } from "../../../../services/aktivitasAdminService";
import { toast } from "react-toastify";

export default function UnlockModal({ open, onClose, selected }) {
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

  const handleUnlock = async () => {
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

      const res = await unlockAktivitas(payload);

      if (!res?.success) {
        throw new Error(res?.message || "Gagal unlock");
      }

      toast.success("Berhasil unlock");
      handleClose();

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Gagal unlock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CModal visible={open} onClose={handleClose} alignment="center">
      
      <CModalHeader>
        <CModalTitle>Unlock Aktivitas Pegawai</CModalTitle>
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
          label="Alasan Unlock"
          value={form.alasan}
          onChange={(e) =>
            setForm({ ...form, alasan: e.target.value })
          }
        >
          <option value="">-- Pilih Alasan --</option>
          <option value="Kendala teknis">Kendala teknis</option>
          <option value="Gangguan jaringan atau sistem">Gangguan jaringan atau sistem</option>
          <option value="Keterlambatan dengan alasan kedinasan">Keterlambatan dengan alasan kedinasan</option>
          <option value="Permohonan resmi pengguna">Permohonan resmi pengguna</option>
          <option value="Pertimbangan kelengkapan data">Pertimbangan kelengkapan data</option>
          <option value="Dispensasi terbatas">Dispensasi terbatas</option>
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
          onClick={handleUnlock}
          disabled={loading}
        >
          {loading ? <CSpinner size="sm" /> : "Unlock"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}