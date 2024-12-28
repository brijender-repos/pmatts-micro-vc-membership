import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { RootLayout } from "@/components/layouts/RootLayout";
import { ManageLayout } from "@/components/layouts/ManageLayout";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/store";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Project from "@/pages/Project";
import Portfolio from "@/pages/Portfolio";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ResetPassword from "@/pages/auth/ResetPassword";
import UpdatePassword from "@/pages/auth/UpdatePassword";
import Users from "@/pages/manage/Users";
import User from "@/pages/manage/User";
import AddInvestment from "@/pages/manage/AddInvestment";
import Investments from "@/pages/manage/Investments";
import Projects_Admin from "@/pages/manage/Projects";
import Project_Admin from "@/pages/manage/Project";
import Settings from "@/pages/manage/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/:projectId",
        element: <Project />,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "update-password",
        element: <UpdatePassword />,
      },
    ],
  },
  {
    path: "manage",
    element: <ManageLayout />,
    children: [
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/:userId",
        element: <User />,
      },
      {
        path: "users/:userId/add-investment",
        element: <AddInvestment />,
      },
      {
        path: "investments",
        element: <Investments />,
      },
      {
        path: "projects",
        element: <Projects_Admin />,
      },
      {
        path: "projects/:projectId",
        element: <Project_Admin />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}