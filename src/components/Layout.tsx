// Layout.tsx
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

const Layout = () => {
  const location = useLocation()

  const isAdminRoute = location.pathname.startsWith('/admin')

  const isAuthRoute = [
    '/login',
    '/register',
    '/forgot-password',
  ].some(path => location.pathname.startsWith(path))

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

      {/* Navbar */}
      {!isAdminRoute && !isAuthRoute && <Navbar />}

      {/* Page Content */}
      <main className="flex-1 min-h-[73vh]">
        <Outlet />
      </main>

      {/* Footer */}
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </div>
  )
}

export default Layout