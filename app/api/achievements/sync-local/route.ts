import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { localCompletedIds } = await request.json();

    if (!Array.isArray(localCompletedIds)) {
      return NextResponse.json(
        { error: "localCompletedIds must be an array" },
        { status: 400 }
      );
    }

    // Get current progress from DB
    const currentProgress = await prisma.userProgress.findMany({
      where: { userId: user.userId },
      select: { achievementId: true },
    });

    const currentIds = new Set(currentProgress.map((p) => p.achievementId));

    // Find achievements that are in localStorage but not in DB
    const toAdd = localCompletedIds.filter((id) => !currentIds.has(id));

    if (toAdd.length > 0) {
      // Add new achievements to DB
      await prisma.userProgress.createMany({
        data: toAdd.map((achievementId) => ({
          userId: user.userId,
          achievementId,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      success: true,
      synced: toAdd.length,
      message: `${toAdd.length} achievements synced from localStorage`,
    });
  } catch (error) {
    console.error("Sync local achievements error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
