import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserMenu } from "@/components/members/UserMenu"
import { Button } from "@/components/ui/button"

export function ManageHeader() {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-14 items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/members/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
        <div className="flex-1" />
        <UserMenu />
      </div>
    </header>
  )
}