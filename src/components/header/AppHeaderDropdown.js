import React, { useEffect, useState } from 'react'

import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'

import {
  cilLockLocked,
  cilSettings,
  cilUser,
} from '@coreui/icons'

import CIcon from '@coreui/icons-react'

// ✅ pakai service global
import { getProfile } from '../../services/authService'

const getInitials = (name) => {
  if (!name) return "U"

  const words = name.split(" ")
  if (words.length === 1) return words[0][0].toUpperCase()

  return (
    words[0][0].toUpperCase() +
    words[1][0].toUpperCase()
  )
}

const AppHeaderDropdown = () => {
  const [user, setUser] = useState(null)

  // ================================
  // 👤 FETCH USER (GLOBAL API)
  // ================================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getProfile()

        setUser(result.data || result)
      } catch (err) {
        console.error("Gagal ambil user:", err)
      }
    }

    fetchUser()
  }, [])

  // ================================
  // 🚪 LOGOUT
  // ================================
  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <CDropdown variant="nav-item">

      {/* AVATAR */}
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar color="primary" textColor="white" size="md">
          {getInitials(user?.nama)}
        </CAvatar>
      </CDropdownToggle>

      <CDropdownMenu className="pt-0" placement="bottom-end">

        {/* INFO USER */}
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          {user?.nama || "User"}
          <br />
          <small>NIP: {user?.nip || "-"}</small>
          <br />
          <small>{user?.nama_opd || "-"}</small>
        </CDropdownHeader>

        {/* MENU */}
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>

        <CDropdownDivider />

        {/* LOGOUT */}
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>

      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown