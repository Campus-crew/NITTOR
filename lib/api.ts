import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
export interface ScenarioRequest {
  topic?: string;
  brief?: string;
}

export interface ScenarioResponse {
  success: boolean;
  scenario: {
    topic: string;
    scenes: Array<{
      id: string;
      title: string;
      description: string;
      durationSec: number;
    }>;
    totalDuration: number;
  };
}

export interface SceneGenerationRequest {
  sceneId: string;
  mode: "text" | "images";
  prompt?: string;
  images?: File[];
  traits?: Record<string, string | number>;
}

export interface SceneGenerationResponse {
  success: boolean;
  jobId: string;
  sceneId: string;
  status: string;
}

export interface JobStatusResponse {
  success: boolean;
  jobId: string;
  status: "queued" | "running" | "succeeded" | "failed";
  progress?: number;
  assetUrl?: string;
  error?: string;
}

// API functions
async function generateScenario(data: ScenarioRequest): Promise<ScenarioResponse> {
  const response = await fetch("/api/scenario/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to generate scenario");
  }

  return response.json();
}

async function generateScene(data: SceneGenerationRequest): Promise<SceneGenerationResponse> {
  const formData = new FormData();
  
  formData.append("sceneId", data.sceneId);
  formData.append("mode", data.mode);
  
  if (data.prompt) {
    formData.append("prompt", data.prompt);
  }
  
  if (data.traits) {
    formData.append("traits", JSON.stringify(data.traits));
  }
  
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response = await fetch("/api/scene/generate", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to start scene generation");
  }

  return response.json();
}

async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  const response = await fetch(`/api/jobs/${jobId}`);

  if (!response.ok) {
    throw new Error("Failed to get job status");
  }

  return response.json();
}

// Hooks
export function useGenerateScenario() {
  return useMutation({
    mutationFn: generateScenario,
    onSuccess: () => {
      toast.success("Сценарий успешно создан!");
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });
}

export function useGenerateScene() {
  return useMutation({
    mutationFn: generateScene,
    onSuccess: () => {
      toast.success("Генерация кадра началась");
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });
}

export function useJobStatus(jobId: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobStatus(jobId!),
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      
      // Stop polling if job is complete or failed
      if (data.status === "succeeded" || data.status === "failed") {
        return false;
      }
      
      // Poll every 2 seconds while running
      return 2000;
    },
  });
}

// Project management API functions
export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  userId: string;
}

async function getProjects(userId: string): Promise<{ success: boolean; projects: Project[] }> {
  const response = await fetch(`/api/projects?userId=${userId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  
  return response.json();
}

async function createProject(data: CreateProjectRequest): Promise<{ success: boolean; project: Project }> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create project");
  }
  
  return response.json();
}

async function deleteProject(projectId: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
  
  return response.json();
}

// Project hooks
export function useProjects(userId: string | null) {
  return useQuery({
    queryKey: ["projects", userId],
    queryFn: () => getProjects(userId!),
    enabled: !!userId,
  });
}

export function useCreateProject() {
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Проект создан!");
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Проект удален");
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });
}
