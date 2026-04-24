import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
  <CFooter className="px-4">
    <div>
      <span className="ms-1">
        &copy; {new Date().getFullYear()} All rights reserved BKPSDM Kota Padangsidimpuan
      </span>
    </div>
  </CFooter>
  )
}

export default React.memo(AppFooter)

