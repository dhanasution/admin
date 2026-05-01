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
  CFormSelect,
  CSpinner,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";

import { useNavigate } from "react-router-dom";
import api from "src/services/api";
import { getProfile } from "src/services/authService";

const RiwayatAbsensi = () => {
  const navigate = useNavigate();

  const [pegawai, setPegawai] = useState([]);
  const [search, setSearch] = useState(
    sessionStorage.getItem("ra_search") || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(
    Number(sessionStorage.getItem("ra_page")) || 1
  );

  const perPage = 5;

  const [user, setUser] = useState(null);

  const [opdId, setOpdId] = useState(
    sessionStorage.getItem("ra_opdId") || ""
  );

  const [opdList, setOpdList] = useState([]);

  // ================= SAVE SESSION =================
  useEffect(() => {
    sessionStorage.setItem("ra_search", search);
  }, [search]);

  useEffect(() => {
    sessionStorage.setItem("ra_page", page);
  }, [page]);

  useEffect(() => {
    sessionStorage.setItem("ra_opdId", opdId);
  }, [opdId]);

  // ================= PROFILE =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.data || res);
      } catch (err) {
        setError("Gagal mengambil profile user");
      }
    };

    fetchUser();
  }, []);

  // ================= FETCH OPD =================
  useEffect(() => {
    const fetchOpd = async () => {
      if (user?.role !== "admin_utama") return;

      try {
        const res = await api.get("/opd");
        setOpdList(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOpd();
  }, [user]);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      if (!user?.role) return;

      setLoading(true);
      setError("");

      let res;

      if (user.role === "admin_utama") {
        if (!opdId) {
          setPegawai([]);
          setLoading(false);
          return;
        }

        res = await api.get(`/adminutama/pegawai?opd_id=${opdId}`);
      } else {
        res = await api.get("/users/pegawai-opd");
      }

console.log("ROLE:", user.role);

console.log(res.data.data[0]);

      setPegawai(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.role) return;
    fetchData();
  }, [user?.role, opdId]);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return pegawai.filter(
      (item) =>
        item.nama?.toLowerCase().includes(keyword) ||
        item.nip?.toLowerCase().includes(keyword)
    );
  }, [pegawai, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // ================= PAGINATION =================
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const indexOfLast = page * perPage;
  const indexOfFirst = indexOfLast - perPage;

  const currentData = filtered.slice(indexOfFirst, indexOfLast);

  // ================= RESET =================
  const handleReset = () => {
    setSearch("");
    setPage(1);

    if (user?.role === "admin_utama") {
      setOpdId("");
    }

    sessionStorage.removeItem("ra_search");
    sessionStorage.removeItem("ra_page");
    sessionStorage.removeItem("ra_opdId");
  };

  // ================= DETAIL =================
  const handleDetail = (item) => {
    const basePath =
      user?.role === "admin_utama"
        ? "/adminutama/riwayat-absensi"
        : "/adminopd/riwayat-absensi";

    navigate(`${basePath}/${item.nip}`, {
      state: { nama: item.nama },
    });
  };

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="bg-white border-bottom">
        <h5 className="mb-0 fw-bold">Riwayat Absensi Pegawai</h5>
      </CCardHeader>

      <CCardBody>
        {/* ERROR */}
        {error && (
          <div className="alert alert-danger py-2">
            {error}
          </div>
        )}

        {/* FILTER AREA */}
        <CCard className="mb-4 border-0 shadow-sm bg-light">
          <CCardBody>
            <CRow className="g-3 align-items-end">
              {/* OPD */}
              {user?.role === "admin_utama" && (
                <CCol md={4}>
                  <label className="form-label fw-semibold">
                    Pilih Unor Induk
                  </label>

                  <CFormSelect
                    value={opdId}
                    onChange={(e) => setOpdId(e.target.value)}
                  >
                    <option value="">-- Pilih Unor Induk --</option>

                    {opdList.map((opd) => (
                      <option key={opd.id} value={opd.id}>
                        {opd.nama_opd}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              )}

              {/* SEARCH */}
              <CCol md={user?.role === "admin_utama" ? 5 : 9}>
                <label className="form-label fw-semibold">
                  Cari Nama / NIP
                </label>

                <CInputGroup>
 

                  <CFormInput
                    placeholder="Ketik nama pegawai atau NIP..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </CInputGroup>
              </CCol>

              {/* RESET */}
              <CCol md={3}>
                <label className="form-label fw-semibold d-block">
                  &nbsp;
                </label>

                <CButton
                  color="secondary"
                  variant="outline"
                  className="w-100 fw-semibold"
                  onClick={handleReset}
                >
                  Reset Filter
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
          </div>
        ) : (
          <CTable bordered hover responsive>
            <CTableHead color="light">
              <CTableRow className="text-center align-middle">
                <CTableHeaderCell width="60">No</CTableHeaderCell>
                <CTableHeaderCell>Nama</CTableHeaderCell>
                <CTableHeaderCell width="180">NIP</CTableHeaderCell>
                <CTableHeaderCell width="140">
                  Kategori
                </CTableHeaderCell>
                <CTableHeaderCell>Bidang</CTableHeaderCell>
                <CTableHeaderCell width="140">
                  Aksi
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {currentData.length === 0 ? (
                <CTableRow>
                  <CTableDataCell
                    colSpan={6}
                    className="text-center py-4 text-muted"
                  >
                    Tidak ada data ditemukan
                  </CTableDataCell>
                </CTableRow>
              ) : (
                currentData.map((item, index) => (
                  <CTableRow key={item.id || item.nip}>
                    <CTableDataCell className="text-center">
                      {indexOfFirst + index + 1}
                    </CTableDataCell>

                    <CTableDataCell className="fw-semibold">
                      {item.nama}
                    </CTableDataCell>

                    <CTableDataCell>{item.nip}</CTableDataCell>


                    <CTableDataCell className="text-center">
                      {item.kategori_pegawai || item.nama_kategori || "-"}
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.nama_bidang}
                      <br />
                      <small className="text-muted">
                        {item.nama_opd}
                      </small>
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <CButton
                        size="sm"
                        color="info"
                        className="fw-semibold text-white"
                        onClick={() => handleDetail(item)}
                      >
                        Lihat
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        )}

        {/* PAGINATION */}
        <div className="mt-4 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Total Data: {filtered.length}
          </small>

          <div className="d-flex align-items-center gap-2">
            <CButton
              size="sm"
              color="secondary"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </CButton>

            <span className="fw-semibold small">
              {page} / {totalPages}
            </span>

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
        </div>
      </CCardBody>
    </CCard>
  );
};

export default RiwayatAbsensi;