import { Film } from 'lucide-react';
import type { DashboardStats } from '../../../../types/Admin.type';

interface TopMoviesProps {
  dashboardData: DashboardStats | null;
}

export const TopMovies = ({ dashboardData }: TopMoviesProps) => {
  if (!dashboardData?.top_performers?.top_movies || dashboardData.top_performers.top_movies.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Film size={20} className="mr-2 text-purple-400" />
        Top Performing Movies
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardData.top_performers.top_movies.slice(0, 6).map((movie) => (
          <div key={movie._id} className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3">
            <img 
              src={movie.poster_url} 
              alt={movie.title}
              className="w-16 h-20 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-movie.png';
              }}
            />
            <div className="flex-1">
              <h4 className="text-white font-medium mb-1">{movie.title}</h4>
              <p className="text-gray-400 text-sm">{movie.bookings_count} bookings</p>
              <p className="text-green-400 text-sm">${movie.revenue.toLocaleString()}</p>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-400 h-2 rounded-full" 
                  style={{
                    width: `${Math.min(
                      (movie.bookings_count / Math.max(...dashboardData.top_performers.top_movies.map(m => m.bookings_count))) * 100, 
                      100
                    )}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
