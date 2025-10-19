/**
 * Scenarios API
 */

import { apiClient, unwrapApiResponse } from "./client";
import type {
  Scenario,
  ScenarioCreate,
  ScenarioUpdate,
  ScenarioWithSteps,
  ScenarioStep,
  ScenarioStepCreate,
  ScenarioStepUpdate,
} from "@/lib/types/api";

export const scenariosApi = {
  // ==================== Scenarios ====================

  /**
   * Generate scenario using Azure OpenAI
   */
  generateScenario: async (
    projectId: number,
    data: {
      title: string;
      outline: string;
      use_context?: boolean;
    }
  ): Promise<ScenarioWithSteps> => {
    const response = await apiClient.post<ScenarioWithSteps>(
      `/projects/${projectId}/scenario/generate`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Get scenario for a project
   */
  getProjectScenario: async (projectId: number): Promise<ScenarioWithSteps> => {
    const response = await apiClient.get<ScenarioWithSteps>(
      `/projects/${projectId}/scenario`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Create a scenario for a project
   */
  createProjectScenario: async (
    projectId: number,
    data: ScenarioCreate
  ): Promise<Scenario> => {
    const response = await apiClient.post<Scenario>(
      `/projects/${projectId}/scenario`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Update project scenario
   */
  updateProjectScenario: async (
    projectId: number,
    data: ScenarioUpdate
  ): Promise<Scenario> => {
    const response = await apiClient.put<Scenario>(
      `/projects/${projectId}/scenario`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Delete project scenario
   */
  deleteProjectScenario: async (projectId: number): Promise<void> => {
    const response = await apiClient.delete(`/projects/${projectId}/scenario`);
    await unwrapApiResponse(response);
  },

  // ==================== Scenario Steps ====================

  /**
   * Get all steps for a scenario
   */
  getScenarioSteps: async (projectId: number): Promise<ScenarioStep[]> => {
    const response = await apiClient.get<ScenarioStep[]>(
      `/projects/${projectId}/scenario/steps`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Get a specific scenario step
   */
  getScenarioStep: async (
    projectId: number,
    stepId: number
  ): Promise<ScenarioStep> => {
    const response = await apiClient.get<ScenarioStep>(
      `/projects/${projectId}/scenario/steps/${stepId}`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Create a new scenario step
   */
  createScenarioStep: async (
    projectId: number,
    data: ScenarioStepCreate
  ): Promise<ScenarioStep> => {
    const response = await apiClient.post<ScenarioStep>(
      `/projects/${projectId}/scenario/steps`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Update a scenario step
   */
  updateScenarioStep: async (
    projectId: number,
    stepId: number,
    data: ScenarioStepUpdate
  ): Promise<ScenarioStep> => {
    const response = await apiClient.put<ScenarioStep>(
      `/projects/${projectId}/scenario/steps/${stepId}`,
      data
    );
    return unwrapApiResponse(response);
  },

  /**
   * Delete a scenario step
   */
  deleteScenarioStep: async (projectId: number, stepId: number): Promise<void> => {
    const response = await apiClient.delete(
      `/projects/${projectId}/scenario/steps/${stepId}`
    );
    await unwrapApiResponse(response);
  },

  /**
   * Get the next pending step in the scenario
   */
  getNextStep: async (projectId: number): Promise<ScenarioStep | null> => {
    const response = await apiClient.get<ScenarioStep | null>(
      `/projects/${projectId}/scenario/next-step`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Get the currently in-progress step
   */
  getCurrentStep: async (projectId: number): Promise<ScenarioStep | null> => {
    const response = await apiClient.get<ScenarioStep | null>(
      `/projects/${projectId}/scenario/current-step`
    );
    return unwrapApiResponse(response);
  },

  /**
   * Generate contextual prompt for a step
   */
  generateContextualPrompt: async (
    projectId: number,
    data: {
      step_id: number;
      base_prompt: string;
      include_previous_steps?: boolean;
    }
  ): Promise<{ enhanced_prompt: string }> => {
    const response = await apiClient.post<{ enhanced_prompt: string }>(
      `/projects/${projectId}/generate-prompt`,
      data
    );
    return unwrapApiResponse(response);
  },
};
