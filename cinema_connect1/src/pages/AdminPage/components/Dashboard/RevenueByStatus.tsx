import { Activity } from 'lucide-react';
import type { DashboardStats } from '../../../../types/Admin.type';

interface RevenueByStatusProps {
  dashboardData: DashboardStats | null;
}

export const RevenueByStatus = ({ dashboardData }: RevenueByStatusProps) => {
  if (!dashboardData?.booking_stats?.revenue_by_status || dashboardData.booking_stats.revenue_by_status.length === 0) {
    return null;
  }

  const colors = {
    confirmed: 'bg-green-400',
    pending: 'bg-yellow-400',
    cancelled: 'bg-red-400'
  };

  const maxRevenue = Math.max(...dashboardData.booking_stats.revenue_by_status.map(s => s.total));

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Activity size={20} className="mr-2 text-blue-400" />
        Revenue by Booking Status
      </h3>
      <div className="space-y-4">
        {dashboardData.booking_stats.revenue_by_status.map((status, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${colors[status._id as keyof typeof colors] || 'bg-gray-400'}`}></div>
              <span className="text-white capitalize">{status._id}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-24 bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${colors[status._id as keyof typeof colors] || 'bg-gray-400'}`}
                  style={{width: `${(status.total / maxRevenue) * 100}%`}}
                ></div>
              </div>
              <span className="text-green-400 font-medium min-w-[80px] text-right">
                ${status.total.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
