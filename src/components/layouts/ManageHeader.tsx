import { SidebarTrigger } from "@/components/ui/sidebar"

export function ManageHeader() {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-14 items-center">
        <SidebarTrigger />
        <div className="flex-1" />
      </div>
    </header>
  )
}