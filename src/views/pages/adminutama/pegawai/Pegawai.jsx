import React, { useEffect, useMemo, useState } from "react";
import api from "src/services/api";
import {
  CCard, CCardHeader, CCardBody,
  CButton,
  CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell,
  CFormInput, CFormSelect,
  CSpinner,
  CRow, CCol,
  CBadge,
} from "@coreui/react";

import EditAtasanModal from "./EditAtasanModal";

export default function Pegawai() {
  const [pegawai, setPegawai] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openRow, setOpenRow] = useState(null);

  const [selectedPegawai, setSelectedPegawai] = useState(null);
  const [openAtasan, setOpenAtasan] = useState(false);

  // ================= LOAD =================
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pegawai");
      setPegawai(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setPegawai([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= FILTER =================
  const normalize = (text) =>
    (text || "")
      .toString()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const filteredData = useMemo(() => {
    const keyword = normalize(search);
    if (!keyword) return pegawai;

    return pegawai.filter((p) =>
      normalize(p.nama).includes(keyword) ||
      normalize(p.nip).includes(keyword) ||
      normalize(p.unor).includes(keyword) ||
      normalize(p.jabatan).includes(keyword) ||
      normalize(p.kategori_pegawai).includes(keyword)
    );
  }, [pegawai, search]);

  // ================= PAGINATION =================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / rowsPerPage)
  );

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  // ================= HANDLER =================
  const handleOpenAtasan = (p, e) => {
    e.stopPropagation();
    setSelectedPegawai(p);
    setOpenAtasan(true);
  };

  const toggleRow = (key) => {
    setOpenRow((prev) => (prev === key ? null : key));
  };

  // ================= UI =================
  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader>
        <strong>Manajemen Pegawai</strong>
        <div className="text-medium-emphasis small">
          Total: {filteredData.length}
        </div>
      </CCardHeader>

      <CCardBody>

        {loading ? (
          <div className="text-center py-5">
            <CSpinner />
          </div>
        ) : (
          <>

            {/* FILTER */}
            <CRow className="mb-3 align-items-center">

              {/* KIRI */}
              <CCol md={3}>
                <CFormSelect
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  style={{ maxWidth: 140 }}
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </CFormSelect>
              </CCol>

              {/* KANAN */}
              <CCol md={9}>
                <div className="d-flex justify-content-end gap-2 flex-wrap">

                  {/* SEARCH */}
                  <CFormInput
                    style={{ maxWidth: 280 }}
                    placeholder="Cari pegawai..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {/* BUTTON */}
                  <CButton
                    color="primary"
                    onClick={() => console.log("Tambah Pegawai clicked")}
                  >
                    + Tambah Pegawai
                  </CButton>

                </div>
              </CCol>

            </CRow>

            {/* TABLE */}
            <CTable hover bordered responsive align="middle">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell>Nama</CTableHeaderCell>
                  <CTableHeaderCell>NIP</CTableHeaderCell>
                  <CTableHeaderCell>Unit</CTableHeaderCell>
                  <CTableHeaderCell>Jabatan</CTableHeaderCell>
                  <CTableHeaderCell>Kategori</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {currentData.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center">
                      Data tidak ditemukan
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentData.map((p, i) => {
                    const key = p.id || p.nip;
                    const isOpen = openRow === key;

                    return (
                      <React.Fragment key={key}>

                        {/* ROW UTAMA */}
                        <CTableRow
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleRow(key)}
                        >
                          <CTableDataCell>
                            {(currentPage - 1) * rowsPerPage + i + 1}
                          </CTableDataCell>

                          <CTableDataCell>
                            <strong>{p.nama || "-"}</strong>
                          </CTableDataCell>

                          <CTableDataCell>{p.nip || "-"}</CTableDataCell>
                          <CTableDataCell>{p.unor || "-"}</CTableDataCell>
                          <CTableDataCell>{p.jabatan || "-"}</CTableDataCell>
                          <CTableDataCell>{p.kategori_pegawai || "-"}</CTableDataCell>

                          <CTableDataCell>
                            <CBadge color={p.user_id ? "success" : "secondary"}>
                              {p.user_id ? "Aktif" : "Belum"}
                            </CBadge>
                          </CTableDataCell>

                          <CTableDataCell>
                            <CButton
                              size="sm"
                              color="warning"
                              onClick={(e) => handleOpenAtasan(p, e)}
                            >
                              Edit Atasan
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>

                        {/* DETAIL ROW */}
                        {isOpen && (
                          <CTableRow>
                            <CTableDataCell colSpan={8}>
                              <div className="p-3 bg-light border rounded">
                                <div className="mb-2">
                                  <strong>Detail Pegawai</strong>
                                </div>

                                <div className="small">
                                  <div>Unor Induk: {p.unor_induk || "-"}</div>
                                  <div>Golongan: {p.golongan || "-"}</div>
                                  <div>Atasan: {p.nama_atasan || "-"}</div>
                                </div>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        )}

                      </React.Fragment>
                    );
                  })
                )}
              </CTableBody>
            </CTable>

            {/* PAGINATION */}
            <div className="d-flex justify-content-between mt-3">
              <small>
                Halaman {currentPage} / {totalPages}
              </small>

              <div className="d-flex gap-2">
                <CButton
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </CButton>

                <CButton
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </CButton>
              </div>
            </div>

          </>
        )}

        {/* MODAL */}
        {openAtasan && selectedPegawai && (
          <EditAtasanModal
            data={selectedPegawai}
            onClose={() => {
              setOpenAtasan(false);
              setSelectedPegawai(null);
            }}
            onSuccess={() => {
              setOpenAtasan(false);
              setSelectedPegawai(null);
              loadData();
            }}
          />
        )}

      </CCardBody>
    </CCard>
  );
}