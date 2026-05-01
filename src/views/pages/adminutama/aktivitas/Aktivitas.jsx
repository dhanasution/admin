import { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CFormInput
} from "@coreui/react";

import AktivitasTable from "./AktivitasTable";
import AktivitasFormModal from "./AktivitasFormModal";
import UnlockModal from "./UnlockModal";
import LockModal from "./LockModal";

import {
  getAktivitasAdmin,
  deleteAktivitas
} from "../../../../services/aktivitasAdminService";

import { searchPegawai } from "../../../../services/pegawaiService";

export default function Aktivitas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const [lockModal, setLockModal] = useState(false);
  const [unlockModal, setUnlockModal] = useState(false);

  const [keyword, setKeyword] = useState("");

  // 🔥 PAGINATION
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // 🔥 SEARCH PEGAWAI
  const [result, setResult] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAktivitasAdmin({
        page,
        limit
      });

      setData(res.data.data || []);
      setTotal(res.data.total || 0);

    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Hapus data?")) return;

    await deleteAktivitas(id);

    // 🔥 kalau data habis di page terakhir, mundur 1 page
    if (data.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      fetchData();
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!keyword) return;

    try {
      setLoadingSearch(true);

      const res = await searchPegawai(keyword);

      let data = [];

      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data.data)) {
        data = res.data.data;
      } else if (Array.isArray(res.data.data?.data)) {
        data = res.data.data.data;
      }

      setResult(data);

    } catch (err) {
      console.error("SEARCH ERROR:", err);
      setResult([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleReset = () => {
    setKeyword("");
    setResult([]);
  };

  /* ================= TOTAL PAGE ================= */
  const totalPage = Math.ceil(total / limit) || 1;

  return (
    <>
      {/* ================= SEARCH CARD ================= */}
      <CCard className="mb-3">
        <CCardHeader>
          <strong>Lock / Unlock Aktivitas Pegawai</strong>
        </CCardHeader>

        <CCardBody>
          <div className="d-flex gap-2">
            <CFormInput
              placeholder="Masukkan NIP atau Nama"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearch()
              }
            />

            <CButton color="primary" onClick={handleSearch}>
              Cari
            </CButton>

            <CButton color="secondary" onClick={handleReset}>
              Reset
            </CButton>
          </div>

          {/* RESULT */}
          <div className="mt-4">
            {loadingSearch ? (
              <CSpinner size="sm" />
            ) : result.length === 0 ? (
              <small className="text-muted">
                Tidak ada data ditemukan
              </small>
            ) : (
              result.map((item) => (
                <div
                  key={item.id}
                  className="border rounded p-3 mb-2 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div><strong>{item.nama}</strong></div>
                    <div className="text-muted">NIP: {item.nip}</div>
                    <div className="text-muted">{item.unor || "-"}</div>
                    <div className="text-muted small">
                      Jabatan: {item.jabatan || "-"}
                    </div>
                    <div className="text-muted small">
                      Atasan: {item.nama_atasan || "-"}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <CButton
                      color="success"
                      size="sm"
                      onClick={() => {
                        setSelected(item);
                        setUnlockModal(true);
                      }}
                    >
                      Unlock
                    </CButton>

                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => {
                        setSelected(item);
                        setLockModal(true);
                      }}
                    >
                      Lock
                    </CButton>
                  </div>
                </div>
              ))
            )}
          </div>
        </CCardBody>
      </CCard>

      {/* ================= TABLE ================= */}
      <CCard>
        <CCardHeader>
          <strong>Data Aktivitas</strong>
        </CCardHeader>

        <CCardBody>
          {loading ? (
            <CSpinner />
          ) : (
            <>
              <AktivitasTable
                data={data}
                onEdit={(row) => {
                  setSelected(row);
                  setModal(true);
                }}
                onDelete={handleDelete}
              />

              {/* 🔥 PAGINATION */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  Total: {total}
                </div>

                <div className="d-flex gap-2 align-items-center">
                  <CButton
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Prev
                  </CButton>

                  <span>
                    {page} / {totalPage}
                  </span>

                  <CButton
                    size="sm"
                    disabled={page >= totalPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </CButton>
                </div>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      {/* ================= MODAL ================= */}
      <AktivitasFormModal
        open={modal}
        onClose={() => {
          setModal(false);
          setSelected(null);
        }}
        data={selected}
        refresh={fetchData}
      />

      <UnlockModal
        open={unlockModal}
        onClose={() => setUnlockModal(false)}
        selected={selected}
      />

      <LockModal
        open={lockModal}
        onClose={() => setLockModal(false)}
        selected={selected}
      />
    </>
  );
}