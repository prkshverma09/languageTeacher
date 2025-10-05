import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from "next/server";
import { db } from '@/db';
import { lessonSteps } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

// A simple in-memory store for the user's progress.
// In a real application, this would be stored in a database.
let userState = {
  currentLessonId: 1,
  currentStepId: 1,
};

export async function POST(req: Request) {
  try {
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
        where: eq(lessonSteps.id, userState.currentStepId),
    });

    let responseText;

    if (!currentStep) {
      responseText = "You have completed all lessons. Congratulations!";
    } else {
      // Very simple check for correctness.
      const isCorrect = transcribedText.trim().toLowerCase().includes(currentStep.expectedUserResponse?.toLowerCase() || '---');

      if (isCorrect) {
        responseText = currentStep.successFeedback;
        // Advance to the next step
        if (currentStep.nextStepId) {
          userState.currentStepId = currentStep.nextStepId;
        } else {
          // End of the lesson
          responseText += " You've finished this lesson!";
          userState.currentStepId = -1; // Sentinel value for lesson completion
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