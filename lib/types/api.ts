/**
 * API Types from OpenAPI Specification
 * Generated from Kernel Video Generation API
 */

// ==================== Enums ====================

export type FileType = "image" | "video" | "audio" | "document" | "other";

export type ScenarioStatus = "draft" | "in_progress" | "completed" | "cancelled";

export type StepStatus = "pending" | "in_progress" | "completed" | "skipped" | "blocked";

export type StepType =
  | "scene"
  | "character"
  | "location"
  | "dialogue"
  | "action"
  | "transition"
  | "effect"
  | "music"
  | "voiceover"
  | "other";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

// ==================== User & Auth ====================

export interface User {
  id: number;
  email: string;
  username?: string | null;
  full_name?: string | null;
  is_active: boolean;
  is_verified: boolean;
  google_id?: string | null;
  avatar_url?: string | null;
  credits: number;
  created_at: string;
  last_login?: string | null;
}

export interface UserCreate {
  email: string;
  password: string;
  username?: string | null;
  full_name?: string | null;
  is_active?: boolean;
}

export interface UserLogin {
  email: string; // Can be email or username
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// ==================== Projects ====================

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  owner_id: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface ProjectCreate {
  name: string;
  description?: string | null;
  scenario_prompt?: string | null;
}

export interface ProjectUpdate {
  name?: string | null;
  description?: string | null;
}

export interface ProjectFile {
  id: number;
  project_id: number;
  filename: string;
  file_url: string;
  file_type: FileType;
  file_size?: number | null;
  mime_type?: string | null;
  prompt?: string | null;
  file_metadata?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface ProjectFileCreate {
  filename: string;
  file_url: string;
  file_type: FileType;
  file_size?: number | null;
  mime_type?: string | null;
  prompt?: string | null;
  file_metadata?: string | null;
}

// ==================== Tracks ====================

export interface Track {
  id: number;
  project_id: number;
  name: string;
  description?: string | null;
  duration?: number | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface TrackCreate {
  name: string;
  description?: string | null;
  duration?: number | null;
  order_index?: number;
}

export interface TrackVideoFile {
  id: number;
  track_id: number;
  filename: string;
  file_url: string;
  file_size?: number | null;
  duration?: number | null;
  resolution?: string | null;
  fps?: number | null;
  codec?: string | null;
  // Timeline coordinates (from backend API)
  start_time?: number | null;
  end_time?: number | null;
  volume?: number | null;
  created_at: string;
  updated_at?: string | null;
}

export interface TrackVideoFileCreate {
  filename: string;
  file_url: string;
  file_size?: number | null;
  duration?: number | null;
  resolution?: string | null;
  fps?: number | null;
  codec?: string | null;
  // Timeline coordinates (from backend API)
  start_time?: number;
  end_time?: number;
  volume?: number;
}

export interface TrackAudioFile {
  id: number;
  track_id: number;
  filename: string;
  file_url: string;
  file_size?: number | null;
  duration?: number | null;
  sample_rate?: number | null;
  bitrate?: number | null;
  channels?: number | null;
  codec?: string | null;
  // Timeline coordinates (from backend API)
  start_time?: number | null;
  end_time?: number | null;
  volume?: number | null;
  created_at: string;
  updated_at?: string | null;
}

export interface TrackAudioFileCreate {
  filename: string;
  file_url: string;
  file_size?: number | null;
  duration?: number | null;
  sample_rate?: number | null;
  bitrate?: number | null;
  channels?: number | null;
  codec?: string | null;
  // Timeline coordinates (from backend API)
  start_time?: number;
  end_time?: number;
  volume?: number;
}

export interface TrackWithFiles extends Track {
  video_files: TrackVideoFile[];
  audio_files: TrackAudioFile[];
}

export interface ProjectWithTracksAndFiles extends Project {
  files: ProjectFile[];
  tracks: TrackWithFiles[];
}

// ==================== Scenarios ====================

export interface Scenario {
  id: number;
  project_id: number;
  title: string;
  prompt: string;
  description?: string | null;
  status: ScenarioStatus;
  is_active: boolean;
  generated_by_ai: boolean;
  ai_model_used?: string | null;
  generation_metadata?: string | null;
  created_at: string;
  updated_at?: string | null;
  generated_at?: string | null;
}

export interface ScenarioCreate {
  title: string;
  prompt: string;
  description?: string | null;
}

export interface ScenarioUpdate {
  title?: string | null;
  prompt?: string | null;
  description?: string | null;
  status?: ScenarioStatus | null;
}

export interface ScenarioStep {
  id: number;
  scenario_id: number;
  title: string;
  description: string;
  context_prompt?: string | null;
  order_index: number;
  step_type: StepType;
  status: StepStatus;
  estimated_duration?: number | null;
  actual_duration?: number | null;
  difficulty_level?: number | null;
  depends_on_step_id?: number | null;
  generation_attempts: number;
  last_generation_prompt?: string | null;
  generation_notes?: string | null;
  created_at: string;
  updated_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface ScenarioStepCreate {
  title: string;
  description: string;
  context_prompt?: string | null;
  order_index?: number;
  step_type?: StepType;
  estimated_duration?: number | null;
  difficulty_level?: number | null;
  depends_on_step_id?: number | null;
  generation_notes?: string | null;
}

export interface ScenarioStepUpdate {
  title?: string | null;
  description?: string | null;
  context_prompt?: string | null;
  order_index?: number | null;
  step_type?: StepType | null;
  status?: StepStatus | null;
  estimated_duration?: number | null;
  difficulty_level?: number | null;
  depends_on_step_id?: number | null;
  generation_notes?: string | null;
}

export interface ScenarioWithSteps extends Scenario {
  steps: ScenarioStep[];
}

// ==================== Generation ====================

export interface TextToImageRequest {
  prompt: string;
  width_and_height?: string;
  enhance_prompt?: boolean;
  quality?: string;
  seed?: number | null;
  style_id?: string | null;
  model?: string;
  webhook_url?: string | null;
  webhook_secret?: string | null;
}

export interface ImageToVideoRequest {
  prompt: string;
  input_images: Array<{
    type: string;
    image_url?: string;
    [key: string]: unknown;
  }>;
  model?: string;
  seed?: number | null;
  motions?: Array<Record<string, unknown>> | null;
  enhance_prompt?: boolean;
  webhook_url?: string | null;
  webhook_secret?: string | null;
}

export interface GenerationResponse {
  job_id: string;
  status: string;
  message: string;
  data?: Record<string, unknown> | null;
}

export interface JobStatusResponse {
  id: string;
  type: string;
  status: string;
  created_at: string;
  updated_at?: string | null;
  completed_at?: string | null;
  progress?: number | null;
  input_params: Record<string, unknown>;
  result?: Record<string, unknown> | null;
  error?: string | null;
}

export interface ContextualGenerationRequest {
  prompt: string;
  project_id: number;
  use_project_context?: boolean;
  scenario_step_id?: number | null;
  generation_settings?: Record<string, unknown> | null;
}

export interface GenerationContext {
  project_id: number;
  current_step_id?: number | null;
  use_project_context?: boolean;
  context_summary?: string | null;
  previous_files_context?: string | null;
  scenario_context?: string | null;
}

// ==================== API Responses ====================

export interface ValidationError {
  loc: Array<string | number>;
  msg: string;
  type: string;
}

export interface ApiError {
  detail?: string | ValidationError[];
  message?: string;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string | ApiError;
  status: number;
}
