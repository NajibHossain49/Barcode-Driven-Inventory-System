import AnalyticsDashboard from '@/app/components/AnalyticsDashboard';
import Navbar from '@/app/components/Navbar';

export default function AnalyticsPage() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}