"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleContinue = () => {
    console.log("Sign up with:", { name, email });
    // Here you would handle registration
  };

  const handleSocialSignUp = (provider: string) => {
    console.log("Sign up with:", provider);
    // Here you would handle social registration
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
            className="flex-1 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
            onClick={() => handleSocialSignUp("apple")}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
            onClick={() => handleSocialSignUp("google")}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
            onClick={() => handleSocialSignUp("microsoft")}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
            </svg>
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

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Full name
          </label>
          <Input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031]"
          />
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Email address
          </label>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleContinue();
              }
            }}
          />
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!email || !name}
          className="w-full bg-[#B4E031] hover:bg-[#A0D020] text-black font-semibold h-12 text-base"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* Terms */}
        <p className="text-xs text-zinc-500 text-center mt-4">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-zinc-400 hover:text-white underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-zinc-400 hover:text-white underline">
            Privacy Policy
          </a>
        </p>

        {/* Sign In Link */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-white hover:text-[#B4E031] font-medium">
            Sign in
          </a>
        </p>
      </Card>
    </div>
  );
}
