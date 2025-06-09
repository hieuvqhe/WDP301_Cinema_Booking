import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
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
  AlertTriangle,
  Activity,
  Database
} from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');

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
    { label: 'Total Users', value: '2,847', change: '+15%', icon: Users, color: 'text-blue-400' },
    { label: 'Active Partners', value: '23', change: '+3', icon: Building2, color: 'text-green-400' },
    { label: 'System Revenue', value: '$187,420', change: '+22%', icon: DollarSign, color: 'text-orange-400' },
    { label: 'Active Movies', value: '156', change: '+8', icon: Film, color: 'text-purple-400' },
  ];

  const systemAlerts = [
    { type: 'warning', message: 'High server load detected', time: '2 mins ago' },
    { type: 'info', message: 'Database backup completed', time: '1 hour ago' },
    { type: 'error', message: 'Payment gateway issue resolved', time: '3 hours ago' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemStats.map((stat, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <p className="text-green-400 text-sm mt-1 flex items-center">
                        <TrendingUp size={14} className="mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Alerts */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle size={20} className="mr-2 text-yellow-400" />
                  System Alerts
                </h3>
                <div className="space-y-3">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === 'error' ? 'bg-red-400' : 
                        alert.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{alert.message}</p>
                        <p className="text-gray-400 text-xs mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* System Performance */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Activity size={20} className="mr-2 text-green-400" />
                  System Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">CPU Usage</span>
                      <span className="text-white">45%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Memory Usage</span>
                      <span className="text-white">67%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '67%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Database Load</span>
                      <span className="text-white">32%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{width: '32%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">API Response</span>
                      <span className="text-white">98.5%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{width: '98.5%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activities */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Administrative Activities</h3>
              <div className="space-y-3">
                {[
                  { action: 'New partner registration approved', user: 'Cinema Plus', time: '10 mins ago', type: 'success' },
                  { action: 'User account suspended for policy violation', user: 'john.doe@email.com', time: '25 mins ago', type: 'warning' },
                  { action: 'System maintenance completed', user: 'System', time: '1 hour ago', type: 'info' },
                  { action: 'New movie "Avatar 3" added to catalog', user: 'Movie Manager', time: '2 hours ago', type: 'success' },
                  { action: 'Payment gateway configuration updated', user: 'Admin', time: '3 hours ago', type: 'info' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-green-400' : 
                        activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                      <div>
                        <p className="text-white text-sm">{activity.action}</p>
                        <p className="text-gray-400 text-xs">by {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
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