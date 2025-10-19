// OpenAI integration for scenario generation

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export interface ScenarioGenerationRequest {
  topic: string;
  duration?: number; // total duration in seconds
  sceneCount?: number; // number of scenes
}

export interface GeneratedScene {
  title: string;
  description: string;
  durationSec: number;
  prompt: string; // AI-generated prompt for video generation
}

export interface GeneratedScenario {
  topic: string;
  scenes: GeneratedScene[];
  totalDuration: number;
}

/**
 * Generate scenario using OpenAI
 */
export async function generateScenario(
  request: ScenarioGenerationRequest
): Promise<GeneratedScenario> {
  if (!OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not configured, using fallback scenario");
    return generateFallbackScenario(request);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a professional video script writer. Generate a detailed video scenario with multiple scenes. 
Return ONLY valid JSON in this exact format:
{
  "topic": "string",
  "scenes": [
    {
      "title": "string",
      "description": "string",
      "durationSec": number,
      "prompt": "detailed visual description for AI video generation"
    }
  ]
}`,
          },
          {
            role: "user",
            content: `Create a video scenario for: "${request.topic}". 
Total duration: ${request.duration || 60} seconds.
Number of scenes: ${request.sceneCount || 3}.
Make each scene visually interesting and include detailed prompts for AI video generation.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in OpenAI response");
    }

    const scenario = JSON.parse(jsonMatch[0]) as GeneratedScenario;
    
    // Calculate total duration
    scenario.totalDuration = scenario.scenes.reduce(
      (sum, scene) => sum + scene.durationSec,
      0
    );

    return scenario;
  } catch (error) {
    console.error("OpenAI generation failed:", error);
    return generateFallbackScenario(request);
  }
}

/**
 * Fallback scenario when OpenAI is not available
 */
function generateFallbackScenario(
  request: ScenarioGenerationRequest
): GeneratedScenario {
  const sceneCount = request.sceneCount || 3;
  const totalDuration = request.duration || 60;
  const sceneDuration = Math.floor(totalDuration / sceneCount);

  const scenes: GeneratedScene[] = [
    {
      title: "Вступление",
      description: "Захватывающее открытие с динамичной музыкой и визуальными эффектами",
      durationSec: sceneDuration,
      prompt: `Opening scene for ${request.topic}: dynamic intro with engaging visuals, modern aesthetic, professional lighting`,
    },
    {
      title: "Основная часть",
      description: request.topic || "Демонстрация ключевых моментов и особенностей",
      durationSec: sceneDuration,
      prompt: `Main content for ${request.topic}: showcase key features, detailed visuals, engaging presentation`,
    },
    {
      title: "Заключение",
      description: "Призыв к действию и финальный кадр с контактной информацией",
      durationSec: totalDuration - (sceneDuration * 2),
      prompt: `Closing scene for ${request.topic}: call to action, memorable ending, professional finish`,
    },
  ];

  return {
    topic: request.topic,
    scenes,
    totalDuration,
  };
}

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!OPENAI_API_KEY;
}
