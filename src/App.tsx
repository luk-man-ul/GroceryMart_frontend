import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

/* ================= PUBLIC ================= */
import Home from './pages/Public/Home'
import AboutUs from './pages/Public/AboutUs'
import NewArrivals from './pages/Public/NewArrivals'
import Deals from './pages/Public/Deals'
import Cart from './pages/Public/Cart'
import Products from './pages/Public/Products'
import ProductDetails from './pages/Public/ProductDetails'

/* ================= AUTH ================= */
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

/* ================= USER ================= */
import OrderConfirmation from './pages/user/OrderConfirmation'
import MyOrders from './pages/user/MyOrders'
import MyAccount from './pages/user/MyAccount'

/* ================= ADMIN ================= */
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AddProduct from './pages/admin/AddProduct'
import EditProduct from './pages/admin/EditProduct'
import AddCategory from './pages/admin/AddCategory'
import EditCategory from './pages/admin/EditCategory'
import AdminStaff from './pages/admin/AdminStaff'
import AdminSales from './pages/admin/AdminSales'

/* ================= STAFF ================= */
import StaffLayout from './pages/staff/StaffLayout'
import BillingPOS from './pages/staff/BillingPOS'
import Inventory from './pages/staff/Inventory'
import Delivery from './pages/staff/Delivery'

/* ================= CONTEXT / GUARDS ================= */
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import AdminRoute from './auth/AdminRoute'
import StaffRoute from './auth/StaffRoute'
import { CartProvider } from './cart/CartContext'

/* ================= LAYOUT ================= */
import Layout from './components/Layout'

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>

            {/* ================= PUBLIC + USER ================= */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="aboutus" element={<AboutUs />} />
              <Route path="new-arrivals" element={<NewArrivals />} />
              <Route path="deals" element={<Deals />} />
              <Route path="cart" element={<Cart />} />

              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />

              <Route
                path="order-success"
                element={
                  <ProtectedRoute roles={['USER']}>
                    <OrderConfirmation />
                  </ProtectedRoute>
                }
              />

              <Route
                path="orders"
                element={
                  <ProtectedRoute roles={['USER']}>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="account"
                element={
                  <ProtectedRoute
                    roles={[
                      'USER'
                    ]}
                  >
                    <MyAccount />
                  </ProtectedRoute>
                }
              />

              {/* Public fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* ================= STAFF ================= */}
            <Route element={<StaffRoute />}>
              <Route path="staff" element={<StaffLayout />}>
                <Route index element={<Navigate to="billing" replace />} />
                <Route path="billing" element={<BillingPOS />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="delivery" element={<Delivery />} />

                {/* Staff fallback */}
                <Route path="*" element={<Navigate to="/staff" replace />} />
              </Route>
            </Route>

            {/* ================= ADMIN ================= */}
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="categories/add" element={<AddCategory />} />
                <Route path="categories/edit/:id" element={<EditCategory />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="sales" element={<AdminSales />} />

                {/* Admin fallback */}
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
