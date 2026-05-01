import React from "react"
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CContainer,
} from "@coreui/react"

const DashboardOpd = () => {

  const cardStyle = {
    border: "none",
    borderRadius: "16px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  }

  return (
    <div style={{ width: "100%" }}>
      <CContainer fluid className="px-4">

        {/* HEADER */}
        <CRow className="mb-4">
          <CCol xs={12}>
            <CCard style={cardStyle}>
              <CCardBody>
                <h3 className="fw-bold mb-1">
                  Dashboard Admin OPD
                </h3>
                <small className="text-medium-emphasis">
                  Monitoring Kehadiran & Aktivitas Pegawai
                </small>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

      </CContainer>
    </div>
  )
}

export default DashboardOpd