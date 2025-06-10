import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import { 
  Ticket, 
  Film, 
  Calendar, 
  MapPin, 
  Star, 
  User, 
  LogOut,
  Search,
  Menu,
  X
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      title: "Phim",
      href: "/movies",
      icon: Film,
      children: [
        { title: "Phim đang chiếu", href: "/movies/now-showing", description: "Xem các bộ phim đang chiếu tại rạp" },
        { title: "Phim sắp chiếu", href: "/movies/coming-soon", description: "Khám phá những bộ phim sắp ra mắt" },
        { title: "Phim IMAX", href: "/movies/imax", description: "Trải nghiệm điện ảnh với công nghệ IMAX" },
        { title: "Phim 3D", href: "/movies/3d", description: "Các bộ phim với công nghệ 3D sống động" }
      ]
    },
    {
      title: "Rạp",
      href: "/theaters",
      icon: MapPin,
      children: [
        { title: "Rạp CGV", href: "/theaters/cgv", description: "Hệ thống rạp CGV toàn quốc" },
        { title: "Rạp Galaxy", href: "/theaters/galaxy", description: "Chuỗi rạp Galaxy Cinema" },
        { title: "Rạp Lotte", href: "/theaters/lotte", description: "Lotte Cinema với nhiều ưu đãi" },
        { title: "Rạp BHD", href: "/theaters/bhd", description: "BHD Star Cineplex" }
      ]
    },
    {
      title: "Lịch chiếu",
      href: "/showtimes",
      icon: Calendar,
      children: [
        { title: "Hôm nay", href: "/showtimes/today", description: "Lịch chiếu phim trong ngày" },
        { title: "Tuần này", href: "/showtimes/week", description: "Lịch chiếu cả tuần" },
        { title: "Đặt vé nhanh", href: "/booking/quick", description: "Đặt vé chỉ với vài click" }
      ]
    },
    {
      title: "Ưu đãi",
      href: "/promotions",
      icon: Star,
      children: [
        { title: "Khuyến mãi", href: "/promotions/deals", description: "Các chương trình khuyến mãi hot" },
        { title: "Combo ưu đãi", href: "/promotions/combos", description: "Combo bắp nước giá tốt" },
        { title: "Thành viên VIP", href: "/promotions/vip", description: "Ưu đãi dành cho thành viên" }
      ]
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors"
            >
              <Ticket size={32} />
              <span className="text-xl font-bold">Cinema Connect</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger 
                      className={`bg-transparent text-gray-300 hover:text-white hover:bg-gray-800 data-[state=open]:bg-gray-800 data-[state=open]:text-white ${
                        isActivePath(item.href) ? 'text-orange-400 bg-gray-800' : ''
                      }`}
                    >
                      <item.icon size={16} className="mr-2" />
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4 bg-gray-800 border-gray-700">
                        {item.children.map((child) => (
                          <NavigationMenuLink
                            key={child.title}
                            onClick={() => navigate(child.href)}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 hover:text-orange-400 focus:bg-gray-700 focus:text-orange-400 cursor-pointer"
                          >
                            <div className="text-sm font-medium leading-none text-white">
                              {child.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              {child.description}
                            </p>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm phim, rạp..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'admin' ? 'bg-red-600 text-white' :
                    user.role === 'staff' ? 'bg-blue-600 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="sm"
                  className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                >
                  <User size={16} className="mr-1" />
                  Đăng nhập
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Đăng ký
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 py-4">
            {/* Mobile Search */}
            <div className="px-4 pb-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm phim, rạp..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div className="space-y-2 px-4">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <button
                    onClick={() => navigate(item.href)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActivePath(item.href) 
                        ? 'bg-orange-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.title}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;