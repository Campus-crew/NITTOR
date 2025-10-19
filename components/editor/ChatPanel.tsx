"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, ArrowDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGenerateScenario, useGenerateScene } from "@/lib/api";
import { useEditorStore } from "@/lib/store";
import { ImageUpload } from "./ImageUpload";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sceneComplete?: boolean;
}

interface ChatPanelProps {
  currentTab: "scenario" | "video";
  mode: "description" | "images";
}

export function ChatPanel({ currentTab, mode }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  
  const { keepTraits, setKeepTraits, setScenario, setScenes, traits, currentSceneId, setCurrentSceneId, scenes, updateScene } = useEditorStore();
  const generateScenarioMutation = useGenerateScenario();
  const generateSceneMutation = useGenerateScene();

  const handleSend = async () => {
    if (!input.trim() && uploadedImages.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input || `Загружено ${uploadedImages.length} изображений`,
    };

    setMessages([...messages, newMessage]);
    const userInput = input;
    setInput("");

    if (currentTab === "scenario") {
      // Generate scenario
      try {
        const result = await generateScenarioMutation.mutateAsync({
          topic: userInput,
        });

        if (result.success) {
          setScenario(result.scenario.topic);
          const newScenes = result.scenario.scenes.map((s) => ({
            ...s,
            status: "pending" as const,
          }));
          setScenes(newScenes);
          
          // Set first scene as current
          if (newScenes.length > 0) {
            setCurrentSceneId(newScenes[0].id);
          }

          const response: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: `Scenario created: "${result.scenario.topic}"\n\nScenes:\n${result.scenario.scenes
              .map((s, i) => `${i + 1}. ${s.title} (${s.durationSec}s) - ${s.description}`)
              .join("\n")}\n\nTotal duration: ${result.scenario.totalDuration}s\n\nSwitch to "Video" tab to start generating scenes.`,
          };
          setMessages((prev) => [...prev, response]);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Generate scene
      try {
        // Get current scene to use its AI-generated prompt if available
        const currentScene = scenes.find(s => s.id === currentSceneId);
        const scenePrompt = currentScene?.prompt;
        
        // Combine user input with AI-generated prompt
        const finalPrompt = userInput 
          ? `${userInput}${scenePrompt ? `. Scene context: ${scenePrompt}` : ''}`
          : scenePrompt || "Generate a video";
        
        const result = await generateSceneMutation.mutateAsync({
          sceneId: currentSceneId || "scene-1",
          mode: mode === "description" ? "text" : "images",
          prompt: finalPrompt,
          images: uploadedImages,
          traits: keepTraits ? traits : undefined,
        });

        if (result.success) {
          // Mark current scene as generating
          if (currentSceneId) {
            updateScene(currentSceneId, { status: "generating" });
          }
          
          const response: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: `Frame generation started (Job ID: ${result.jobId}). Check progress on the right.`,
            sceneComplete: true,
          };
          setMessages((prev) => [...prev, response]);
          setUploadedImages([]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleNextScene = () => {
    // Mark current scene as complete
    if (currentSceneId) {
      updateScene(currentSceneId, { status: "complete" });
    }
    
    // Find next pending scene
    const currentIndex = scenes.findIndex(s => s.id === currentSceneId);
    const nextScene = scenes.find((s, idx) => idx > currentIndex && s.status === "pending");
    
    if (nextScene) {
      setCurrentSceneId(nextScene.id);
      const nextSceneMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Moving to next scene: "${nextScene.title}"\n${nextScene.description}`,
      };
      setMessages([...messages, nextSceneMessage]);
      toast.success(`Ready for scene: ${nextScene.title}`);
    } else {
      const doneMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "All scenes completed! 🎉",
      };
      setMessages([...messages, doneMessage]);
      toast.success("All scenes completed!");
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="border-b border-zinc-800 p-4">
        <h2 className="font-semibold text-sm">
          {currentTab === "scenario" ? "Scenario Generation" : "Video Generation"}
        </h2>
        {currentTab === "video" && (
          <label className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={keepTraits}
              onChange={(e) => setKeepTraits(e.target.checked)}
              className="rounded border-zinc-600"
            />
            Keep common traits
          </label>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center text-xs text-zinc-500">
            {currentTab === "scenario"
              ? "Describe the topic or theme of the video, and AI will create a scenario"
              : "Describe the frame you want to generate"}
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "rounded-lg p-3",
              msg.role === "user"
                ? "ml-8 bg-[#B4E031]/20 text-white"
                : "mr-8 bg-zinc-800 text-zinc-100"
            )}
          >
            <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            {msg.sceneComplete && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2 gap-2 border-green-600 text-green-400 hover:bg-green-600/20 text-xs"
                onClick={handleNextScene}
              >
                <Check className="h-3.5 w-3.5" />
                Scene Done → Next
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4 space-y-3">
        {currentTab === "video" && mode === "images" && (
          <ImageUpload onImagesChange={setUploadedImages} />
        )}
        
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              currentTab === "scenario"
                ? "Describe video topic..."
                : mode === "description"
                ? "Describe frame..."
                : "Describe frame (optional)..."
            }
            className="min-h-[80px] resize-none bg-zinc-900 border-zinc-700"
            disabled={generateScenarioMutation.isPending || generateSceneMutation.isPending}
          />
          <Button
            onClick={handleSend}
            size="sm"
            className="bg-[#B4E031] hover:bg-[#A0D020] text-black h-9 w-9 p-0 self-end"
            disabled={generateScenarioMutation.isPending || generateSceneMutation.isPending}
          >
            {generateScenarioMutation.isPending || generateSceneMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {currentTab === "scenario" && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <ArrowDown className="h-3 w-3" />
            <span>After scenario, switch to "Video" tab</span>
          </div>
        )}
      </div>
    </div>
  );
}
