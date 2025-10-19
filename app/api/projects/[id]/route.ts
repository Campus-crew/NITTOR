import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // Temporarily disabled - configure DATABASE_URL in .env.local

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Use database when configured
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PATCH update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Use database when configured
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Use database when configured
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
