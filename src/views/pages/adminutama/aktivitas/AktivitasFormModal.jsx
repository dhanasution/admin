import { useState, useEffect } from "react";
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput
} from "@coreui/react";

import {
  createAktivitas,
  updateAktivitas
} from "../../../../services/aktivitasAdminService";

export default function AktivitasFormModal({ open, onClose, data, refresh }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (data) setForm(data);
    else setForm({});
  }, [data]);

  const handleSubmit = async () => {
    if (data) {
      await updateAktivitas(data.id, form);
    } else {
      await createAktivitas(form);
    }

    refresh();
    onClose();
  };

  return (
    <CModal visible={open} onClose={onClose}>
      <CModalHeader>
        {data ? "Edit Aktivitas" : "Intervensi Aktivitas"}
      </CModalHeader>

      <CModalBody>
        <CFormInput
          label="User ID"
          value={form.user_id || ""}
          onChange={(e) =>
            setForm({ ...form, user_id: e.target.value })
          }
        />

        <CFormInput
          type="date"
          label="Tanggal"
          value={form.tanggal || ""}
          onChange={(e) =>
            setForm({ ...form, tanggal: e.target.value })
          }
        />

        <CFormInput
          label="Nama Kegiatan"
          value={form.nama_kegiatan || ""}
          onChange={(e) =>
            setForm({ ...form, nama_kegiatan: e.target.value })
          }
        />
      </CModalBody>

      <CModalFooter>
        <CButton onClick={onClose}>Batal</CButton>
        <CButton onClick={handleSubmit}>Simpan</CButton>
      </CModalFooter>
    </CModal>
  );
}