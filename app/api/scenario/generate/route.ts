import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // Temporarily disabled - configure DATABASE_URL in .env.local
import { generateScenario, isOpenAIConfigured } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, brief, projectId, duration, sceneCount } = body;

    const scenarioTopic = topic || brief || "Видео без названия";
    
    // Generate scenario using OpenAI or fallback
    const generatedScenario = await generateScenario({
      topic: scenarioTopic,
      duration: duration || 60,
      sceneCount: sceneCount || 3,
    });

    // Map generated scenes to database format
    const scenesData = generatedScenario.scenes.map((scene, idx) => ({
      title: scene.title,
      description: scene.description,
      durationSec: scene.durationSec,
      prompt: scene.prompt, // Store AI-generated prompt for video generation
      order: idx,
    }));

    const totalDuration = generatedScenario.totalDuration;

    // Save to database if projectId provided
    // TODO: Uncomment when DATABASE_URL is configured
    // if (projectId) {
    //   const scenario = await prisma.scenario.create({
    //     data: {
    //       topic: scenarioTopic,
    //       totalDuration,
    //       projectId,
    //       scenes: {
    //         create: scenesData,
    //       },
    //     },
    //     include: {
    //       scenes: {
    //         orderBy: { order: "asc" },
    //       },
    //     },
    //   });
    //   return NextResponse.json({
    //     success: true,
    //     scenario: {
    //       id: scenario.id,
    //       topic: scenario.topic,
    //       scenes: scenario.scenes.map((s: { id: string; title: string; description: string; durationSec: number }) => ({
    //         id: s.id,
    //         title: s.title,
    //         description: s.description,
    //         durationSec: s.durationSec,
    //       })),
    //       totalDuration: scenario.totalDuration,
    //     },
    //   });
    // }

    // Fallback: return without saving (for backward compatibility)
    const scenes = scenesData.map((s, idx) => ({
      id: `scene-${idx + 1}`,
      title: s.title,
      description: s.description,
      durationSec: s.durationSec,
      prompt: s.prompt, // Include prompt for video generation
    }));

    return NextResponse.json({
      success: true,
      scenario: {
        topic: generatedScenario.topic,
        scenes,
        totalDuration,
      },
      aiGenerated: isOpenAIConfigured(),
    });
  } catch (error) {
    console.error("Scenario generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate scenario" },
      { status: 500 }
    );
  }
}
