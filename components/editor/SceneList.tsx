"use client";

import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScenarioStep, ScenarioWithSteps } from "@/lib/types/api";

export function SceneList() {
  const currentScenario = useAppStore((state) => state.currentScenario) as ScenarioWithSteps | null;
  const currentStep = useAppStore((state) => state.currentStep);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);

  const steps: ScenarioStep[] = currentScenario?.steps || [];

  if (steps.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800 p-4">
        <p className="text-xs text-zinc-500 text-center">
          No scenario steps yet. Create a scenario first.
        </p>
      </Card>
    );
  }

  const getStatusIcon = (status: ScenarioStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "skipped":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "blocked":
        return <XCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Circle className="h-4 w-4 text-zinc-600" />;
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-4">
      <h3 className="font-semibold mb-3 text-sm">Scenario Steps</h3>
      <div className="space-y-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step)}
            className={cn(
              "w-full text-left p-3 rounded-lg border transition-colors",
              currentStep?.id === step.id
                ? "border-[#B4E031] bg-[#B4E031]/10"
                : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
            )}
          >
            <div className="flex items-start gap-2">
              {getStatusIcon(step.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">#{step.order_index + 1}</span>
                  <span className="font-medium text-sm truncate">
                    {step.title}
                  </span>
                  {step.estimated_duration && (
                    <span className="text-xs text-zinc-500 ml-auto">
                      {step.estimated_duration}s
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {step.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
