"use client";

import { useState, useRef, useEffect } from 'react';

type LessonStep = {
  id: number;
  agentPromptB: string;
  targetPhraseA: string;
};

type Lesson = {
  id: number;
  title: string;
  description: string;
  steps: LessonStep[];
};

type Status = 'idle' | 'listening' | 'processing' | 'speaking';

type TranscriptEntry = {
  user: string;
  agent: string;
  result: 'success' | 'failure';
};

function LessonClientComponent({ lesson }: { lesson: Lesson }) {
  const [status, setStatus] = useState<Status>('idle');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const currentStep = lesson.steps[currentStepIndex];

  const getButtonState = () => {
    switch (status) {
      case 'listening':
        return { text: 'Recording...', style: 'bg-red-600 hover:bg-red-700 animate-pulse' };
      case 'processing':
        return { text: 'Processing...', style: 'bg-yellow-500 hover:bg-yellow-600 animate-pulse' };
      case 'speaking':
        return { text: 'Agent Speaking...', style: 'bg-green-500 hover:bg-green-600' };
      case 'idle':
      default:
        return { text: 'Push to Talk', style: 'bg-blue-600 hover:bg-blue-700' };
    }
  };

  const handleStartRecording = async () => {
    if (status !== 'idle') return;
    setError(null); // Clear previous errors
    setStatus('listening');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setStatus('processing');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        try {
          const response = await fetch('/api/conversation', {
            method: 'POST',
            body: audioBlob,
          });

          if (response.ok) {
            const userTranscription = response.headers.get("X-User-Transcription") || "";
            const agentResponse = response.headers.get("X-Agent-Response") || "";
            const result = (response.headers.get("X-Interaction-Result") || 'failure') as 'success' | 'failure';

            setTranscript(prev => [...prev, { user: userTranscription, agent: agentResponse, result }]);

            if (result === 'success' && currentStepIndex < lesson.steps.length - 1) {
              setCurrentStepIndex(prev => prev + 1);
            }

            setStatus('speaking');
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioData = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(audioData);
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
            source.onended = () => setStatus('idle');
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to get a response from the server.');
            setStatus('idle');
          }
        } catch (err) {
          console.error("Error sending/receiving audio:", err);
          setError('An unexpected error occurred. Please try again.');
          setStatus('idle');
        }
      };

      mediaRecorder.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access was denied. Please allow microphone access in your browser settings.');
      setStatus('idle');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && status === 'listening') {
      mediaRecorderRef.current.stop();
    }
  };

  const { text: buttonText, style: buttonStyle } = getButtonState();

  return (
    <main className="flex flex-col items-center p-6 md:p-12 lg:p-24 bg-gray-900 text-white flex-grow">
      <div className="w-full max-w-4xl flex-grow flex flex-col">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">{lesson.title}</h1>
        <p className="text-lg text-gray-400 mb-6 text-center">{lesson.description}</p>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 shadow-lg">
            <p className="font-semibold text-lg text-blue-300">Current Task:</p>
            <p className="text-gray-300 mt-1">{currentStep?.agentPromptB || "Lesson complete!"}</p>
            {currentStep && (
                <p className="text-green-400 font-mono mt-2 text-lg">Say: "{currentStep.targetPhraseA}"</p>
            )}
        </div>

        <div className="w-full flex-grow bg-gray-800/50 rounded-lg p-4 overflow-y-auto mb-6 border border-gray-700 h-96">
          {transcript.map((entry, index) => (
            <div key={index} className="mb-4 flex flex-col">
                <div className={`self-end max-w-lg p-3 rounded-lg bg-blue-600 border ${entry.result === 'success' ? 'border-green-500' : 'border-red-500'}`}>
                    <p className="text-white">{entry.user}</p>
                </div>
                <div className="self-start max-w-lg p-3 rounded-lg bg-gray-700 mt-2">
                    <p className="text-gray-200">{entry.agent}</p>
                </div>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>

        {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-4 text-center">
                <span className="block sm:inline">{error}</span>
                <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg className="fill-current h-6 w-6 text-red-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </button>
            </div>
        )}

        <div className="mt-auto pt-4 text-center">
          <button
            onMouseDown={handleStartRecording}
            onMouseUp={handleStopRecording}
            onTouchStart={handleStartRecording}
            onTouchEnd={handleStopRecording}
            disabled={status !== 'idle' && status !== 'listening'}
            className={`font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${buttonStyle}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </main>
  );
}

async function getLesson(id: string): Promise<Lesson | null> {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/lessons/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error("Failed to fetch lesson:", error);
        return null;
    }
}

export default async function LessonPage({ params }: { params: { id: string } }) {
  const lesson = await getLesson(params.id);

  if (!lesson) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Lesson not found</h1>
        <p className="mt-4">There was an issue loading the lesson. Please try again later.</p>
      </main>
    );
  }

  return <LessonClientComponent lesson={lesson} />;
}