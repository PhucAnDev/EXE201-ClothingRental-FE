import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { ContactFloat } from "./components/ContactFloat";
import { Toaster } from "./components/ui/sonner";
import { HomePage } from "./pages/HomePage";
import { CollectionPage } from "./pages/CollectionPage";
import { AIStylistPage } from "./pages/AIStylistPage";
import { ServicesPage } from "./pages/ServicesPage";
import { AboutPage } from "./pages/AboutPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordFindPage } from "./pages/ForgotPasswordFindPage";
import { ForgotPasswordVerifyPage } from "./pages/ForgotPasswordVerifyPage";
import { ForgotPasswordResetPage } from "./pages/ForgotPasswordResetPage";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductDetailTest } from "./pages/ProductDetailTest";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage";
import { PaymentFailedPage } from "./pages/PaymentFailedPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProductsPage from "./pages/admin/ProductsPage";
import UsersPage from "./pages/admin/UsersPage";
import TermsPage from "./pages/admin/TermsPage";
import SystemPage from "./pages/admin/SystemPage";
import OrdersPage from "./pages/admin/OrdersPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

function AppContent() {
  const location = useLocation();
  // Pages that should not show Navigation header
  const hideNavigationPaths = ["/dang-ky"];
  // Admin pages should not show Navigation and ContactFloat
  const isAdminPage = location.pathname.startsWith("/admin");
  const shouldHideNavigation =
    hideNavigationPaths.includes(location.pathname) || isAdminPage;

  return (
    <div className="min-h-screen bg-white">
      {!shouldHideNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bo-suu-tap" element={<CollectionPage />} />
        <Route path="/san-pham/:id" element={<ProductDetailPage />} />
        <Route path="/test-product/:id" element={<ProductDetailTest />} />
        <Route path="/ai-stylist" element={<AIStylistPage />} />
        <Route path="/dich-vu" element={<ServicesPage />} />
        <Route path="/ve-chung-toi" element={<AboutPage />} />
        <Route path="/thanh-toan" element={<CheckoutPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
        <Route path="/quen-mat-khau" element={<ForgotPasswordFindPage />} />
        <Route
          path="/quen-mat-khau/xac-minh"
          element={<ForgotPasswordVerifyPage />}
        />
        <Route
          path="/quen-mat-khau/doi-mat-khau"
          element={<ForgotPasswordResetPage />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<ProfilePage />} />
        <Route path="/wishlist" element={<ProfilePage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-failed" element={<PaymentFailedPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/products" element={<ProductsPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/terms" element={<TermsPage />} />
        <Route path="/admin/system" element={<SystemPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAdminPage && <ContactFloat />}
    </div>
  );
}

export default function App() {
  // Wrap AppContent with Router so `useLocation` has the proper context
  return (
    <Router>
      <AppContent />
      <Toaster />
    </Router>
  );
}
