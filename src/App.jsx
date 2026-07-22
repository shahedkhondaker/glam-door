import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Salons from '@/pages/Salons';
import SalonDetail from '@/pages/SalonDetail';
import Partner from '@/pages/Partner';
import Dashboard from '@/pages/Dashboard';
import CustomerDashboard from '@/pages/CustomerDashboard';
import SalonDashboard from '@/pages/SalonDashboard';
import ServiceManagement from '@/pages/ServiceManagement';
import InvoiceCenter from '@/pages/InvoiceCenter';
import MyBookings from '@/pages/MyBookings';
import ProfessionalProfile from '@/pages/ProfessionalProfile';
import RevenueReports from '@/pages/RevenueReports';
import CRMManagement from '@/pages/CRMManagement';
import AIInsights from '@/pages/AIInsights';
import NotificationsCenter from '@/pages/NotificationsCenter';
import CommissionSummary from '@/pages/CommissionSummary';
import AvailabilitySettings from '@/pages/AvailabilitySettings';
import MarketingPromos from '@/pages/MarketingPromos';
import AboutUs from '@/pages/AboutUs';
import ContactUs from '@/pages/ContactUs';
import GlamShop from '@/pages/GlamShop';
import GlamProductDetail from '@/pages/GlamProductDetail';
import GlamCart from '@/pages/GlamCart';
import GlamCheckout from '@/pages/GlamCheckout';
import GlamOrders from '@/pages/GlamOrders';
import { CartProvider } from '@/context/CartContext';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/salons/:id" element={<SalonDetail />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
        <Route path="/dashboard/salon" element={<SalonDashboard />} />
        <Route path="/service-management" element={<ServiceManagement />} />
        <Route path="/invoice-center" element={<InvoiceCenter />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/professional-profile" element={<ProfessionalProfile />} />
        <Route path="/revenue-reports" element={<RevenueReports />} />
        <Route path="/crm-management" element={<CRMManagement />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/notifications" element={<NotificationsCenter />} />
        <Route path="/commission-summary" element={<CommissionSummary />} />
        <Route path="/availability-settings" element={<AvailabilitySettings />} />
        <Route path="/marketing-promos" element={<MarketingPromos />} />
        <Route path="/glamshop" element={<GlamShop />} />
        <Route path="/glamshop/product/:slug" element={<GlamProductDetail />} />
        <Route path="/glamshop/cart" element={<GlamCart />} />
        <Route path="/glamshop/checkout" element={<GlamCheckout />} />
        <Route path="/glamshop/account/orders" element={<GlamOrders />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <CartProvider>
            <AuthenticatedApp />
          </CartProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App