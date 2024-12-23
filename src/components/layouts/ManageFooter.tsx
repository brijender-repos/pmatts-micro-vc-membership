export function ManageFooter() {
  return (
    <footer className="border-t py-6 bg-background">
      <div className="container flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} PMatts Innovative Catalysts Federation. All rights reserved.
        </p>
      </div>
    </footer>
  )
}