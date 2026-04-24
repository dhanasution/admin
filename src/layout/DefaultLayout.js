/**
 * DefaultLayout Component
 *
 * Main application layout wrapper that composes the primary UI structure
 * for authenticated routes.
 */

import React, { Suspense } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const loading = (
  <div className="pt-3 text-center">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

const DefaultLayout = () => {
  return (
    <div>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main wrapper */}
      <div className="wrapper d-flex flex-column min-vh-100">

        {/* Header */}
        <AppHeader />

        {/* Content */}
        <div className="body flex-grow-1 px-3">
          <Suspense fallback={loading}>
            <AppContent />
          </Suspense>
        </div>

        {/* Footer */}
        <AppFooter />

      </div>
    </div>
  )
}

export default DefaultLayout