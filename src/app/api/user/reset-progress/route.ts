import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);

    // Reset user progress to step 1
    await db.update(users).set({ progress: 1 }).where(eq(users.id, userId));

    console.log(`User ${userId} reset their progress`);

    return NextResponse.json({
      success: true,
      message: "Progress reset successfully"
    });
  } catch (error) {
    console.error("[RESET_PROGRESS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to reset progress" },
      { status: 500 }
    );
  }
}
