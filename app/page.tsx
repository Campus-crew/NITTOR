"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Home() {
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" style={{zIndex: -1}}></div>

      {/* Overlay to make text more readable */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Large "nittor" text with Flow-style font */}
        <h1 className="text-white text-[120px] md:text-[180px] lg:text-[220px] font-light tracking-tight leading-none mb-8 select-none">
          nittor
        </h1>

        {/* Tagline */}
        <p className="text-white/90 text-xl md:text-2xl font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Where the next wave of storytelling happens
        </p>

        {/* CTA Button */}
        <Link 
          href="/projects"
          className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-medium text-base transition-all backdrop-blur-sm border border-white/20"
        >
          Create with nittor
        </Link>
      </div>
    </div>
  );
}
