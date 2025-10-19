"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Mail, CreditCard, LogOut, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function AccountPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link href="/" className="text-xl font-bold text-[#B4E031]">
              nittor
            </Link>
          </div>
          <Button
            variant="outline"
            className="gap-2 border-zinc-700 hover:bg-zinc-800 text-white"
            onClick={() => window.location.href = '/login'}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#B4E031] rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Profile</h2>
                <p className="text-sm text-zinc-400">Manage your personal information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <Button className="bg-[#B4E031] hover:bg-[#A0D020] text-black font-semibold">
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Subscription Section */}
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-[#B4E031]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Subscription</h2>
                <p className="text-sm text-zinc-400">Manage your billing and plan</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <p className="font-medium">Free Plan</p>
                  <p className="text-sm text-zinc-400">10 videos per month</p>
                </div>
                <Button
                  variant="outline"
                  className="border-[#B4E031] text-[#B4E031] hover:bg-[#B4E031] hover:text-black"
                >
                  Upgrade
                </Button>
              </div>

              <div className="text-sm text-zinc-400">
                <p>• 10 video generations remaining this month</p>
                <p>• Resets on January 1, 2025</p>
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-[#B4E031]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Security</h2>
                <p className="text-sm text-zinc-400">Manage your password and security settings</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800 text-white"
            >
              Change Password
            </Button>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-zinc-900 border-red-900/50 p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant="outline"
              className="border-red-700 text-red-400 hover:bg-red-900/20"
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
