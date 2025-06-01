
import axios from 'axios';
import type { 
  LoginResponse, 
  RegisterResponse, 
  RegisterUserType, 
  UserLoginType,
  OtpRegisterType
} from '../types/User.type';

const BASE_URL = 'https://bookmovie-5n6n.onrender.com';

// API for user registration
export const registerUser = async (userData: RegisterUserType) => {
  try {
    const response = await axios.post<RegisterResponse>(
      `${BASE_URL}/users/register`,
      userData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
};

// API for OTP verification after registration
export const verifyRegistration = async ({ email, otpVerify }: OtpRegisterType) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/verify-registration`,
      { email, code: otpVerify }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
    throw new Error('OTP verification failed');
  }
};

// API for user login
export const loginUser = async (credentials: UserLoginType) => {
  try {
    const response = await axios.post<LoginResponse>(
      `${BASE_URL}/users/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};

// Helper function to store authentication tokens
export const storeAuthToken = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken);
};

// Helper function to get the stored authentication token
export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Helper function to remove the authentication token (logout)
export const removeAuthToken = () => {
  localStorage.removeItem('accessToken');
};

// Create authenticated axios instance with token
export const createAuthenticatedRequest = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};