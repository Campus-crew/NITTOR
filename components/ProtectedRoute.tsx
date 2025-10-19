"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    // If not loading and no user (or error), redirect to login
    if (!isLoading && (!user || error)) {
      router.push("/login");
    }
  }, [user, isLoading, error, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, show nothing (will redirect)
  if (!user || error) {
    return null;
  }

  // User is authenticated, show children
  return <>{children}</>;
}
