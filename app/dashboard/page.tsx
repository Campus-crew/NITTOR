"use client";

import { useState } from "react";
import { useProjects, useCurrentUser, useLogout } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Folder, Calendar, LogOut } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CreateProjectModal } from "@/components/project/CreateProjectModal";

function DashboardContent() {
  const { data: user } = useCurrentUser();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const logout = useLogout();
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleLogout = () => {
    logout.mutate();
  };

  if (projectsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-zinc-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">My Projects</h1>
            <p className="mt-1 text-zinc-400">
              {projects?.length || 0} project{projects?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-right">
                <p className="text-xs text-zinc-500">{user.email}</p>
                <p className="text-sm text-zinc-400">
                  Credits: <span className="font-bold text-[#B4E031]">{user.credits}</span>
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="icon"
                className="border-zinc-700 text-zinc-400 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="gap-2 bg-[#B4E031] text-black hover:bg-[#9fc928]"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects && projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-[#B4E031] hover:shadow-lg hover:shadow-[#B4E031]/20"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="mb-4 flex items-center justify-between">
                <Folder className="h-8 w-8 text-[#B4E031]" />
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    project.is_active
                      ? "bg-green-500/20 text-green-400"
                      : "bg-zinc-700 text-zinc-400"
                  }`}
                >
                  {project.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              
              <h3 className="mb-2 text-lg font-semibold text-white">
                {project.name}
              </h3>
              
              {project.description && (
                <p className="mb-4 line-clamp-2 text-sm text-zinc-400">
                  {project.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Calendar className="h-3 w-3" />
                {new Date(project.created_at).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-900 p-12 text-center">
          <div className="mb-4 text-6xl">📁</div>
          <h3 className="mb-2 text-xl font-semibold text-white">
            No projects yet
          </h3>
          <p className="mb-6 text-zinc-400">
            Create your first video project to get started
          </p>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="gap-2 bg-[#B4E031] text-black hover:bg-[#9fc928]"
          >
            <Plus className="h-4 w-4" />
            Create First Project
          </Button>
        </Card>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
