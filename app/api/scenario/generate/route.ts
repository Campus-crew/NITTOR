import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, brief } = body;

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock scenario generation
    const scenes = [
      {
        id: "scene-1",
        title: "Вступление",
        description: "Захватывающее открытие с динамичной музыкой",
        durationSec: 5,
      },
      {
        id: "scene-2",
        title: "Основная часть",
        description: topic || brief || "Демонстрация ключевых моментов",
        durationSec: 45,
      },
      {
        id: "scene-3",
        title: "Заключение",
        description: "Призыв к действию и финальный кадр",
        durationSec: 10,
      },
    ];

    return NextResponse.json({
      success: true,
      scenario: {
        topic: topic || brief || "Видео без названия",
        scenes,
        totalDuration: scenes.reduce((sum, s) => sum + s.durationSec, 0),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to generate scenario" },
      { status: 500 }
    );
  }
}
