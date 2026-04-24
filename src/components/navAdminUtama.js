import React from 'react'
import CIcon from '@coreui/icons-react'

import {
  cilSpeedometer,
  cilUser,
  cilPeople,
  cilNotes,
} from '@coreui/icons'

import { CNavItem, CNavTitle } from '@coreui/react'

const navAdminUtama = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/adminutama/dashboard',
    icon: <CIcon icon={cilSpeedometer} className="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Admin Utama',
  },

  {
    component: CNavItem,
    name: 'Users',
    to: '/adminutama/users',
    icon: <CIcon icon={cilUser} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Pegawai',
    to: '/adminutama/pegawai',
    icon: <CIcon icon={cilPeople} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Aktivitas',
    to: '/adminutama/aktivitas',
    icon: <CIcon icon={cilNotes} className="nav-icon" />,
  },
]

export default navAdminUtama