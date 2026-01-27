// API client configuration
// In production (served by Node), keep it relative so the app works on a single port (e.g. http://localhost:8000)
// In dev, you can still set VITE_API_URL if you want, but leaving it empty works with Vite proxy.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Generic network error message shown to users when the backend cannot be reached
const NETWORK_ERROR_MESSAGE =
  'We are having trouble connecting right now. Please check your connection and try again in a moment.';

// Type definitions
export interface SignupRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface GoogleOAuthRequest {
  id_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  verification_code: string;
  new_password: string;
  confirm_password: string;
}

export interface Template {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// API functions
export const api = {
  // Auth endpoints
  signup: async (data: SignupRequest): Promise<ApiResponse<any>> => {
    try {
      // Normalize email, trim password and name
      const normalizedData = {
        email: String(data.email).trim().toLowerCase(),
        password: String(data.password).trim(),
        full_name: String(data.full_name).trim(),
      };

      console.log("📤 Sending signup request - Email:", normalizedData.email, "Password length:", normalizedData.password.length);

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normalizedData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.detail || result.message || 'Signup failed' };
      }

      return { data: result, message: result.message };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },

  signin: async (data: SigninRequest): Promise<ApiResponse<any>> => {
    try {
      // Normalize email and trim password
      const normalizedData = {
        email: String(data.email).trim().toLowerCase(),
        password: String(data.password).trim(),
      };

      console.log("📤 Sending login request - Email:", normalizedData.email, "Password length:", normalizedData.password.length);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normalizedData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        return {
          error:
            result.error ||
            result.message ||
            result.detail ||
            'Invalid email or password',
        };
      }
  
      return {
        data: result,
        message: result.message || 'Login successful',
      };
    } catch (error) {
      console.error('Signin error:', error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },
  
  // Templates endpoint
  searchTemplates: async (search?: string): Promise<ApiResponse<Template[]>> => {
    try {
      const token = localStorage.getItem('access_token');
      const url = new URL(`${API_BASE_URL}/api/templates`, window.location.origin);
      if (search) {
        url.searchParams.append('search', search);
      }

      const response = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      
      if (!response.ok) {
        return { error: 'Failed to fetch templates' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Search templates error:', error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // Google OAuth
  googleOAuth: async (data: GoogleOAuthRequest): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google_oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.detail || 'Google OAuth failed' };
      }

      return { data: result, message: 'Google authentication successful' };
    } catch (error) {
      console.error('Google OAuth error:', error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.detail || 'Failed to send verification code' };
      }

      return { data: result, message: result.message || 'Verification code sent to your email' };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },

  // Reset Password
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.detail || 'Failed to reset password' };
      }

      return { data: result, message: result.message || 'Password reset successfully' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },

  // n8n Import
  importToN8n: async (templateId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/n8n/import/${templateId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.detail || 'Failed to import template to n8n' };
      }

      return { data: result, message: result.message || 'Template imported successfully' };
    } catch (error) {
      console.error('n8n import error:', error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },

  // n8n Test Connection
  testN8nConnection: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/n8n/test`);

      const result = await response.json();

      if (!response.ok) {
        return { error: result.detail || 'Failed to connect to n8n' };
      }

      return { data: result, message: result.message || 'Connected to n8n successfully' };
    } catch (error) {
      console.error('n8n test connection error:', error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },

  // Posts endpoints
  createPost: async (formData: FormData): Promise<ApiResponse<any>> => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.detail || "Failed to create post" };
      }

      return { data: result, message: result.message || "Post created successfully" };
    } catch (error) {
      console.error("Create post error:", error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },

  getPosts: async (params?: { status?: string; platform?: string }): Promise<ApiResponse<any>> => {
    try {
      const token = localStorage.getItem("access_token");
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append("status", params.status);
      if (params?.platform) queryParams.append("platform", params.platform);

      const response = await fetch(`${API_BASE_URL}/api/posts?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return { error: "Failed to fetch posts" };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error("Get posts error:", error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },

  getPost: async (postId: number): Promise<ApiResponse<any>> => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return { error: "Failed to fetch post" };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error("Get post error:", error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },

  approvePost: async (postId: number, comment?: string): Promise<ApiResponse<any>> => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.detail || "Failed to approve post" };
      }

      return { data: result, message: result.message || "Post approved successfully" };
    } catch (error) {
      console.error("Approve post error:", error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },

  rejectPost: async (postId: number, comment?: string): Promise<ApiResponse<any>> => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.detail || "Failed to reject post" };
      }

      return { data: result, message: result.message || "Post rejected" };
    } catch (error) {
      console.error("Reject post error:", error);
      return { error: NETWORK_ERROR_MESSAGE };
    }
  },
};