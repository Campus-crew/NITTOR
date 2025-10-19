/**
 * Generation Hooks
 * React Query hooks for content generation operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generationApi } from "@/lib/api";
import type {
  TextToImageRequest,
  ImageToVideoRequest,
  ContextualGenerationRequest,
} from "@/lib/types/api";
import { useState, useEffect } from "react";

// ==================== Text-to-Image ====================

/**
 * Generate image from text
 */
export function useTextToImage() {
  return useMutation({
    mutationFn: (data: TextToImageRequest) => generationApi.textToImage(data),
    onSuccess: (response) => {
      toast.success("Image generation started!");
      return response;
    },
    onError: (error: Error) => {
      toast.error(`Failed to start generation: ${error.message}`);
    },
  });
}

/**
 * Generate image from text and wait for completion
 */
export function useTextToImageAndWait() {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (data: TextToImageRequest) =>
      generationApi.textToImageAndWait(data, setProgress),
    onSuccess: (result) => {
      toast.success("Image generated successfully!");
      setProgress(0);
      return result;
    },
    onError: (error: Error) => {
      toast.error(`Generation failed: ${error.message}`);
      setProgress(0);
    },
  });

  return { ...mutation, progress };
}

// ==================== Image-to-Video ====================

/**
 * Generate video from image
 */
export function useImageToVideo() {
  return useMutation({
    mutationFn: (data: ImageToVideoRequest) => generationApi.imageToVideo(data),
    onSuccess: (response) => {
      toast.success("Video generation started!");
      return response;
    },
    onError: (error: Error) => {
      toast.error(`Failed to start generation: ${error.message}`);
    },
  });
}

/**
 * Generate video from image and wait for completion
 */
export function useImageToVideoAndWait() {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (data: ImageToVideoRequest) =>
      generationApi.imageToVideoAndWait(data, setProgress),
    onSuccess: (result) => {
      toast.success("Video generated successfully!");
      setProgress(0);
      return result;
    },
    onError: (error: Error) => {
      toast.error(`Generation failed: ${error.message}`);
      setProgress(0);
    },
  });

  return { ...mutation, progress };
}

// ==================== Job Status ====================

/**
 * Get job status
 */
export function useJobStatus(jobSetId: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["generation", "jobs", jobSetId],
    queryFn: () => generationApi.getJobStatus(jobSetId!),
    enabled: !!jobSetId && (options?.enabled !== false),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;

      // Stop polling if job is complete or failed
      if (
        data.status === "completed" ||
        data.status === "succeeded" ||
        data.status === "failed"
      ) {
        return false;
      }

      // Poll every 2 seconds while processing
      return 2000;
    },
  });
}

/**
 * Hook to poll job status with callbacks
 */
export function useJobStatusPolling(
  jobSetId: string | null,
  onComplete?: (result: any) => void,
  onError?: (error: string) => void
) {
  const { data, isLoading, error } = useJobStatus(jobSetId);

  useEffect(() => {
    if (!data) return;

    // Handle completion
    if (data.status === "completed" || data.status === "succeeded") {
      if (onComplete) {
        onComplete(data);
      }
    }

    // Handle error
    if (data.status === "failed") {
      if (onError) {
        onError(data.error || "Generation failed");
      } else {
        toast.error(`Generation failed: ${data.error || "Unknown error"}`);
      }
    }
  }, [data, onComplete, onError]);

  return {
    status: data?.status,
    progress: data?.progress,
    result: data?.result,
    error: data?.error,
    isLoading,
    queryError: error,
  };
}

// ==================== Available Motions ====================

/**
 * Get available motion effects
 */
export function useAvailableMotions() {
  return useQuery({
    queryKey: ["generation", "motions"],
    queryFn: () => generationApi.getAvailableMotions(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// ==================== Contextual Generation ====================

/**
 * Generate with project context
 */
export function useContextualGeneration() {
  return useMutation({
    mutationFn: (data: ContextualGenerationRequest) =>
      generationApi.contextualGeneration(data),
    onSuccess: (response) => {
      toast.success("Generation started with project context!");
      return response;
    },
    onError: (error: Error) => {
      toast.error(`Failed to start generation: ${error.message}`);
    },
  });
}

// ==================== Batch Generation ====================

/**
 * Generate multiple images in sequence
 */
export function useBatchTextToImage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const textToImage = useTextToImage();

  const generateBatch = async (requests: TextToImageRequest[]) => {
    setCurrentIndex(0);
    setResults([]);

    for (let i = 0; i < requests.length; i++) {
      setCurrentIndex(i);
      try {
        const result = await textToImage.mutateAsync(requests[i]);
        setResults((prev) => [...prev, result]);
      } catch (error) {
        console.error(`Failed to generate image ${i + 1}:`, error);
        setResults((prev) => [...prev, { error }]);
      }
    }
  };

  return {
    generateBatch,
    currentIndex,
    results,
    isGenerating: textToImage.isPending,
  };
}
