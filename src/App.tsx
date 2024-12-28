import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Callback from "@/pages/auth/Callback";
import Dashboard from "@/pages/members/Dashboard";
import Portfolio from "@/pages/members/Portfolio";
import Settings from "@/pages/members/Settings";
import Success from "@/pages/payment/Success";
import Failure from "@/pages/payment/Failure";
import FAQs from "@/pages/FAQs";
import ManageIndex from "@/pages/manage/Index";
import Users from "@/pages/manage/Users";
import UserDetails from "@/pages/manage/UserDetails";
import Investments from "@/pages/manage/Investments";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ManageLayout } from "@/components/layouts/ManageLayout";
import { Toaster } from "@/components/ui/sonner";

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/callback" element={<Callback />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route
            path="/members/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/members/portfolio"
            element={
              <AuthGuard>
                <Portfolio />
              </AuthGuard>
            }
          />
          <Route
            path="/members/settings"
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
          <Route
            path="/payment/success"
            element={
              <AuthGuard>
                <Success />
              </AuthGuard>
            }
          />
          <Route
            path="/payment/failure"
            element={
              <AuthGuard>
                <Failure />
              </AuthGuard>
            }
          />
          <Route
            path="/manage"
            element={
              <AuthGuard>
                <ManageLayout />
              </AuthGuard>
            }
          >
            <Route index element={<ManageIndex />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="investments" element={<Investments />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;