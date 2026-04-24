import React, { Suspense, useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'

import './scss/style.scss'
import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Layout
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const LoginAdminOPD = React.lazy(() => import('./views/pages/login/LoginAdminOPD'))
const LoginAdminUtama = React.lazy(() => import('./views/pages/login/LoginAdminUtama'))

// 🔐 Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (!token) {
    return <Navigate to="/login/admin-opd" replace />
  }

  

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin_utama') {
      return <Navigate to="/adminutama/dashboard" replace />
    }
    return <Navigate to="/adminopd/dashboard" replace />
  }

  return children
}

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('ekinerja-admin-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    if (isColorModeSet()) return
    setColorMode(storedTheme)
  }, [])

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" />
          </div>
        }
      >

        {/* 🔥 TOAST DI SINI */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      
        <Routes>

          {/* 🔐 LOGIN */}
          <Route path="/login/admin-opd" element={<LoginAdminOPD />} />
          <Route path="/login/admin-utama" element={<LoginAdminUtama />} />

          {/* redirect default */}
          <Route path="/login" element={<Navigate to="/login/admin-opd" replace />} />

          {/* 🔐 ADMIN OPD */}
          <Route
            path="/adminopd/*"
            element={
              <ProtectedRoute allowedRoles={['admin_opd']}>
                <DefaultLayout />
              </ProtectedRoute>
            }
          />

          {/* 🔐 ADMIN UTAMA */}
          <Route
            path="/adminutama/*"
            element={
              <ProtectedRoute allowedRoles={['admin_utama']}>
                <DefaultLayout />
              </ProtectedRoute>
            }
          />

          {/* 🔀 DEFAULT REDIRECT */}
          <Route path="/" element={<Navigate to="/login/admin-opd" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App