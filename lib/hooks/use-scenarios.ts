/**
 * Scenarios Hooks
 * React Query hooks for scenarios and scenario steps operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { scenariosApi } from "@/lib/api";
import type {
  ScenarioCreate,
  ScenarioUpdate,
  ScenarioStepCreate,
  ScenarioStepUpdate,
} from "@/lib/types/api";

// ==================== Scenarios ====================

/**
 * Generate scenario using Azure OpenAI
 */
export function useGenerateScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: number;
      data: { title: string; outline: string; use_context?: boolean };
    }) => scenariosApi.generateScenario(projectId, data),
    onSuccess: (_, variables) => {
      toast.success("Scenario generated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "scenario"],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate scenario: ${error.message}`);
    },
  });
}

/**
 * Get scenario for a project
 */
export function useProjectScenario(projectId: number | null) {
  return useQuery({
    queryKey: ["projects", projectId, "scenario"],
    queryFn: async () => {
      try {
        return await scenariosApi.getProjectScenario(projectId!);
      } catch (error: any) {
        // If scenario doesn't exist (404), return null instead of throwing
        if (
          error.message?.includes("404") || 
          error.message?.includes("[404]") ||
          error.message?.includes("not found") ||
          error.message?.includes("Not found")
        ) {
          return null;
        }
        // Log other errors in development
        if (process.env.NODE_ENV === 'development') {
          console.warn("Scenario fetch error:", error.message);
        }
        throw error;
      }
    },
    enabled: !!projectId,
    retry: false, // Don't retry if scenario doesn't exist
  });
}

/**
 * Create a scenario for a project
 */
export function useCreateProjectScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: ScenarioCreate }) =>
      scenariosApi.createProjectScenario(projectId, data),
    onSuccess: (_, variables) => {
      toast.success("Scenario created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "scenario"],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create scenario: ${error.message}`);
    },
  });
}

/**
 * Update project scenario
 */
export function useUpdateProjectScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: ScenarioUpdate }) =>
      scenariosApi.updateProjectScenario(projectId, data),
    onSuccess: (_, variables) => {
      toast.success("Scenario updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "scenario"],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update scenario: ${error.message}`);
    },
  });
}

/**
 * Delete project scenario
 */
export function useDeleteProjectScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) => scenariosApi.deleteProjectScenario(projectId),
    onSuccess: (_, projectId) => {
      toast.success("Scenario deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "scenario"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete scenario: ${error.message}`);
    },
  });
}

// ==================== Scenario Steps ====================

/**
 * Get all steps for a scenario
 */
export function useScenarioSteps(projectId: number | null) {
  return useQuery({
    queryKey: ["projects", projectId, "scenario", "steps"],
    queryFn: () => scenariosApi.getScenarioSteps(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Get a specific scenario step
 */
export function useScenarioStep(projectId: number | null, stepId: number | null) {
  return useQuery({
    queryKey: ["projects", projectId, "scenario", "steps", stepId],
    queryFn: () => scenariosApi.getScenarioStep(projectId!, stepId!),
    enabled: !!projectId && !!stepId,
  });
}

/**
 * Create a new scenario step
 */
export function useCreateScenarioStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: number;
      data: ScenarioStepCreate;
    }) => scenariosApi.createScenarioStep(projectId, data),
    onSuccess: (_, variables) => {
      toast.success("Step created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "scenario"],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create step: ${error.message}`);
    },
  });
}

/**
 * Update a scenario step
 */
export function useUpdateScenarioStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      stepId,
      data,
    }: {
      projectId: number;
      stepId: number;
      data: ScenarioStepUpdate;
    }) => scenariosApi.updateScenarioStep(projectId, stepId, data),
    onSuccess: (_, variables) => {
      toast.success("Step updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "scenario"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "scenario", "steps", variables.stepId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update step: ${error.message}`);
    },
  });
}

/**
 * Delete a scenario step
 */
export function useDeleteScenarioStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, stepId }: { projectId: number; stepId: number }) =>
      scenariosApi.deleteScenarioStep(projectId, stepId),
    onSuccess: (_, variables) => {
      toast.success("Step deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "scenario"],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete step: ${error.message}`);
    },
  });
}

/**
 * Get the next pending step
 */
export function useNextStep(projectId: number | null) {
  return useQuery({
    queryKey: ["projects", projectId, "scenario", "next-step"],
    queryFn: () => scenariosApi.getNextStep(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Get the currently in-progress step
 */
export function useCurrentStep(projectId: number | null) {
  return useQuery({
    queryKey: ["projects", projectId, "scenario", "current-step"],
    queryFn: () => scenariosApi.getCurrentStep(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Generate contextual prompt
 */
export function useGenerateContextualPrompt() {
  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: number;
      data: {
        step_id: number;
        base_prompt: string;
        include_previous_steps?: boolean;
      };
    }) => scenariosApi.generateContextualPrompt(projectId, data),
    onError: (error: Error) => {
      toast.error(`Failed to generate prompt: ${error.message}`);
    },
  });
}
