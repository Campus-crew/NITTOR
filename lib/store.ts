import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Project,
  Scenario,
  ScenarioStep,
  User,
  JobStatusResponse,
} from "@/lib/types/api";

// ==================== App State ====================

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Current Project
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;

  // Current Scenario
  currentScenario: Scenario | null;
  setCurrentScenario: (scenario: Scenario | null) => void;

  // Current Step
  currentStep: ScenarioStep | null;
  setCurrentStep: (step: ScenarioStep | null) => void;

  // Active Generation Jobs
  activeJobs: Map<string, JobStatusResponse>;
  addJob: (jobId: string, job: JobStatusResponse) => void;
  updateJob: (jobId: string, updates: Partial<JobStatusResponse>) => void;
  removeJob: (jobId: string) => void;
  clearJobs: () => void;

  // Editor Settings
  editorSettings: {
    keepConsistency: boolean;
    autoSaveInterval: number;
    defaultImageQuality: string;
    defaultVideoModel: string;
  };
  updateEditorSettings: (settings: Partial<AppState["editorSettings"]>) => void;

  // UI State
  ui: {
    sidebarOpen: boolean;
    timelineZoom: number;
    selectedTrackId: number | null;
  };
  updateUI: (updates: Partial<AppState["ui"]>) => void;

  // Reset state
  reset: () => void;
}

const initialState = {
  user: null,
  currentProject: null,
  currentScenario: null,
  currentStep: null,
  activeJobs: new Map(),
  editorSettings: {
    keepConsistency: true,
    autoSaveInterval: 30000, // 30 seconds
    defaultImageQuality: "1080p",
    defaultVideoModel: "dop-turbo",
  },
  ui: {
    sidebarOpen: true,
    timelineZoom: 1,
    selectedTrackId: null,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      // User actions
      setUser: (user) => set({ user }),

      // Project actions
      setCurrentProject: (project) => set({ currentProject: project }),

      // Scenario actions
      setCurrentScenario: (scenario) => set({ currentScenario: scenario }),

      // Step actions
      setCurrentStep: (step) => set({ currentStep: step }),

      // Job management
      addJob: (jobId, job) =>
        set((state) => {
          const newJobs = new Map(state.activeJobs);
          newJobs.set(jobId, job);
          return { activeJobs: newJobs };
        }),

      updateJob: (jobId, updates) =>
        set((state) => {
          const newJobs = new Map(state.activeJobs);
          const existing = newJobs.get(jobId);
          if (existing) {
            newJobs.set(jobId, { ...existing, ...updates });
          }
          return { activeJobs: newJobs };
        }),

      removeJob: (jobId) =>
        set((state) => {
          const newJobs = new Map(state.activeJobs);
          newJobs.delete(jobId);
          return { activeJobs: newJobs };
        }),

      clearJobs: () => set({ activeJobs: new Map() }),

      // Settings
      updateEditorSettings: (settings) =>
        set((state) => ({
          editorSettings: { ...state.editorSettings, ...settings },
        })),

      // UI
      updateUI: (updates) =>
        set((state) => ({
          ui: { ...state.ui, ...updates },
        })),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: "kernel-app-storage",
      partialize: (state) => ({
        editorSettings: state.editorSettings,
        ui: state.ui,
      }),
    }
  )
);

// ==================== Legacy Exports for Compatibility ====================
// Keep old interfaces for gradual migration

export interface Scene {
  id: string;
  title: string;
  description: string;
  durationSec: number;
  videoUrl?: string;
  status: "pending" | "generating" | "complete" | "error";
}

export interface TimelineClip {
  id: string;
  trackId: string;
  start: number;
  duration: number;
  content: string;
  type: "video" | "audio" | "text";
  assetUrl?: string;
}

// Legacy store for backward compatibility
export const useEditorStore = useAppStore;
