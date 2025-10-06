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

export default function LessonClient({ lesson }: { lesson: Lesson }) {
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
    setError(null);
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
            const encoding = response.headers.get('X-Encoding');
            let userTranscription = response.headers.get('X-User-Transcription') || '';
            let agentResponse = response.headers.get('X-Agent-Response') || '';
            
            // Decode base64 if encoded
            if (encoding === 'base64') {
              userTranscription = atob(userTranscription);
              agentResponse = atob(agentResponse);
            }
            
            const interactionResult = response.headers.get('X-Interaction-Result') as 'success' | 'failure';

            setTranscript((prev) => [
              ...prev,
              { user: userTranscription, agent: agentResponse, result: interactionResult },
            ]);

            setStatus('speaking');
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            audio.onended = () => {
              setStatus('idle');
              if (interactionResult === 'success') {
                setCurrentStepIndex((prev) => Math.min(prev + 1, lesson.steps.length - 1));
              }
            };

            audio.play();
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'An error occurred. Please try again.');
            setStatus('idle');
          }
        } catch (err) {
          console.error('Error during conversation:', err);
          setError('Network error. Please check your connection and try again.');
          setStatus('idle');
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access your microphone. Please check your browser permissions.');
      setStatus('idle');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && status === 'listening') {
      mediaRecorderRef.current.stop();
    }
  };

  const buttonState = getButtonState();

  if (!currentStep) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Lesson Complete!</h1>
        <p className="mt-4">You have finished all the steps in this lesson.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
        <p className="text-gray-400 mb-8">{lesson.description}</p>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Current Task</h2>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-bold text-blue-400">Agent says:</span> {currentStep.agentPromptB}
            </p>
            <p className="text-lg">
              <span className="font-bold text-green-400">Say:</span> {currentStep.targetPhraseA}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-8">
          <button
            onMouseDown={handleStartRecording}
            onMouseUp={handleStopRecording}
            onTouchStart={handleStartRecording}
            onTouchEnd={handleStopRecording}
            className={`${buttonState.style} text-white font-bold py-4 px-8 rounded-full text-xl transition-all`}
            disabled={status !== 'idle' && status !== 'listening'}
          >
            {buttonState.text}
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Conversation</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {transcript.map((entry, index) => (
              <div key={index} className="space-y-2">
                <div className={`p-3 rounded-lg ${entry.result === 'success' ? 'bg-green-900 border-2 border-green-500' : 'bg-red-900 border-2 border-red-500'} text-right`}>
                  <p className="text-sm text-gray-400">You:</p>
                  <p>{entry.user}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-900 text-left">
                  <p className="text-sm text-gray-400">Agent:</p>
                  <p>{entry.agent}</p>
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      </div>
    </main>
  );
}
