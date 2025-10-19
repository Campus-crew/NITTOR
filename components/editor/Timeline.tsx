"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Trash2,
  Copy,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { TrackWithFiles } from "@/lib/types/api";
import {
  useCreateTrackVideoFile,
  useCreateTrackAudioFile,
} from "@/lib/hooks";

interface TimelineClip {
  id: string;
  trackId: number;
  filename: string;
  url: string;
  type: "video" | "audio" | "image" | "text";
  startTime: number;
  duration: number;
  trimStart: number;
  trimEnd: number;
  speed: number;
  volume?: number;
  color?: string;
  textContent?: string;
  textStyle?: {
    fontSize: number;
    fontFamily: string;
    color: string;
    position: { x: number; y: number };
  };
}

interface TimelineProps {
  projectId: number;
  tracks: TrackWithFiles[];
  onClipSelect?: (clip: TimelineClip | null) => void;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
}

export function Timeline({
  projectId,
  tracks,
  onClipSelect,
  currentTime: externalTime,
  onTimeUpdate,
}: TimelineProps) {
  const createVideoFile = useCreateTrackVideoFile();
  const createAudioFile = useCreateTrackAudioFile();

  const [clips, setClips] = useState<TimelineClip[]>([]);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(externalTime || 0);
  const [zoom, setZoom] = useState(1);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  useEffect(() => {
    if (externalTime !== undefined) {
      setCurrentTime(externalTime);
    }
  }, [externalTime, currentTime]);
  const [draggingClipId, setDraggingClipId] = useState<string | null>(null);
  const [resizingClip, setResizingClip] = useState<{
    id: string;
    side: "left" | "right";
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    clipId: string;
  } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const PIXELS_PER_SECOND = 50 * zoom;
  const TRACK_HEIGHT = 80;
  const [, setIsDraggingPlayhead] = useState(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;

      e.preventDefault();

      const container = scrollContainerRef.current;
      if (!container) return;

      // Get mouse position relative to container
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left + container.scrollLeft;

      // Calculate new zoom
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.5, Math.min(3, zoom + delta));

      // Calculate scroll adjustment to keep mouse position
      const zoomRatio = newZoom / zoom;
      const newScrollLeft = mouseX * zoomRatio - (e.clientX - rect.left);

      setZoom(newZoom);

      // Adjust scroll position after zoom changes
      requestAnimationFrame(() => {
        if (container) {
          container.scrollLeft = newScrollLeft;
        }
      });
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [zoom]);

  // Load clips from tracks (backend data)
  useEffect(() => {
    const loadedClips: TimelineClip[] = [];
    
    tracks.forEach(track => {
      // Load video files
      track.video_files?.forEach(videoFile => {
        loadedClips.push({
          id: `video-${videoFile.id}`,
          trackId: track.id,
          filename: videoFile.filename,
          url: videoFile.file_url,
          type: 'video',
          startTime: videoFile.start_time || 0,
          duration: videoFile.end_time ? (videoFile.end_time - (videoFile.start_time || 0)) : videoFile.duration || 0,
          trimStart: 0,
          trimEnd: videoFile.duration || 0,
          speed: 1,
          volume: videoFile.volume || 1,
          color: '#3b82f6',
        });
      });
      
      // Load audio files
      track.audio_files?.forEach(audioFile => {
        loadedClips.push({
          id: `audio-${audioFile.id}`,
          trackId: track.id,
          filename: audioFile.filename,
          url: audioFile.file_url,
          type: 'audio',
          startTime: audioFile.start_time || 0,
          duration: audioFile.end_time ? (audioFile.end_time - (audioFile.start_time || 0)) : audioFile.duration || 0,
          trimStart: 0,
          trimEnd: audioFile.duration || 0,
          speed: 1,
          volume: audioFile.volume || 1,
          color: '#8b5cf6',
        });
      });
    });
    
    setClips(loadedClips);
  }, [tracks]);

  const handleDrop = async (
    e: React.DragEvent,
    trackId: number,
    dropTime: number
  ) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const file = JSON.parse(data);
      const duration = file.duration || 5;
      const startTime = Math.max(0, dropTime);
      const endTime = startTime + duration;
      
      // Save to backend
      if (file.type === 'video') {
        await createVideoFile.mutateAsync({
          projectId,
          trackId,
          data: {
            filename: file.filename,
            file_url: file.url,
            duration,
            start_time: startTime,
            end_time: endTime,
            volume: 1.0,
            resolution: file.resolution || '1920x1080',
            fps: file.fps || 30,
          },
        });
      } else if (file.type === 'audio') {
        await createAudioFile.mutateAsync({
          projectId,
          trackId,
          data: {
            filename: file.filename,
            file_url: file.url,
            duration,
            start_time: startTime,
            end_time: endTime,
            volume: 1.0,
            sample_rate: file.sample_rate || 44100,
            bitrate: file.bitrate || 192,
          },
        });
      }
      // Clips will be reloaded from tracks via useEffect
    } catch (error) {
      console.error("Failed to add file to timeline:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const getDropTime = (e: React.DragEvent, containerRect: DOMRect) => {
    const x = e.clientX - containerRect.left - 128; // Учитываем ширину track label
    return Math.max(0, x / PIXELS_PER_SECOND);
  };

  const handleDeleteClip = (clipId: string) => {
    setClips(clips.filter((c) => c.id !== clipId));
    setContextMenu(null);
  };

  const handleDuplicateClip = (clipId: string) => {
    const clip = clips.find((c) => c.id === clipId);
    if (!clip) return;
    const newClip = {
      ...clip,
      id: `clip-${Date.now()}`,
      startTime: clip.startTime + clip.duration + 0.5,
    };
    setClips([...clips, newClip]);
    setContextMenu(null);
  };

  const handleChangeSpeed = (clipId: string, speed: number) => {
    setClips(
      clips.map((c) =>
        c.id === clipId
          ? { ...c, speed, duration: (c.trimEnd - c.trimStart) / speed }
          : c
      )
    );
    setContextMenu(null);
  };

  const handleClipMouseDown = (e: React.MouseEvent, clip: TimelineClip) => {
    e.stopPropagation();
    if (e.button === 2) return; // Ignore right click

    setSelectedClipId(clip.id);
    onClipSelect?.(clip);

    const target = e.target as HTMLElement;
    const isResizeHandle = target.classList.contains("resize-handle");

    if (isResizeHandle) {
      const side = target.classList.contains("resize-left") ? "left" : "right";
      setResizingClip({ id: clip.id, side });
    } else {
      setDraggingClipId(clip.id);
      const clipElement = e.currentTarget as HTMLElement;
      const rect = clipElement.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setSelectedClipId(clip.id);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingClipId) {
        const clip = clips.find((c) => c.id === draggingClipId);
        if (!clip || !timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 128 - dragOffset.x;
        const newStartTime = Math.max(0, x / PIXELS_PER_SECOND);

        setClips(
          clips.map((c) =>
            c.id === draggingClipId ? { ...c, startTime: newStartTime } : c
          )
        );
      } else if (resizingClip) {
        const clip = clips.find((c) => c.id === resizingClip.id);
        if (!clip || !timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 128;
        const timeAtCursor = x / PIXELS_PER_SECOND;

        if (resizingClip.side === "left") {
          const newTrimStart = Math.max(
            0,
            Math.min(
              clip.trimEnd - 0.1,
              timeAtCursor - clip.startTime + clip.trimStart
            )
          );
          const newDuration = (clip.trimEnd - newTrimStart) / clip.speed;
          setClips(
            clips.map((c) =>
              c.id === resizingClip.id
                ? { ...c, trimStart: newTrimStart, duration: newDuration }
                : c
            )
          );
        } else {
          const newTrimEnd = Math.max(
            clip.trimStart + 0.1,
            timeAtCursor - clip.startTime + clip.trimStart
          );
          const newDuration = (newTrimEnd - clip.trimStart) / clip.speed;
          setClips(
            clips.map((c) =>
              c.id === resizingClip.id
                ? { ...c, trimEnd: newTrimEnd, duration: newDuration }
                : c
            )
          );
        }
      }
    },
    [draggingClipId, resizingClip, clips, dragOffset, PIXELS_PER_SECOND]
  );

  const handleMouseUp = () => {
    setDraggingClipId(null);
    setResizingClip(null);
  };


  useEffect(() => {
    if (draggingClipId || resizingClip) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggingClipId, resizingClip, clips, dragOffset, handleMouseMove]);

  const handleContextMenu = (e: React.MouseEvent, clipId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, clipId });
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener("click", handleClickOutside);
      return () => window.removeEventListener("click", handleClickOutside);
    }
  }, [contextMenu]);

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setCurrentTime((t) => t + 0.1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [playing]);

  const maxDuration = Math.max(
    30,
    ...clips.map((c) => c.startTime + c.duration)
  );

  return (
    <Card className="h-full border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col">
      <style jsx>{`
        .timeline-scroll::-webkit-scrollbar {
          height: 12px;
          width: 12px;
        }
        .timeline-scroll::-webkit-scrollbar-track {
          background: #18181b;
        }
        .timeline-scroll::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 6px;
          border: 2px solid #18181b;
        }
        .timeline-scroll::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 p-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">Timeline</h3>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-zinc-400 hover:text-white"
              onClick={() => setPlaying(!playing)}
            >
              {playing ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">
            {Math.floor(currentTime)}s / {Math.floor(maxDuration)}s
          </span>
          <span className="text-[10px] text-zinc-600 px-2 py-1 bg-zinc-800 rounded">
            Ctrl+Scroll to zoom
          </span>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              className="h-7 w-7 text-zinc-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
              className="h-7 w-7 text-zinc-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto timeline-scroll"
      >
        <div
          ref={timelineRef}
          className="relative min-h-full cursor-pointer"
          style={{ minWidth: `${maxDuration * PIXELS_PER_SECOND + 200}px` }}
          onClick={(e) => {
            if (
              e.target === e.currentTarget ||
              (e.target as HTMLElement).closest(".time-ruler-area")
            ) {
              const rect = timelineRef.current?.getBoundingClientRect();
              if (rect) {
                const clickX = e.clientX - rect.left - 128;
                const newTime = Math.max(0, clickX / PIXELS_PER_SECOND);
                setCurrentTime(newTime);
                onTimeUpdate?.(newTime);
              }
            }
          }}
        >
          {/* Time ruler */}
          <div className="time-ruler-area sticky top-0 z-10 flex h-8 items-center border-b border-zinc-800 bg-zinc-900 px-2">
            {Array.from({ length: Math.ceil(maxDuration) }).map((_, i) => (
              <div
                key={i}
                className="text-xs text-zinc-500"
                style={{ width: `${PIXELS_PER_SECOND}px`, textAlign: "left" }}
              >
                {i}s
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div className="relative">
            {tracks.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-center">
                <div>
                  <p className="text-sm text-zinc-500">No tracks yet</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Add a track to start
                  </p>
                </div>
              </div>
            ) : (
              tracks.map((track) => (
                <div
                  key={track.id}
                  className="group relative border-b border-zinc-800"
                  style={{ height: `${TRACK_HEIGHT}px` }}
                  onDrop={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const dropTime = getDropTime(e, rect);
                    handleDrop(e, track.id, dropTime);
                  }}
                  onDragOver={handleDragOver}
                >
                  {/* Track label */}
                  <div className="absolute left-0 top-0 z-10 flex h-full w-32 items-center border-r border-zinc-800 bg-zinc-900 px-3">
                    <span className="text-xs font-medium text-white truncate">
                      {track.name}
                    </span>
                  </div>

                  {/* Track content area */}
                  <div
                    className="absolute left-32 right-0 top-0 h-full bg-zinc-950/50"
                    onDrop={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const dropX = e.clientX - rect.left;
                      const dropTime = Math.max(0, dropX / PIXELS_PER_SECOND);
                      handleDrop(e, track.id, dropTime);
                    }}
                    onDragOver={handleDragOver}
                  >
                    {clips
                      .filter((c) => c.trackId === track.id)
                      .map((clip) => (
                        <div
                          key={clip.id}
                          className={`group/clip absolute top-2 rounded border-2 px-2 py-1 text-xs text-white transition-all hover:z-20 cursor-move select-none overflow-hidden ${
                            selectedClipId === clip.id
                              ? "border-white ring-2 ring-white/50"
                              : "border-zinc-600"
                          }`}
                          style={{
                            left: `${clip.startTime * PIXELS_PER_SECOND}px`,
                            width: `${clip.duration * PIXELS_PER_SECOND}px`,
                            height: `${TRACK_HEIGHT - 16}px`,
                            backgroundColor: clip.color,
                          }}
                          onMouseDown={(e) => handleClipMouseDown(e, clip)}
                          onContextMenu={(e) => handleContextMenu(e, clip.id)}
                        >
                          <div
                            className="resize-handle resize-left absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/0 hover:bg-white/20 transition-colors"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setResizingClip({ id: clip.id, side: "left" });
                            }}
                          />

                          <div className="flex h-full flex-col justify-between pointer-events-none">
                            <div className="flex items-start justify-between">
                              <span className="truncate font-medium text-xs">
                                {clip.filename}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] opacity-70">
                                {clip.duration.toFixed(1)}s
                              </span>
                              {clip.speed !== 1 && (
                                <span className="text-[10px] bg-black/40 px-1 rounded">
                                  {clip.speed}x
                                </span>
                              )}
                            </div>
                          </div>

                          <div
                            className="resize-handle resize-right absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/0 hover:bg-white/20 transition-colors"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setResizingClip({ id: clip.id, side: "right" });
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Playhead - Interactive */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 cursor-ew-resize"
            style={{ left: `${currentTime * PIXELS_PER_SECOND + 128}px` }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsDraggingPlayhead(true);

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const rect = timelineRef.current?.getBoundingClientRect();
                if (rect) {
                  const x = moveEvent.clientX - rect.left - 128;
                  const newTime = Math.max(0, x / PIXELS_PER_SECOND);
                  setCurrentTime(newTime);
                  onTimeUpdate?.(newTime);
                }
              };

              const handleMouseUp = () => {
                setIsDraggingPlayhead(false);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          >
            <div
              className="absolute -left-2 -top-1 h-3 w-5 bg-red-500 cursor-pointer"
              style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
            />
          </div>
        </div>
      </div>


      {contextMenu && (
        <div
          className="fixed z-50 min-w-[180px] rounded-lg border border-zinc-700 bg-zinc-900 p-1 shadow-xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-white hover:bg-zinc-800 transition-colors"
            onClick={() => handleDuplicateClip(contextMenu.clipId)}
          >
            <Copy className="h-4 w-4" />
            Duplicate
          </button>
          <button
            className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-white hover:bg-zinc-800 transition-colors"
            onClick={() => handleDeleteClip(contextMenu.clipId)}
          >
            <Trash2 className="h-4 w-4 text-red-400" />
            Delete
          </button>
          <div className="my-1 h-px bg-zinc-700" />
          <div className="px-3 py-1 text-xs text-zinc-500">Speed</div>
          <button
            className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-white hover:bg-zinc-800 transition-colors"
            onClick={() => handleChangeSpeed(contextMenu.clipId, 0.5)}
          >
            <Zap className="h-4 w-4" />
            0.5x (Slow)
          </button>
          <button
            className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-white hover:bg-zinc-800 transition-colors"
            onClick={() => handleChangeSpeed(contextMenu.clipId, 1)}
          >
            <Zap className="h-4 w-4" />
            1x (Normal)
          </button>
          <button
            className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-white hover:bg-zinc-800 transition-colors"
            onClick={() => handleChangeSpeed(contextMenu.clipId, 2)}
          >
            <Zap className="h-4 w-4" />
            2x (Fast)
          </button>
        </div>
      )}
    </Card>
  );
}
