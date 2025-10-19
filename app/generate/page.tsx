"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function GeneratePage() {
  const router = useRouter();
  const { data: user, isLoading, error } = useCurrentUser();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && (!user || error)) {
      router.push("/login");
    }
  }, [user, error, isLoading, router]);

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

  if (!user || error) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="mx-auto max-w-6xl">
        <Card className="border-zinc-800 bg-zinc-900 p-8">
          <div className="text-center">
            <Zap className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
            <h1 className="mb-4 text-3xl font-bold text-white">
              AI Video Generation
            </h1>
            <p className="mb-8 text-zinc-400">
              Create stunning videos with AI-powered tools
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push("/projects")}
              >
                Go to Projects
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-700"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
