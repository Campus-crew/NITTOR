"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

export default function FeaturesPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Video background */}
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedData={() => console.log("Video loaded successfully")}
        onError={(e) => console.error("Video error:", e)}
      >
        <source src="https://d3u0tzju9qaucj.cloudfront.net/bc7c962c-df80-4e8f-a0bb-a60a92385e32/4ba6d9af-cf5a-4bfa-98f5-dc3b405682bb.mp4" type="video/mp4" />
      </video>
      
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" style={{zIndex: -1}}></div>
      
      {/* Overlay to make text more readable */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <main className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        {/* Logo/Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-12 w-12 text-[#B4E031]" />
            <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
              nittor
            </h1>
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Where the next wave of storytelling happens
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/generate">
            <Button 
              size="lg" 
              className="bg-[#B4E031] hover:bg-[#A0D020] text-black font-semibold px-8 py-6 text-lg rounded-full transition-all hover:scale-105"
            >
              Create Project
            </Button>
          </Link>
          <Link href="/projects">
            <Button 
              size="lg" 
              variant="outline"
              className="border-[#B4E031] text-[#B4E031] hover:bg-[#B4E031] hover:text-black font-semibold px-8 py-6 text-lg rounded-full transition-all hover:scale-105"
            >
              Explore Projects
            </Button>
          </Link>
        </div>

        {/* Feature hints */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <div className="text-4xl">🎬</div>
            <h3 className="font-semibold text-white">Scenario Generation</h3>
            <p className="text-sm">AI creates a script based on your topic</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <div className="text-4xl">🎨</div>
            <h3 className="font-semibold text-white">Frame Creation</h3>
            <p className="text-sm">Generate video from description or images</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <div className="text-4xl">✂️</div>
            <h3 className="font-semibold text-white">Editing</h3>
            <p className="text-sm">Edit, cut, add audio</p>
          </div>
        </div>
      </main>
    </div>
  );
}
