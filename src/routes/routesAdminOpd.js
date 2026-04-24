import Dashboard from '../views/pages/adminopd/DashboardOpd'
import Pegawai from '../views/pages/adminopd/Pegawai/PegawaiOpd'
import Laporan from '../views/pages/adminopd/Laporan/LaporanOpd'

import RiwayatAbsensi from '../views/pages/adminopd/RiwayatAbsensi/RiwayatAbsensi'
import RiwayatAbsensiDetail from "../views/pages/adminopd/RiwayatAbsensi/RiwayatAbsensiDetail";


const routesAdminOpd = [
  {
    path: "dashboard",
    element: Dashboard,
  },
  {
    path: "pegawai",
    element: Pegawai,
  },
  {
    path: "laporan",
    element: Laporan,
  },
  {
    path: "riwayat-absensi",
    element: RiwayatAbsensi,
  },
  {
    path: "riwayat-absensi/:id",
    element: RiwayatAbsensiDetail,
  },

]

export default routesAdminOpd;