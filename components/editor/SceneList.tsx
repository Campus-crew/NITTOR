"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SceneList() {
  const { scenes, currentSceneId, setCurrentSceneId } = useEditorStore();

  if (scenes.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800 p-4">
        <p className="text-xs text-zinc-500 text-center">
          First create a scenario on the "Scenario" tab
        </p>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "generating":
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-zinc-600" />;
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-4">
      <h3 className="font-semibold mb-3 text-sm">Scenes</h3>
      <div className="space-y-2">
        {scenes.map((scene, index) => (
          <button
            key={scene.id}
            onClick={() => setCurrentSceneId(scene.id)}
            className={cn(
              "w-full text-left p-3 rounded-lg border transition-colors",
              currentSceneId === scene.id
                ? "border-[#B4E031] bg-[#B4E031]/10"
                : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
            )}
          >
            <div className="flex items-start gap-2">
              {getStatusIcon(scene.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">#{index + 1}</span>
                  <span className="font-medium text-sm truncate">
                    {scene.title}
                  </span>
                  <span className="text-xs text-zinc-500 ml-auto">
                    {scene.durationSec}с
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {scene.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
