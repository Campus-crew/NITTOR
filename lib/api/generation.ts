/**
 * Generation API
 * Text-to-Image and Image-to-Video generation
 */

import { apiClient, unwrapApiResponse } from "./client";
import type {
  TextToImageRequest,
  ImageToVideoRequest,
  GenerationResponse,
  JobStatusResponse,
  ContextualGenerationRequest,
} from "@/lib/types/api";

export const generationApi = {
  // ==================== Generation ====================

  /**
   * Create a text-to-image generation job
   */
  textToImage: async (data: TextToImageRequest): Promise<GenerationResponse> => {
    const response = await apiClient.post<GenerationResponse>(
      "/generation/text-to-image",
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Create an image-to-video generation job
   */
  imageToVideo: async (data: ImageToVideoRequest): Promise<GenerationResponse> => {
    const response = await apiClient.post<GenerationResponse>(
      "/generation/image-to-video",
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Get status of a specific job
   */
  getJobStatus: async (jobSetId: string): Promise<JobStatusResponse> => {
    const response = await apiClient.get<JobStatusResponse>(
      `/generation/jobs/${jobSetId}`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Get available motion effects
   */
  getAvailableMotions: async (): Promise<any> => {
    const response = await apiClient.get("/generation/motions");
    return unwrapApiResponse(response);
  },

  /**
   * Legacy: Get job status (use getJobStatus instead)
   */
  getJobStatusLegacy: async (jobSetId: string): Promise<JobStatusResponse> => {
    const response = await apiClient.get<JobStatusResponse>(
      `/generation/job/${jobSetId}`
    );
    return unwrapApiResponse(response);
  },

  // ==================== Contextual Generation ====================

  /**
   * Generate content with project context
   * This uses the project's scenario and previous generations for consistency
   */
  contextualGeneration: async (
    data: ContextualGenerationRequest
  ): Promise<GenerationResponse> => {
    // This is a custom endpoint that would need to be implemented
    // For now, we'll use the standard text-to-image with enhanced prompt
    const textToImageData: TextToImageRequest = {
      prompt: data.prompt,
      enhance_prompt: data.use_project_context,
    };
    
    return generationApi.textToImage(textToImageData);
  },

  // ==================== Helper Functions ====================

  /**
   * Poll job status until completion
   * Returns a promise that resolves when job is completed or failed
   */
  pollJobStatus: async (
    jobSetId: string,
    onProgress?: (progress: number) => void,
    interval = 2000,
    maxAttempts = 300 // 10 minutes with 2s interval
  ): Promise<JobStatusResponse> => {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++;
          
          if (attempts > maxAttempts) {
            reject(new Error("Job polling timeout"));
            return;
          }

          const status = await generationApi.getJobStatus(jobSetId);

          // Call progress callback
          if (onProgress && status.progress !== null && status.progress !== undefined) {
            onProgress(status.progress);
          }

          // Check if job is complete
          if (status.status === "completed" || status.status === "succeeded") {
            resolve(status);
            return;
          }

          // Check if job failed
          if (status.status === "failed") {
            reject(new Error(status.error || "Generation failed"));
            return;
          }

          // Continue polling
          setTimeout(poll, interval);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  },

  /**
   * Generate image and wait for completion
   */
  textToImageAndWait: async (
    data: TextToImageRequest,
    onProgress?: (progress: number) => void
  ): Promise<JobStatusResponse> => {
    const generationResponse = await generationApi.textToImage(data);
    return generationApi.pollJobStatus(generationResponse.job_id, onProgress);
  },

  /**
   * Generate video and wait for completion
   */
  imageToVideoAndWait: async (
    data: ImageToVideoRequest,
    onProgress?: (progress: number) => void
  ): Promise<JobStatusResponse> => {
    const generationResponse = await generationApi.imageToVideo(data);
    return generationApi.pollJobStatus(generationResponse.job_id, onProgress);
  },
};
