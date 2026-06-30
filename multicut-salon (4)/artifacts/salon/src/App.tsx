import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}


// Public pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Gallery from "@/pages/Gallery";
import Stylists from "@/pages/Stylists";
import StylistDetail from "@/pages/StylistDetail";
import Reviews from "@/pages/Reviews";
import Contact from "@/pages/Contact";
import BookAppointment from "@/pages/BookAppointment";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminAppointments from "@/pages/admin/Appointments";
import AdminServices from "@/pages/admin/Services";
import AdminStylists from "@/pages/admin/Stylists";
import AdminGallery from "@/pages/admin/Gallery";
import AdminReviews from "@/pages/admin/Reviews";
import AdminContacts from "@/pages/admin/Contacts";
import AdminSettings from "@/pages/admin/Settings";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminAdmins from "@/pages/admin/Admins";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Redirect to="/admin/login" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/services/:slug" component={ServiceDetail} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/stylists" component={Stylists} />
      <Route path="/stylists/:id" component={StylistDetail} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/contact" component={Contact} />
      <Route path="/book-appointment" component={BookAppointment} />

      {/* Admin */}
      <Route path="/admin" component={() => <Redirect to="/admin/login" />} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={() => <ProtectedRoute component={AdminDashboard} />} />
      <Route path="/admin/appointments" component={() => <ProtectedRoute component={AdminAppointments} />} />
      <Route path="/admin/services" component={() => <ProtectedRoute component={AdminServices} />} />
      <Route path="/admin/stylists" component={() => <ProtectedRoute component={AdminStylists} />} />
      <Route path="/admin/gallery" component={() => <ProtectedRoute component={AdminGallery} />} />
      <Route path="/admin/reviews" component={() => <ProtectedRoute component={AdminReviews} />} />
      <Route path="/admin/contacts" component={() => <ProtectedRoute component={AdminContacts} />} />
      <Route path="/admin/settings" component={() => <ProtectedRoute component={AdminSettings} />} />
      <Route path="/admin/analytics" component={() => <ProtectedRoute component={AdminAnalytics} />} />
      <Route path="/admin/admins" component={() => <ProtectedRoute component={AdminAdmins} />} />

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
