"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Maximize, Download, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { SAMPLE_VIDEOS } from "@/lib/constants";

interface VideoPreviewProps {
  selectedClip?: any;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
}

export function VideoPreview({ selectedClip, currentTime: externalTime, onTimeUpdate }: VideoPreviewProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(externalTime || 0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [useSample, setUseSample] = useState(true);
  const currentProject = useAppStore((state) => state.currentProject);
  const currentStep = useAppStore((state) => state.currentStep);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Sync external time from timeline
  useEffect(() => {
    if (externalTime !== undefined && Math.abs(externalTime - currentTime) > 0.1) {
      setCurrentTime(externalTime);
      if (videoRef.current) {
        videoRef.current.currentTime = externalTime;
      }
    }
  }, [externalTime]);
  
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

  // Get video URL from selected clip or project or use sample
  const clipVideoUrl = selectedClip?.url;
  // @ts-ignore - tracks might not exist on base Project type but exists at runtime
  const projectVideoUrl = currentProject?.tracks?.[0]?.video_files?.[0]?.url;
  const videoUrl = clipVideoUrl || projectVideoUrl || (useSample ? SAMPLE_VIDEOS.BIG_BUCK_BUNNY : null);

  // Update video volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);
  
  // Update parent time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime;
      setCurrentTime(newTime);
      onTimeUpdate?.(newTime);
    }
  };

  return (
    <Card className="flex h-full flex-col bg-zinc-900 border-zinc-800">
      {/* Video player area */}
      <div className="relative flex-1 bg-zinc-950 flex items-center justify-center">
        {/* Selected clip info */}
        {selectedClip && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-[#B4E031]/30">
            <p className="text-xs text-[#B4E031] font-medium mb-1">📹 Selected Clip</p>
            <p className="text-sm font-medium text-white">{selectedClip.filename}</p>
            <p className="text-xs text-zinc-400 mt-1">
              {selectedClip.duration.toFixed(1)}s · {selectedClip.type}
            </p>
          </div>
        )}
        
        {/* Current step info */}
        {!selectedClip && currentStep && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-xs text-zinc-400">Current Step</p>
            <p className="text-sm font-medium text-white">{currentStep.title}</p>
            <p className="text-xs text-zinc-500 mt-1">{currentStep.status}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {!projectVideoUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setUseSample(!useSample)}
              className="gap-2 border-zinc-700 bg-black/60 backdrop-blur-sm hover:bg-black/80"
            >
              <RefreshCw className="h-4 w-4" />
              {useSample ? 'Hide Sample' : 'Show Sample'}
            </Button>
          )}
          {videoUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const a = document.createElement('a');
                a.href = videoUrl;
                a.download = 'video.mp4';
                a.click();
              }}
              className="gap-2 border-zinc-700 bg-black/60 backdrop-blur-sm hover:bg-black/80"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>

        {/* Video player or placeholder */}
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="max-w-full max-h-full rounded"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            crossOrigin="anonymous"
          />
        ) : (
          <div className="text-center text-zinc-600">
            <div className="mb-4 text-6xl">🎬</div>
            <p className="text-sm mb-2">
              {currentStep 
                ? currentStep.status === "in_progress" 
                  ? "Generating video..."
                  : "No video generated yet"
                : "No video available"}
            </p>
            {currentProject && (
              <div className="mt-4">
                <p className="text-xs text-zinc-700 mb-2">
                  Project: {currentProject.name}
                </p>
                <Button
                  size="sm"
                  onClick={() => setUseSample(true)}
                  className="bg-[#B4E031] text-black hover:bg-[#9fc928]"
                >
                  Load Sample Video
                </Button>
              </div>
            )}
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
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setVolume(volume > 0 ? 0 : 1)}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 accent-[#B4E031]"
            />
          </div>

          {/* Fullscreen */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => {
              if (videoRef.current) {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  videoRef.current.requestFullscreen();
                }
              }
            }}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </Card>
  );
}
