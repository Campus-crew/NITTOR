"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import {
  useGenerateScenario,
  useProjectScenario,
  useScenarioSteps,
  useUpdateScenarioStep,
  useDeleteScenarioStep,
  useCreateScenarioStep,
} from "@/lib/hooks";
import type { ScenarioStep } from "@/lib/types/api";

interface ScenarioPanelProps {
  projectId: number;
}

export function ScenarioPanel({ projectId }: ScenarioPanelProps) {
  const { data: scenario, isLoading: scenarioLoading } = useProjectScenario(projectId);
  const { data: steps = [], isLoading: stepsLoading } = useScenarioSteps(projectId);
  const generateScenario = useGenerateScenario();
  const updateStep = useUpdateScenarioStep();
  const deleteStep = useDeleteScenarioStep();
  const createStep = useCreateScenarioStep();

  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showStepDialog, setShowStepDialog] = useState(false);
  const [editingStep, setEditingStep] = useState<ScenarioStep | null>(null);
  
  // Generate scenario form
  const [title, setTitle] = useState("");
  const [outline, setOutline] = useState("");
  
  // Step form
  const [stepTitle, setStepTitle] = useState("");
  const [stepDescription, setStepDescription] = useState("");

  const handleGenerateScenario = async () => {
    if (!title.trim() || !outline.trim()) return;

    await generateScenario.mutateAsync({
      projectId,
      data: {
        title: title.trim(),
        outline: outline.trim(),
        use_context: true,
      },
    });

    setShowGenerateDialog(false);
    setTitle("");
    setOutline("");
  };

  const handleToggleStepStatus = async (step: ScenarioStep) => {
    let newStatus: ScenarioStep["status"];
    
    if (step.status === "completed") {
      newStatus = "pending";
    } else if (step.status === "in_progress") {
      newStatus = "completed";
    } else {
      newStatus = "in_progress";
    }

    await updateStep.mutateAsync({
      projectId,
      stepId: step.id,
      data: { status: newStatus },
    });
  };

  const handleDeleteStep = async (stepId: number) => {
    if (!confirm("Delete this step?")) return;
    await deleteStep.mutateAsync({ projectId, stepId });
  };

  const handleEditStep = (step: ScenarioStep) => {
    setEditingStep(step);
    setStepTitle(step.title);
    setStepDescription(step.description || "");
    setShowStepDialog(true);
  };

  const handleSaveStep = async () => {
    if (!stepTitle.trim()) return;

    if (editingStep) {
      // Update existing step
      await updateStep.mutateAsync({
        projectId,
        stepId: editingStep.id,
        data: {
          title: stepTitle.trim(),
          ...(stepDescription.trim() && { description: stepDescription.trim() }),
        },
      });
    } else {
      // Create new step
      await createStep.mutateAsync({
        projectId,
        data: {
          title: stepTitle.trim(),
          description: stepDescription.trim() || "",
          order_index: steps.length,
        },
      });
    }

    setShowStepDialog(false);
    setEditingStep(null);
    setStepTitle("");
    setStepDescription("");
  };

  const getStatusIcon = (status: ScenarioStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case "skipped":
        return <Circle className="h-5 w-5 text-zinc-600" />;
      default:
        return <Circle className="h-5 w-5 text-zinc-400" />;
    }
  };

  const getStatusColor = (status: ScenarioStep["status"]) => {
    switch (status) {
      case "completed":
        return "border-green-400/20 bg-green-400/5";
      case "in_progress":
        return "border-yellow-400/20 bg-yellow-400/5";
      case "skipped":
        return "border-zinc-700 bg-zinc-900/50";
      default:
        return "border-zinc-800 bg-zinc-900";
    }
  };

  if (scenarioLoading || stepsLoading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900 p-6">
        <div className="text-center text-zinc-400">
          <Clock className="mx-auto mb-2 h-8 w-8 animate-pulse" />
          <p>Loading scenario...</p>
        </div>
      </Card>
    );
  }

  // No scenario - show generate button
  if (!scenario) {
    return (
      <>
        <Card className="border-zinc-800 bg-zinc-900 p-6">
          <div className="text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
            <h3 className="mb-2 text-lg font-semibold text-white">
              No Scenario Yet
            </h3>
            <p className="mb-4 text-sm text-zinc-400">
              Generate a structured plan for your video with AI
            </p>
            <Button
              onClick={() => setShowGenerateDialog(true)}
              className="bg-yellow-400 text-zinc-900 hover:bg-yellow-500"
              disabled={generateScenario.isPending}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Scenario
            </Button>
          </div>
        </Card>

        <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
          <DialogContent className="border-zinc-800 bg-zinc-900">
            <DialogHeader>
              <DialogTitle className="text-white">Generate Scenario</DialogTitle>
              <DialogDescription>
                Describe your video idea and AI will create a structured plan
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Product Demo Video"
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Outline / Description
                </label>
                <Textarea
                  value={outline}
                  onChange={(e) => setOutline(e.target.value)}
                  placeholder="e.g. 30-second video showing our app features: intro, main features, call to action"
                  className="min-h-[120px] border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowGenerateDialog(false)}
                className="border-zinc-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateScenario}
                disabled={!title.trim() || outline.trim().length < 10 || generateScenario.isPending}
                className="bg-yellow-400 text-zinc-900 hover:bg-yellow-500"
              >
                {generateScenario.isPending ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </DialogFooter>
            {outline.trim().length > 0 && outline.trim().length < 10 && (
              <p className="mt-2 text-xs text-red-400">
                Outline must be at least 10 characters
              </p>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Show scenario steps
  return (
    <>
      <Card className="border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {scenario.title}
            </h3>
            <p className="text-sm text-zinc-400">
              {steps.filter((s) => s.status === "completed").length} / {steps.length} completed
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowStepDialog(true)}
            variant="outline"
            className="border-zinc-700"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Step
          </Button>
        </div>

        <div className="space-y-2">
          {steps.length === 0 ? (
            <div className="py-8 text-center text-zinc-400">
              <p>No steps yet. Add your first step!</p>
            </div>
          ) : (
            steps
              .sort((a, b) => a.order_index - b.order_index)
              .map((step) => (
                <div
                  key={step.id}
                  className={`group flex items-start gap-3 rounded-lg border p-3 transition-colors ${getStatusColor(
                    step.status
                  )}`}
                >
                  <button
                    onClick={() => handleToggleStepStatus(step)}
                    className="mt-0.5 transition-transform hover:scale-110"
                  >
                    {getStatusIcon(step.status)}
                  </button>

                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        step.status === "completed"
                          ? "text-zinc-400 line-through"
                          : "text-white"
                      }`}
                    >
                      {step.title}
                    </h4>
                    {step.description && (
                      <p className="mt-1 text-sm text-zinc-400">
                        {step.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditStep(step)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteStep(step.id)}
                      className="h-8 w-8 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>
      </Card>

      {/* Step Dialog */}
      <Dialog open={showStepDialog} onOpenChange={setShowStepDialog}>
        <DialogContent className="border-zinc-800 bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingStep ? "Edit Step" : "Add Step"}
            </DialogTitle>
            <DialogDescription>
              {editingStep
                ? "Update the step details"
                : "Add a new step to your scenario"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Title
              </label>
              <Input
                value={stepTitle}
                onChange={(e) => setStepTitle(e.target.value)}
                placeholder="e.g. Create intro animation"
                className="border-zinc-700 bg-zinc-800 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Description (optional)
              </label>
              <Textarea
                value={stepDescription}
                onChange={(e) => setStepDescription(e.target.value)}
                placeholder="e.g. 3-second intro with logo reveal"
                className="min-h-[80px] border-zinc-700 bg-zinc-800 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowStepDialog(false);
                setEditingStep(null);
                setStepTitle("");
                setStepDescription("");
              }}
              className="border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveStep}
              disabled={!stepTitle.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingStep ? "Update" : "Add"} Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
