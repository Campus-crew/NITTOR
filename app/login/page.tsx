"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin, useGoogleLogin } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = useLogin();
  const googleLogin = useGoogleLogin();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setError("");

    try {
      await login.mutateAsync({ email, password });
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      const error = err as Error;
      setError(error.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    googleLogin.mutate();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#B4E031] rounded-xl flex items-center justify-center">
            <span className="text-3xl font-bold text-black">n</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Sign in to nittor
          </h1>
          <p className="text-sm text-zinc-400">
            Welcome back! Please sign in to continue
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white gap-2"
            onClick={handleGoogleLogin}
            disabled={googleLogin.isPending}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>
              {googleLogin.isPending
                ? "Redirecting..."
                : "Continue with Google"}
            </span>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-zinc-900 px-2 text-zinc-500">or</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Email or Username Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Email or Username
          </label>
          <Input
            type="text"
            placeholder="john@example.com or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031]"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Password
          </label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={!email || !password || login.isPending}
          className="w-full bg-[#B4E031] hover:bg-[#A0D020] text-black font-semibold h-12 text-base"
        >
          {login.isPending ? "Signing in..." : "Sign in"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-white hover:text-[#B4E031] font-medium"
          >
            Sign up
          </a>
        </p>
      </Card>
    </div>
  );
}
