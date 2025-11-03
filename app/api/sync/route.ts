import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Check basic auth
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const base64Credentials = authHeader.split(" ")[1];
    if (!base64Credentials) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf-8"
    );
    const [username, password] = credentials.split(":");

    // Verify credentials exist
    if (!username || !password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify credentials match
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Get completed achievements from request body
    const { completedIds } = await request.json();

    if (!Array.isArray(completedIds)) {
      return NextResponse.json(
        { error: "completedIds must be an array" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { username },
      });
    }

    // Get current progress
    const currentProgress = await prisma.userProgress.findMany({
      where: { userId: user.id },
    });

    const currentAchievementIds = new Set(
      currentProgress.map((p: { achievementId: string; id: string }) => p.achievementId)
    );
    const newAchievementIds = new Set(completedIds);

    // Delete achievements that are no longer completed
    const toDelete = currentProgress
      .filter((p: { achievementId: string; id: string }) => !newAchievementIds.has(p.achievementId))
      .map((p: { achievementId: string; id: string }) => p.id);

    if (toDelete.length > 0) {
      await prisma.userProgress.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    // Add new completed achievements
    const toAdd = completedIds.filter((id) => !currentAchievementIds.has(id));

    if (toAdd.length > 0) {
      await prisma.userProgress.createMany({
        data: toAdd.map((achievementId) => ({
          userId: user.id,
          achievementId,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      synced: completedIds.length,
      added: toAdd.length,
      removed: toDelete.length,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
