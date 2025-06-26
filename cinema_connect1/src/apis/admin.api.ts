import axios from 'axios';
import type { 
  DashboardStats,
  DashboardQueryParams,
  AdminUser,
  GetUsersResponse,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserRoleRequest,
  AdminResponse,
  UsersQueryParams
} from '../types/Admin.type';
import { getAuthToken } from './user.api';

const BASE_URL = 'https://bookmovie-5n6n.onrender.com';

// Create authenticated axios instance for admin requests
const createAdminRequest = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Handle admin API errors
const handleAdminError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    if (status === 401) {
      throw new Error('Unauthorized. Please login as admin.');
    } else if (status === 403) {
      throw new Error('Access denied. Admin privileges required.');
    } else if (status === 404) {
      throw new Error(message || 'Resource not found.');
    } else if (status === 400) {
      throw new Error(message || 'Invalid request data.');
    } else if (status === 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error(message || 'Request failed.');
    }
  }
  throw new Error('Network error. Please check your connection.');
};

// ===============================
// DASHBOARD APIS
// ===============================

// Get dashboard statistics
export const getDashboardStats = async (params?: DashboardQueryParams): Promise<DashboardStats> => {
  try {
    const adminApi = createAdminRequest();
    const queryParams = new URLSearchParams();
    
    if (params?.period) queryParams.append('period', params.period);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    
    const url = `/admin/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await adminApi.get<{ result: DashboardStats }>(url);
    return response.data.result;
  } catch (error) {
    throw handleAdminError(error);
  }
};

// ===============================
// USER MANAGEMENT APIS
// ===============================

// Get all users with pagination and filters
export const getAllUsers = async (params?: UsersQueryParams): Promise<GetUsersResponse> => {
  try {
    const adminApi = createAdminRequest();
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    
    const url = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await adminApi.get<GetUsersResponse>(url);
    return response.data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<AdminUser> => {
  try {
    const adminApi = createAdminRequest();
    const response = await adminApi.get<GetUserByIdResponse>(`/admin/users/${userId}`);
    return response.data.result;
  } catch (error) {
    throw handleAdminError(error);
  }
};

// Update user information
export const updateUser = async (userId: string, userData: UpdateUserRequest): Promise<AdminResponse> => {
  try {
    const adminApi = createAdminRequest();
    const response = await adminApi.put<AdminResponse>(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

// Update user role
export const updateUserRole = async (userId: string, roleData: UpdateUserRoleRequest): Promise<AdminResponse> => {
  try {
    const adminApi = createAdminRequest();
    const response = await adminApi.put<AdminResponse>(`/admin/users/${userId}/role`, roleData);
    return response.data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

// Delete user
export const deleteUser = async (userId: string): Promise<AdminResponse> => {
  try {
    const adminApi = createAdminRequest();
    const response = await adminApi.delete<AdminResponse>(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

// Ban/Unban user
export const toggleUserStatus = async (userId: string, action: 'ban' | 'unban'): Promise<AdminResponse> => {
  try {
    const adminApi = createAdminRequest();
    const response = await adminApi.put<AdminResponse>(`/admin/users/${userId}/${action}`);
    return response.data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

// ===============================
// ADMIN UTILITY FUNCTIONS
// ===============================

// Check if user has admin privileges
export const checkAdminPrivileges = async (): Promise<boolean> => {
  try {
    const adminApi = createAdminRequest();
    await adminApi.get('/admin/dashboard');
    return true;
  } catch (error) {
    return false;
  }
};

// Export users data (CSV format)
export const exportUsersData = async (params?: UsersQueryParams): Promise<Blob> => {
  try {
    const adminApi = createAdminRequest();
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    
    const url = `/admin/users/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await adminApi.get(url, {
      responseType: 'blob'
    });
    
    return response.data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

// Get user activity logs
export const getUserActivityLogs = async (userId: string, limit = 50): Promise<any[]> => {
  try {
    const adminApi = createAdminRequest();
    const response = await adminApi.get(`/admin/users/${userId}/activity?limit=${limit}`);
    return response.data.result || [];
  } catch (error) {
    throw handleAdminError(error);
  }
};

// Send notification to user
export const sendNotificationToUser = async (userId: string, notification: {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
}): Promise<AdminResponse> => {
  try {
    const adminApi = createAdminRequest();
    const response = await adminApi.post<AdminResponse>(`/admin/users/${userId}/notify`, notification);
    return response.data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

// Bulk operations
export const bulkUpdateUsers = async (userIds: string[], updates: Partial<UpdateUserRequest>): Promise<AdminResponse> => {
  try {
    const adminApi = createAdminRequest();
    const response = await adminApi.put<AdminResponse>('/admin/users/bulk-update', {
      userIds,
      updates
    });
    return response.data;
  } catch (error) {
    throw handleAdminError(error);
  }
};

export const bulkDeleteUsers = async (userIds: string[]): Promise<AdminResponse> => {
  try {
    const adminApi = createAdminRequest();
    const response = await adminApi.delete<AdminResponse>('/admin/users/bulk-delete', {
      data: { userIds }
    });
    return response.data;
  } catch (error) {
    throw handleAdminError(error);
  }
};
