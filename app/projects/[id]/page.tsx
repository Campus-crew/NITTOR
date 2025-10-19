"use client";

import { use, useEffect, useState } from "react";
import { useProject, useCreateTrack } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Layers, Eye } from "lucide-react";
import { MediaPool } from "@/components/editor/MediaPool";
import { Timeline } from "@/components/editor/Timeline";
import { VideoPreview } from "@/components/editor/VideoPreview";
import { ScenarioPanel } from "@/components/scenario/ScenarioPanel";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MODELS, GENERATION_MODES } from "@/lib/constants";

function ProjectPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projectId = Number(id);
  const router = useRouter();

  const { data: project, isLoading } = useProject(projectId);
  const createTrack = useCreateTrack();
  
  const setCurrentProject = useAppStore((state) => state.setCurrentProject);

  // UI State
  const [mainView, setMainView] = useState<'mediapool' | 'preview'>('mediapool');
  const [generationMode, setGenerationMode] = useState<'text-to-video' | 'image-to-video' | 'edit-scenario'>('text-to-video');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('stable-diffusion');
  const [selectedClip, setSelectedClip] = useState<any>(null);
  const [timelineTime, setTimelineTime] = useState(0);

  useEffect(() => {
    if (project) setCurrentProject(project);
  }, [project, setCurrentProject]);

  // Auto-create fixed tracks (Video and Audio) if they don't exist
  useEffect(() => {
    if (project && project.tracks) {
      const hasVideoTrack = project.tracks.some(t => t.name.toLowerCase().includes('video'));
      const hasAudioTrack = project.tracks.some(t => t.name.toLowerCase().includes('audio'));
      
      // Create Video track if missing
      if (!hasVideoTrack) {
        createTrack.mutate({
          projectId,
          data: { 
            name: 'Video Track',
            order_index: 0,
          },
        });
      }
      
      // Create Audio track if missing
      if (!hasAudioTrack) {
        createTrack.mutate({
          projectId,
          data: { 
            name: 'Audio Track',
            order_index: 1,
          },
        });
      }
    }
  }, [project?.id]); // Only run when project ID changes

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-zinc-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-4xl">❌</div>
          <p className="text-zinc-400 mb-4">Project not found</p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/dashboard")}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-white">{project.name}</h1>
              {project.description && (
                <p className="text-xs text-zinc-400">{project.description}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 flex-shrink-0 border-r border-zinc-800 bg-zinc-900 flex flex-col">
          {/* Scenario Panel - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <ScenarioPanel projectId={projectId} />
          </div>

          {/* Generation Section - Fixed at Bottom */}
          <div className="border-t border-zinc-800 p-4 bg-zinc-900">
            {/* Mode & Model Selectors */}
            <div className="flex gap-2 mb-3">
              {/* Mode Selector */}
              <select
                value={generationMode}
                onChange={(e) => setGenerationMode(e.target.value as any)}
                className="flex-1 bg-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-xs font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B4E031]/50 hover:bg-zinc-750 transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1rem'
                }}
              >
                <option value="text-to-video">Text → Video</option>
                <option value="image-to-video">Image → Video</option>
              </select>

              {/* Model Selector */}
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="flex-1 bg-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-xs font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B4E031]/50 hover:bg-zinc-750 transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1rem'
                }}
              >
                <option value="kling">Kling</option>
                <option value="veo3">Veo 3</option>
                <option value="stable-diffusion">Stable Diffusion</option>
                <option value="runway">Runway</option>
              </select>
            </div>

            {/* Large Prompt Input with Send Button Inside */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && prompt.trim()) {
                    e.preventDefault();
                    console.log('Generate:', prompt);
                  }
                }}
                placeholder="Describe what you want to generate...\nShift+Enter for new line"
                rows={4}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 pr-12 text-sm text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:outline-none focus:ring-2 focus:ring-[#B4E031]/20 resize-none"
              />
              <button
                onClick={() => prompt.trim() && console.log('Generate:', prompt)}
                disabled={!prompt.trim()}
                className="absolute bottom-2 right-2 h-9 w-9 rounded-lg bg-[#B4E031] text-black hover:bg-[#9fc928] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-[#B4E031]/30 transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
                title="Generate (Enter)"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex flex-1 flex-col min-w-0">
          {/* View Switcher */}
          <div className="border-b border-zinc-800 px-3 py-2 flex items-center gap-2">
            <button
              onClick={() => setMainView('mediapool')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                mainView === 'mediapool' 
                  ? 'bg-[#B4E031] text-black' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Layers className="h-4 w-4 inline mr-2" />
              Media Pool
            </button>
            <button
              onClick={() => setMainView('preview')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                mainView === 'preview' 
                  ? 'bg-[#B4E031] text-black' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Eye className="h-4 w-4 inline mr-2" />
              Preview
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {mainView === 'mediapool' ? (
              <div className="h-full p-3 overflow-y-auto">
                <MediaPool
                  projectId={projectId}
                  files={project.files || []}
                  videoFiles={project.tracks?.flatMap(t => t.video_files || [])}
                  audioFiles={project.tracks?.flatMap(t => t.audio_files || [])}
                />
              </div>
            ) : (
              <div className="h-full p-3">
                <VideoPreview 
                  selectedClip={selectedClip}
                  currentTime={timelineTime}
                  onTimeUpdate={setTimelineTime}
                />
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="flex-shrink-0 border-t border-zinc-800" style={{ height: '260px' }}>
            <Timeline
              projectId={projectId}
              tracks={project.tracks || []}
              onClipSelect={setSelectedClip}
              currentTime={timelineTime}
              onTimeUpdate={setTimelineTime}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ProtectedRoute>
      <ProjectPageContent params={params} />
    </ProtectedRoute>
  );
}
