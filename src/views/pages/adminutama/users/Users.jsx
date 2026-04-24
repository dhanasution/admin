import React, { useEffect, useState } from "react";

import ModalGantiPassword from "../../../../components/pegawai/ModalGantiPassword";
import { getUsers, deleteUser } from "../../../../services/userService";
import UsersForm from "./UsersForm";

import {
  CCard,
  CCardHeader,
  CCardBody,
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
  CBadge,
  CAlert,
} from "@coreui/react";

import { toast } from "react-toastify";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const token = localStorage.getItem("token");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserPassword, setSelectedUserPassword] = useState(null);

  // ================= LOAD DATA =================
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("LOAD USERS ERROR:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>Yakin hapus user ini?</p>

        <div className="d-flex gap-2 mt-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={async () => {
              try {
                await deleteUser(id);

                toast.success("User berhasil dihapus");
                loadData();
                closeToast();

              } catch (err) {
                console.error(err);

                const message =
                  err.response?.data?.message ||
                  "Gagal hapus user";

                toast.error(message);
              }
            }}
          >
            Ya
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={closeToast}
          >
            Batal
          </button>
        </div>
      </div>
    ),
    { autoClose: false }
  );
};

  // ================= FILTER =================
  const filteredUsers = users.filter((u) => {
    const keyword = search.toLowerCase();

    return (
      u.nama?.toLowerCase().includes(keyword) ||
      u.nip?.toLowerCase().includes(keyword) ||
      u.role?.toLowerCase().includes(keyword)
    );
  });

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredUsers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage]);

  const handleChangePassword = (user) => {
    setSelectedUserPassword(user);
    setShowPasswordModal(true);
  };

  // ================= UI =================
  return (
    <>
      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Management Users</strong>

          
        </CCardHeader>

        <CCardBody>
          {/* LOADING */}
          {loading ? (
            <div className="text-center py-4">
              <CSpinner />
            </div>
          ) : (
            <>
             <CRow className="mb-3 align-items-center">

              {/* LEFT: Rows per page */}
              <CCol md={3} sm={6} xs={12}>
                <CFormSelect
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  style={{
                    width: "120px",
                  }}
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                </CFormSelect>
              </CCol>

              {/* RIGHT: Search + Button */}
              <CCol md={9} sm={6} xs={12}>
                <div className="d-flex justify-content-end gap-2 flex-wrap">

                  {/* SEARCH */}
                  <CFormInput
                    style={{ maxWidth: "250px" }}
                    placeholder="Cari nama / NIP / role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {/* BUTTON */}
                  <CButton
                    color="primary"
                    className="text-nowrap"
                    onClick={() => {
                      setSelected(null);
                      setShowForm(true);
                    }}
                  >
                    + Tambah User
                  </CButton>


                  


                </div>
              </CCol>

            </CRow>

              {/* TABLE */}
              <CTable bordered hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">No</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Nama</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">NIP</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Role</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Aksi</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {currentData.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className="text-center">
                        Data tidak ditemukan
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    currentData.map((u, i) => (
                      <CTableRow key={u.id}>
                        <CTableDataCell className="text-center">
                          {startIndex + i + 1}
                        </CTableDataCell>

                        <CTableDataCell>{u.nama}</CTableDataCell>
                        <CTableDataCell>{u.nip}</CTableDataCell>

                        <CTableDataCell>
                          <CBadge color="info">{u.role}</CBadge>
                        </CTableDataCell>

                        <CTableDataCell className="text-center">
                          <CButton
                            size="sm"
                            color="warning"
                            onClick={() => {
                              setSelected(u);
                              setShowForm(true);
                            }}
                          >
                            Edit
                          </CButton>{" "}
                          <CButton
                            size="sm"
                            color="info"
                            className="ms-1"
                            onClick={() => handleChangePassword(u)}
                          >
                            Password
                          </CButton>{" "}

                          <CButton
                            size="sm"
                            color="danger"
                            onClick={() => handleDelete(u.id)}
                          >
                            Hapus
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>


              {/* PAGINATION */}
              <div className="mt-3 d-flex justify-content-end align-items-center gap-2">

                {/* Prev */}
                <CButton
                  size="sm"
                  color="secondary"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </CButton>

                {/* Page Info */}
                <span className="small fw-semibold">
                  Page {currentPage} / {totalPages || 1}
                </span>

                {/* Next */}
                <CButton
                  size="sm"
                  color="secondary"
                  variant="outline"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </CButton>

              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      {/* FORM MODAL */}
      {showForm && (
        <UsersForm
          user={selected}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadData();
          }}
        />
      )}
    {showPasswordModal && (
      <ModalGantiPassword
        visible={showPasswordModal}
        user={selectedUserPassword}
        onClose={() => {
          setShowPasswordModal(false);
          setSelectedUserPassword(null);
        }}
      />
    )}

    </>
  );
}