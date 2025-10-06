import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/db";
import { users, conversations } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, transcript, duration, objectivesCovered, metadata } =
      body;

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get conversation
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Verify conversation belongs to user
    if (conversation.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to complete this conversation" },
        { status: 403 }
      );
    }

    // Check if already completed
    if (conversation.completedAt) {
      return NextResponse.json(
        { error: "Conversation already completed" },
        { status: 400 }
      );
    }

    // Update conversation with completion data
    const [updatedConversation] = await db
      .update(conversations)
      .set({
        completedAt: new Date(),
        duration: duration || null,
        transcript: transcript || conversation.transcript,
        objectivesCovered:
          objectivesCovered || conversation.objectivesCovered,
        metadata: {
          ...conversation.metadata,
          ...metadata,
        },
      })
      .where(eq(conversations.id, conversationId))
      .returning();

    console.log(`Completed conversation ${conversationId} for user ${user.id}`);

    // Optionally update user progress if all objectives were covered
    // This could be implemented based on your progress tracking logic
    const allObjectivesCovered =
      updatedConversation.objectivesCovered &&
      Array.isArray(updatedConversation.objectivesCovered) &&
      updatedConversation.objectivesCovered.length > 0;

    if (allObjectivesCovered) {
      // TODO: Update user progress to next lesson or next step
      console.log(
        `User ${user.id} completed all objectives in lesson ${conversation.lessonId}`
      );
    }

    return NextResponse.json({
      conversationId: updatedConversation.id,
      completedAt: updatedConversation.completedAt,
      duration: updatedConversation.duration,
      objectivesCovered: updatedConversation.objectivesCovered,
      message: "Conversation completed successfully",
    });
  } catch (error) {
    console.error("Error completing conversation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
