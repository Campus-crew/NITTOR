"use client";

import Link from "next/link";
import { useCurrentUser } from "@/lib/hooks";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function ProfileContent() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Первая буква имени или username для аватара
  const avatarLetter = (user.full_name || user.username || user.email || "U")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-normal hover:text-gray-300 transition-colors">
              nittor
            </Link>
            
            {/* Navigation link */}
            <Link 
              href="/projects" 
              className="text-gray-400 hover:text-lime-400 transition-colors font-medium"
            >
              Feed
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User avatar with profile link */}
            <Link 
              href="/profile"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-lime-400 text-black text-sm font-bold hover:bg-lime-500 transition-colors"
            >
              {avatarLetter}
            </Link>
          </div>
        </div>
      </header>

      {/* Profile content */}
      <main className="w-full px-12 py-6">
        {/* Profile header with banner and avatar */}
        <div className="mb-8">
          {/* Banner */}
          <div className="relative rounded-2xl overflow-hidden h-[240px] bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200 mb-[-60px] group cursor-pointer">
            {/* Green/yellow accent blobs */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-green-400 rounded-full blur-3xl opacity-40"></div>
            
            {/* Change Cover button - only visible on hover */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg font-medium transition-colors">
                Change Cover
              </button>
            </div>
          </div>
          
          {/* Avatar and user info */}
          <div className="relative px-6">
            <div className="flex items-end gap-4">
              {/* Avatar with green blob and hover effect */}
              <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-gray-300 via-gray-200 to-white text-white text-5xl font-medium border-4 border-black overflow-hidden group cursor-pointer">
                {/* Green/yellow accent blob in avatar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-yellow-300 rounded-full blur-xl opacity-60"></div>
                </div>
                <span className="relative z-10 text-gray-800 group-hover:opacity-0 transition-opacity">{avatarLetter}</span>
                
                {/* Hover overlay with change button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                </div>
              </div>
              
              {/* Username and edit button */}
              <div className="flex-1 flex items-center justify-between pb-2">
                <div>
                  <h1 className="text-3xl font-normal">{user.username || user.email}</h1>
                  {user.full_name && user.full_name !== user.username && (
                    <p className="text-sm text-gray-400 mt-1">{user.full_name}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-400">
                      Credits: <span className="text-lime-400 font-medium">{user.credits}</span>
                    </span>
                    {user.email && (
                      <span className="text-sm text-gray-500">{user.email}</span>
                    )}
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 px-6">
          <button className="px-6 py-2 bg-white text-black rounded-full font-medium">
            All
          </button>
          <button className="px-6 py-2 text-gray-400 hover:text-white transition-colors">
            Image
          </button>
          <button className="px-6 py-2 text-gray-400 hover:text-white transition-colors">
            Video
          </button>
          <button className="px-6 py-2 text-gray-400 hover:text-white transition-colors">
            Boards
          </button>
        </div>

        {/* Content area */}
        <div className="px-6">
          <div className="text-center py-20">
            <div className="mb-6">
              {/* Placeholder images */}
              <div className="flex justify-center gap-2 mb-6">
                <div className="w-24 h-24 bg-gray-800 rounded-lg"></div>
                <div className="w-24 h-24 bg-gray-800 rounded-lg"></div>
                <div className="w-24 h-24 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
            <h2 className="text-2xl font-normal mb-2">Create. Share. Inspire.</h2>
            <p className="text-gray-400 mb-6">
              Publish your generations and see how others<br />
              bring their ideas to life.
            </p>
            <button className="px-6 py-3 bg-lime-300 hover:bg-lime-400 text-black rounded-full font-medium transition-colors">
              Publish
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
