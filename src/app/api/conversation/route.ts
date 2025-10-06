import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from "next/server";
import { db } from '@/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getLessonStepContent } from "@/lib/multilingual-data";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const audioBlob = await req.blob();
    if (!audioBlob || audioBlob.size === 0) {
      return NextResponse.json({ error: 'No audio data was received. Please try again.' }, { status: 400 });
    }

    // 1. Transcribe Audio
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model_id", "scribe_v1");

    const sttResponse = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
      body: formData,
    });

    if (!sttResponse.ok) {
      const errorBody = await sttResponse.json().catch(() => ({ detail: { message: 'Could not parse error from STT service.' } }));
      console.error("STT API Error:", errorBody);
      return NextResponse.json({ error: `Sorry, I couldn't understand that. Please try speaking again.` }, { status: 502 });
    }

    const sttResult = await sttResponse.json();
    const transcribedText = sttResult.text || "";
    console.log("Transcribed text:", transcribedText);

    // 2. Conversation Logic - Get content in user's conversation language
    const conversationLang = user.conversationLanguage || "en";
    const currentStep = getLessonStepContent(user.progress, conversationLang);
    let responseText;
    let interactionResult: 'success' | 'failure';

    if (!currentStep) {
      // Completion message in user's conversation language
      const completionMessages: { [key: string]: string } = {
        en: "You have completed all lessons. Congratulations!",
        hi: "आपने सभी पाठ पूरे कर लिए हैं। बधाई हो!",
        es: "¡Has completado todas las lecciones. Felicitaciones!",
        fr: "Vous avez terminé toutes les leçons. Félicitations!",
      };
      responseText = completionMessages[conversationLang] || completionMessages['en'];
      interactionResult = 'success';
    } else {
      const isCorrect = transcribedText.trim().toLowerCase().includes(currentStep.expectedUserResponse?.toLowerCase() || '---');
      if (isCorrect) {
        responseText = currentStep.successFeedback;
        interactionResult = 'success';
        if (currentStep.nextStepId) {
          await db.update(users).set({ progress: currentStep.nextStepId }).where(eq(users.id, userId));
        } else {
          // Lesson completion message in user's conversation language
          const lessonCompleteMessages: { [key: string]: string } = {
            en: " You've finished this lesson!",
            hi: " आपने यह पाठ पूरा कर लिया है!",
            es: " ¡Has terminado esta lección!",
            fr: " Vous avez terminé cette leçon!",
          };
          responseText += lessonCompleteMessages[conversationLang] || lessonCompleteMessages['en'];
          await db.update(users).set({ progress: -1 }).where(eq(users.id, userId));
        }
      } else {
        responseText = currentStep.failureFeedback;
        interactionResult = 'failure';
      }
    }

    // 3. Generate Audio Response
    const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
    // Use user's preferred voice or default
    const voiceId = user.preferredVoiceId || "21m00Tcm4TlvDq8ikWAM";
    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
        text: responseText,
        model_id: "eleven_multilingual_v2",
        // Language hint based on user's conversation language
        language_code: user.conversationLanguage || "en"
    });

    // Collect audio chunks from the async iterable
    const audioChunks: Buffer[] = [];
    for await (const chunk of audioStream) {
        audioChunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(audioChunks);

    const headers = new Headers();
    headers.set("Content-Type", "audio/mpeg");
    // Encode non-ASCII characters as base64 to avoid HTTP header encoding errors
    headers.set("X-User-Transcription", Buffer.from(transcribedText).toString('base64'));
    headers.set("X-Agent-Response", Buffer.from(responseText).toString('base64'));
    headers.set("X-Interaction-Result", interactionResult);
    headers.set("X-Encoding", "base64"); // Flag to indicate base64 encoding

    return new NextResponse(audioBuffer, { headers });

  } catch (error) {
    console.error("[CONVERSATION_API_ERROR]", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ error: `An internal server error occurred. Please try again later.` }, { status: 500 });
  }
}
