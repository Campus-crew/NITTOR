import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Scene {
  id: string;
  title: string;
  description: string;
  durationSec: number;
  prompt?: string; // AI-generated prompt for video generation
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

interface EditorState {
  // Scenario
  scenario: string;
  scenes: Scene[];
  setScenario: (scenario: string) => void;
  setScenes: (scenes: Scene[]) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;

  // Current scene being edited
  currentSceneId: string | null;
  setCurrentSceneId: (id: string | null) => void;

  // Timeline
  clips: TimelineClip[];
  addClip: (clip: TimelineClip) => void;
  updateClip: (id: string, updates: Partial<TimelineClip>) => void;
  removeClip: (id: string) => void;

  // Settings
  keepTraits: boolean;
  setKeepTraits: (keep: boolean) => void;

  // Traits to persist across scenes
  traits: Record<string, string | number>;
  setTraits: (traits: Record<string, string | number>) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      scenario: "",
      scenes: [],
      setScenario: (scenario) => set({ scenario }),
      setScenes: (scenes) => set({ scenes }),
      updateScene: (id, updates) =>
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === id ? { ...scene, ...updates } : scene
          ),
        })),

      currentSceneId: null,
      setCurrentSceneId: (id) => set({ currentSceneId: id }),

      clips: [],
      addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),
      updateClip: (id, updates) =>
        set((state) => ({
          clips: state.clips.map((clip) =>
            clip.id === id ? { ...clip, ...updates } : clip
          ),
        })),
      removeClip: (id) =>
        set((state) => ({
          clips: state.clips.filter((clip) => clip.id !== id),
        })),

      keepTraits: true,
      setKeepTraits: (keep) => set({ keepTraits: keep }),

      traits: {},
      setTraits: (traits) => set({ traits }),
    }),
    {
      name: "flow-editor-storage",
    }
  )
);
