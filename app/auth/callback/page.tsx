"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleCallback } from "@/lib/hooks";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleCallback = useGoogleCallback();
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple calls
    if (hasProcessed.current) return;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && !googleCallback.isPending) {
      hasProcessed.current = true;
      
      googleCallback.mutate(
        { code, state: state || undefined },
        {
          onSuccess: () => {
            // Redirect to dashboard after successful OAuth
            setTimeout(() => router.push("/dashboard"), 500);
          },
          onError: (error) => {
            // Show error and redirect to login after delay
            setError(error.message || "Authentication failed");
            setTimeout(() => router.push("/login"), 2000);
          },
        }
      );
    } else if (!code) {
      // No code, redirect to login
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="text-center max-w-md px-4">
        {error ? (
          <>
            <div className="mb-4 text-6xl">❌</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Authentication Failed
            </h1>
            <p className="text-zinc-400 mb-4">
              {error}
            </p>
            <p className="text-sm text-zinc-500">
              Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <div className="mb-4 text-6xl">🔐</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Completing Google Sign In
            </h1>
            <p className="text-zinc-400">
              Please wait while we verify your credentials...
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B4E031] border-t-transparent"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
