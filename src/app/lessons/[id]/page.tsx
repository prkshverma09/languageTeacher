"use client";

import { useState, useRef } from 'react';
import { lessons as allLessons, lessonSteps as allLessonSteps } from '@/lib/data';

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

function LessonClientComponent({ lesson }: { lesson: Lesson }) {
  const [status, setStatus] = useState<Status>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
            console.error('Failed to get audio response from server');
            setStatus('idle');
          }
        } catch (error) {
          console.error("Error sending/receiving audio:", error);
          setStatus('idle');
        }
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access is required to use this feature.');
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
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-lg text-gray-400 mb-8">{lesson.description}</p>

        <div className="space-y-4">
          {lesson.steps.map((step) => (
            <div key={step.id} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
              <p className="font-semibold text-white">Agent: <span className="font-normal text-gray-300">{step.agentPromptB}</span></p>
              <p className="font-semibold text-white">You should say: <span className="font-normal text-green-400">{step.targetPhraseA}</span></p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
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

// Fetching data directly in the server component
function getLesson(id: string): Lesson | null {
    const lessonId = parseInt(id, 10);
    const lesson = allLessons.find((l) => l.id === lessonId);

    if (!lesson) {
        return null;
    }

    const steps = allLessonSteps.filter((step) => step.lessonId === lessonId);
    return { ...lesson, steps };
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const lesson = getLesson(params.id);

  if (!lesson) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Lesson not found</h1>
      </main>
    );
  }

  return <LessonClientComponent lesson={lesson} />;
}