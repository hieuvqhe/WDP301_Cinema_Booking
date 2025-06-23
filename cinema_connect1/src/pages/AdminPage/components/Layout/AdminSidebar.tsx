import { BarChart3, Users, Building2, Film, Settings, Database, Shield } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'partners', label: 'Partner Management', icon: Building2 },
    { id: 'movies', label: 'Movie Management', icon: Film },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'reports', label: 'Reports', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <aside className="w-64 bg-gray-800 min-h-screen border-r border-gray-700">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
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
  );
};
