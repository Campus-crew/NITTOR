/**
 * Tracks Hooks
 * React Query hooks for track files operations (video/audio on timeline)
 * 
 * Note: Create hooks (useCreateTrackVideoFile, useCreateTrackAudioFile) 
 * are in use-projects.ts to avoid circular dependencies
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { projectsApi } from "@/lib/api";
import type {
  TrackVideoFileCreate,
  TrackAudioFileCreate,
} from "@/lib/types/api";

// ==================== Track Video Files ====================

/**
 * Update video file on track (move, trim, volume)
 */
export function useUpdateTrackVideoFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      trackId,
      fileId,
      data,
    }: {
      projectId: number;
      trackId: number;
      fileId: number;
      data: Partial<TrackVideoFileCreate>;
    }) => projectsApi.updateTrackVideoFile(projectId, trackId, fileId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update video: ${error.message}`);
    },
  });
}

/**
 * Delete video file from track
 */
export function useDeleteTrackVideoFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      trackId,
      fileId,
    }: {
      projectId: number;
      trackId: number;
      fileId: number;
    }) => projectsApi.deleteTrackVideoFile(projectId, trackId, fileId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
      toast.success("Video removed from timeline");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete video: ${error.message}`);
    },
  });
}

// ==================== Track Audio Files ====================

/**
 * Update audio file on track (move, trim, volume)
 */
export function useUpdateTrackAudioFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      trackId,
      fileId,
      data,
    }: {
      projectId: number;
      trackId: number;
      fileId: number;
      data: Partial<TrackAudioFileCreate>;
    }) => projectsApi.updateTrackAudioFile(projectId, trackId, fileId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update audio: ${error.message}`);
    },
  });
}

/**
 * Delete audio file from track
 */
export function useDeleteTrackAudioFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      trackId,
      fileId,
    }: {
      projectId: number;
      trackId: number;
      fileId: number;
    }) => projectsApi.deleteTrackAudioFile(projectId, trackId, fileId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
      toast.success("Audio removed from timeline");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete audio: ${error.message}`);
    },
  });
}

// ==================== Batch Operations ====================

/**
 * Update multiple clips at once (optimized)
 */
export function useBatchUpdateClips() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      updates,
    }: {
      projectId: number;
      updates: Array<{
        trackId: number;
        fileId: number;
        type: "video" | "audio";
        data: Partial<TrackVideoFileCreate | TrackAudioFileCreate>;
      }>;
    }) => {
      // Execute all updates in parallel
      await Promise.all(
        updates.map((update) => {
          if (update.type === "video") {
            return projectsApi.updateTrackVideoFile(
              projectId,
              update.trackId,
              update.fileId,
              update.data
            );
          } else {
            return projectsApi.updateTrackAudioFile(
              projectId,
              update.trackId,
              update.fileId,
              update.data
            );
          }
        })
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update clips: ${error.message}`);
    },
  });
}
