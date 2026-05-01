import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,

} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilContrast,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppHeaderDropdown } from './header/index'
import { getProfile } from '../services/authService' 




const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [user, setUser] = useState(null)



  // ================================
  // 👤 FETCH USER (GLOBAL API)
  // ================================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getProfile()

        // sesuaikan dengan response backend
        setUser(result.data || result)
      } catch (err) {
        console.error("Gagal ambil user:", err)
      }
    }

    fetchUser()
  }, [])



  // ================================
  // 🎨 SHADOW HEADER
  // ================================
  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          'shadow-sm',
          document.documentElement.scrollTop > 0
        )
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  // ================================
  // 🌤️ GREETING WIB
  // ================================
  const getGreeting = () => {
    const now = new Date()

    const wibHour = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    ).getHours()

    if (wibHour >= 4 && wibHour < 10) return "Selamat Pagi"
    if (wibHour >= 10 && wibHour < 15) return "Selamat Siang"
    if (wibHour >= 15 && wibHour < 18) return "Selamat Sore"
    return "Selamat Malam"
  }


  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4 d-flex align-items-center" fluid>

        {/* TOGGLER */}
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        {/* GREETING */}
        <CHeaderNav className="d-none d-md-flex ms-3 align-items-center">
          <div className="lh-sm">
            <div className="fw-semibold text-primary">
              {getGreeting()}, {user?.nama || "User"}
            </div>
            <div className="fw-semibold text-primary">
              NIP. {user?.nip || "-"} / {user?.nama_opd || "-"}
            </div>
          </div>
        </CHeaderNav>

        {/* RIGHT SIDE */}
        <CHeaderNav className="ms-auto">


          {/* THEME SWITCHER */}
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>

            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} /> Light
              </CDropdownItem>

              <CDropdownItem
                active={colorMode === 'dark'}
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} /> Dark
              </CDropdownItem>

              <CDropdownItem
                active={colorMode === 'auto'}
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          {/* USER DROPDOWN */}
          <AppHeaderDropdown />

        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader