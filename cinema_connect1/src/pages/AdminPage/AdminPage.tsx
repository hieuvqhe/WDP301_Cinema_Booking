import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { AdminHeader, AdminSidebar, Dashboard, UserManagement } from './components';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 flex">{/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Header */}
        <AdminHeader user={user} onLogout={handleLogout} />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
