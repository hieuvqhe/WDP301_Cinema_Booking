import { Loader2, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminUser } from '../../../../types/Admin.type';

interface UserTableProps {
  users: AdminUser[];
  usersLoading: boolean;
  currentPage: number;
  totalUsers: number;
  limit: number;
  onViewUser: (userId: string) => void;
  onEditUser: (user: AdminUser) => void;
  onUpdateUserRole: (userId: string, role: string) => void;
  onToggleUserStatus: (userId: string, isCurrentlyActive: boolean) => void;
  onDeleteUser: (user: AdminUser) => void;
  onPageChange: (page: number) => void;
}

export const UserTable = ({
  users,
  usersLoading,
  currentPage,
  totalUsers,
  limit,
  onViewUser,
  onEditUser,
  onUpdateUserRole,
  onToggleUserStatus,
  onDeleteUser,
  onPageChange
}: UserTableProps) => {
  const totalPages = Math.ceil(totalUsers / limit);

  if (usersLoading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-blue-400" />
          <span className="ml-3 text-gray-400">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
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
                    onChange={(e) => onUpdateUserRole(userData._id, e.target.value)}
                    className="px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 text-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="partner">Partner</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onToggleUserStatus(userData._id, userData.isVerified)}
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
                      onClick={() => onViewUser(userData._id)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEditUser(userData)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors"
                      title="Edit User"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteUser(userData)}
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
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
