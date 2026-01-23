import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

const Layout = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

      {!isAdminRoute && <Navbar />}

      {/* 👇 THIS IS THE FIX */}
      <main className="flex-1 min-h-[73vh]">
        <Outlet />
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default Layout
