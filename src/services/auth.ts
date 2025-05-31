// API Endpoints voor Authenticatie
export const API_ENDPOINTS = {
  // Basis URL (pas deze aan naar je backend URL)
  BASE_URL: 'http://127.0.0.1:8000/api',

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
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  // Registreren
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  },

  // Gebruikersgegevens ophalen
  async getUser(): Promise<UserResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.USER}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return response.json();
  },

  // Uitloggen
  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });
    } catch (error) {
      throw error;
    }
  }
}; 