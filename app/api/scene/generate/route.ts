import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sceneId, mode, prompt, traits } = body;

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock job creation
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      jobId,
      sceneId,
      status: "queued",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to start scene generation" },
      { status: 500 }
    );
  }
}
