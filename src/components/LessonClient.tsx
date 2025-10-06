"use client";

import { useState, useRef, useEffect } from 'react';
import { Conversation } from '@elevenlabs/client';
import AudioWaveform from './AudioWaveform';

type Lesson = {
  id: number;
  title: string;
  description: string;
  estimatedDuration?: number;
  difficultyLevel?: string;
};

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export default function LessonClient({ lesson }: { lesson: Lesson }) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const conversationRef = useRef<Conversation | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Initialize agent when component mounts
  useEffect(() => {
    initializeAgent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const initializeAgent = async () => {
    try {
      setIsInitializing(true);
      setError(null);

      // Create or update agent with lesson knowledge base
      const response = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize agent');
      }

      const data = await response.json();
      setAgentId(data.agentId);
      console.log('Agent initialized:', data.agentId);
    } catch (err) {
      console.error('Error initializing agent:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize agent');
    } finally {
      setIsInitializing(false);
    }
  };

  const startConversation = async () => {
    if (!agentId) {
      setError('Agent not initialized. Please refresh the page.');
      return;
    }

    try {
      setConnectionStatus('connecting');
      setError(null);
      startTimeRef.current = Date.now();

      // Create conversation record in database
      const response = await fetch('/api/conversations/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to start conversation session');
      }

      const data = await response.json();
      setConversationId(data.conversationId);

      // Start ElevenLabs conversation
      const conversation = await Conversation.startSession({
        agentId: agentId,
        onConnect: () => {
          console.log('Connected to agent');
          setConnectionStatus('connected');
        },
        onDisconnect: () => {
          console.log('Disconnected from agent');
          setConnectionStatus('disconnected');
          setIsAgentSpeaking(false);
          setIsUserSpeaking(false);
        },
        onError: (error) => {
          console.error('Conversation error:', error);
          setError('Connection error. Please try again.');
          setConnectionStatus('error');
        },
        onModeChange: (mode) => {
          // mode can be 'speaking', 'listening', 'thinking'
          console.log('Mode changed:', mode);
          setIsAgentSpeaking(mode.mode === 'speaking');
          setIsUserSpeaking(mode.mode === 'listening');
        },
      });

      conversationRef.current = conversation;
      console.log('Conversation started');
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
      setConnectionStatus('error');
    }
  };

  const endConversation = async () => {
    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
        conversationRef.current = null;

        // Save conversation data
        if (conversationId && startTimeRef.current) {
          const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);

          await fetch('/api/conversations/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId,
              duration,
              metadata: { ended: 'manual' },
            }),
          });
        }

        setConnectionStatus('disconnected');
        setIsAgentSpeaking(false);
        setIsUserSpeaking(false);
      } catch (err) {
        console.error('Error ending conversation:', err);
      }
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected - Agent is ready';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Not Connected';
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-gray-400 mb-2">{lesson.description}</p>
          {lesson.estimatedDuration && (
            <p className="text-sm text-gray-500">
              Estimated duration: {lesson.estimatedDuration} minutes • Level: {lesson.difficultyLevel || 'Beginner'}
            </p>
          )}
        </div>

        {/* Connection Status */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
            <span className="text-lg font-medium">{getStatusText()}</span>
          </div>
          {agentId && (
            <span className="text-xs text-gray-500">Agent ID: {agentId.substring(0, 8)}...</span>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-4 rounded-lg mb-6">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {connectionStatus === 'disconnected' || connectionStatus === 'error' ? (
            <button
              onClick={startConversation}
              disabled={!agentId || isInitializing}
              className={`${
                !agentId || isInitializing
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-bold py-4 px-8 rounded-full text-xl transition-all shadow-lg`}
            >
              {isInitializing ? 'Initializing Agent...' : 'Start Conversation'}
            </button>
          ) : (
            <button
              onClick={endConversation}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all shadow-lg"
            >
              End Conversation
            </button>
          )}
        </div>

        {/* Audio Waveforms */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-6">Live Audio</h2>
          <div className="space-y-6">
            <AudioWaveform
              isActive={isAgentSpeaking}
              label="Agent Speaking"
              color="#3B82F6"
            />
            <AudioWaveform
              isActive={isUserSpeaking}
              label="You Speaking"
              color="#10B981"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">1.</span>
              <span>Click "Start Conversation" to begin your lesson</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">2.</span>
              <span>The agent will greet you and explain what you'll learn today</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">3.</span>
              <span>Speak naturally - you can ask questions, request clarification, or practice phrases</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">4.</span>
              <span>You can interrupt the agent at any time - just start speaking</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">5.</span>
              <span>Click "End Conversation" when you're done</span>
            </li>
          </ul>
          <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg">
            <p className="text-sm text-blue-200">
              💡 <strong>Tip:</strong> The agent will speak in your native language to teach you the target language.
              Feel free to have a natural conversation!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
