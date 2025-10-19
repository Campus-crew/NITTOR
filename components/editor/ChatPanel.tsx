"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useTextToImage, useImageToVideo } from "@/lib/hooks";

interface ChatPanelProps {
  currentTab: "scenario" | "video";
  mode: "description" | "images";
}

export function ChatPanel({ currentTab, mode }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const currentProject = useAppStore((state) => state.currentProject);
  const currentStep = useAppStore((state) => state.currentStep);
  
  const textToImage = useTextToImage();
  const imageToVideo = useImageToVideo();
  const handleGenerate = async () => {
    if (!input.trim() || !currentStep) return;
    
    setInput("");
    
    // Generate image based on step
    try {
      await textToImage.mutateAsync({
        prompt: input,
        quality: "1080p",
        enhance_prompt: true,
      });
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800 p-4">
        <h3 className="font-semibold text-white">Generate Content</h3>
        {currentStep && (
          <p className="text-xs text-zinc-400 mt-1">
            For: {currentStep.title}
          </p>
        )}
      </div>

      <div className="flex-1 p-4">
        <div className="text-center text-zinc-500 text-sm">
          {currentStep ? (
            <div>
              <p className="mb-2">Describe what you want to generate:</p>
              <p className="text-xs text-zinc-600">{currentStep.description}</p>
            </div>
          ) : (
            <p>Select a step from scenario to generate content</p>
          )}
        </div>
      </div>

      <div className="border-t border-zinc-800 p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder="Describe what you want to generate..."
            className="min-h-[80px] resize-none bg-zinc-900 border-zinc-700 text-white"
            disabled={!currentStep || textToImage.isPending}
          />
          <Button
            onClick={handleGenerate}
            size="sm"
            className="bg-[#B4E031] hover:bg-[#A0D020] text-black h-9 w-9 p-0 self-end"
            disabled={!currentStep || !input.trim() || textToImage.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
