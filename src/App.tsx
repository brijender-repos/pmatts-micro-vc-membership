import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { ProjectPage } from "./components/ProjectPage";
import FAQs from "./pages/FAQs";
import Dashboard from "./pages/members/Dashboard";
import Settings from "./pages/members/Settings";
import Portfolio from "./pages/members/Portfolio";
import Login from "./pages/auth/Login";
import Callback from "./pages/auth/Callback";
import PaymentSuccess from "./pages/payment/Success";
import PaymentFailure from "./pages/payment/Failure";
import { AuthGuard } from "./components/auth/AuthGuard";
import { ManageLayout } from "./components/layouts/ManageLayout";
import ManageIndex from "./pages/manage/Index";
import Users from "./pages/manage/Users";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/callback" element={<Callback />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
          
          {/* Protected routes */}
          <Route path="/members/*" element={
            <AuthGuard>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/portfolio" element={<Portfolio />} />
              </Routes>
            </AuthGuard>
          } />

          {/* Management routes */}
          <Route path="/manage" element={
            <AuthGuard>
              <ManageLayout />
            </AuthGuard>
          }>
            <Route index element={<ManageIndex />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;