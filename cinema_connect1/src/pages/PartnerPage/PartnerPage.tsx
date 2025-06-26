import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  TrendingUp,
  Menu,
  X,
  Star,
  MapPin,
  User,
  Mail,
  Phone
} from 'lucide-react';

const PartnerPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);



  const handleLogout = async () => {
    await logout();
    navigate('/home');
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
    { label: 'Total Revenue', value: '$45,230', change: '+12%', icon: DollarSign, changeType: 'positive' },
    { label: 'Active Theaters', value: '8', change: '+2', icon: Building2, changeType: 'positive' },
    { label: 'Movies Showing', value: '24', change: '+5', icon: Film, changeType: 'positive' },
    { label: 'Today\'s Bookings', value: '156', change: '+18%', icon: Calendar, changeType: 'positive' },
  ];

  // Enhanced Mock data for different tabs with Orange Cinema theme
  const mockTheaters = [
    {
      id: 1,
      name: 'Orange Cinema Central',
      location: 'District 1, Ho Chi Minh City',
      capacity: 250,
      screens: 8,
      status: 'Active',
      revenue: '$12,450',
      occupancy: 92,
      amenities: ['3D', 'IMAX', 'Dolby Atmos', 'VIP Seats'],
      image: '/avenger_endgame.jpg'
    },
    {
      id: 2,
      name: 'Sunset Theater Complex',
      location: 'District 3, Ho Chi Minh City',
      capacity: 180,
      screens: 6,
      status: 'Active',
      revenue: '$8,720',
      occupancy: 85,
      amenities: ['3D', 'Premium Sound', 'Recliner Seats'],
      image: '/spidermanAcross.jpg'
    },
    {
      id: 3,
      name: 'Golden Screen Plaza',
      location: 'District 7, Ho Chi Minh City',
      capacity: 320,
      screens: 12,
      status: 'Maintenance',
      revenue: '$15,680',
      occupancy: 78,
      amenities: ['4DX', 'IMAX', 'VIP Lounge', 'Concession Stand'],
      image: '/guardiansGalaxy.jpg'
    },
    {
      id: 4,
      name: 'Diamond Cinema Hub',
      location: 'District 2, Ho Chi Minh City',
      capacity: 200,
      screens: 7,
      status: 'Active',
      revenue: '$9,830',
      occupancy: 88,
      amenities: ['3D', 'Luxury Seating', 'Bar & Grill'],
      image: '/johnWick4.png'
    }
  ];

  const mockMovies = [
    {
      id: 1,
      title: 'Avengers: Endgame',
      genre: 'Action, Adventure',
      duration: '181 min',
      rating: 4.9,
      status: 'Now Showing',
      revenue: '$8,450',
      showtimes: ['14:00', '17:30', '21:00'],
      poster: '/avenger_endgame.jpg',
      director: 'Anthony Russo, Joe Russo',
      cast: 'Robert Downey Jr., Chris Evans, Scarlett Johansson',
      bookings: 234
    },
    {
      id: 2,
      title: 'Spider-Man: Across the Spider-Verse',
      genre: 'Animation, Action',
      duration: '140 min',
      rating: 4.8,
      status: 'Now Showing',
      revenue: '$6,720',
      showtimes: ['13:30', '16:00', '19:30', '22:00'],
      poster: '/spidermanAcross.jpg',
      director: 'Joaquim Dos Santos',
      cast: 'Shameik Moore, Hailee Steinfeld, Oscar Isaac',
      bookings: 189
    },
    {
      id: 3,
      title: 'John Wick: Chapter 4',
      genre: 'Action, Thriller',
      duration: '169 min',
      rating: 4.7,
      status: 'Now Showing',
      revenue: '$7,380',
      showtimes: ['15:00', '18:30', '21:45'],
      poster: '/johnWick4.png',
      director: 'Chad Stahelski',
      cast: 'Keanu Reeves, Donnie Yen, Bill Skarsgård',
      bookings: 156
    },
    {
      id: 4,
      title: 'Guardians of the Galaxy Vol. 3',
      genre: 'Action, Comedy',
      duration: '150 min',
      rating: 4.6,
      status: 'Coming Soon',
      revenue: '$0',
      showtimes: ['TBA'],
      poster: '/guardiansGalaxy.jpg',
      director: 'James Gunn',
      cast: 'Chris Pratt, Zoe Saldana, Dave Bautista',
      bookings: 0
    }
  ];

  const mockShowtimes = [
    {
      id: 1,
      movie: 'Avengers: Endgame',
      theater: 'Orange Cinema Central - Screen 1',
      date: '2024-12-26',
      time: '14:00',
      price: '$15.00',
      availableSeats: 45,
      totalSeats: 120,
      status: 'On Sale',
      bookings: 75
    },
    {
      id: 2,
      movie: 'Spider-Man: Across the Spider-Verse',
      theater: 'Sunset Theater Complex - Screen 2',
      date: '2024-12-26',
      time: '16:00',
      price: '$12.00',
      availableSeats: 28,
      totalSeats: 100,
      status: 'On Sale',
      bookings: 72
    },
    {
      id: 3,
      movie: 'John Wick: Chapter 4',
      theater: 'Golden Screen Plaza - Screen 3',
      date: '2024-12-26',
      time: '18:30',
      price: '$14.00',
      availableSeats: 15,
      totalSeats: 150,
      status: 'Almost Full',
      bookings: 135
    },
    {
      id: 4,
      movie: 'Avengers: Endgame',
      theater: 'Diamond Cinema Hub - Screen 1',
      date: '2024-12-26',
      time: '21:00',
      price: '$16.00',
      availableSeats: 8,
      totalSeats: 80,
      status: 'Almost Full',
      bookings: 72
    },
    {
      id: 5,
      movie: 'Spider-Man: Across the Spider-Verse',
      theater: 'Orange Cinema Central - Screen 2',
      date: '2024-12-27',
      time: '13:30',
      price: '$12.00',
      availableSeats: 55,
      totalSeats: 120,
      status: 'On Sale',
      bookings: 65
    }
  ];

  const mockBookings = [
    {
      id: 'BK001',
      customer: 'Nguyen Van A',
      email: 'nguyenvana@email.com',
      movie: 'Avengers: Endgame',
      theater: 'Orange Cinema Central',
      showtime: '2024-12-26 21:00',
      seats: ['A1', 'A2'],
      total: '$32.00',
      status: 'Confirmed',
      bookingDate: '2024-12-24',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'BK002',
      customer: 'Tran Thi B',
      email: 'tranthib@email.com',
      movie: 'Spider-Man: Across the Spider-Verse',
      theater: 'Sunset Theater Complex',
      showtime: '2024-12-26 16:00',
      seats: ['B5', 'B6', 'B7'],
      total: '$36.00',
      status: 'Confirmed',
      bookingDate: '2024-12-25',
      paymentMethod: 'PayPal'
    },
    {
      id: 'BK003',
      customer: 'Le Van C',
      email: 'levanc@email.com',
      movie: 'John Wick: Chapter 4',
      theater: 'Golden Screen Plaza',
      showtime: '2024-12-26 18:30',
      seats: ['C10'],
      total: '$14.00',
      status: 'Pending',
      bookingDate: '2024-12-26',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'BK004',
      customer: 'Pham Thi D',
      email: 'phamthid@email.com',
      movie: 'Avengers: Endgame',
      theater: 'Diamond Cinema Hub',
      showtime: '2024-12-26 21:00',
      seats: ['D8', 'D9'],
      total: '$32.00',
      status: 'Cancelled',
      bookingDate: '2024-12-23',
      paymentMethod: 'Credit Card'
    }
  ];

  const mockStaff = [
    {
      id: 1,
      name: 'Nguyen Van Manager',
      email: 'manager@cinema.com',
      role: 'Theater Manager',
      department: 'Operations',
      phone: '+84 123 456 789',
      joinDate: '2023-01-15',
      status: 'Active',
      theater: 'Orange Cinema Central',
      salary: '$2,500',
      avatar: '/avatar2.jpg'
    },
    {
      id: 2,
      name: 'Tran Thi Cashier',
      email: 'cashier@cinema.com',
      role: 'Cashier',
      department: 'Front Office',
      phone: '+84 987 654 321',
      joinDate: '2023-03-20',
      status: 'Active',
      theater: 'Sunset Theater Complex',
      salary: '$1,200',
      avatar: '/avatar2.jpg'
    },
    {
      id: 3,
      name: 'Le Van Technician',
      email: 'tech@cinema.com',
      role: 'Technical Support',
      department: 'Maintenance',
      phone: '+84 555 123 456',
      joinDate: '2022-11-10',
      status: 'Active',
      theater: 'Golden Screen Plaza',
      salary: '$1,800',
      avatar: '/avatar2.jpg'
    },
    {
      id: 4,
      name: 'Pham Thi Security',
      email: 'security@cinema.com',
      role: 'Security Guard',
      department: 'Security',
      phone: '+84 111 222 333',
      joinDate: '2023-06-01',
      status: 'On Leave',
      theater: 'Diamond Cinema Hub',
      salary: '$1,000',
      avatar: '/avatar2.jpg'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-orange-500/20 hover:shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mt-2 tracking-tight">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp size={14} className="mr-1 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-medium">{stat.change}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-orange-500/30">
                      <stat.icon size={24} className="text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <motion.div 
                className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Recent Bookings</h3>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg shadow-lg shadow-orange-500/30">
                    <Calendar size={20} className="text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { movie: 'Avengers: Endgame', theater: 'Theater 1', time: '7:30 PM', price: '$24.00', rating: 4.9 },
                    { movie: 'Spider-Man: No Way Home', theater: 'Theater 2', time: '9:00 PM', price: '$26.00', rating: 4.8 },
                    { movie: 'The Batman', theater: 'Theater 3', time: '6:15 PM', price: '$22.00', rating: 4.7 },
                    { movie: 'Top Gun: Maverick', theater: 'Theater 1', time: '8:45 PM', price: '$25.00', rating: 4.9 },
                    { movie: 'Doctor Strange 2', theater: 'Theater 2', time: '10:30 PM', price: '$24.00', rating: 4.6 }
                  ].map((booking, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-all duration-300 border border-slate-600/30 hover:border-orange-500/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-medium">{booking.movie}</p>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-current" />
                            <span className="text-yellow-400 text-xs font-medium">{booking.rating}</span>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm">{booking.theater} - {booking.time}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-orange-400 font-semibold text-lg">{booking.price}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Theater Performance */}
              <motion.div 
                className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Theater Performance</h3>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg shadow-lg shadow-orange-500/30">
                    <BarChart3 size={20} className="text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Theater 1', occupancy: 95, capacity: 120, revenue: '$2,850' },
                    { name: 'Theater 2', occupancy: 87, capacity: 100, revenue: '$2,175' },
                    { name: 'Theater 3', occupancy: 78, capacity: 150, revenue: '$2,925' },
                    { name: 'Theater 4', occupancy: 92, capacity: 80, revenue: '$1,840' }
                  ].map((theater, index) => (
                    <motion.div 
                      key={index} 
                      className="p-4 bg-slate-700/40 rounded-lg border border-slate-600/30 hover:border-orange-500/30 transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-medium">{theater.name}</p>
                          <p className="text-slate-400 text-sm">{theater.occupancy}% occupancy • {theater.capacity} seats</p>
                        </div>
                        <div className="text-right">
                          <span className="text-orange-400 font-semibold">{theater.revenue}</span>
                          <p className="text-slate-400 text-xs">Today's revenue</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full shadow-lg"
                          initial={{ width: 0 }}
                          animate={{ width: `${theater.occupancy}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div 
              className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Add Movie', icon: Film, color: 'from-orange-500 to-red-500' },
                  { label: 'Schedule Show', icon: Clock, color: 'from-amber-500 to-yellow-500' },
                  { label: 'View Reports', icon: BarChart3, color: 'from-emerald-500 to-green-500' },
                  { label: 'Manage Staff', icon: Users, color: 'from-blue-500 to-cyan-500' }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    className="p-4 bg-slate-700/40 rounded-lg border border-slate-600/30 hover:border-orange-500/30 transition-all duration-300 group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`bg-gradient-to-r ${action.color} p-3 rounded-lg mb-3 mx-auto w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <action.icon size={24} className="text-white" />
                    </div>
                    <p className="text-white font-medium text-sm">{action.label}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );

      case 'theaters':
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Theater Management</h2>
              <motion.button 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Theater
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTheaters.map((theater, index) => (
                <motion.div 
                  key={theater.id}
                  className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-orange-500/20 hover:shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{theater.name}</h3>
                      <p className="text-slate-400 text-sm flex items-center">
                        <MapPin size={16} className="mr-1" />
                        {theater.location}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      theater.status === 'Active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {theater.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-700/30 p-3 rounded-lg">
                      <p className="text-slate-400 text-xs">Capacity</p>
                      <p className="text-white font-bold">{theater.capacity}</p>
                    </div>
                    <div className="bg-slate-700/30 p-3 rounded-lg">
                      <p className="text-slate-400 text-xs">Screens</p>
                      <p className="text-white font-bold">{theater.screens}</p>
                    </div>
                    <div className="bg-slate-700/30 p-3 rounded-lg">
                      <p className="text-slate-400 text-xs">Revenue</p>
                      <p className="text-orange-400 font-bold">{theater.revenue}</p>
                    </div>
                    <div className="bg-slate-700/30 p-3 rounded-lg">
                      <p className="text-slate-400 text-xs">Occupancy</p>
                      <p className="text-emerald-400 font-bold">{theater.occupancy}%</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-slate-400 text-xs mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {theater.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button 
                      className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Edit
                    </motion.button>
                    <motion.button 
                      className="flex-1 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'movies':
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Movie Management</h2>
              <motion.button 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Movie
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMovies.map((movie, index) => (
                <motion.div 
                  key={movie.id}
                  className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-orange-500/20 hover:shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="aspect-[2/3] bg-slate-700/30 relative overflow-hidden">
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                      movie.status === 'Now Showing' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {movie.status}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{movie.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{movie.genre} • {movie.duration}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-slate-400 text-xs">Rating</p>
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-400 fill-current mr-1" />
                          <span className="text-white font-bold">{movie.rating}</span>
                        </div>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-lg">
                        <p className="text-slate-400 text-xs">Revenue</p>
                        <p className="text-orange-400 font-bold">{movie.revenue}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-slate-400 text-xs mb-2">Showtimes Today</p>
                      <div className="flex flex-wrap gap-2">
                        {movie.showtimes.map((time, idx) => (
                          <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded border border-orange-500/30">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <motion.button 
                        className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Edit
                      </motion.button>
                      <motion.button 
                        className="flex-1 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'showtimes':
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Showtime Management</h2>
              <motion.button 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Showtime
              </motion.button>
            </div>
            
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Movie</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Theater</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Date & Time</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Seats</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockShowtimes.map((showtime, index) => (
                      <motion.tr 
                        key={showtime.id}
                        className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{showtime.movie}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-300">{showtime.theater}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-300">{showtime.date}</div>
                          <div className="text-sm text-slate-400">{showtime.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-orange-400 font-medium">{showtime.price}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-300">{showtime.availableSeats}/{showtime.totalSeats}</div>
                          <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300" 
                              style={{width: `${((showtime.totalSeats - showtime.availableSeats) / showtime.totalSeats) * 100}%`}}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            showtime.status === 'On Sale' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {showtime.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <motion.button 
                              className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Edit
                            </motion.button>
                            <motion.button 
                              className="bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Delete
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case 'bookings':
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Booking Management</h2>
              <div className="flex gap-3">
                <motion.button 
                  className="bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Export
                </motion.button>
                <motion.button 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  New Booking
                </motion.button>
              </div>
            </div>
            
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Booking ID</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Movie</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Theater</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Showtime</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Seats</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBookings.map((booking, index) => (
                      <motion.tr 
                        key={booking.id}
                        className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-orange-400">{booking.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{booking.customer}</div>
                          <div className="text-sm text-slate-400">{booking.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-300">{booking.movie}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-300">{booking.theater}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-300">{booking.showtime}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {booking.seats.map((seat, idx) => (
                              <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded border border-orange-500/30">
                                {seat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-emerald-400 font-medium">{booking.total}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'Confirmed' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : booking.status === 'Pending'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <motion.button 
                              className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              View
                            </motion.button>
                            <motion.button 
                              className="bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case 'staff':
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Staff Management</h2>
              <motion.button 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Staff
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStaff.map((staff, index) => (
                <motion.div 
                  key={staff.id}
                  className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-orange-500/20 hover:shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{staff.name}</h3>
                        <p className="text-slate-400 text-sm">{staff.role}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      staff.status === 'Active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {staff.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-slate-300 text-sm">
                      <Mail size={16} className="mr-2 text-slate-400" />
                      {staff.email}
                    </div>
                    <div className="flex items-center text-slate-300 text-sm">
                      <Phone size={16} className="mr-2 text-slate-400" />
                      {staff.phone}
                    </div>
                    <div className="flex items-center text-slate-300 text-sm">
                      <Building2 size={16} className="mr-2 text-slate-400" />
                      {staff.theater}
                    </div>
                    <div className="flex items-center text-slate-300 text-sm">
                      <Calendar size={16} className="mr-2 text-slate-400" />
                      Joined {staff.joinDate}
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/30 p-3 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Salary</span>
                      <span className="text-orange-400 font-bold">{staff.salary}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button 
                      className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Edit
                    </motion.button>
                    <motion.button 
                      className="flex-1 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Profile
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div 
            className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-orange-500/30">
              {(() => {
                const menuItem = menuItems.find(item => item.id === activeTab);
                const IconComponent = menuItem?.icon;
                return IconComponent ? <IconComponent size={32} className="text-white" /> : null;
              })()}
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h3>
            <p className="text-slate-400 text-lg">This section is under development.</p>
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span className="text-orange-300 text-sm font-medium">Coming Soon</span>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header 
        className="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 px-6 py-4 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30 hover:border-orange-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {sidebarCollapsed ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
              </motion.div>
            </motion.button>
            
            <div className="flex items-center space-x-4">
              <motion.div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-xl shadow-lg shadow-orange-500/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Building2 size={32} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Orange Cinema Portal
                </h1>
                <p className="text-slate-400">Partner Management Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div 
              className="text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="font-medium text-white">{user?.name || 'Staff User'}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                {user?.role?.toUpperCase() || 'STAFF'}
              </span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600/50 hover:bg-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
              >
                <LogOut size={16} />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          <motion.aside 
            className="bg-slate-800/60 backdrop-blur-sm min-h-screen border-r border-slate-700/50 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto"
            initial={{ x: -300 }}
            animate={{ 
              x: 0,
              width: sidebarCollapsed ? 80 : 256 
            }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
          >
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.li 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <motion.button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent hover:border-orange-500/20'
                      }`}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-orange-400'} transition-colors duration-300`}>
                        <item.icon size={20} />
                      </div>
                      
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="font-medium"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        </AnimatePresence>

        {/* Main Content */}
        <motion.main 
          className="flex-1 p-6 overflow-auto"
          animate={{ 
            marginLeft: sidebarCollapsed ? 0 : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
};

export default PartnerPage;