/**
 * Projects Hooks
 * React Query hooks for projects, tracks, and files operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { projectsApi } from "@/lib/api";
import type {
  ProjectCreate,
  ProjectUpdate,
  ProjectFileCreate,
  TrackCreate,
  TrackVideoFileCreate,
  TrackAudioFileCreate,
} from "@/lib/types/api";

// ==================== Projects ====================

/**
 * Get all projects for current user
 */
export function useProjects(skip = 0, limit = 100) {
  return useQuery({
    queryKey: ["projects", skip, limit],
    queryFn: () => projectsApi.getProjects(skip, limit),
  });
}

/**
 * Get a specific project with tracks and files
 */
export function useProject(projectId: number | null) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => projectsApi.getProject(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectCreate) => projectsApi.createProject(data),
    onSuccess: (newProject) => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      return newProject;
    },
    onError: (error: Error) => {
      toast.error(`Failed to create project: ${error.message}`);
    },
  });
}

/**
 * Update a project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: ProjectUpdate }) =>
      projectsApi.updateProject(projectId, data),
    onSuccess: (_, variables) => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update project: ${error.message}`);
    },
  });
}

/**
 * Delete a project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) => projectsApi.deleteProject(projectId),
    onSuccess: (_, projectId) => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.removeQueries({ queryKey: ["projects", projectId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    },
  });
}

// ==================== Project Files ====================

/**
 * Get all files for a project
 */
export function useProjectFiles(projectId: number | null) {
  return useQuery({
    queryKey: ["projects", projectId, "files"],
    queryFn: () => projectsApi.getProjectFiles(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Add a file to a project
 */
export function useCreateProjectFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: ProjectFileCreate }) =>
      projectsApi.createProjectFile(projectId, data),
    onSuccess: (_, variables) => {
      toast.success("File added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "files"],
      });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add file: ${error.message}`);
    },
  });
}

/**
 * Delete a project file
 */
export function useDeleteProjectFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, fileId }: { projectId: number; fileId: number }) =>
      projectsApi.deleteProjectFile(projectId, fileId),
    onSuccess: (_, variables) => {
      toast.success("File deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "files"],
      });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete file: ${error.message}`);
    },
  });
}

// ==================== Tracks ====================

/**
 * Get all tracks for a project
 */
export function useProjectTracks(projectId: number | null) {
  return useQuery({
    queryKey: ["projects", projectId, "tracks"],
    queryFn: () => projectsApi.getProjectTracks(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Get a specific track
 */
export function useTrack(projectId: number | null, trackId: number | null) {
  return useQuery({
    queryKey: ["projects", projectId, "tracks", trackId],
    queryFn: () => projectsApi.getTrack(projectId!, trackId!),
    enabled: !!projectId && !!trackId,
  });
}

/**
 * Create a new track
 */
export function useCreateTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: TrackCreate }) =>
      projectsApi.createTrack(projectId, data),
    onSuccess: (_, variables) => {
      toast.success("Track created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "tracks"],
      });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create track: ${error.message}`);
    },
  });
}

/**
 * Delete a track
 */
export function useDeleteTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, trackId }: { projectId: number; trackId: number }) =>
      projectsApi.deleteTrack(projectId, trackId),
    onSuccess: (_, variables) => {
      toast.success("Track deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "tracks"],
      });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete track: ${error.message}`);
    },
  });
}

// ==================== Track Files ====================

/**
 * Add a video file to a track
 */
export function useCreateTrackVideoFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      trackId,
      data,
    }: {
      projectId: number;
      trackId: number;
      data: TrackVideoFileCreate;
    }) => projectsApi.createTrackVideoFile(projectId, trackId, data),
    onSuccess: (_, variables) => {
      toast.success("Video file added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "tracks", variables.trackId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "tracks"],
      });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add video file: ${error.message}`);
    },
  });
}

/**
 * Add an audio file to a track
 */
export function useCreateTrackAudioFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      trackId,
      data,
    }: {
      projectId: number;
      trackId: number;
      data: TrackAudioFileCreate;
    }) => projectsApi.createTrackAudioFile(projectId, trackId, data),
    onSuccess: (_, variables) => {
      toast.success("Audio file added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "tracks", variables.trackId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "tracks"],
      });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add audio file: ${error.message}`);
    },
  });
}
