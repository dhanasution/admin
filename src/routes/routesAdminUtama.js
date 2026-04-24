import React from "react";

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

];

export default routesAdminUtama;