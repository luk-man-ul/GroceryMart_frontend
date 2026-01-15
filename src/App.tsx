import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Public/Home'
import AboutUs from './pages/Public/AboutUs'
import NewArrivals from './pages/Public/NewArrivals'
import Deals from './pages/Public/Deals'
import Cart from './pages/Public/Cart'
import Products from './pages/Public/Products'
import ProductDetails from './pages/Public/ProductDetails'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

import OrderConfirmation from './pages/user/OrderConfirmation'
import MyOrders from './pages/user/MyOrders'
import MyAccount from './pages/user/MyAccount'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminLayout from './pages/admin/AdminLayout'
import AddProduct from './pages/admin/AddProduct'
import EditProduct from './pages/admin/EditProduct'
import AddCategory from './pages/admin/AddCategory'
import EditCategory from './pages/admin/EditCategory'

import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import AdminRoute from './auth/AdminRoute'
import { CartProvider } from './cart/CartContext'

import Layout from './components/Layout'

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>

            {/* ================= PUBLIC + USER ================= */}
            <Route element={<Layout />}>
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
            </Route>

            {/* ================= ADMIN ================= */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="categories/add" element={<AddCategory />} />
                <Route path="categories/edit/:id" element={<EditCategory />} />
              </Route>
            </Route>

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
