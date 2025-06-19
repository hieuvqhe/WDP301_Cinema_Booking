import axios from "axios";
import type { Movie } from "../types/Movie.type";

const BASE_URL = 'https://bookmovie-5n6n.onrender.com';
const API_URL = '/cinema/movies';

// Create axios instance for movie requests
const movieApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Handle movie API errors
const handleMovieError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    if (status === 401) {
      throw new Error('Unauthorized. Please login.');
    } else if (status === 403) {
      throw new Error('Access denied.');
    } else if (status === 404) {
      throw new Error(message || 'Movie not found.');
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

export const getAllMovies = async (): Promise<Movie[]> => {
  try {
    const res = await movieApi.get<{ movies: Movie[] }>("/cinema/movies");
    return res.data.movies;
  } catch (error) {
    throw handleMovieError(error);
  }
};

export const getMovieById = async (id: string): Promise<Movie> => {
  try {
    const res = await movieApi.get<{ result: Movie }>(`${API_URL}/${id}`);
    return res.data.result;
  } catch (error) {
    throw handleMovieError(error);
  }
};

export const createMovie = async (movie: Partial<Movie>): Promise<Movie> => {
  try {
    const res = await movieApi.post<{ result: Movie }>(`${API_URL}`, movie);
    return res.data.result;
  } catch (error) {
    throw handleMovieError(error);
  }
};

export const updateMovie = async (id: string, movie: Partial<Movie>): Promise<Movie> => {
  try {
    const res = await movieApi.put<{ result: Movie }>(`${API_URL}/${id}`, movie);
    return res.data.result;
  } catch (error) {
    throw handleMovieError(error);
  }
};

export const deleteMovie = async (id: string): Promise<{ message: string }> => {
  try {
    const res = await movieApi.delete<{ message: string }>(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    throw handleMovieError(error);
  }
};