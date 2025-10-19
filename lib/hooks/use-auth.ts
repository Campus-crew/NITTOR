/**
 * Authentication Hooks
 * React Query hooks for authentication operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import type { User, UserCreate, UserLogin } from "@/lib/types/api";

/**
 * Get current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get user credits
 */
export function useCredits() {
  return useQuery({
    queryKey: ["auth", "credits"],
    queryFn: () => authApi.getCredits(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Register a new user
 * После регистрации автоматически логинит пользователя
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserCreate) => {
      // 1. Регистрируем пользователя
      const user = await authApi.register(data);
      
      // 2. Автоматически логинимся
      if (data.email && data.password) {
        await authApi.login({
          email: data.email,
          password: data.password,
        });
      }
      
      return user;
    },
    onSuccess: () => {
      toast.success("Registration successful! You are now logged in.");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error: Error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });
}

/**
 * Login with email and password
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserLogin) => authApi.login(data),
    onSuccess: () => {
      toast.success("Login successful!");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      // Fetch user data after login
      queryClient.prefetchQuery({
        queryKey: ["auth", "me"],
        queryFn: () => authApi.getCurrentUser(),
      });
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });
}

/**
 * Logout current user
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.clear();
      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
    onError: (error: Error) => {
      toast.error(`Logout failed: ${error.message}`);
    },
  });
}

/**
 * Get Google OAuth login URL
 */
export function useGoogleLogin() {
  return useMutation({
    mutationFn: () => authApi.getGoogleLoginUrl(),
    onSuccess: (data) => {
      // Redirect to Google OAuth
      if (typeof window !== "undefined" && data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast.error(`Google login failed: ${error.message}`);
    },
  });
}

/**
 * Handle Google OAuth callback
 */
export function useGoogleCallback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, state }: { code: string; state?: string }) =>
      authApi.handleGoogleCallback(code, state),
    onSuccess: () => {
      toast.success("Google login successful!");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      // Prefetch user data
      queryClient.prefetchQuery({
        queryKey: ["auth", "me"],
        queryFn: () => authApi.getCurrentUser(),
      });
      // Note: redirect handled by callback page
    },
    onError: (error: Error) => {
      toast.error(`Google login failed: ${error.message}`);
    },
  });
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  return authApi.isAuthenticated();
}
