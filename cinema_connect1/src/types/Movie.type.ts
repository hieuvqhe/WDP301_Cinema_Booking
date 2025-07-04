// Movie related types
export interface MovieCast {
  id: number;
  name: string;
  character: string;
  order: number;
  profile_image: string;
  gender: number;
}
export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  director: string;
  cast: CastMember[];
  duration: number; // in minutes
  release_date: string;
  poster_url: string;
  trailer_url?: string;
  average_rating: number;
  ratings_count: number;
  language: string;
  is_featured: boolean;
  featured_order?: number | null;
  status: 'now_showing' | 'coming_soon' | 'ended';
  created_at: string;
  updated_at: string;
}

// Movie Cast interface
export interface CastMember {
  id: number;
  name: string;
  character: string;
  order: number;
  profile_image: string;
  gender: number;
}

export interface CreateMovieRequest {
  title: string;
  description: string;
  genre: string[];
  director: string;
  cast: MovieCast[];
  duration: number;
  release_date: string;
  poster_url: string;
  trailer_url?: string;
  language: string;
  status: 'now_showing' | 'coming_soon' | 'ended';
}

export interface UpdateMovieRequest extends Partial<CreateMovieRequest> {
  is_featured?: boolean;
}

export interface MovieQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  status?: 'now_showing' | 'coming_soon' | 'ended';
  language?: string;
  sortBy?: 'title' | 'release_date' | 'average_rating' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface GetMoviesResponse {
  success: boolean;
  message: string;
  result: {
    movies: Movie[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalMovies: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    total?: number;
  };
}

export interface GetMovieByIdResponse {
  success: boolean;
  message: string;
  result: Movie;
}

export interface MovieResponse {
  success: boolean;
  message: string;
  result?: Movie;
}

export interface UpdateMovieFeatureRequest {
  is_featured: boolean;
}
