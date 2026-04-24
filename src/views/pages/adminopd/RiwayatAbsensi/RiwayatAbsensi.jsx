import React, { useEffect, useState, useMemo } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CSpinner,
} from "@coreui/react";



import { useNavigate } from "react-router-dom";
import api from "src/services/api";

const RiwayatAbsensi = () => {
  const [pegawai, setPegawai] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 5;

  const navigate = useNavigate();

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/users/pegawai-opd");
      setPegawai(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal ambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return pegawai.filter((item) =>
      item.nama?.toLowerCase().includes(keyword) ||
      item.nip?.toLowerCase().includes(keyword) ||
      item.kategori_pegawai?.toLowerCase().includes(keyword)
    );
  }, [pegawai, search]);

  useEffect(() => setPage(1), [search]);

  // ================= PAGINATION =================
  const indexOfLast = page * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  return (
    <CCard>
      <CCardHeader>
        <h5>Riwayat Absensi Pegawai</h5>
      </CCardHeader>

      <CCardBody>
        {error && <div className="text-danger mb-2">❌ {error}</div>}

        <CFormInput
          placeholder="Cari nama / NIP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />

        {loading ? (
          <div className="text-center">
            <CSpinner />
          </div>
        ) : (
          <CTable striped hover responsive>
            <CTableHead className="text-center">
              <CTableRow>
                <CTableHeaderCell>No</CTableHeaderCell>
                <CTableHeaderCell>Nama</CTableHeaderCell>
                <CTableHeaderCell>NIP</CTableHeaderCell>
                <CTableHeaderCell>Kategori</CTableHeaderCell>
                <CTableHeaderCell>Bidang</CTableHeaderCell>
                <CTableHeaderCell>Aksi</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {currentData.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center">
                    Data kosong
                  </CTableDataCell>
                </CTableRow>
              ) : (
                currentData.map((item, index) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>
                      {indexOfFirst + index + 1}
                    </CTableDataCell>

                    <CTableDataCell>{item.nama}</CTableDataCell>
                    <CTableDataCell>{item.nip}</CTableDataCell>
                    <CTableDataCell>{item.kategori_pegawai}</CTableDataCell>

                    <CTableDataCell>
                      {item.nama_bidang}
                      <br />
                      <small>({item.nama_opd})</small>
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <CButton
                        size="sm"
                        color="info"
                        onClick={() =>
                          navigate(`/adminopd/riwayat-absensi/${item.nip}`, {
                            state: { nama: item.nama },
                          })
                        }
                      >
                        Lihat Absensi
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        )}

        {/* PAGINATION */}
        <div className="mt-3 d-flex justify-content-end align-items-center gap-2">

          {/* Prev */}
          <CButton
            size="sm"
            color="secondary"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </CButton>

          {/* Page Info */}
          <span className="small fw-semibold">
            Page {page} / {totalPages}
          </span>

          {/* Next */}
          <CButton
            size="sm"
            color="secondary"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </CButton>

        </div>
      </CCardBody>
    </CCard>
  );
};

export default RiwayatAbsensi;