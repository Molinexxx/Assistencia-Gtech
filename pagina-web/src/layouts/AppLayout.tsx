import { Outlet } from 'react-router-dom'

import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <main className="ml-[304px] flex min-h-screen min-w-0 flex-col gap-5 px-5 py-5 lg:gap-6 lg:px-6 lg:py-6">
        <Header />
        <Outlet />
      </main>
    </div>
  )
}