import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ManageLayout } from "@/components/layouts/ManageLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

// Lazy load components
const Users = lazy(() => import("@/pages/manage/Users"));
const ManageUserDetails = lazy(() => import("@/pages/manage/ManageUserDetails"));
const Investments = lazy(() => import("@/pages/manage/Investments"));
const Home = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const ManageIndex = lazy(() => import("@/pages/manage/Index"));
const Dashboard = lazy(() => import("@/pages/members/Dashboard"));
const Settings = lazy(() => import("@/pages/members/Settings"));
const Portfolio = lazy(() => import("@/pages/members/Portfolio"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected member routes */}
          <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
            <Route path="/members/dashboard" element={<Dashboard />} />
            <Route path="/members/settings" element={<Settings />} />
            <Route path="/members/portfolio" element={<Portfolio />} />
          </Route>

          {/* Protected admin routes */}
          <Route path="manage" element={<AuthGuard><ManageLayout /></AuthGuard>}>
            <Route index element={<ManageIndex />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:userId" element={<ManageUserDetails />} />
            <Route path="investments" element={<Investments />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;