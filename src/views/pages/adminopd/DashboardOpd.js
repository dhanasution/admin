import React from "react"
import { CCard, CCardBody, CCardTitle, CRow, CCol } from "@coreui/react"

const DashboardOpd = () => {
  return (
    <div>
      <h4 className="mb-3">Dashboard Admin OPD</h4>

      <CRow>
        <CCol md={6}>
          <CCard>
            <CCardBody>
              <CCardTitle>HALAMAN ADMIN OPD</CCardTitle>
              <h3>30</h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6}>
          <CCard>
            <CCardBody>
              <CCardTitle>Menunggu Persetujuan</CCardTitle>
              <h3>8</h3>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default DashboardOpd