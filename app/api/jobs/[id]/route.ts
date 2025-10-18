import { NextRequest, NextResponse } from "next/server";

// Simulate job progress tracking
const jobProgress = new Map<string, { progress: number; status: string }>();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;

    // Initialize job if not exists
    if (!jobProgress.has(jobId)) {
      jobProgress.set(jobId, { progress: 0, status: "queued" });
    }

    const job = jobProgress.get(jobId)!;

    // Simulate progress
    if (job.status === "queued") {
      job.status = "running";
      job.progress = 10;
    } else if (job.status === "running" && job.progress < 100) {
      job.progress = Math.min(100, job.progress + 20);
    }

    // Mark as complete when progress reaches 100
    if (job.progress >= 100) {
      job.status = "succeeded";
      
      // Clean up after a while
      setTimeout(() => jobProgress.delete(jobId), 60000);

      return NextResponse.json({
        success: true,
        jobId,
        status: "succeeded",
        progress: 100,
        assetUrl: `https://example.com/videos/${jobId}.mp4`,
      });
    }

    return NextResponse.json({
      success: true,
      jobId,
      status: job.status,
      progress: job.progress,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to get job status" },
      { status: 500 }
    );
  }
}
