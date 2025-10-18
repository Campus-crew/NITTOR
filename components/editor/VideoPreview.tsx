"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Maximize, Download } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useEditorStore } from "@/lib/store";

export function VideoPreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { scenes, currentSceneId } = useEditorStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't trigger shortcuts when typing
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause();
            } else {
              videoRef.current.play();
            }
          }
          setIsPlaying((prev) => !prev);
          break;
        case "k":
          e.preventDefault();
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause();
            } else {
              videoRef.current.play();
            }
          }
          setIsPlaying((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying]);

  const currentScene = scenes.find((s) => s.id === currentSceneId);

  return (
    <Card className="flex h-full flex-col bg-zinc-900 border-zinc-800">
      {/* Video player area */}
      <div className="relative flex-1 bg-zinc-950 flex items-center justify-center">
        {/* Current scene info */}
        {currentScene && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-xs text-zinc-400">Current Scene</p>
            <p className="text-sm font-medium text-white">{currentScene.title}</p>
          </div>
        )}

        {/* Download button */}
        {currentScene?.videoUrl && (
          <Button
            size="sm"
            variant="outline"
            className="absolute top-4 right-4 gap-2 border-zinc-700 bg-black/60 backdrop-blur-sm hover:bg-black/80"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}

        {/* Video player or placeholder */}
        {currentScene?.videoUrl ? (
          <video
            ref={videoRef}
            src={currentScene.videoUrl}
            className="max-w-full max-h-full"
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <div className="text-center text-zinc-600">
            <div className="mb-4 text-6xl">🎬</div>
            <p className="text-sm">
              {currentScene 
                ? currentScene.status === "generating" 
                  ? "Generating video..."
                  : "Start frame generation"
                : "Generated video will appear here"}
            </p>
          </div>
        )}

        {/* Player controls overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 rounded-lg bg-black/60 p-3 backdrop-blur-sm">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => {
              if (videoRef.current) {
                if (isPlaying) {
                  videoRef.current.pause();
                } else {
                  videoRef.current.play();
                }
              }
              setIsPlaying(!isPlaying);
            }}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Progress bar */}
          <div className="flex-1">
            <div className="h-1 rounded-full bg-zinc-700">
              <div 
                className="h-full rounded-full bg-[#B4E031]" 
                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>
          </div>

          {/* Time */}
          <span className="text-xs text-white">
            {formatTime(currentTime)} / {formatTime(duration || 0)}
          </span>

          {/* Volume */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <Volume2 className="h-4 w-4" />
          </Button>

          {/* Fullscreen */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </Card>
  );
}
