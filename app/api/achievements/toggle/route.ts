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

    const { achievementId } = await request.json();

    if (!achievementId || typeof achievementId !== "string") {
      return NextResponse.json(
        { error: "achievementId is required" },
        { status: 400 }
      );
    }

    // Check if achievement is already completed
    const existing = await prisma.userProgress.findUnique({
      where: {
        userId_achievementId: {
          userId: user.userId,
          achievementId,
        },
      },
    });

    if (existing) {
      // Remove completion
      await prisma.userProgress.delete({
        where: {
          userId_achievementId: {
            userId: user.userId,
            achievementId,
          },
        },
      });

      return NextResponse.json({
        success: true,
        completed: false,
        message: "Achievement unmarked",
      });
    } else {
      // Add completion
      await prisma.userProgress.create({
        data: {
          userId: user.userId,
          achievementId,
        },
      });

      return NextResponse.json({
        success: true,
        completed: true,
        message: "Achievement completed",
      });
    }
  } catch (error) {
    console.error("Toggle achievement error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
