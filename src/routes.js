
import routesAdminOpd from "./routes/routesAdminOpd";
import routesAdminUtama from "./routes/routesAdminUtama";

/**
 * 🔥 MASTER ROUTES (DIGUNAKAN UNTUK):
 * - Mapping global route (jika dibutuhkan)
 * - Future scaling
 */
const routes = [
  // ================= ADMIN OPD =================
  ...routesAdminOpd.map((route) => ({
    ...route,
    role: "admin_opd",
  })),

  // ================= ADMIN UTAMA =================
  ...routesAdminUtama.map((route) => ({
    ...route,
    role: "admin_utama",
  })),
];

export default routes;