import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { 
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
  toggleUserStatus
} from '../../apis/admin.api';
import type { 
  DashboardStats, 
  DashboardQueryParams,
  AdminUser,
  UsersQueryParams,
  UpdateUserRequest
} from '../../types/Admin.type';
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
  Loader2,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardQueryParams['period']>('month');

  // User Management States
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

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

  // User Management Functions
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const params: UsersQueryParams = {
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        sortBy: sortBy as any,
        sortOrder
      };      const response = await getAllUsers(params);
      console.log('Users API Response:', response); // Debug log
      
      if (response?.result?.users) {
        setUsers(response.result.users);
        // Handle different pagination structures
        const totalUsers = response.result.pagination?.totalUsers || 
                          response.result.total || 
                          response.result.users.length || 0;
        setTotalUsers(totalUsers);
      } else if (response?.result && Array.isArray(response.result)) {
        // Handle case where result is directly an array
        setUsers(response.result);
        setTotalUsers(response.result.length);
      } else {
        console.warn('Unexpected response structure:', response);
        setUsers([]);
        setTotalUsers(0);
        // Don't show error toast if we got some response, just warn
        if (!response) {
          toast.error('No response from server');
        }
      }    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
      setTotalUsers(0);
      
      // Only show toast error for actual errors, not for empty responses
      if (error instanceof Error) {
        toast.error(`Failed to load users: ${error.message}`);
      } else {
        toast.error('Failed to load users');
      }
    } finally {
      setUsersLoading(false);
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      setIsLoading(true);
      const userDetails = await getUserById(userId);
      setSelectedUser(userDetails);
      setShowUserModal(true);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      toast.error('Failed to load user details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (userId: string, userData: UpdateUserRequest) => {
    try {
      await updateUser(userId, userData);
      toast.success('User updated successfully');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    }
  };
  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      console.log('Updating user role:', { userId, role }); // Debug log
      
      // Validate role
      const validRoles = ['admin', 'user', 'partner'];
      if (!validRoles.includes(role)) {
        toast.error('Invalid role selected');
        return;
      }
      
      await updateUserRole(userId, { role: role as 'admin' | 'user' | 'partner' });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error('Failed to update user role');
    }
  };
  const handleToggleUserStatus = async (userId: string, isCurrentlyActive: boolean) => {
    try {
      const action = isCurrentlyActive ? 'ban' : 'unban';
      await toggleUserStatus(userId, action);
      toast.success(`User ${action === 'ban' ? 'banned' : 'unbanned'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete._id);
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const confirmDeleteUser = (user: AdminUser) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Effect to fetch users when dependencies change
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, currentPage, roleFilter, sortBy, sortOrder]);

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
    },  ];

  // User Management Component
  const renderUserManagement = () => {
    const totalPages = Math.ceil(totalUsers / limit);
    
    return (
      <div className="space-y-6">
        {/* Header with Search and Filters */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Total Users: {totalUsers}</span>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors"
              >
                <Search size={16} />
              </button>
            </form>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="partner">Partner</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="createdAt">Created Date</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {usersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-blue-400" />
              <span className="ml-3 text-gray-400">Loading users...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((userData) => (
                      <tr key={userData._id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {userData.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{userData.name}</div>
                              <div className="text-sm text-gray-400">{userData.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={userData.role}
                            onChange={(e) => handleUpdateUserRole(userData._id, e.target.value)}
                            className="px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 text-sm"
                          >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="partner">Partner</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleUserStatus(userData._id, userData.isVerified)}
                            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                              userData.isVerified
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {userData.isVerified ? 'Active' : 'Banned'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(userData.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewUser(userData._id)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditUser(userData)}
                              className="text-yellow-400 hover:text-yellow-300 transition-colors"
                              title="Edit User"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => confirmDeleteUser(userData)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-700 px-6 py-3 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modals */}
        {showUserModal && selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => {
              setShowUserModal(false);
              setSelectedUser(null);
            }}
          />
        )}

        {showEditModal && selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            onSave={handleUpdateUser}
          />
        )}

        {showDeleteModal && userToDelete && (
          <DeleteConfirmModal
            user={userToDelete}
            onClose={() => {
              setShowDeleteModal(false);
              setUserToDelete(null);
            }}
            onConfirm={handleDeleteUser}
          />
        )}
      </div>
    );
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
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
                </div>

                {/* Top Movies Section */}
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
      case 'users':
        return renderUserManagement();
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

  // Modal Components
  const UserDetailModal = ({ user, onClose }: { user: AdminUser; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">User Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User size={20} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-green-400" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
              </div>
              
              {user.phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-yellow-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">{user.phone}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-purple-400" />
                <div>
                  <p className="text-gray-400 text-sm">Joined</p>
                  <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Role</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'partner' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role.toUpperCase()}
                </span>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isVerified ? 'Active' : 'Banned'}
                </span>
              </div>
              
              {user.date_of_birth && (
                <div>
                  <p className="text-gray-400 text-sm">Date of Birth</p>
                  <p className="text-white">{new Date(user.date_of_birth).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
          
          {user.address && (
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-orange-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <div className="text-white">
                    <p>{user.address.street}</p>
                    <p>{user.address.city}, {user.address.state}</p>
                    <p>{user.address.country} {user.address.zipCode}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const EditUserModal = ({ 
    user, 
    onClose, 
    onSave 
  }: { 
    user: AdminUser; 
    onClose: () => void; 
    onSave: (userId: string, data: UpdateUserRequest) => void;
  }) => {
    const [formData, setFormData] = useState({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
      address: user.address || {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
      }
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(user._id, formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Edit User</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-lg font-medium text-white">Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Street</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, street: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, city: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, state: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, country: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Zip Code</label>
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, zipCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = ({ 
    user, 
    onClose, 
    onConfirm 
  }: { 
    user: AdminUser; 
    onClose: () => void; 
    onConfirm: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-2">
            Are you sure you want to delete this user?
          </p>
          <div className="bg-gray-700 p-3 rounded">
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <p className="text-red-400 text-sm mt-2">
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );

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