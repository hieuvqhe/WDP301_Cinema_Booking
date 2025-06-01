export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: "staff" | "admin" | "customer";
  verify: "unverified" | 2 | "verified"; // 2=banned 
  avatar: string;
  created_at: string;
  updated_at: string;
  date_of_birth?: string;
  address?: Address;
  phone?: string;
}

export interface LoginResponse {
  message: string;
  result: {
    access_token: string;
    user: User;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface UserLoginType {
  email: string;
  password: string;
}

export interface RegisterUserType {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
  address: Address;
  phone: string;
}

export interface OtpRegisterType {
  email: string;
  otpVerify: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: File | null;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}

export interface GetProfileResponse {
  user: User;
}


export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

