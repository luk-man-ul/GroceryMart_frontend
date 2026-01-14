import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Public/Home'
import AboutUs from './pages/Public/AboutUs'
import NewArrivals from './pages/Public/NewArrivals'
import Deals from './pages/Public/Deals'
import Cart from './pages/Public/Cart'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Products from './pages/Public/Products'
import AdminDashboard from './pages/admin/AdminDashboard'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import ProductDetails from './pages/Public/ProductDetails'
import OrderConfirmation from './pages/user/OrderConfirmation'
import MyOrders from './pages/user/MyOrders'
import MyAccount from './pages/user/MyAccount'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { CartProvider } from './cart/CartContext'

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>  
      <BrowserRouter>
        <Navbar />    
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* User */}
          <Route
            path="/order-success"
            element={
              <ProtectedRoute roles={['USER']}>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={['USER', 'ADMIN']}>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
            <ProtectedRoute roles={['USER', 'ADMIN']}>
              <MyAccount />
            </ProtectedRoute>
          }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
