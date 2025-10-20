import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

// Layouts
import MainLayout from '@components/layouts/MainLayout';
import DashboardLayout from '@components/layouts/DashboardLayout';

// Public Pages
import HomePage from '@pages/public/HomePage';
import ProductsPage from '@pages/public/ProductsPage';
import ProductDetailPage from '@pages/public/ProductDetailPage';
import VendorsPage from '@pages/public/VendorsPage';
import VendorDetailPage from '@pages/public/VendorDetailPage';
import CartPage from '@pages/public/CartPage';
import EventsPage from '@pages/public/EventsPage';
import ChatbotPage from '@pages/public/ChatbotPage';

// Footer Pages
import AboutPage from '@pages/public/AboutPage';
import SupportPage from '@pages/public/SupportPage';
import HelpPage from '@pages/public/HelpPage';
import ContactPage from '@pages/public/ContactPage';
import FAQPage from '@pages/public/FAQPage';
import PrivacyPolicyPage from '@pages/public/PrivacyPolicyPage';
import TermsOfServicePage from '@pages/public/TermsOfServicePage';
import ReturnPolicyPage from '@pages/public/ReturnPolicyPage';

// Auth Pages
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import ForgotPasswordPage from '@pages/auth/ForgotPasswordPage';

// Customer Pages
import CustomerDashboard from '@pages/customer/CustomerDashboard';
import OrdersPage from '@pages/customer/OrdersPage';
import OrderDetailPage from '@pages/customer/OrderDetailPage';
import ProfilePage from '@pages/customer/ProfilePage';
import CheckoutPage from '@pages/customer/CheckoutPage';

// Vendor Pages
import VendorDashboard from '@pages/vendor/VendorDashboard';
import VendorProductsPage from '@pages/vendor/VendorProductsPage';
import VendorOrdersPage from '@pages/vendor/VendorOrdersPage';
import VendorAnalyticsPage from '@pages/vendor/VendorAnalyticsPage';
import VendorProfilePage from '@pages/vendor/VendorProfilePage';
import VendorEventsPage from '@pages/vendor/VendorEventsPage';

// Admin Pages
import AdminDashboard from '@pages/admin/AdminDashboard';
import AdminVendorsPage from '@pages/admin/AdminVendorsPage';
import AdminAnalyticsPage from '@pages/admin/AdminAnalyticsPage';
import AdminCustomersPage from '@pages/admin/AdminCustomersPage';
import AdminProductsPage from '@pages/admin/AdminProductsPage';
import AdminPaymentsPage from '@pages/admin/AdminPaymentsPage';
import AdminSupportPage from '@pages/admin/AdminSupportPage';
import AdminEventsPage from '@pages/admin/AdminEventsPage';

// Components
import ProtectedRoute from '@components/auth/ProtectedRoute';
import VendorProtectedRoute from '@components/vendor/VendorProtectedRoute';
import NotFound from '@pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/vendors/:id" element={<VendorDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Footer Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/returns" element={<ReturnPolicyPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Customer Dashboard */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Legacy dashboard route - redirect to customer */}
      <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />

      {/* Checkout (Customer Only) */}
      <Route
        path="https://paymob.xyz/iufqRc9N/"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      {/* Vendor Dashboard */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<VendorProtectedRoute><VendorDashboard /></VendorProtectedRoute>} />
        <Route path="products" element={<VendorProtectedRoute><VendorProductsPage /></VendorProtectedRoute>} />
        <Route path="orders" element={<VendorProtectedRoute><VendorOrdersPage /></VendorProtectedRoute>} />
        <Route path="events" element={<VendorProtectedRoute><VendorEventsPage /></VendorProtectedRoute>} />
        <Route path="analytics" element={<VendorProtectedRoute><VendorAnalyticsPage /></VendorProtectedRoute>} />
        <Route path="profile" element={<VendorProfilePage />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="vendors" element={<AdminVendorsPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="support" element={<AdminSupportPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
      </Route>

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
