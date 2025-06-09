import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useAuthStore } from '../../store/useAuthStore';
import { Ticket, LogOut, User } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Ticket size={24} className="text-orange-400 mr-2" />
            <h1 className="text-xl font-bold text-orange-400">Cinema Connect</h1>
            <span className="ml-4 px-3 py-1 bg-green-600 text-white rounded-full text-sm">Customer</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="text-sm hidden sm:inline">Hello, {user?.name || 'Guest'}</span>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              <LogOut size={16} className="mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto p-4 mt-8">
        <h1 className="text-3xl font-bold mb-6 text-orange-400">Welcome to Cinema Connect</h1>
        <p className="text-lg mb-8 text-gray-300">Book your favorite movies and enjoy the best cinema experience!</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Placeholder for movie cards */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="h-48 bg-gray-700 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse mb-4"></div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Book Now</Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;