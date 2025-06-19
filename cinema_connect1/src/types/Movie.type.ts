export interface Movie {
    _id: string;
    title: string;
    description: string;
    duration: number;
    genre: string[];
    language: string;
    release_date: string;
    director: string;
    cast: string[];
    poster_url: string;
    status: 'coming_soon' | 'now_showing' | 'archived';
    average_rating: number;
    ratings_count: number;
    is_featured: boolean;
    featured_order: number | null;
    created_at: string;
    updated_at: string;
}


