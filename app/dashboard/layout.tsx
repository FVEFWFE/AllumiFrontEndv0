import Sidebar from '@/components/dashboard/Sidebar';
import ConversionNotifications from '@/components/dashboard/ConversionNotifications';
import TrialBanner from '@/components/dashboard/TrialBanner';
import TrialUrgencyModal from '@/components/dashboard/TrialUrgencyModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <TrialBanner className="m-4 mb-0" />
        <div className="flex-1">
          {children}
        </div>
      </main>
      <ConversionNotifications />
      <TrialUrgencyModal />
    </div>
  );
}