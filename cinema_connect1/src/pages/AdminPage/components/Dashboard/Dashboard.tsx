import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { getDashboardStats } from '../../../../apis/admin.api';
import type { DashboardStats, DashboardQueryParams } from '../../../../types/Admin.type';
import { toast } from 'sonner';

import { DashboardStatsComponent } from './DashboardStats';
import { TopMovies } from './TopMovies';
import { TopTheaters } from './TopTheaters';
import { BookingsChart } from './BookingsChart';
import { RevenueByStatus } from './RevenueByStatus';

export const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardQueryParams['period']>('month');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await getDashboardStats({ period: selectedPeriod });
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = () => {
    fetchDashboardData();
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-400">Monitor system performance and statistics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as DashboardQueryParams['period'])}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <Button
            onClick={handleRefreshData}
            size="sm"
            className="bg-gray-700 hover:bg-gray-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-red-400" />
          <span className="ml-2 text-gray-400">Loading dashboard data...</span>
        </div>
      )}

      {/* Dashboard Content */}
      {!isLoading && (
        <>
          <DashboardStatsComponent dashboardData={dashboardData} />
          <TopMovies dashboardData={dashboardData} />
          <TopTheaters dashboardData={dashboardData} />
          <BookingsChart dashboardData={dashboardData} />
          <RevenueByStatus dashboardData={dashboardData} />
          
          {/* Additional Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-3">Content Overview</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Theaters</span>
                  <span className="text-white">{dashboardData?.content_stats?.total_theaters || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Screens</span>
                  <span className="text-white">{dashboardData?.content_stats?.total_screens || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Ratings</span>
                  <span className="text-white">{dashboardData?.content_stats?.total_ratings || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Feedbacks</span>
                  <span className="text-white">{dashboardData?.content_stats?.total_feedbacks || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
