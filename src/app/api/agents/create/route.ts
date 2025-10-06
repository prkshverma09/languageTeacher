import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/db";
import { users, agents, lessons } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import {
  generateSystemPrompt,
  formatLessonAsKnowledgeBase,
  getDefaultVoiceForLanguage,
  validateLanguagePair,
} from "@/lib/agent-utils";

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

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate language pair
    const validation = validateLanguagePair(
      user.conversationLanguage,
      user.targetLanguage
    );
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get lesson if lessonId provided
    let lesson = null;
    if (lessonId) {
      [lesson] = await db
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
    }

    // Generate system prompt
    const systemPrompt = generateSystemPrompt(
      user.conversationLanguage,
      user.targetLanguage,
      user.name || undefined
    );

    // Determine voice ID
    const voiceId =
      user.preferredVoiceId ||
      getDefaultVoiceForLanguage(user.conversationLanguage);

    // Check if user already has an agent
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.userId, user.id))
      .limit(1);

    let agentId: string;
    let agentStatus: "created" | "updated";

    if (existingAgent && user.agentId) {
      // Update existing agent
      // Note: ElevenLabs API might not support updating agents directly
      // In that case, we might need to delete and recreate
      // For now, we'll track this as an update operation
      agentId = user.agentId;
      agentStatus = "updated";

      // Update agent record in our database
      await db
        .update(agents)
        .set({
          updatedAt: new Date(),
          configuration: {
            conversationLanguage: user.conversationLanguage,
            targetLanguage: user.targetLanguage,
            voiceId,
            systemPrompt,
          },
        })
        .where(eq(agents.userId, user.id));

      console.log(`Updated agent configuration for user ${user.id}`);
    } else {
      // Create new agent
      try {
        const firstMessage =
          user.conversationLanguage === "hi"
            ? "नमस्ते! मैं आपका भाषा शिक्षक हूँ। मैं आपको अंग्रेजी सीखने में मदद करूंगा। क्या आप तैयार हैं?"
            : user.conversationLanguage === "es"
              ? "¡Hola! Soy tu tutor de idiomas. Te ayudaré a aprender inglés. ¿Estás listo?"
              : user.conversationLanguage === "fr"
                ? "Bonjour ! Je suis votre tuteur de langue. Je vous aiderai à apprendre l'anglais. Êtes-vous prêt ?"
                : "Hello! I'm your language tutor. I'll help you learn English. Are you ready?";

        const agent = await elevenlabs.conversationalAi.agents.create({
          name: `Language Tutor for ${user.name || user.email}`,
          conversationConfig: {
            agent: {
              firstMessage,
              language: user.conversationLanguage,
              prompt: {
                prompt: systemPrompt,
              },
            },
            tts: {
              voiceId,
              modelId: "eleven_turbo_v2_5", // Fast, multilingual model
            },
          },
        });

        agentId = agent.agentId;
        agentStatus = "created";

        // Create agent record in our database
        await db.insert(agents).values({
          userId: user.id,
          agentId,
          configuration: {
            conversationLanguage: user.conversationLanguage,
            targetLanguage: user.targetLanguage,
            voiceId,
            systemPrompt,
          },
        });

        // Update user with agent ID
        await db
          .update(users)
          .set({ agentId })
          .where(eq(users.id, user.id));

        console.log(`Created new agent ${agentId} for user ${user.id}`);
      } catch (error) {
        console.error("Error creating agent:", error);
        return NextResponse.json(
          {
            error: "Failed to create agent",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 }
        );
      }
    }

    // If lesson provided, add knowledge base
    if (lesson && lesson.learningObjectives) {
      try {
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
          console.warn(
            `No translations found for lesson ${lesson.id} in language ${user.conversationLanguage}`
          );
          // Fallback to English or skip knowledge base
          throw new Error("Translations not available");
        }

        const knowledgeBaseText = formatLessonAsKnowledgeBase(
          lesson,
          translations
        );

        // Add knowledge base document to agent
        await elevenlabs.conversationalAi.knowledgeBase.documents.createFromText({
          name: `Lesson ${lesson.id} - ${lesson.title}`,
          text: knowledgeBaseText,
        });

        console.log(
          `Added knowledge base document for lesson ${lesson.id}`
        );
      } catch (error) {
        console.error("Error adding knowledge base:", error);
        // Don't fail the request if knowledge base addition fails
        console.warn(
          "Agent created but knowledge base not added. It can be added later."
        );
      }
    }

    return NextResponse.json({
      agentId,
      status: agentStatus,
      configuration: {
        conversationLanguage: user.conversationLanguage,
        targetLanguage: user.targetLanguage,
        voice: voiceId,
        model: "eleven_turbo_v2_5",
      },
      message:
        agentStatus === "created"
          ? "Agent created successfully"
          : "Agent updated successfully",
    });
  } catch (error) {
    console.error("Error in agent creation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
