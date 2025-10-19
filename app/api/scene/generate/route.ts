import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // Temporarily disabled - configure DATABASE_URL in .env.local
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { generateVideo, fileToBase64, isHiggsfieldConfigured } from "@/lib/higgsfield";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const sceneId = formData.get("sceneId") as string;
    const mode = formData.get("mode") as string;
    const prompt = formData.get("prompt") as string | null;
    const traitsStr = formData.get("traits") as string | null;
    const traits = traitsStr ? JSON.parse(traitsStr) : undefined;

    // Handle uploaded images
    const imageUrls: string[] = [];
    const imageBase64: string[] = [];
    const imageFiles = formData.getAll("images") as File[];
    
    if (imageFiles.length > 0) {
      const uploadDir = join(process.cwd(), "public", "uploads");
      
      // Ensure upload directory exists
      await mkdir(uploadDir, { recursive: true });
      
      for (const file of imageFiles) {
        if (file.size > 0) {
          // Save file locally
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const filename = `${randomUUID()}-${file.name}`;
          const filepath = join(uploadDir, filename);
          
          await writeFile(filepath, buffer);
          imageUrls.push(`/uploads/${filename}`);
          
          // Convert to base64 for Higgsfield API
          const base64 = await fileToBase64(file);
          imageBase64.push(base64);
        }
      }
    }

    // Generate video using Higgsfield API
    let jobId: string;
    let higgsfieldJobId: string | undefined;
    
    if (isHiggsfieldConfigured() && (prompt || imageBase64.length > 0)) {
      try {
        const higgsfieldResponse = await generateVideo({
          prompt: prompt || "Generate a video",
          images: imageBase64.length > 0 ? imageBase64 : undefined,
          duration: 5, // Default 5 seconds per scene
          aspectRatio: "16:9",
        });
        
        higgsfieldJobId = higgsfieldResponse.jobId;
        jobId = higgsfieldResponse.jobId;
        
        console.log(`Higgsfield job created: ${jobId}`);
      } catch (error) {
        console.error("Higgsfield API error:", error);
        // Fallback to mock generation
        jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        simulateVideoGeneration(jobId, sceneId);
      }
    } else {
      // Fallback: mock generation when Higgsfield not configured
      jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      simulateVideoGeneration(jobId, sceneId);
    }
    
    // TODO: Save to database when configured
    // await prisma.generatedResult.create({
    //   data: { jobId, sceneId, mode, prompt, status: "queued", progress: 0 },
    // });

    return NextResponse.json({
      success: true,
      jobId,
      sceneId,
      status: "queued",
      uploadedImages: imageUrls,
      usingHiggsfield: isHiggsfieldConfigured(),
      higgsfieldJobId,
    });
  } catch (error) {
    console.error("Scene generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start scene generation" },
      { status: 500 }
    );
  }
}

// Simulate video generation process (disabled without DB)
function simulateVideoGeneration(jobId: string, sceneId: string) {
  // TODO: Uncomment when DATABASE_URL is configured
  // setTimeout(async () => {
  //   await prisma.generatedResult.update({
  //     where: { jobId },
  //     data: { status: "running", progress: 10 },
  //   });
  // }, 1000);
  
  console.log(`Simulating video generation for job ${jobId}, scene ${sceneId}`);
}
