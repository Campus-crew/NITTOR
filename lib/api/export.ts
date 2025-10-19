/**
 * Export API
 * FFmpeg video export functionality
 */

import { apiClient, unwrapApiResponse } from "./client";

export interface ExportRequest {
  resolution?: string; // e.g. "1920x1080"
  fps?: number; // e.g. 30
  quality?: "low" | "medium" | "high" | "ultra";
  output_filename?: string;
  format?: string; // default: "mp4"
}

export interface ExportResponse {
  export_id: string;
  status: "queued" | "processing" | "completed" | "failed";
  message: string;
  output_url?: string;
}

export interface ExportStatusResponse {
  status: "queued" | "processing" | "completed" | "failed";
  progress: number; // 0.0 - 1.0
  message: string;
  output_url?: string;
  error?: string;
}

export const exportApi = {
  /**
   * Start video export for a project
   */
  startExport: async (
    projectId: number,
    data: ExportRequest
  ): Promise<ExportResponse> => {
    const response = await apiClient.post<ExportResponse>(
      `/projects/${projectId}/export`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Get export job status
   */
  getExportStatus: async (exportId: string): Promise<ExportStatusResponse> => {
    const response = await apiClient.get<ExportStatusResponse>(
      `/exports/${exportId}/status`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Poll export status until completion
   */
  pollExportStatus: async (
    exportId: string,
    onProgress?: (progress: number, status: string) => void,
    interval = 3000,
    maxAttempts = 200 // 10 minutes with 3s interval
  ): Promise<ExportStatusResponse> => {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++;

          if (attempts > maxAttempts) {
            reject(new Error("Export polling timeout"));
            return;
          }

          const status = await exportApi.getExportStatus(exportId);

          // Call progress callback
          if (onProgress) {
            onProgress(status.progress, status.status);
          }

          // Check if export is complete
          if (status.status === "completed") {
            resolve(status);
            return;
          }

          // Check if export failed
          if (status.status === "failed") {
            reject(new Error(status.error || status.message || "Export failed"));
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
   * Export video and wait for completion
   */
  exportAndWait: async (
    projectId: number,
    data: ExportRequest,
    onProgress?: (progress: number, status: string) => void
  ): Promise<ExportStatusResponse> => {
    const exportResponse = await exportApi.startExport(projectId, data);
    return exportApi.pollExportStatus(exportResponse.export_id, onProgress);
  },
};
