"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ModeSelector } from "@/components/editor/ModeSelector";
import { ChatPanel } from "@/components/editor/ChatPanel";
import { VideoPreview } from "@/components/editor/VideoPreview";
import { TimelineEditor } from "@/components/editor/TimelineEditor";
import { SceneList } from "@/components/editor/SceneList";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";

export default function GeneratePage() {
  const [mode, setMode] = useState<"description" | "images">("description");
  const [currentTab, setCurrentTab] = useState<"scenario" | "video">("scenario");

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-[#B4E031]">
            nittor
          </Link>
          <div className="h-6 w-px bg-zinc-700" />
          <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as "scenario" | "video")}>
            <TabsList className="bg-zinc-900">
              <TabsTrigger value="scenario">Scenario</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-3">
          <ModeSelector mode={mode} onModeChange={setMode} />
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={() => window.location.href = '/login'}
            title="Account"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Chat - динамическая ширина */}
        <div className={currentTab === "scenario" ? "w-[400px] border-r border-zinc-800 flex flex-col" : "w-72 border-r border-zinc-800 flex flex-col"}>
          <ChatPanel currentTab={currentTab} mode={mode} />
        </div>

        {/* Middle panel: Preview + Timeline */}
        <div className="flex flex-1 flex-col">
          {/* Video preview - динамический размер в зависимости от вкладки */}
          <div className={currentTab === "video" ? "flex-[3] overflow-auto p-6" : "flex-[2] overflow-auto p-6"}>
            <VideoPreview />
          </div>

          {/* Timeline */}
          <div className="flex-[1] border-t border-zinc-800">
            <TimelineEditor />
          </div>
        </div>

        {/* Right panel: Scene list */}
        {currentTab === "video" && (
          <div className="w-72 border-l border-zinc-800 p-4 overflow-y-auto">
            <SceneList />
          </div>
        )}
      </div>
    </div>
  );
}
