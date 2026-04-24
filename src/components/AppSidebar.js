
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import logoImg from 'src/assets/images/logo.png'
import logoMini from 'src/assets/images/logo-mini.png'

import { AppSidebarNav } from './AppSidebarNav'

import navAdminOpd from './navAdminOpd'
import navAdminUtama from './navAdminUtama'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  //ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  console.log("USER:", user)
  console.log("ROLE:", user.role)

  //tentukan nav berdasarkan role
  const navigation =
    user.role === 'admin_opd'
      ? navAdminOpd
      : navAdminUtama
  console.log("NAV DIPAKAI:", navigation)
  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">

        <CSidebarBrand to="/" className="text-decoration-none">
          <img
            src={logoImg}
            height={50}
            className="sidebar-brand-full"
            alt="Logo"
          />

          <img
            src={logoMini}
            height={40}
            className="sidebar-brand-narrow"
            alt="Logo"
          />
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* 🔥 INI YANG DIPERBAIKI */}
      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
          }
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)