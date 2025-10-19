import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // Temporarily disabled - configure DATABASE_URL in .env.local

// GET all projects for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    // TODO: Use database when configured
    // const projects = await prisma.project.findMany({ where: { userId } });

    return NextResponse.json({
      success: true,
      projects: [], // Empty until DB is configured
    });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, userId } = body;

    if (!name || !userId) {
      return NextResponse.json(
        { success: false, error: "name and userId are required" },
        { status: 400 }
      );
    }

    // TODO: Use database when configured
    // const project = await prisma.project.create({ data: { name, description, userId } });

    return NextResponse.json({
      success: true,
      project: {
        id: `project-${Date.now()}`,
        name,
        description,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
