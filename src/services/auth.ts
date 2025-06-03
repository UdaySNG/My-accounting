import { apiClient } from './api'
import { useAuthStore } from '../stores/auth'

// API Endpoints voor Authenticatie
export const API_ENDPOINTS = {
  // Basis URL (pas deze aan naar je backend URL)
  BASE_URL: 'http://127.0.0.1:8001/api',

  // Authenticatie endpoints
  AUTH: {
    REGISTER: '/register',
    LOGIN: '/login',
    LOGOUT: '/logout',
    USER: '/user',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password'
  }
};

// Types voor requests en responses
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}

// Auth service met alle authenticatie functies
export const authService = {
  // Inloggen
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const data = response.data;
      
      // Store token and user data using the auth store
      if (data.data && data.data.token) {
        const authStore = useAuthStore();
        authStore.setAuth(data.data.token, data.data.user);
        console.log('Token stored:', data.data.token);
      } else {
        console.error('No token in response:', data);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Registreren
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  // Gebruikersgegevens ophalen
  async getUser(): Promise<UserResponse> {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.USER);
    return response.data;
  },

  // Uitloggen
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      const authStore = useAuthStore();
      authStore.clearAuth();
      console.log('Token and user data removed');
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }
}; 