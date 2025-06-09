import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { 
  Building2, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Film,
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const PartnerPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'theaters', label: 'Theaters', icon: Building2 },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'showtimes', label: 'Showtimes', icon: Clock },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Total Revenue', value: '$45,230', change: '+12%', icon: DollarSign },
    { label: 'Active Theaters', value: '8', change: '+2', icon: Building2 },
    { label: 'Movies Showing', value: '24', change: '+5', icon: Film },
    { label: 'Today\'s Bookings', value: '156', change: '+18%', icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <p className="text-green-400 text-sm mt-1 flex items-center">
                        <TrendingUp size={14} className="mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <stat.icon size={24} className="text-orange-400" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <div>
                        <p className="text-white font-medium">Avengers: Endgame</p>
                        <p className="text-gray-400 text-sm">Theater 1 - 7:30 PM</p>
                      </div>
                      <span className="text-green-400 font-medium">$24.00</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Theater Performance</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <div>
                        <p className="text-white font-medium">Theater {item}</p>
                        <p className="text-gray-400 text-sm">85% occupancy</p>
                      </div>
                      <div className="w-20 bg-gray-600 rounded-full h-2">
                        <div className="bg-orange-400 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-white mb-2">{menuItems.find(item => item.id === activeTab)?.label}</h3>
            <p className="text-gray-400">This section is under development.</p>
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
            <Building2 size={32} className="text-orange-400" />
            <div>
              <h1 className="text-2xl font-bold text-orange-400">Partner Dashboard</h1>
              <p className="text-gray-400">Cinema Management Portal</p>
            </div>
          </div>
            <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{user?.name || 'Staff User'}</p>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {user?.role?.toUpperCase() || 'STAFF'}
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
                        ? 'bg-orange-600 text-white'
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

export default PartnerPage;