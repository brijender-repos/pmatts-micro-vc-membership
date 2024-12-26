import { SidebarProvider } from "@/components/ui/sidebar"
import { ManageSidebar } from "./ManageSidebar"
import { ManageHeader } from "./ManageHeader"
import { ManageFooter } from "./ManageFooter"
import { Outlet } from "react-router-dom"

export function ManageLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ManageSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <ManageHeader />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
          <ManageFooter />
        </div>
      </div>
    </SidebarProvider>
  )
}