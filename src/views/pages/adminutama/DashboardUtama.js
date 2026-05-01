import React, { useEffect, useState } from "react"
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CContainer,
} from "@coreui/react"
import {
  CChartDoughnut,
  CChartLine,
} from "@coreui/react-chartjs"

import api from "src/services/api"

const DashboardUtama = () => {
  const [loading, setLoading] = useState(true)

  const [dashboard, setDashboard] = useState({
    totalPegawai: 0,

    hadir: 0,
    tidakHadir: 0,
    alpa: 0,

    submitAktivitas: 0,
    belumSubmit: 0,

    disetujui: 0,
    direvisi: 0,

    statistikKehadiran: Array(12).fill(0),
    statistikAktivitas: Array(12).fill(0),
  })

  const bulan = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
  ]

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const res = await api.get("/dashboard-admin")
      const data = res.data?.data || {}

      setDashboard((prev) => ({
        ...prev,
        totalPegawai: data.totalPegawai || 0,
        hadir: data.hadir || 0,
        tidakHadir: data.tidakHadir || 0,
        alpa: data.alpa || 0,

        disetujui: data.disetujui || 0,
        direvisi: data.direvisi || 0,

        // INI YANG PENTING (STATISTIK)
        statistikKehadiran: data.statistikKehadiran || Array(12).fill(0),
        statistikAktivitas: data.statistikAktivitas || Array(12).fill(0),
      }))

    } catch (err) {
      console.error("Gagal load dashboard:", err)
    } finally {
      setLoading(false)
    }
  }

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
                  Dashboard Admin Utama
                </h3>
                <small className="text-medium-emphasis">
                  Monitoring Kehadiran & Aktivitas Pegawai
                </small>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-5">
            Loading dashboard...
          </div>
        )}

        {!loading && (
          <>
            {/* CARD */}
            <CRow className="mb-4">

              <CCol md={4} xl={2} sm={6} xs={12} className="mb-3">
                <CCard style={cardStyle}>
                  <CCardBody className="text-center">
                    <h6>Total Pegawai</h6>
                    <h2 className="text-primary fw-bold">
                      {dashboard.totalPegawai}
                    </h2>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={4} xl={2} sm={6} xs={12} className="mb-3">
                <CCard style={cardStyle}>
                  <CCardBody className="text-center">
                    <h6>Hadir Hari Ini</h6>
                    <h2 className="text-success fw-bold">
                      {dashboard.hadir}
                    </h2>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={4} xl={2} sm={6} xs={12} className="mb-3">
                <CCard style={cardStyle}>
                  <CCardBody className="text-center">
                    <h6>Tidak Hadir</h6>
                    <h2 className="text-warning fw-bold">
                      {dashboard.tidakHadir}
                    </h2>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={4} xl={2} sm={6} xs={12} className="mb-3">
                <CCard style={cardStyle}>
                  <CCardBody className="text-center">
                    <h6>Alpha</h6>
                    <h2 className="text-danger fw-bold">
                      {dashboard.alpa}
                    </h2>
                  </CCardBody>
                </CCard>
              </CCol>


              <CCol md={4} xl={2} sm={6} xs={12} className="mb-3">
                <CCard style={cardStyle}>
                  <CCardBody className="text-center">
                    <h6>Aktivitas Disetujui</h6>
                    <h2 className="text-info fw-bold">
                      {dashboard.disetujui}
                    </h2>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={4} xl={2} sm={6} xs={12} className="mb-3">
                <CCard style={cardStyle}>
                  <CCardBody className="text-center">
                    <h6>Aktivitas Direvisi</h6>
                    <h2 className="text-dark fw-bold">
                      {dashboard.direvisi}
                    </h2>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* DOUGHNUT */}
            <CRow className="mb-4">

              <CCol md={6} xs={12} className="mb-3">
                <CCard style={cardStyle}>
                  <CCardBody>
                    <h5 className="mb-3">
                      Diagram Kehadiran Hari Ini
                    </h5>

                     <CChartDoughnut
                      data={{
                        labels: ["Hadir", "Tidak Hadir", "Alpha"],
                        datasets: [{
                          data: [
                            dashboard.hadir,
                            dashboard.tidakHadir,
                            dashboard.alpa,
                          ],
                          backgroundColor: [
                            "#2eb85c",
                            "#f9b115",
                            "#e55353",
                          ],
                        }],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} xs={12} className="mb-3">
                <CCard style={cardStyle}>
                  <CCardBody>
                    <h5 className="mb-3">
                      Diagram Aktivitas Hari Ini
                    </h5>

                      <CChartDoughnut
                      data={{
                        labels: ["Disetujui", "Direvisi"],
                        datasets: [{
                          data: [
                            dashboard.disetujui,
                            dashboard.direvisi,
                          ],
                          backgroundColor: [
                            "#321fdb",
                            "#f6960b",
                          ],
                        }],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>

            </CRow>

            {/* LINE */}
            <CRow>

              <CCol md={6} xs={12} className="mb-3">
                <CCard style={cardStyle}>
                  <CCardBody>
                    <h5 className="mb-3">
                      Statistik Kehadiran
                    </h5>

                    <CChartLine
                      data={{
                        labels: bulan,
                        datasets: [{
                          label: "Hadir",
                          data: dashboard.statistikKehadiran,
                          borderColor: "#2eb85c",
                          tension: 0.4,
                          fill: false,
                        }],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} xs={12} className="mb-3">
                <CCard style={cardStyle}>
                  <CCardBody>
                    <h5 className="mb-3">
                      Statistik Aktivitas
                    </h5>

                    <CChartLine
                      data={{
                        labels: bulan,
                        datasets: [{
                          label: "Disetujui",
                          data: dashboard.statistikAktivitas,
                          borderColor: "#321fdb",
                          tension: 0.4,
                          fill: false,
                        }],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>

            </CRow>
          </>
        )}

      </CContainer>
    </div>
  )
}

export default DashboardUtama