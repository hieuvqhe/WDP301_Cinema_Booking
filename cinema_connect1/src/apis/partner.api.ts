import axios from "axios";
import { getAuthToken } from "./user.api";


const BASE_URL = 'https://bookmovie-5n6n.onrender.com';

// Create authenticated axios instance for partners requests
const createPartnerRequest = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Create public axios instance for public partners endpoints
const createPublicPartnerRequest = () => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Handle movie API errors
const handlePartnerError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    if (status === 401) {
      throw new Error('Unauthorized. Please login.');
    } else if (status === 403) {
      throw new Error('Access denied. Insufficient privileges.');
    } else if (status === 404) {
      throw new Error(message || 'Partner not found.');
    } else if (status === 400) {
      throw new Error(message || 'Invalid request data.');
    } else if (status === 409) {
      throw new Error(message || 'Partner already exists.');
    } else if (status === 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error(message || 'Request failed.');
    }
  }
  throw new Error('Network error. Please check your connection.');
};


// ===============================
// PUBLIC MOVIE APIS
// ===============================

// Create a new partner (Admin only)
export const createPartner = async (partner: CreatePa): Promise<MovieResponse> => {
  try {
    const movieApi = createMovieRequest();
    const response = await movieApi.post<MovieResponse>('/cinema/movies', movieData);
    return response.data;
  } catch (error) {
    throw handleMovieError(error);
  }
};