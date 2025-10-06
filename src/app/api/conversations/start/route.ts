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
    const { lessonId } = body;

    if (!lessonId) {
      return NextResponse.json(
        { error: "lessonId is required" },
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

    if (!user.agentId) {
      return NextResponse.json(
        {
          error:
            "No agent found for user. Create an agent first by calling /api/agents/create",
        },
        { status: 400 }
      );
    }

    // Create conversation record
    const [conversation] = await db
      .insert(conversations)
      .values({
        userId: user.id,
        agentId: user.agentId,
        lessonId,
        transcript: [],
        objectivesCovered: [],
        metadata: {},
      })
      .returning();

    console.log(
      `Started conversation ${conversation.id} for user ${user.id} on lesson ${lessonId}`
    );

    return NextResponse.json({
      conversationId: conversation.id,
      agentId: user.agentId,
      lessonId,
      startedAt: conversation.startedAt,
      message: "Conversation started successfully",
    });
  } catch (error) {
    console.error("Error starting conversation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
