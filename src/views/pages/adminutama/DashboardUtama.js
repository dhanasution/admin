import React from "react"
import { CCard, CCardBody, CRow, CCol, CContainer } from "@coreui/react"

const DashboardUtama = () => {
  return (
    <div style={{ width: "100%", transition: "all 0.3s ease" }}>
      <CContainer fluid className="px-4">
        <CRow>
          <CCol xs={12}>
            <CCard style={{ width: "100%" }}>
              <CCardBody>
                <h3 className="mb-0">Halaman Dashboard Admin Utama</h3>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default DashboardUtama