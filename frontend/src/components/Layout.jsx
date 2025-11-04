import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

export default function Layout(){
  return (
    <div className="layout-root">
      <Sidebar />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  )
}
