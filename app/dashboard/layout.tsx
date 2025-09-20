import Sidebar from '@/components/dashboard/Sidebar';
import ConversionNotifications from '@/components/dashboard/ConversionNotifications';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
      <ConversionNotifications />
    </div>
  );
}