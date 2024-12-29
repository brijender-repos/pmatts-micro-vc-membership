interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {children}
    </main>
  );
};