import React, { useEffect, useState, useMemo } from "react";
import api from "src/services/api";
import { toast } from "react-toastify";

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormSelect,
  CFormInput,
  CSpinner,
  CAlert,
} from "@coreui/react";

export default function EditAtasanModal({ data, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [loadingAtasan, setLoadingAtasan] = useState(false);

  const [unitList, setUnitList] = useState([]);
  const [atasanList, setAtasanList] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState("");
  const [atasanId, setAtasanId] = useState("");

  const [searchUnit, setSearchUnit] = useState("");

  // ================= LOAD UNIT =================
  useEffect(() => {
    const loadUnit = async () => {
      try {
        const res = await api.get("/pegawai/unit");
        setUnitList(res.data?.data || []);
      } catch (err) {
        console.error("LOAD UNIT ERROR:", err);
      }
    };

    loadUnit();
  }, []);

  // ================= INIT DATA =================
  useEffect(() => {
    if (!data) return;

    setAtasanId(data.atasan_id || "");

    setSelectedUnit(
      String(data.unor_induk_id || data.opd_id || "")
    );
  }, [data]);

  // ================= LOAD PEGAWAI BY UNIT =================
  useEffect(() => {
    if (!selectedUnit) {
      setAtasanList([]);
      return;
    }

    const loadPegawaiUnit = async () => {
      try {
        setLoadingAtasan(true);

        const res = await api.get(
          `/pegawai/by-unit?unit=${selectedUnit}`
        );

        setAtasanList(res.data?.data || []);
      } catch (err) {
        console.error("LOAD PEGAWAI ERROR:", err);
        setAtasanList([]);
      } finally {
        setLoadingAtasan(false);
      }
    };

    loadPegawaiUnit();
  }, [selectedUnit]);

  // ================= FILTER OPD =================
  const filteredUnitList = useMemo(() => {
    return unitList.filter((u) =>
      (u.nama_unit || "")
        .toLowerCase()
        .includes(searchUnit.toLowerCase())
    );
  }, [unitList, searchUnit]);

  // ================= FILTER ATASAN (HANYA PNS) =================
  const filteredAtasanList = useMemo(() => {
    return atasanList
      .filter((a) => a.user_id !== data?.user_id)
      .filter((a) => a.kategori_pegawai === "PNS");
  }, [atasanList, data]);

  // ================= CURRENT ATASAN =================
  const currentAtasan = useMemo(() => {
    if (!data?.atasan_id) return null;

    return {
      nama: data.nama_atasan || "-",
      nip: data.nip_atasan || "-",
    };
  }, [data]);

  // ================= SAVE =================
 const handleSave = async () => {
  try {
    setLoading(true);

    await api.put(`/pegawai/${data.user_id}/atasan`, {
      atasan_id: atasanId || null,
    });

    toast.success("Atasan berhasil diperbarui");

    onSuccess(); // biasanya ini close + refresh

  } catch (err) {
    console.error(err);

    toast.error(
      err.response?.data?.message || "Gagal update atasan"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <CModal visible onClose={onClose} alignment="center" size="md">
      <CModalHeader>
        <CModalTitle>Edit Atasan Pegawai</CModalTitle>
      </CModalHeader>

      <CModalBody>

        {/* ================= ATASAN SAAT INI ================= */}
        <div className="mb-3">
          Atasan Saat Ini

          <div className="mb-3 p-2 border rounded bg-light">
            {currentAtasan ? (
              <>
                <div><strong>{currentAtasan.nama}</strong></div>
                <div className="text-muted">NIP: {currentAtasan.nip}</div>
              </>
            ) : (
              <span className="text-muted">-</span>
            )}
          </div>
        </div>

        {/* ================= OPD SEARCH ================= */}
        <div className="mb-2">
          <CFormInput
            placeholder="Cari OPD / Unit..."
            value={searchUnit}
            onChange={(e) => setSearchUnit(e.target.value)}
          />
        </div>

        {/* ================= UNIT ================= */}
        <div className="mb-3">
          <label className="form-label">Unit / OPD</label>

          <CFormSelect
            value={selectedUnit}
            onChange={(e) => {
              setSelectedUnit(e.target.value);
              setAtasanId("");
              setAtasanList([]);
            }}
          >
            <option value="">-- Pilih Unit --</option>

            {filteredUnitList.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nama_unit}
              </option>
            ))}
          </CFormSelect>

          <small className="text-muted">
            Default: {data?.unor_induk_nama || "-"}
          </small>
        </div>

        {/* ================= ATASAN ================= */}
        <div className="mb-3">
          <label className="form-label">Pilih Atasan (PNS saja)</label>

          <CFormSelect
            value={atasanId}
            onChange={(e) => setAtasanId(e.target.value)}
            disabled={!selectedUnit || loadingAtasan}
          >
            <option value="">
              {loadingAtasan ? "Loading..." : "-- Pilih Atasan --"}
            </option>

            {filteredAtasanList.map((a) => (
              <option key={a.user_id} value={a.user_id}>
                {a.nama} ({a.nip})
              </option>
            ))}
          </CFormSelect>
        </div>

        {/* EMPTY STATE */}
        {selectedUnit && !loadingAtasan && filteredAtasanList.length === 0 && (
          <CAlert color="warning">
            Tidak ada pegawai PNS di unit ini
          </CAlert>
        )}

      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Batal
        </CButton>

        <CButton
          color="primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CSpinner size="sm" /> : "Simpan"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}