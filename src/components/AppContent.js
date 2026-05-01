import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

import routesAdminOpd from "../routes/routesAdminOpd";
import routesAdminUtama from "../routes/routesAdminUtama";

const AppContent = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  let routes = [];

  if (user?.role === "admin_opd") {
    routes = routesAdminOpd;
  } else if (user?.role === "admin_utama") {
    routes = routesAdminUtama; // sudah include OPD
  }

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

          {routes.map((route, idx) => {
            const Component = route.element;
            return (
              <Route
                key={idx}
                path={route.path}
                element={<Component />}
              />
            );
          })}

          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />

        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
