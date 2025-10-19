/**
 * API Client
 * Base configuration and interceptors for API requests
 */

import type { ApiResponse } from "@/lib/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://20.170.114.8:8000";

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("access_token", token);
  },

  removeToken: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
  },

  hasToken: (): boolean => {
    return !!tokenManager.getToken();
  },
};

// API Client class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = tokenManager.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        tokenManager.removeToken();
        // Redirect to login if on client side
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Unauthorized - please login again");
      }

      // Parse response
      let data: T | undefined;
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await response.json();
      }

      // Handle error responses
      if (!response.ok) {
        return {
          status: response.status,
          error: (data as any)?.detail || `Request failed with status ${response.status}`,
          data,
        };
      }

      return {
        status: response.status,
        data,
      };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        status: 0,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Helper function to handle API responses with error throwing
export async function unwrapApiResponse<T>(
  response: ApiResponse<T>
): Promise<T> {
  if (response.error || !response.data) {
    // Handle different error types
    let errorMessage = "Unknown error";
    const statusCode = response.status || 0;
    
    // Log the full error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error("API Error Response:", response);
    }
    
    if (typeof response.error === 'string') {
      errorMessage = response.error;
    } else if (response.error) {
      // Check for detail field
      if (typeof response.error.detail === 'string') {
        errorMessage = response.error.detail;
      } else if (Array.isArray(response.error.detail)) {
        // Validation errors array
        errorMessage = response.error.detail
          .map((err: any) => err.msg || err.message || JSON.stringify(err))
          .join(', ');
      } else if (response.error.message) {
        errorMessage = response.error.message;
      } else {
        errorMessage = JSON.stringify(response.error);
      }
    }
    
    // Include status code for better error handling
    const fullMessage = statusCode ? `[${statusCode}] ${errorMessage}` : errorMessage;
    
    if (process.env.NODE_ENV === 'development') {
      console.error("API Error Message:", fullMessage);
    }
    
    throw new Error(fullMessage);
  }
  
  // If data is null or undefined, throw error
  if (!response.data) {
    if (process.env.NODE_ENV === 'development') {
      console.error("API Response missing data:", response);
    }
    throw new Error("API response missing data");
  }
  
  return response.data;
}
