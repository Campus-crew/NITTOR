"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Image, Video, Music, Trash2, Plus } from "lucide-react";
import type {
  ProjectFile,
  TrackVideoFile,
  TrackAudioFile,
} from "@/lib/types/api";
import { SAMPLE_VIDEOS } from "@/lib/constants";

// Video Thumbnail Component - показывает первый фрейм
function VideoThumbnail({ src, alt }: { src: string; alt: string }) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const handleLoadedData = () => {
      try {
        // Устанавливаем время на 0.1 секунду (первый фрейм)
        video.currentTime = 0.1;
      } catch (err) {
        console.error('Error setting video time:', err);
        setError(true);
      }
    };

    const handleSeeked = () => {
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Захватываем первый фрейм
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Конвертируем в data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setThumbnail(dataUrl);
      } catch (err) {
        console.error('Error capturing thumbnail:', err);
        setError(true);
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [src]);

  return (
    <>
      {/* Hidden video для захвата фрейма */}
      <video
        ref={videoRef}
        src={src}
        crossOrigin="anonymous"
        className="hidden"
        muted
        playsInline
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Показываем thumbnail или fallback */}
      {thumbnail && !error ? (
        <img
          src={thumbnail}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Video className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
      )}
    </>
  );
}

interface MediaPoolProps {
  projectId: number;
  files: ProjectFile[];
  videoFiles?: TrackVideoFile[];
  audioFiles?: TrackAudioFile[];
  onDelete?: (fileId: number) => void;
}

export function MediaPool({
  files,
  videoFiles = [],
  audioFiles = [],
  onDelete,
}: MediaPoolProps) {
  // Sample video для примера
  const sampleVideo = {
    id: 0,
    filename: "Big Buck Bunny (Sample)",
    file_url: SAMPLE_VIDEOS.BIG_BUCK_BUNNY,
    file_type: "video" as const,
    mediaType: "video" as const,
    uniqueId: "sample-video",
    duration: 596, // 9:56
  };

  // Объединяем все медиа файлы из бекенда + sample
  const allMedia = [
    sampleVideo, // Sample video всегда первым
    ...files.map((f) => ({
      ...f,
      mediaType: f.file_type,
      uniqueId: `file-${f.id}`,
    })),
    ...videoFiles.map((f) => ({
      ...f,
      mediaType: "video" as const,
      uniqueId: `video-${f.id}`,
      file_type: "video" as const,
    })),
    ...audioFiles.map((f) => ({
      ...f,
      mediaType: "audio" as const,
      uniqueId: `audio-${f.id}`,
      file_type: "audio" as const,
    })),
  ];

  // Фильтруем только валидные файлы с URL
  const validMedia = allMedia.filter((f) => f.file_url);

  type MediaFile = (typeof allMedia)[0];

  const handleDragStart = (e: React.DragEvent, file: MediaFile) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        id: file.id,
        type: file.mediaType,
        url: file.file_url,
        filename: file.filename,
        duration: "duration" in file ? file.duration : 0,
      })
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      default:
        return <Image className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-full border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <h3 className="text-sm font-semibold text-white">Media Pool</h3>
        <button className="px-2 py-1 text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {validMedia.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <div className="mb-2 text-4xl">📁</div>
              <p className="text-sm text-zinc-500">No media files yet</p>
              <p className="text-xs text-zinc-600 mt-1">
                Generate content to add files to the project
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {validMedia.map((file: MediaFile) => (
              <div
                key={file.uniqueId}
                draggable
                onDragStart={(e) => handleDragStart(e, file)}
                className="group relative cursor-move rounded border border-zinc-800 bg-zinc-950 p-2 transition-all hover:border-[#B4E031] hover:shadow-lg"
              >
                {/* Thumbnail */}
                {file.mediaType === "image" && file.file_url && (
                  <div className="mb-2 aspect-video overflow-hidden rounded bg-zinc-900">
                    <img
                      src={file.file_url}
                      alt={file.filename}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {file.mediaType === "video" && (
                  <div className="mb-2 relative aspect-video overflow-hidden rounded bg-gradient-to-br from-blue-900/50 to-blue-950/50 border border-blue-800/30">
                    {file.file_url ? (
                      <VideoThumbnail src={file.file_url} alt={file.filename} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Video className="h-8 w-8 text-blue-400" />
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white font-medium">
                      {"duration" in file && file.duration
                        ? `${Math.floor(file.duration / 60)}:${String(Math.floor(file.duration % 60)).padStart(2, '0')}`
                        : "VIDEO"}
                    </div>
                  </div>
                )}

                {file.mediaType === "audio" && (
                  <div className="mb-2 flex aspect-video items-center justify-center rounded bg-gradient-to-br from-purple-900/50 to-purple-950/50 border border-purple-800/30 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Music className="h-8 w-8 text-purple-400" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-[10px] text-white">
                      {"duration" in file && file.duration
                        ? `${file.duration.toFixed(1)}s`
                        : "AUDIO"}
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="flex items-start gap-2">
                  <div className="text-zinc-400">{getIcon(file.mediaType)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-medium text-white">
                      {file.filename}
                    </p>
                    {"duration" in file && file.duration && (
                      <p className="text-xs text-zinc-500">{file.duration}s</p>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                {onDelete && typeof file.id === "number" && (
                  <button
                    onClick={() => onDelete(file.id as number)}
                    className="absolute right-2 top-2 rounded bg-red-500/80 p-1 opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                )}

                {/* Drag indicator */}
                <div className="absolute inset-0 flex items-center justify-center rounded bg-[#B4E031]/90 opacity-0 transition-opacity group-active:opacity-100">
                  <p className="text-xs font-bold text-black">
                    Drag to timeline
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
