import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ManageLayout } from "@/components/layouts/ManageLayout"

// Lazy load pages
const Index = lazy(() => import("@/pages/Index"))
const Login = lazy(() => import("@/pages/auth/Login"))
const Callback = lazy(() => import("@/pages/auth/Callback"))
const Dashboard = lazy(() => import("@/pages/members/Dashboard"))
const Portfolio = lazy(() => import("@/pages/members/Portfolio"))
const Settings = lazy(() => import("@/pages/members/Settings"))
const ManageDashboard = lazy(() => import("@/pages/manage/Index"))
const Users = lazy(() => import("@/pages/manage/Users"))
const UserDetails = lazy(() => import("@/pages/manage/UserDetails"))
const AddInvestment = lazy(() => import("@/pages/manage/AddInvestment"))
const Investments = lazy(() => import("@/pages/manage/Investments"))
const PaymentSuccess = lazy(() => import("@/pages/payment/Success"))
const PaymentFailure = lazy(() => import("@/pages/payment/Failure"))

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/callback",
    element: <Callback />,
  },
  {
    path: "/members",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/manage",
    element: (
      <AuthGuard>
        <ManageLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <ManageDashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/:userId",
        element: <UserDetails />,
      },
      {
        path: "users/:userId/add-investment",
        element: <AddInvestment />,
      },
      {
        path: "investments",
        element: <Investments />,
      },
    ],
  },
  {
    path: "/payment/success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment/failure",
    element: <PaymentFailure />,
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
      <SonnerToaster />
    </QueryClientProvider>
  )
}

export default App