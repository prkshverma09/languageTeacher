import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

// GET user settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      conversationLanguage: user.conversationLanguage || "en",
      targetLanguage: user.targetLanguage || "en",
      preferredVoiceId: user.preferredVoiceId || "21m00Tcm4TlvDq8ikWAM",
    });
  } catch (error) {
    console.error("[GET_USER_SETTINGS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch user settings" },
      { status: 500 }
    );
  }
}

// UPDATE user settings
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);
    const body = await req.json();
    const { conversationLanguage, targetLanguage, preferredVoiceId } = body;

    // Validate that conversation and target languages are different
    if (conversationLanguage && targetLanguage && conversationLanguage === targetLanguage) {
      return NextResponse.json(
        { error: "Conversation language and target language must be different" },
        { status: 400 }
      );
    }

    // Update user settings
    const updateData: any = {};
    if (conversationLanguage) updateData.conversationLanguage = conversationLanguage;
    if (targetLanguage) updateData.targetLanguage = targetLanguage;
    if (preferredVoiceId) updateData.preferredVoiceId = preferredVoiceId;

    await db.update(users).set(updateData).where(eq(users.id, userId));

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("[UPDATE_USER_SETTINGS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update user settings" },
      { status: 500 }
    );
  }
}
