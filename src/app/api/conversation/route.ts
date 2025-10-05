import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from "next/server";
import { db } from '@/db';
import { users, lessonSteps } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    // Fetch the current user from the database to get their progress
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const audioBlob = await req.blob();

    // 1. Transcribe the user's audio
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model_id", "scribe_v1");

    const sttResponse = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
      body: formData,
    });

    if (!sttResponse.ok) {
      throw new Error(`STT API request failed with status ${sttResponse.status}`);
    }

    const sttResult = await sttResponse.json();
    const transcribedText = sttResult.text || "";
    console.log("Transcribed text:", transcribedText);

    // 2. Implement the core conversation logic using the database
    const currentStep = await db.query.lessonSteps.findFirst({
        where: eq(lessonSteps.id, user.progress),
    });

    let responseText;

    if (!currentStep) {
      responseText = "You have completed all lessons. Congratulations!";
    } else {
      const isCorrect = transcribedText.trim().toLowerCase().includes(currentStep.expectedUserResponse?.toLowerCase() || '---');

      if (isCorrect) {
        responseText = currentStep.successFeedback;
        // Advance to the next step and update the database
        if (currentStep.nextStepId) {
          await db.update(users).set({ progress: currentStep.nextStepId }).where(eq(users.id, userId));
        } else {
          responseText += " You've finished this lesson!";
          // Optionally, mark lesson as complete or move to a "completed" state, e.g., progress = -1
          await db.update(users).set({ progress: -1 }).where(eq(users.id, userId));
        }
      } else {
        responseText = currentStep.failureFeedback;
      }
    }

    // 3. Generate and stream the audio response
    const elevenlabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const audioStream = await elevenlabs.generate({
        voice: "Rachel",
        text: responseText,
        model_id: "eleven_multilingual_v2"
    });

    const headers = new Headers();
    headers.set("Content-Type", "audio/mpeg");

    const readableStream = new ReadableStream({
        start(controller) {
            audioStream.on("data", (chunk) => controller.enqueue(chunk));
            audioStream.on("end", () => controller.close());
            audioStream.on("error", (err) => controller.error(err));
        },
    });

    return new NextResponse(readableStream, { headers });

  } catch (error) {
    console.error("Error in conversation API:", error);
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 });
  }
}