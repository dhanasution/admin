import { useState } from "react";
import { CButton, CFormInput } from "@coreui/react";
import { createPegawai } from "src/services/pegawaiService";

export default function PegawaiForm({ onSuccess }) {
  const [nip, setNip] = useState("");
  const [bidangId, setBidangId] = useState("");

  const handleSubmit = async () => {
    await createPegawai({
      nip,
      bidang_id: bidangId
    });

    onSuccess();
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <CFormInput
        placeholder="NIP"
        value={nip}
        onChange={(e) => setNip(e.target.value)}
      />

      <CFormInput
        placeholder="Bidang ID"
        value={bidangId}
        onChange={(e) => setBidangId(e.target.value)}
      />

      <CButton onClick={handleSubmit} color="success">
        Simpan
      </CButton>
    </div>
  );
}