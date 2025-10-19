"use client";

import { use, useEffect } from "react";
import { useProject, useProjectScenario, useCreateTrack } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MediaPool } from "@/components/editor/MediaPool";
import { Timeline } from "@/components/editor/Timeline";
import { ChatPanel } from "@/components/editor/ChatPanel";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function ProjectEditorContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projectId = Number(id);
  const router = useRouter();

  // Все данные из бекенда через React Query
  const { data: project, isLoading } = useProject(projectId);
  const { data: scenario } = useProjectScenario(projectId);
  const createTrack = useCreateTrack();
  
  const setCurrentProject = useAppStore((state) => state.setCurrentProject);
  const setCurrentScenario = useAppStore((state) => state.setCurrentScenario);
  const currentStep = useAppStore((state) => state.currentStep);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);

  // Синхронизация с глобальным стором
  useEffect(() => {
    if (project) setCurrentProject(project);
  }, [project, setCurrentProject]);

  useEffect(() => {
    if (scenario) setCurrentScenario(scenario);
  }, [scenario, setCurrentScenario]);

  const handleAddTrack = async (type: 'video' | 'audio') => {
    const tracksCount = project?.tracks?.length || 0;
    await createTrack.mutateAsync({
      projectId,
      data: { 
        name: `${type === 'video' ? 'Video' : 'Audio'} Track ${tracksCount + 1}`,
        order_index: tracksCount,
      },
    });
  };

  // Loading состояние
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-zinc-400">Loading editor...</p>
        </div>
      </div>
    );
  }

  // Проект не найден
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
      <header className="border-b border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-white">{project.name}</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Scenario Sidebar */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-900 p-4 overflow-y-auto">
          <h3 className="mb-3 text-sm font-semibold text-white">Steps</h3>
          {scenario?.steps?.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step)}
              className={`mb-2 w-full rounded border p-2 text-left ${
                currentStep?.id === step.id ? "border-[#B4E031] bg-[#B4E031]/10" : "border-zinc-800"
              }`}
            >
              <p className="text-xs font-medium text-white">{step.title}</p>
            </button>
          ))}
        </aside>

        {/* Generation Panel */}
        <div className="w-80 border-r border-zinc-800">
          <ChatPanel currentTab="video" mode="description" />
        </div>

        {/* Main Area */}
        <main className="flex flex-1 flex-col">
          <div className="flex-1 p-4">
            {/* Media Pool - показывает только реальные файлы из бекенда */}
            <MediaPool
              projectId={projectId}
              files={project.files || []}
              videoFiles={project.tracks?.flatMap(t => t.video_files || [])}
              audioFiles={project.tracks?.flatMap(t => t.audio_files || [])}
            />
          </div>
          <div className="h-64 border-t border-zinc-800 p-4">
            {/* Timeline - треки из бекенда, клипы добавляются через drag & drop */}
            <Timeline
              projectId={projectId}
              tracks={project.tracks || []}
              onAddTrack={handleAddTrack}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ProtectedRoute>
      <ProjectEditorContent params={params} />
    </ProtectedRoute>
  );
}
