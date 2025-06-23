// Admin related types
export interface DashboardStats {
  period: string;
  user_stats: {
    total_users: number;
    new_users: number;
  };
  booking_stats: {
    total_bookings: number;
    completed_bookings: number;
    revenue: number;
    revenue_by_status: Array<{
      _id: string;
      total: number;
    }>;
  };
  content_stats: {
    total_movies: number;
    total_theaters: number;
    total_screens: number;
    total_ratings: number;
    total_feedbacks: number;
  };
  charts: {
    bookings_per_day: Array<{
      date: string;
      bookings: number;
      revenue: number;
    }>;
  };
  top_performers: {
    top_movies: Array<{
      _id: string;
      bookings_count: number;
      revenue: number;
      movie_id: string;
      title: string;
      poster_url: string;
    }>;
    top_theaters: Array<{
      _id: string;
      bookings_count: number;
      revenue: number;
      theater_id: string;
      name: string;
      location: string;
    }>;
  };
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'partner';
  isVerified: boolean;
  date_of_birth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  result: {
    users: AdminUser[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      limit: number;
    };
    // Alternative structure for some APIs
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface GetUserByIdResponse {
  success: boolean;
  message: string;
  result: AdminUser;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

export interface UpdateUserRoleRequest {
  role: 'admin' | 'user' | 'partner';
}

export interface AdminResponse {
  success: boolean;
  message: string;
  result?: any;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Dashboard query parameters
export interface DashboardQueryParams {
  period?: 'today' | 'week' | 'month' | 'year' | 'all';
  start_date?: string; // Format: YYYY-MM-DD
  end_date?: string;   // Format: YYYY-MM-DD
}
