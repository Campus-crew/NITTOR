/**
 * Export Hooks
 * React hooks for video export operations
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { exportApi, type ExportRequest } from "@/lib/api/export";

/**
 * Start video export
 */
export function useStartExport() {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: ExportRequest }) =>
      exportApi.startExport(projectId, data),
    onSuccess: () => {
      toast.success("Export started! Check status below.");
    },
    onError: (error: Error) => {
      toast.error(`Failed to start export: ${error.message}`);
    },
  });
}

/**
 * Get export status
 */
export function useExportStatus(exportId: string | null) {
  return useQuery({
    queryKey: ["exports", exportId, "status"],
    queryFn: () => exportApi.getExportStatus(exportId!),
    enabled: !!exportId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll every 3 seconds if processing
      if (data?.status === "processing" || data?.status === "queued") {
        return 3000;
      }
      // Stop polling if completed or failed
      return false;
    },
  });
}

/**
 * Export video and wait for completion
 */
export function useExportAndWait() {
  return useMutation({
    mutationFn: ({
      projectId,
      data,
      onProgress,
    }: {
      projectId: number;
      data: ExportRequest;
      onProgress?: (progress: number, status: string) => void;
    }) => exportApi.exportAndWait(projectId, data, onProgress),
    onSuccess: (result) => {
      if (result.status === "completed") {
        toast.success("Export completed! Download ready.");
      }
    },
    onError: (error: Error) => {
      toast.error(`Export failed: ${error.message}`);
    },
  });
}
