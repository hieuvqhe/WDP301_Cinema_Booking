import { Building2 } from 'lucide-react';
import type { DashboardStats } from '../../../../types/Admin.type';

interface TopTheatersProps {
  dashboardData: DashboardStats | null;
}

export const TopTheaters = ({ dashboardData }: TopTheatersProps) => {
  if (!dashboardData?.top_performers?.top_theaters || dashboardData.top_performers.top_theaters.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Building2 size={20} className="mr-2 text-blue-400" />
        Top Performing Theaters
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dashboardData.top_performers.top_theaters.slice(0, 4).map((theater) => (
          <div key={theater._id} className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-1">{theater.name}</h4>
            <p className="text-gray-400 text-sm mb-2">{theater.location}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-xs">Bookings</p>
                <p className="text-white font-medium">{theater.bookings_count}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Revenue</p>
                <p className="text-green-400 font-medium">${theater.revenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
              <div 
                className="bg-blue-400 h-2 rounded-full" 
                style={{
                  width: `${Math.min(
                    (theater.bookings_count / Math.max(...dashboardData.top_performers.top_theaters.map(t => t.bookings_count))) * 100, 
                    100
                  )}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
