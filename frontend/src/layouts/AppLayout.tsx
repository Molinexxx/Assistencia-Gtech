import { Outlet } from 'react-router-dom'

import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <main className="ml-[296px] flex min-h-screen min-w-0 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Header />
        <Outlet />
      </main>
    </div>
  )
}