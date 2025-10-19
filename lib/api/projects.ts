/**
 * Projects API
 */

import { apiClient, unwrapApiResponse } from "./client";
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectWithTracksAndFiles,
  ProjectFile,
  ProjectFileCreate,
  Track,
  TrackCreate,
  TrackWithFiles,
  TrackVideoFile,
  TrackVideoFileCreate,
  TrackAudioFile,
  TrackAudioFileCreate,
} from "@/lib/types/api";

export const projectsApi = {
  // ==================== Projects ====================

  /**
   * Get all projects for current user
   */
  getProjects: async (skip = 0, limit = 100): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>(
      `/projects/?skip=${skip}&limit=${limit}`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Get a specific project with tracks and files
   */
  getProject: async (projectId: number): Promise<ProjectWithTracksAndFiles> => {
    const response = await apiClient.get<ProjectWithTracksAndFiles>(
      `/projects/${projectId}`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Create a new project
   */
  createProject: async (data: ProjectCreate): Promise<Project> => {
    const response = await apiClient.post<Project>("/projects/", data);
    return unwrapApiResponse(response);
  },

  /**
   * Update a project
   */
  updateProject: async (projectId: number, data: ProjectUpdate): Promise<Project> => {
    const response = await apiClient.put<Project>(`/projects/${projectId}`, data);
    return unwrapApiResponse(response);
  },

  /**
   * Delete a project (soft delete)
   */
  deleteProject: async (projectId: number): Promise<void> => {
    const response = await apiClient.delete(`/projects/${projectId}`);
    await unwrapApiResponse(response);
  },

  // ==================== Project Files ====================

  /**
   * Get all files for a project
   */
  getProjectFiles: async (projectId: number): Promise<ProjectFile[]> => {
    const response = await apiClient.get<ProjectFile[]>(
      `/projects/${projectId}/files`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Add a file to a project
   */
  createProjectFile: async (
    projectId: number,
    data: ProjectFileCreate
  ): Promise<ProjectFile> => {
    const response = await apiClient.post<ProjectFile>(
      `/projects/${projectId}/files`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Delete a project file
   */
  deleteProjectFile: async (projectId: number, fileId: number): Promise<void> => {
    const response = await apiClient.delete(
      `/projects/${projectId}/files/${fileId}`
    );
    await unwrapApiResponse(response);
  },

  // ==================== Tracks ====================

  /**
   * Get all tracks for a project
   */
  getProjectTracks: async (projectId: number): Promise<TrackWithFiles[]> => {
    const response = await apiClient.get<TrackWithFiles[]>(
      `/projects/${projectId}/tracks`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Get a specific track with its files
   */
  getTrack: async (projectId: number, trackId: number): Promise<TrackWithFiles> => {
    const response = await apiClient.get<TrackWithFiles>(
      `/projects/${projectId}/tracks/${trackId}`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Create a new track
   */
  createTrack: async (projectId: number, data: TrackCreate): Promise<Track> => {
    const response = await apiClient.post<Track>(
      `/projects/${projectId}/tracks`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Delete a track
   */
  deleteTrack: async (projectId: number, trackId: number): Promise<void> => {
    const response = await apiClient.delete(
      `/projects/${projectId}/tracks/${trackId}`
    );
    await unwrapApiResponse(response);
  },

  // ==================== Track Files ====================

  /**
   * Add a video file to a track
   */
  createTrackVideoFile: async (
    projectId: number,
    trackId: number,
    data: TrackVideoFileCreate
  ): Promise<TrackVideoFile> => {
    const response = await apiClient.post<TrackVideoFile>(
      `/projects/${projectId}/tracks/${trackId}/video`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Add an audio file to a track
   */
  createTrackAudioFile: async (
    projectId: number,
    trackId: number,
    data: TrackAudioFileCreate
  ): Promise<TrackAudioFile> => {
    const response = await apiClient.post<TrackAudioFile>(
      `/projects/${projectId}/tracks/${trackId}/audio`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Update a video file in a track (timeline coordinates, volume)
   */
  updateTrackVideoFile: async (
    projectId: number,
    trackId: number,
    fileId: number,
    data: Partial<TrackVideoFileCreate>
  ): Promise<TrackVideoFile> => {
    const response = await apiClient.patch<TrackVideoFile>(
      `/projects/${projectId}/tracks/${trackId}/video/${fileId}`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Update an audio file in a track (timeline coordinates, volume)
   */
  updateTrackAudioFile: async (
    projectId: number,
    trackId: number,
    fileId: number,
    data: Partial<TrackAudioFileCreate>
  ): Promise<TrackAudioFile> => {
    const response = await apiClient.patch<TrackAudioFile>(
      `/projects/${projectId}/tracks/${trackId}/audio/${fileId}`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Delete a video file from a track
   */
  deleteTrackVideoFile: async (
    projectId: number,
    trackId: number,
    fileId: number
  ): Promise<void> => {
    const response = await apiClient.delete(
      `/projects/${projectId}/tracks/${trackId}/video/${fileId}`
    );
    await unwrapApiResponse(response);
  },

  /**
   * Delete an audio file from a track
   */
  deleteTrackAudioFile: async (
    projectId: number,
    trackId: number,
    fileId: number
  ): Promise<void> => {
    const response = await apiClient.delete(
      `/projects/${projectId}/tracks/${trackId}/audio/${fileId}`
    );
    await unwrapApiResponse(response);
  },
};
