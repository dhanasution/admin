import React from "react";

// =====================
// LAZY LOAD ADMIN UTAMA
// =====================
const DashboardUtama = React.lazy(() =>
  import("../views/pages/adminutama/DashboardUtama")
);

const Users = React.lazy(() =>
  import("../views/pages/adminutama/users/Users")
);

const Pegawai = React.lazy(() =>
  import("../views/pages/adminutama/pegawai/Pegawai")
);

const Aktivitas = React.lazy(() =>
  import("../views/pages/adminutama/aktivitas/Aktivitas")
);

const LaporanOpd = React.lazy(() =>
  import("../views/pages/adminopd/Laporan/LaporanOpd")
);

// =====================
// SHARED PAGE
// =====================
const RiwayatAbsensi = React.lazy(() =>
  import("../views/pages/adminopd/RiwayatAbsensi/RiwayatAbsensi")
);

const RiwayatAbsensiDetail = React.lazy(() =>
  import("../views/pages/adminopd/RiwayatAbsensi/RiwayatAbsensiDetail")
);

// =====================
// ROUTES
// =====================
const routesAdminUtama = [
  {
    path: "dashboard",
    name: "Dashboard Utama",
    element: DashboardUtama,
  },
  {
    path: "users",
    name: "Users",
    element: Users,
  },
  {
    path: "pegawai",
    name: "Pegawai",
    element: Pegawai,
  },
  {
    path: "aktivitas",
    name: "Aktivitas",
    element: Aktivitas,
  },
  {
    path: "riwayat-absensi",
    name: "Riwayat Absensi",
    element: RiwayatAbsensi,
  },
  {
    path: "riwayat-absensi/:id",
    name: "Detail Absensi",
    element: RiwayatAbsensiDetail,
  },
  {
    path: "laporan", 
    name: "Laporan",
    element: LaporanOpd,
  },
];

export default routesAdminUtama;