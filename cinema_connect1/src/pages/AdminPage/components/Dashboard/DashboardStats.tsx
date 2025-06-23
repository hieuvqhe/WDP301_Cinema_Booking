import { Users, Film, BarChart3, DollarSign, TrendingUp } from 'lucide-react';
import type { DashboardStats } from '../../../../types/Admin.type';

interface DashboardStatsProps {
  dashboardData: DashboardStats | null;
}

export const DashboardStatsComponent = ({ dashboardData }: DashboardStatsProps) => {
  const systemStats = [
    { 
      label: 'Total Users', 
      value: dashboardData?.user_stats?.total_users?.toLocaleString() || '0', 
      change: `+${dashboardData?.user_stats?.new_users || 0}`, 
      icon: Users, 
      color: 'text-blue-400' 
    },
    { 
      label: 'Total Movies', 
      value: dashboardData?.content_stats?.total_movies?.toLocaleString() || '0', 
      change: `${dashboardData?.content_stats?.total_theaters || 0} theaters`, 
      icon: Film, 
      color: 'text-purple-400' 
    },
    { 
      label: 'Total Bookings', 
      value: dashboardData?.booking_stats?.total_bookings?.toLocaleString() || '0', 
      change: `${dashboardData?.booking_stats?.completed_bookings || 0} completed`, 
      icon: BarChart3, 
      color: 'text-green-400' 
    },
    { 
      label: 'Total Revenue', 
      value: dashboardData?.booking_stats?.revenue ? `$${dashboardData.booking_stats.revenue.toLocaleString()}` : '$0', 
      change: `${dashboardData?.content_stats?.total_screens || 0} screens`, 
      icon: DollarSign, 
      color: 'text-orange-400' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {systemStats.map((stat, index) => (
        <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-green-400 text-sm mt-1 flex items-center">
                <TrendingUp size={14} className="mr-1" />
                {stat.change}
              </p>
            </div>
            <stat.icon size={32} className={stat.color} />
          </div>
        </div>
      ))}
    </div>
  );
};
