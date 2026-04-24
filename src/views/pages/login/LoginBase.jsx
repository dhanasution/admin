import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CSpinner
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilLockUnlocked } from '@coreui/icons';

// ✅ GLOBAL SERVICE
import { login } from '../../../services/authService';

export default function LoginBase({ roleTarget }) {
  const navigate = useNavigate();

  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ pakai service global
      const res = await login({ nip, password });

      const { token, user } = res;

      // 🔐 VALIDASI ROLE SESUAI HALAMAN
      if (roleTarget && user.role !== roleTarget) {
        setError('Akun tidak sesuai dengan halaman login ini');
        setLoading(false);
        return;
      }

      // 🔐 VALIDASI ROLE ADMIN
      const allowedRoles = ['admin_opd', 'admin_utama'];

      if (!allowedRoles.includes(user.role)) {
        setError('Anda tidak memiliki akses admin');
        setLoading(false);
        return;
      }

      // 💾 SIMPAN DATA LOGIN
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 🚀 redirect
      if (user.role === 'admin_utama') {
        navigate('/adminutama', { replace: true });
      } else if (user.role === 'admin_opd') {
        navigate('/adminopd', { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-md-5 col-lg-4">

          <div className="card shadow border-0 rounded-4">

            <div className="card-header text-center bg-primary text-white">
              <h5 className="mb-0">
                Login {roleTarget === 'admin_utama' ? 'Admin Utama' : 'Admin OPD'}
              </h5>
            </div>

            <div className="card-body p-4">

              {error && (
                <CAlert color="danger" className="text-center">
                  {error}
                </CAlert>
              )}

              <CForm onSubmit={handleLogin}>

                {/* NIP */}
                <div className="mb-3">
                  <CFormLabel>NIP</CFormLabel>
                  <CFormInput
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Masukkan NIP"
                    autoComplete="username"
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div className="mb-3">
                  <CFormLabel>Password</CFormLabel>

                  <CInputGroup>
                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan Password"
                      autoComplete="current-password"
                      required
                    />

                    <CInputGroupText
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked} />
                    </CInputGroupText>
                  </CInputGroup>
                </div>

                {/* BUTTON */}
                <CButton
                  type="submit"
                  color="primary"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Loading...
                    </>
                  ) : (
                    'Login'
                  )}
                </CButton>

              </CForm>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}