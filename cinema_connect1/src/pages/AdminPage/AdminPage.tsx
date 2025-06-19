import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { getDashboardStats } from '../../apis/admin.api';
import type { DashboardStats, DashboardQueryParams } from '../../types/Admin.type';
import { toast } from 'sonner';
import { 
  Shield, 
  Users, 
  Building2, 
  BarChart3, 
  Settings, 
  LogOut,
  Film,
  DollarSign,
  TrendingUp,
  Activity,
  Database,
  RefreshCw,
  Loader2
} from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardQueryParams['period']>('month');

  // Fetch dashboard data
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'partners', label: 'Partner Management', icon: Building2 },
    { id: 'movies', label: 'Movie Management', icon: Film },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'reports', label: 'Reports', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
  ];
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

  const renderContent = () => {
    switch (activeTab) {case 'dashboard':
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

            {/* System Stats */}
            {!isLoading && (
              <>
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
                </div>                {/* Top Movies Section */}
                {dashboardData?.top_performers?.top_movies && dashboardData.top_performers.top_movies.length > 0 && (
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
                              (e.target as HTMLImageElement).src ='/placeholder-movie.png';
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
                )}

                {/* Top Theaters Section */}
                {dashboardData?.top_performers?.top_theaters && dashboardData.top_performers.top_theaters.length > 0 && (
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
                )}

                {/* Bookings per Day Chart */}
                {dashboardData?.charts?.bookings_per_day && dashboardData.charts.bookings_per_day.length > 0 && (
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
                )}

                {/* Revenue by Status */}
                {dashboardData?.booking_stats?.revenue_by_status && dashboardData.booking_stats.revenue_by_status.length > 0 && (
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Activity size={20} className="mr-2 text-blue-400" />
                      Revenue by Booking Status
                    </h3>
                    <div className="space-y-4">
                      {dashboardData.booking_stats.revenue_by_status.map((status, index) => {
                        const colors = {
                          confirmed: 'bg-green-400',
                          pending: 'bg-yellow-400',
                          cancelled: 'bg-red-400'
                        };
                        const maxRevenue = Math.max(...dashboardData.booking_stats.revenue_by_status.map(s => s.total));
                        
                        return (
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
                        );
                      })}
                    </div>
                  </div>
                )}

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
      default:
        return (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">{menuItems.find(item => item.id === activeTab)?.label}</h3>
            <p className="text-gray-400">This administrative section is under development.</p>
            <p className="text-gray-500 text-sm mt-2">Advanced management features will be available soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield size={32} className="text-red-400" />
            <div>
              <h1 className="text-2xl font-bold text-red-400">Admin Console</h1>
              <p className="text-gray-400">System Administration Portal</p>
            </div>
          </div>
            <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{user?.name || 'Administrator'}</p>
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {user?.role?.toUpperCase() || 'ADMIN'}
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-screen border-r border-gray-700">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;