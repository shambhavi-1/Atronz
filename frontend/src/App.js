import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider, CartContext } from './context/CartContext';
import { SnackbarProvider } from './context/SnackbarContext';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';
import PublicMenuPage from './components/PublicMenuPage';
import ItemDetailsPage from './components/ItemDetailsPage';
import Login from './auth/Login';
import Register from './auth/Register';
import UserLayout from './user/UserLayout';
import HomePage from './user/HomePage';
import CartPage from './user/CartPage';
import CheckoutPage from './user/CheckoutPage';
import OrdersPage from './user/OrdersPage';
import FeedbackPage from './user/FeedbackPage';
import AdminDashboard from './admin/AdminDashboard';
import AdminLayout from './admin/AdminLayout';
import AdminHeader from './admin/components/AdminHeader';
import AuthModal from './components/AuthModal';
import Snackbar from './components/Snackbar';
import Navbar from './components/Navbar';
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // prevents flicker

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 FIX: role comparison (CASE SAFE)
  if (role && user.role !== role.toUpperCase()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <SnackbarProvider>
        <AuthProvider>
          <CartProvider>
            {!location.pathname.startsWith('/user') && !location.pathname.startsWith('/admin') && location.pathname !== '/' && <Navbar />}
            {location.pathname.startsWith('/admin') && <AdminHeader />}
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<PublicMenuPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/user/*"
              element={
                <ProtectedRoute role="USER">
                  <UserLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/user/home" replace />} />
                      <Route path="home" element={<PublicMenuPage />} />
                      <Route path="item/:id" element={<ItemDetailsPage />} />
                      <Route path="cart" element={<CartPage />} />
                      <Route path="checkout" element={<CheckoutPage />} />
                      <Route path="feedback" element={<FeedbackPage />} />
                      <Route path="feedback/:orderId/:itemId" element={<FeedbackPage />} />
                    </Routes>
                  </UserLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/orders"
              element={
                <ProtectedRoute role="USER">
                  <UserLayout>
                    <OrdersPage />
                  </UserLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="" element={<AdminDashboard />} />
              <Route path="menu" element={<AdminDashboard />} />
              <Route path="inventory" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminDashboard />} />
              <Route path="waste" element={<AdminDashboard />} />
              <Route path="feedback" element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminDashboard />} />
              <Route path="reorder" element={<AdminDashboard />} />
            </Route>
          </Routes>
          <AuthModalWrapper />
          <Snackbar />
        </CartProvider>
      </AuthProvider>
      </SnackbarProvider>
    </ErrorBoundary>
  );
}

const AuthModalWrapper = () => {
  const { showAuthModal, setShowAuthModal } = useContext(CartContext);
  return <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />;
};

export default App;
