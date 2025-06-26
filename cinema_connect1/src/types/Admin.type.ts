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
  username?: string;
  avatar?: string;
  phone?: string;
  role: 'admin' | 'customer' | 'staff';
  verify: number; // 0: not verified, 1: verified, 2: banned
  date_of_birth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  created_at: string;
  updated_at: string;
  email_verify_code?: string;
  verify_code_expires_at?: string | null;
  class?: string;
  stats: {
    bookings_count: number;
    ratings_count: number;
    feedbacks_count: number;
    total_spent?: number;
  };
  recent_activity?: {
    recent_bookings: any[];
    recent_ratings: any[];
    recent_feedbacks: any[];
  };
}

export interface GetUsersResponse {
  message: string;
  result: {
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface GetUserByIdResponse {
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
  role: 'admin' | 'customer' | 'staff';
}

export interface AdminResponse {
  message: string;
  result?: any;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sort_by?: 'name' | 'email' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// Dashboard query parameters
export interface DashboardQueryParams {
  period?: 'today' | 'week' | 'month' | 'year' | 'all';
  start_date?: string; // Format: YYYY-MM-DD
  end_date?: string;   // Format: YYYY-MM-DD
}
