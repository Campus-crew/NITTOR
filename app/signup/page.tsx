"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister, useGoogleLogin } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const register = useRegister();
  const googleLogin = useGoogleLogin();

  const handleRegister = async () => {
    if (!email || !username || !fullName || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError("");

    try {
      await register.mutateAsync({
        email,
        username,
        full_name: fullName,
        password,
        is_active: true,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
      const error = err as Error;
      setError(error.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignUp = () => {
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
            Create your nittor account
          </h1>
          <p className="text-sm text-zinc-400">
            Start creating AI videos in minutes
          </p>
        </div>

        {/* Social Sign Up Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white gap-2"
            onClick={handleGoogleSignUp}
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

        {/* Full Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Full name
          </label>
          <Input
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031]"
          />
        </div>

        {/* Username Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Username
          </label>
          <Input
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031]"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Email address
          </label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031]"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Password
          </label>
          <Input
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031]"
          />
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Confirm Password
          </label>
          <Input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRegister();
              }
            }}
          />
        </div>

        {/* Register Button */}
        <Button
          onClick={handleRegister}
          disabled={
            !email ||
            !username ||
            !fullName ||
            !password ||
            !confirmPassword ||
            register.isPending
          }
          className="w-full bg-[#B4E031] hover:bg-[#A0D020] text-black font-semibold h-12 text-base"
        >
          {register.isPending ? "Creating account..." : "Create account"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* Terms */}
        <p className="text-xs text-zinc-500 text-center mt-4">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-zinc-400 hover:text-white underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-zinc-400 hover:text-white underline"
          >
            Privacy Policy
          </a>
        </p>

        {/* Sign In Link */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-white hover:text-[#B4E031] font-medium"
          >
            Sign in
          </a>
        </p>
      </Card>
    </div>
  );
}
