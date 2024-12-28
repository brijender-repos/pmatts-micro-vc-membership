import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md p-6">
        <Outlet />
      </main>
    </div>
  )
}