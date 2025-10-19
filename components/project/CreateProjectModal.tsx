"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProject } from "@/lib/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  const router = useRouter();
  const createProject = useCreateProject();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scenarioPrompt, setScenarioPrompt] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      const project = await createProject.mutateAsync({
        name: name.trim(),
        description: description.trim() || null,
        scenario_prompt: scenarioPrompt.trim() || null,
      });

      // Close modal
      onOpenChange(false);

      // Reset form
      setName("");
      setDescription("");
      setScenarioPrompt("");

      // Redirect to project page
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Set up your video project. Add a scenario prompt to automatically
            generate a production plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="My Awesome Video"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031]"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of your video project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031] min-h-[80px]"
            />
          </div>

          {/* Scenario Prompt */}
          <div className="space-y-2">
            <Label htmlFor="scenario" className="text-sm font-medium">
              Scenario Prompt
            </Label>
            <Textarea
              id="scenario"
              placeholder="Create a promotional video about our new product launch. Should include intro, product features, and call to action..."
              value={scenarioPrompt}
              onChange={(e) => setScenarioPrompt(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#B4E031] focus:ring-[#B4E031] min-h-[100px]"
            />
            <p className="text-xs text-zinc-500">
              Optional: Describe your video vision and we'll generate a step-by-step
              production plan.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || createProject.isPending}
            className="bg-[#B4E031] hover:bg-[#A0D020] text-black font-semibold"
          >
            {createProject.isPending ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
