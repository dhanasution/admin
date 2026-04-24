
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

import routesAdminOpd from "../routes/routesAdminOpd";
import routesAdminUtama from "../routes/routesAdminUtama";

const AppContent = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isAdminOpd = user?.role === "admin_opd";

  const routes = isAdminOpd
    ? routesAdminOpd
    : routesAdminUtama;

  return (
    <CContainer className="px-4" lg>
      <Suspense
        fallback={
          <div className="text-center py-5">
            <CSpinner />
          </div>
        }
      >
        <Routes>

          {/* ROUTES */}
          {routes.map((route, idx) => {
            const Component = route.element;
            return (
              <Route
                key={idx}
                path={route.path} // ✅ LANGSUNG PAKAI
                element={<Component />}
              />
            );
          })}

          {/* DEFAULT KE DASHBOARD */}
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={<Navigate to="dashboard" replace />}
          />

        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
