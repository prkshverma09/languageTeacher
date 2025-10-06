import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/db";
import { users, lessons } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { formatLessonAsKnowledgeBase } from "@/lib/agent-utils";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

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
          error: "No agent found for user. Create an agent first.",
        },
        { status: 400 }
      );
    }

    // Get lesson
    const [lesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.id, lessonId))
      .limit(1);

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Import extended lesson data for translations
    const { getLessonTranslations } = await import(
      "@/lib/extended-lesson-data"
    );

    // Get lesson translations for user's conversation language
    const translations = getLessonTranslations(
      lesson.id,
      user.conversationLanguage
    );

    if (!translations) {
      return NextResponse.json(
        {
          error: `No translations available for lesson ${lesson.id} in language ${user.conversationLanguage}`,
        },
        { status: 400 }
      );
    }

    const knowledgeBaseText = formatLessonAsKnowledgeBase(lesson, translations);

    try {
      // Add or update knowledge base document
      await elevenlabs.conversationalAi.knowledgeBase.documents.createFromText({
        name: `Lesson ${lesson.id} - ${lesson.title}`,
        text: knowledgeBaseText,
      });

      console.log(
        `Updated knowledge base document for lesson ${lesson.id}`
      );

      return NextResponse.json({
        success: true,
        message: "Knowledge base updated successfully",
        lessonId: lesson.id,
        agentId: user.agentId,
      });
    } catch (error) {
      console.error("Error updating knowledge base:", error);
      return NextResponse.json(
        {
          error: "Failed to update knowledge base",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in knowledge base update:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
