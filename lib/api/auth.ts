/**
 * Authentication API
 */

import { apiClient, tokenManager, unwrapApiResponse } from "./client";
import type { User, UserCreate, UserLogin, Token } from "@/lib/types/api";

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: UserCreate): Promise<User> => {
    const response = await apiClient.post<User>("/auth/register", data);
    return unwrapApiResponse(response);
  },

  /**
   * Login with email and password
   */
  login: async (data: UserLogin): Promise<Token> => {
    const response = await apiClient.post<Token>("/auth/login", {
      email: data.email,
      password: data.password,
    });
    const token = await unwrapApiResponse(response);
    tokenManager.setToken(token.access_token);
    return token;
  },

  /**
   * Get Google OAuth login URL
   */
  getGoogleLoginUrl: async (): Promise<{ url: string }> => {
    const response = await apiClient.get<{ authorization_url: string }>(
      "/auth/google/login"
    );
    const data = await unwrapApiResponse(response);
    return { url: data.authorization_url };
  },

  /**
   * Handle Google OAuth callback
   */
  handleGoogleCallback: async (
    code: string,
    state?: string
  ): Promise<Token> => {
    const params = new URLSearchParams({ code });
    if (state) params.append("state", state);

    const response = await apiClient.get<Token>(
      `/auth/callback?${params.toString()}`
    );
    const token = await unwrapApiResponse(response);
    // Store token
    tokenManager.setToken(token.access_token);
    return token;
  },

  /**
   * Get current user info
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return unwrapApiResponse(response);
  },

  /**
   * Get user credits
   */
  getCredits: async (): Promise<{ credits: number }> => {
    const response = await apiClient.get<{ credits: number }>("/auth/credits");
    return unwrapApiResponse(response);
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
    tokenManager.removeToken();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenManager.hasToken();
  },
};
