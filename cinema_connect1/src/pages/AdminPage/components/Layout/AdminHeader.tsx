import { Shield, LogOut } from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface AdminHeaderProps {
  user: any;
  onLogout: () => void;
}

export const AdminHeader = ({ user, onLogout }: AdminHeaderProps) => {
  return (
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
            <p className="font-medium text-white">{user?.name || 'Administrator'}</p>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {user?.role?.toUpperCase() || 'ADMIN'}
            </span>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
};
