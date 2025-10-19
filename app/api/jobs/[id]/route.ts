import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // Temporarily disabled - configure DATABASE_URL in .env.local
import { getJobStatus as getHiggsfieldJobStatus, isHiggsfieldConfigured } from "@/lib/higgsfield";

// In-memory job tracking (fallback when DB is not configured)
const jobProgress = new Map<string, { progress: number; status: string; assetUrl?: string }>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;

    // TODO: Use database when configured
    // const job = await prisma.generatedResult.findUnique({ where: { jobId } });
    
    // Try Higgsfield API first if configured
    if (isHiggsfieldConfigured()) {
      try {
        const higgsfieldStatus = await getHiggsfieldJobStatus(jobId);
        
        // Map Higgsfield status to our format
        const status = higgsfieldStatus.status === "completed" ? "succeeded" : 
                      higgsfieldStatus.status === "failed" ? "failed" :
                      higgsfieldStatus.status === "processing" ? "running" : "queued";
        
        return NextResponse.json({
          success: true,
          jobId,
          status,
          progress: higgsfieldStatus.progress,
          assetUrl: higgsfieldStatus.videoUrl,
          error: higgsfieldStatus.error,
          source: "higgsfield",
        });
      } catch (error) {
        console.error("Higgsfield status check failed:", error);
        // Fall through to mock tracking
      }
    }
    
    // Fallback: in-memory tracking for mock jobs
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
      job.assetUrl = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
      
      // Clean up after a while
      setTimeout(() => jobProgress.delete(jobId), 60000);
    }

    return NextResponse.json({
      success: true,
      jobId,
      status: job.status,
      progress: job.progress,
      assetUrl: job.assetUrl,
      error: undefined,
      source: "mock",
    });
  } catch (error) {
    console.error("Get job status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get job status" },
      { status: 500 }
    );
  }
}
