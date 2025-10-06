import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/db";
import { users, agents } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Get agent information
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.userId, user.id))
      .limit(1);

    if (!agent || !user.agentId) {
      return NextResponse.json({
        hasAgent: false,
        message: "No agent found for this user",
      });
    }

    return NextResponse.json({
      hasAgent: true,
      agentId: user.agentId,
      configuration: agent.configuration,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching agent info:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
