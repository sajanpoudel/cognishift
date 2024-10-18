export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background bg-grey-100">
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
