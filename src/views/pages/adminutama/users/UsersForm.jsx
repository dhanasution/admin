import React, { useState, useEffect } from "react";
import api from "../../../../services/api";

import {
  createUser,
  updateUser
} from "../../../../services/userService";

import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CButton,
  CFormInput,
  CFormSelect,
  CSpinner
} from "@coreui/react";

import { toast } from "react-toastify";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilLockUnlocked } from "@coreui/icons";

export default function UsersForm({ user, onClose, onSuccess }) {


  const [pegawaiList, setPegawaiList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [selectedPegawai, setSelectedPegawai] = useState(null);


  const [form, setForm] = useState({
    nama: "",
    nip: "",
    unor: "",
    role: "pegawai",
    password: ""
  });

  // ================= INIT FORM =================
  useEffect(() => {
    if (!user) {
      setForm({
        nama: "",
        nip: "",
        unor: "",
        role: "pegawai",
        password: ""
      });

      setSearch("");
      setSelectedPegawai(null);
      setPegawaiList([]);
      return;
    }

    setForm({
      nama: user.nama || "",
      nip: user.nip || "",
      unor: user.unor || "",
      role: user.role || "pegawai",
      password: ""
    });
  }, [user]);

  // ================= SEARCH PEGAWAI =================
  useEffect(() => {
    if (user) return; // hanya CREATE

    const fetchPegawai = async () => {
      try {
        setLoading(true);

        const res = await api.get("/pegawai/available", {
          params: { search }
        });

        const data = res.data?.data || [];
        setPegawaiList(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error(err);
        setPegawaiList([]);
      } finally {
        setLoading(false);
      }
    };

    if (search.trim().length > 1) {
      const delay = setTimeout(fetchPegawai, 300);
      return () => clearTimeout(delay);
    } else {
      setPegawaiList([]);
    }
  }, [search, user]);

  // ================= PILIH PEGAWAI =================
  const handleSelectPegawai = (p) => {
    setSelectedPegawai(p);

    setForm((prev) => ({
      ...prev,
      nama: p.nama,
      nip: p.nip,
      unor: p.unor || ""
    }));

    setSearch(p.nama);
    setShowDropdown(false);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.nama || !form.nip) {
        toast.warning("Nama dan NIP wajib diisi");
        return;
      }

      // CREATE
      if (!user) {
        if (!selectedPegawai) {
          toast.warning("Pilih pegawai terlebih dahulu");
          return;
        }

        if (!form.password || form.password.length < 6) {
          toast.warning("Password minimal 6 karakter");
          return;
        }

        await createUser({
          nama: form.nama,
          nip: form.nip,
          role: form.role,
          password: form.password
        });

        toast.success(`User ${form.nama} berhasil ditambahkan`);
      } else {
        // EDIT
        await updateUser(user.id, {
          nama: form.nama,
          nip: form.nip,
          role: form.role
        });

        toast.success(`Role ${form.nama} berhasil diperbarui`);
      }

      onSuccess();
      onClose();

    } catch (err) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <CModal visible onClose={onClose} size="md">
  <CModalHeader>
    <CModalTitle>
      {user ? "Edit User" : "Tambah User"}
    </CModalTitle>
  </CModalHeader>

  <CModalBody>
    {/* CREATE ONLY */}
    {!user && (
      <div className="mb-3">
        <label className="fw-semibold mb-1">Cari Pegawai</label>

        <CFormInput
          placeholder="Ketik nama / NIP..."
          value={search}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedPegawai(null);
            setShowDropdown(true);
          }}
        />

        {showDropdown && search && (
          <div
            className="border mt-2 rounded"
            style={{ maxHeight: 200, overflowY: "auto" }}
          >
            {loading ? (
              <div className="p-2 text-center">
                <CSpinner size="sm" />
              </div>
            ) : (
              pegawaiList.map((p) => (
                <div
                  key={p.nip}
                  className="p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectPegawai(p)}
                >
                  <strong>{p.nama}</strong>
                  <br />
                  <small>{p.nip}</small>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    )}

    {/* DATA */}
    <div className="mb-3">
      <CFormInput
        label="Nama"
        value={form.nama}
        readOnly
        className="mb-2"
      />

      <CFormInput
        label="NIP"
        value={form.nip}
        readOnly
        className="mb-2"
      />

      <CFormInput
        label="Unor"
        value={form.unor}
        readOnly
        className="mb-2"
      />

      {/* PASSWORD KHUSUS TAMBAH USER */}
      {!user && (
        <div className="mb-3">
          <label className="form-label">Password</label>

          <div className="input-group">
            <CFormInput
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
            />

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              <CIcon
                icon={showPassword ? cilLockUnlocked : cilLockLocked}
              />
            </button>
          </div>
        </div>
      )}
    </div>

    {/* ROLE */}
    <CFormSelect
      label="Role"
      value={form.role}
      onChange={(e) =>
        setForm({
          ...form,
          role: e.target.value
        })
      }
    >
      <option value="pegawai">Pegawai</option>
      <option value="admin_opd">Admin OPD</option>
      <option value="admin_utama">Admin Utama</option>
    </CFormSelect>
  </CModalBody>

  <CModalFooter>
    <CButton color="secondary" onClick={onClose}>
      Batal
    </CButton>

    <CButton color="primary" onClick={handleSubmit}>
      Simpan
    </CButton>
  </CModalFooter>
</CModal>
  );
}