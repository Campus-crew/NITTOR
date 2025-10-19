// Higgsfield API integration for video generation

const HIGGSFIELD_API_URL = process.env.HIGGSFIELD_API_URL || "https://api.higgsfield.ai/v1";
const HIGGSFIELD_API_KEY = process.env.HIGGSFIELD_API_KEY;

export interface HiggsfieldGenerationRequest {
  prompt: string;
  images?: string[]; // Base64 or URLs
  duration?: number; // in seconds
  aspectRatio?: "16:9" | "9:16" | "1:1";
  style?: string;
}

export interface HiggsfieldGenerationResponse {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
}

export interface HiggsfieldJobStatus {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number; // 0-100
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

/**
 * Generate video using Higgsfield API
 */
export async function generateVideo(
  request: HiggsfieldGenerationRequest
): Promise<HiggsfieldGenerationResponse> {
  if (!HIGGSFIELD_API_KEY) {
    throw new Error("HIGGSFIELD_API_KEY not configured");
  }

  const response = await fetch(`${HIGGSFIELD_API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${HIGGSFIELD_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: request.prompt,
      images: request.images,
      duration: request.duration || 5,
      aspect_ratio: request.aspectRatio || "16:9",
      style: request.style,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Higgsfield API error: ${error}`);
  }

  return response.json();
}

/**
 * Check video generation status
 */
export async function getJobStatus(jobId: string): Promise<HiggsfieldJobStatus> {
  if (!HIGGSFIELD_API_KEY) {
    throw new Error("HIGGSFIELD_API_KEY not configured");
  }

  const response = await fetch(`${HIGGSFIELD_API_URL}/jobs/${jobId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${HIGGSFIELD_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Higgsfield API error: ${error}`);
  }

  return response.json();
}

/**
 * Convert File to base64 for API
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(",")[1]); // Remove data:image/...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Check if Higgsfield API is configured
 */
export function isHiggsfieldConfigured(): boolean {
  return !!HIGGSFIELD_API_KEY;
}
