/**
 * Application constants
 */

export const SAMPLE_VIDEOS = {
  BIG_BUCK_BUNNY: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
} as const;

export const MODELS = [
  { id: 'stable-diffusion', name: 'Stable Diffusion', type: 'text-to-video' },
  { id: 'runway-gen2', name: 'Runway Gen-2', type: 'text-to-video' },
  { id: 'pika-labs', name: 'Pika Labs', type: 'image-to-video' },
  { id: 'animate-diff', name: 'AnimateDiff', type: 'image-to-video' },
] as const;

export const GENERATION_MODES = [
  { id: 'text-to-video', label: 'Text→Video' },
  { id: 'image-to-video', label: 'Image→Video' },
  { id: 'edit-scenario', label: 'Edit' },
] as const;

export const AUTO_SAVE_DELAY = 1000; // ms
