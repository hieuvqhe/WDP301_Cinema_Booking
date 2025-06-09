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
      // Check if it's a network error or server error
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      // Handle different status codes
      const status = error.response?.status;
      const message = error.response?.data?.message;
      
      if (status === 400) {
        throw new Error(message || 'Invalid registration data. Please check your information.');
      } else if (status === 409) {
        throw new Error(message || 'Email already exists. Please use a different email.');
      } else if (status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(message || 'Failed to send verification email. Please try again.');
      }
    }
    throw new Error('Failed to send verification email. Please try again.');
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

// API for resending OTP verification code
export const resendOtpCode = async (email: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/resend-otp`,
      { email }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      
      if (status === 404) {
        throw new Error('Email not found. Please register first.');
      } else if (status === 429) {
        throw new Error('Too many requests. Please wait before requesting a new code.');
      } else {
        throw new Error(message || 'Failed to send verification code');
      }
    }
    throw new Error('Failed to send verification code');
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