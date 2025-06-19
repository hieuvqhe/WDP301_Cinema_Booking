import axios from 'axios';
import type { Showtime } from '../types/Showtime.type';

const BASE_URL = 'https://bookmovie-5n6n.onrender.com';
const API_URL = '/cinema/showtimes';

// Create axios instance for showtime requests
const showtimeApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Handle showtime API errors
const handleShowtimeError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    if (status === 401) {
      throw new Error('Unauthorized. Please login.');
    } else if (status === 403) {
      throw new Error('Access denied.');
    } else if (status === 404) {
      throw new Error(message || 'Showtime not found.');
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

export const getShowtimes = async (): Promise<Showtime[]> => {
  try {
    const res = await showtimeApi.get<{ showtimes: Showtime[] }>(API_URL);
    return res.data.showtimes;
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

export const createShowtime = async (data: Partial<Showtime>): Promise<Showtime> => {
  try {
    const res = await showtimeApi.post<{ result: Showtime }>(API_URL, data);
    return res.data.result;
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

export const getShowtimeById = async (showtime_id: string): Promise<Showtime> => {
  try {
    const res = await showtimeApi.get<{ result: Showtime }>(`${API_URL}/${showtime_id}`);
    return res.data.result;
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

export const updateShowtime = async (showtime_id: string, data: Partial<Showtime>): Promise<Showtime> => {
  try {
    const res = await showtimeApi.put<{ result: Showtime }>(`${API_URL}/${showtime_id}`, data);
    return res.data.result;
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

export const deleteShowtime = async (showtime_id: string): Promise<{ message: string }> => {
  try {
    const res = await showtimeApi.delete<{ message: string }>(`${API_URL}/${showtime_id}`);
    return res.data;
  } catch (error) {
    throw handleShowtimeError(error);
  }
};

export const getLockedSeats = async (showtime_id: string): Promise<any[]> => {
  try {
    const res = await showtimeApi.get<{ locked_seats: any[] }>(`${API_URL}/${showtime_id}/locked-seats`);
    return res.data.locked_seats;
  } catch (error) {
    throw handleShowtimeError(error);
  }
};