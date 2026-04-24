import React, { useEffect, useState, useRef } from "react";
import {
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilLockUnlocked } from "@coreui/icons";

import { toast } from "react-toastify";
import { changePassword } from "../../services/userService";

const ModalGantiPassword = ({ visible, onClose, user }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const timeoutRef = useRef(null);

  // ================= RESET =================
  useEffect(() => {
    if (visible) {
      setPassword("");
      setConfirm("");
      setShowPassword(false);
      setShowConfirm(false);
      setLoading(false);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visible, user]);

  if (!user) return null;

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!password || !confirm) {
        return toast.error("Semua field wajib diisi");
      }

      if (password.length < 6) {
        return toast.error("Password minimal 6 karakter");
      }

      if (password !== confirm) {
        return toast.error("Password tidak sama");
      }

      setLoading(true);

      await changePassword(user.id, password);

      toast.success("Password berhasil diubah");

      setTimeout(() => {
        onClose();
      }, 500);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Gagal ubah password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CModal visible={visible} onClose={onClose} backdrop="static">
      <CModalHeader>
        <CModalTitle>Ganti Password</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="mb-3">
          <strong>{user.nama}</strong>
        </div>

        {/* PASSWORD */}
        <CInputGroup className="mb-2">
          <CFormInput
            type={showPassword ? "text" : "password"}
            placeholder="Password baru"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <CInputGroupText
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked} />
          </CInputGroupText>
        </CInputGroup>

        {/* CONFIRM */}
        <CInputGroup>
          <CFormInput
            type={showConfirm ? "text" : "password"}
            placeholder="Ulangi password"
            value={confirm}
            autoComplete="new-password"
            onChange={(e) => setConfirm(e.target.value)}
          />
          <CInputGroupText
            style={{ cursor: "pointer" }}
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            <CIcon icon={showConfirm ? cilLockUnlocked : cilLockLocked} />
          </CInputGroupText>
        </CInputGroup>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Batal
        </CButton>

        <CButton
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ModalGantiPassword;