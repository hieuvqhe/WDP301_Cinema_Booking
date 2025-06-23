import { BarChart3 } from 'lucide-react';
import type { DashboardStats } from '../../../../types/Admin.type';

interface BookingsChartProps {
  dashboardData: DashboardStats | null;
}

export const BookingsChart = ({ dashboardData }: BookingsChartProps) => {
  if (!dashboardData?.charts?.bookings_per_day || dashboardData.charts.bookings_per_day.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <BarChart3 size={20} className="mr-2 text-green-400" />
        Daily Bookings & Revenue
      </h3>
      <div className="grid gap-2 items-end h-40" style={{gridTemplateColumns: `repeat(${dashboardData.charts.bookings_per_day.length}, 1fr)`}}>
        {dashboardData.charts.bookings_per_day.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex flex-col items-center space-y-1 mb-2">
              <div 
                className="bg-green-400 rounded-t w-full min-h-[4px]"
                style={{
                  height: `${(day.bookings / Math.max(...dashboardData.charts.bookings_per_day.map(d => d.bookings))) * 120}px`
                }}
              ></div>
              <div 
                className="bg-orange-400 rounded-t w-full min-h-[4px]"
                style={{
                  height: `${(day.revenue / Math.max(...dashboardData.charts.bookings_per_day.map(d => d.revenue))) * 60}px`
                }}
              ></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">{new Date(day.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</p>
              <p className="text-xs text-green-400">{day.bookings}b</p>
              <p className="text-xs text-orange-400">${(day.revenue / 1000).toFixed(1)}k</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span className="text-gray-400 text-sm">Bookings</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-400 rounded"></div>
          <span className="text-gray-400 text-sm">Revenue</span>
        </div>
      </div>
    </div>
  );
};
