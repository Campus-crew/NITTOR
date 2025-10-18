"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Scissors,
  FastForward,
  Rewind,
  Plus,
  Video,
  Music,
  Type,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Track {
  id: string;
  type: "video" | "audio" | "text";
  name: string;
  clips: Clip[];
}

interface Clip {
  id: string;
  start: number;
  duration: number;
  content: string;
}

export function TimelineEditor() {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: "video-1",
      type: "video",
      name: "Video",
      clips: [
        { id: "v1", start: 0, duration: 5, content: "Scene 1" },
      ],
    },
  ]);

  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [audioTrackCount, setAudioTrackCount] = useState(0);
  const [textTrackCount, setTextTrackCount] = useState(0);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast.error("Please select an audio file");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File too large (max 50MB)");
        return;
      }
      
      const newCount = audioTrackCount + 1;
      // Add audio track with the uploaded file
      setTracks([
        ...tracks,
        {
          id: `audio-${newCount}`,
          type: "audio",
          name: `Audio ${newCount}`,
          clips: [
            {
              id: `audio-clip-${newCount}`,
              start: 0,
              duration: 10,
              content: file.name.replace(/\.[^/.]+$/, ""),
            },
          ],
        },
      ]);
      setAudioTrackCount(newCount);
      toast.success(`Audio "${file.name}" added`);
    }
    // Reset input to allow selecting the same file again
    e.target.value = "";
  };

  const addAudioTrack = () => {
    audioInputRef.current?.click();
  };

  const addTextTrack = () => {
    const text = prompt("Enter text to overlay:");
    if (text && text.trim()) {
      const newCount = textTrackCount + 1;
      // Add text track
      setTracks([
        ...tracks,
        {
          id: `text-${newCount}`,
          type: "text",
          name: `Text ${newCount}`,
          clips: [
            {
              id: `text-clip-${newCount}`,
              start: 0,
              duration: 5,
              content: text.trim(),
            },
          ],
        },
      ]);
      setTextTrackCount(newCount);
      toast.success("Text track added");
    }
  };

  const removeTrack = (trackId: string) => {
    setTracks(tracks.filter((t) => t.id !== trackId));
    toast.success("Track removed");
  };

  const getTrackIcon = (type: Track["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      case "text":
        return <Type className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col bg-zinc-900">
      {/* Hidden audio input */}
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        className="hidden"
      />
      
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 p-3">
        <Button
          size="sm"
          variant="outline"
          className="gap-2 border-zinc-700 hover:bg-zinc-800"
        >
          <Scissors className="h-4 w-4" />
          Cut
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 border-zinc-700 hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          Insert
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 border-zinc-700 hover:bg-zinc-800"
        >
          <FastForward className="h-4 w-4" />
          Speed Up
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 border-zinc-700 hover:bg-zinc-800"
        >
          <Rewind className="h-4 w-4" />
          Slow Down
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 border-zinc-700 hover:bg-zinc-800 text-xs h-7"
          onClick={addAudioTrack}
        >
          <Music className="h-3.5 w-3.5" />
          Add Audio Track
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 border-zinc-700 hover:bg-zinc-800 text-xs h-7"
          onClick={addTextTrack}
        >
          <Type className="h-3.5 w-3.5" />
          Add Text Track
        </Button>
        <div className="ml-auto text-xs text-zinc-500">
          Selected: {selectedClip ? "1 clip" : "none"}
        </div>
      </div>

      {/* Timeline tracks */}
      <div className="max-h-64 overflow-y-auto p-4">
        <div className="space-y-3">
          {tracks.map((track) => (
            <div key={track.id} className="flex gap-3">
              {/* Track label */}
              <div className="flex w-16 items-center gap-1 text-xs text-zinc-400">
                {getTrackIcon(track.type)}
                <span>{track.name}</span>
                {(track.type === "audio" || track.type === "text") && (
                  <button
                    onClick={() => removeTrack(track.id)}
                    className="ml-auto text-red-400 hover:text-red-300 transition-colors"
                    title="Remove track"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Track timeline */}
              <div className="relative flex-1 h-12 bg-zinc-800 rounded border border-zinc-700">
                {/* Time markers */}
                <div className="absolute inset-x-0 top-0 flex text-xs text-zinc-600">
                  {Array.from({ length: 13 }).map((_, i) => (
                    <div key={i} className="flex-1 border-l border-zinc-700 pl-1">
                      {i}s
                    </div>
                  ))}
                </div>

                {/* Clips */}
                <div className="absolute inset-0 top-4 flex items-center">
                  {track.clips.map((clip) => (
                    <div
                      key={clip.id}
                      className={`absolute h-8 rounded bg-[#B4E031] border-2 cursor-pointer transition-all ${
                        selectedClip === clip.id
                          ? "border-[#A0D020] shadow-lg"
                          : "border-[#8BC020]"
                      }`}
                      style={{
                        left: `${(clip.start / 12) * 100}%`,
                        width: `${(clip.duration / 12) * 100}%`,
                      }}
                      onClick={() => setSelectedClip(clip.id)}
                    >
                      <div className="flex h-full items-center justify-center text-xs font-medium text-black">
                        {clip.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
