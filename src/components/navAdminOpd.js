import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPeople,
  cilBriefcase,
  cilChartPie,
  cilClipboard,
} from '@coreui/icons'

import { CNavItem, CNavTitle } from '@coreui/react'

const navAdminOpd = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/adminopd/dashboard',
    icon: <CIcon icon={cilSpeedometer} className="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Admin OPD',
  },

  {
    component: CNavItem,
    name: 'Pegawai',
    to: '/adminopd/pegawai',
    icon: <CIcon icon={cilPeople} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Laporan',
    to: '/adminopd/laporan',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Riwayat Absen',
    to: '/adminopd/riwayat-absensi',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },



]

export default navAdminOpd