# Agent-Based Architecture - Language Teacher

## Overview

This document describes the architecture of the Language Teacher application using the **ElevenLabs Agents Platform** for natural, conversational language learning experiences.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICE                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (React)                      │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │  │
│  │  │ Conversation │  │ Transcript   │  │ Lesson Progress │ │  │
│  │  │   Controls   │  │   Display    │  │     Display     │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘ │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │  ElevenLabs Conversational AI SDK (WebSocket)     │   │  │
│  │  │  - Continuous audio streaming                      │   │  │
│  │  │  - Real-time bidirectional communication          │   │  │
│  │  │  - Automatic interruption handling                │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ WebSocket Connection
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   ELEVENLABS AGENTS PLATFORM                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              User's Personalized Agent                      │ │
│  │  - Configured with user's conversation language            │ │
│  │  - Loaded with current lesson knowledge base               │ │
│  │  - Uses appropriate voice for language                     │ │
│  │  - Handles natural conversation flow                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │ API Calls (Agent Management)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS BACKEND                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   API Routes                               │  │
│  │                                                            │  │
│  │  /api/agents/create     - Create/update user's agent      │  │
│  │  /api/agents/:userId    - Get agent configuration         │  │
│  │  /api/lessons/:id/kb    - Update lesson knowledge base    │  │
│  │  /api/conversations/*   - Session management              │  │
│  │  /api/user/settings     - Language preference updates     │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Agent Configuration Logic                     │  │
│  │  - System prompt generation                               │  │
│  │  - Knowledge base formatting                              │  │
│  │  - Voice selection                                        │  │
│  │  - Language configuration                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Database Queries
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  POSTGRESQL DATABASE                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  users                                                     │  │
│  │  - id, name, email, agentId                               │  │
│  │  - conversationLanguage, targetLanguage                   │  │
│  │  - preferredVoiceId, progress                             │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  lessons                                                   │  │
│  │  - id, title, description, targetLanguage                 │  │
│  │  - learningObjectives, teachingGuidance                   │  │
│  │  - translations, knowledgeBaseId                          │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  conversations                                             │  │
│  │  - id, userId, agentId, lessonId                          │  │
│  │  - transcript, duration, completedAt                      │  │
│  │  - objectivesCovered, metadata                            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Frontend (Next.js/React)

#### Responsibilities:
- Manage WebSocket connection to ElevenLabs agent
- Handle microphone permissions and audio capture
- Display real-time conversation transcript
- Show connection status and visual feedback
- Manage conversation session lifecycle

#### Key Components:

**`LessonClient.tsx`** (To be updated)
- Removes "Push to Talk" button
- Adds "Start/End Conversation" controls
- Integrates ElevenLabs Conversational AI SDK
- Handles continuous audio streaming
- Displays real-time transcript

**`ConversationControls.tsx`** (New)
```typescript
interface ConversationControlsProps {
  agentId: string;
  lessonId: number;
  onTranscriptUpdate: (transcript: Message[]) => void;
  onComplete: (sessionId: string) => void;
}
```

**`TranscriptDisplay.tsx`** (New)
- Shows conversation history
- Distinguishes user vs agent messages
- Auto-scrolls to latest message
- Supports multilingual text display

#### ElevenLabs SDK Integration:
```typescript
import { Conversation } from '@11labs/client';

const conversation = await Conversation.startSession({
  agentId: user.agentId,
  onMessage: (message) => {
    // Update transcript
  },
  onStatusChange: (status) => {
    // Update UI state
  }
});
```

### 2. Backend (Next.js API Routes)

#### Key Endpoints:

##### **POST `/api/agents/create`**
Creates or updates a user's personalized learning agent.

**Request:**
```json
{
  "userId": "user_123",
  "conversationLanguage": "hi",
  "targetLanguage": "en",
  "voiceId": "voice_abc",
  "lessonId": 1
}
```

**Response:**
```json
{
  "agentId": "agent_xyz",
  "status": "created",
  "configuration": {
    "language": "hi",
    "voice": "voice_abc",
    "model": "eleven_turbo_v2_5"
  }
}
```

**Implementation:**
```typescript
export async function POST(request: Request) {
  const { userId, conversationLanguage, targetLanguage, voiceId, lessonId } = await request.json();

  // Generate system prompt
  const systemPrompt = generateSystemPrompt(conversationLanguage, targetLanguage, lessonId);

  // Get lesson content
  const lesson = await getLessonById(lessonId);

  // Create agent
  const agent = await elevenlabs.agents.create({
    name: `Language Tutor for User ${userId}`,
    system_prompt: systemPrompt,
    language: conversationLanguage,
    voice_id: voiceId,
    model_id: "eleven_turbo_v2_5",
    first_message: lesson.translations[conversationLanguage].greeting
  });

  // Add knowledge base
  await elevenlabs.agents.addKnowledgeBase(agent.id, {
    name: `Lesson ${lessonId}`,
    text: formatLessonAsKnowledgeBase(lesson, conversationLanguage)
  });

  // Update user record
  await db.update(users)
    .set({ agentId: agent.id })
    .where(eq(users.id, userId));

  return Response.json({ agentId: agent.id, status: 'created' });
}
```

##### **POST `/api/lessons/:id/knowledge-base`**
Updates the knowledge base for a specific lesson.

**Request:**
```json
{
  "agentId": "agent_xyz",
  "lessonId": 1
}
```

**Implementation:**
```typescript
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { agentId } = await request.json();
  const lesson = await getLessonById(parseInt(params.id));
  const user = await getUserByAgentId(agentId);

  const knowledgeBaseText = formatLessonAsKnowledgeBase(
    lesson,
    user.conversationLanguage
  );

  await elevenlabs.agents.addKnowledgeBase(agentId, {
    name: `Lesson ${lesson.id} - ${lesson.title}`,
    text: knowledgeBaseText
  });

  return Response.json({ success: true });
}
```

##### **POST `/api/conversations/start`**
Creates a new conversation session.

**Request:**
```json
{
  "userId": "user_123",
  "lessonId": 1,
  "agentId": "agent_xyz"
}
```

**Response:**
```json
{
  "conversationId": "conv_abc",
  "agentId": "agent_xyz",
  "startedAt": "2025-10-06T12:00:00Z"
}
```

##### **POST `/api/conversations/:id/complete`**
Marks a conversation as complete and updates user progress.

**Request:**
```json
{
  "transcript": [...],
  "duration": 850,
  "objectivesCovered": ["greeting", "introduction", "thanks"]
}
```

### 3. System Prompt Generation

The system prompt is dynamically generated based on user preferences and lesson context.

#### Template Structure:

```typescript
function generateSystemPrompt(
  conversationLanguage: string,
  targetLanguage: string,
  lessonId: number
): string {
  const languageNames = {
    en: { en: 'English', hi: 'अंग्रेजी', es: 'inglés', fr: 'anglais' },
    hi: { en: 'Hindi', hi: 'हिंदी', es: 'hindi', fr: 'hindi' },
    // ... more languages
  };

  const conversationLangName = languageNames[conversationLanguage][conversationLanguage];
  const targetLangName = languageNames[targetLanguage][conversationLanguage];

  return `
# Role
You are a patient and encouraging language tutor. Your goal is to teach ${targetLangName} to students who speak ${conversationLangName}.

# Critical Rules
1. **ALWAYS speak in ${conversationLangName}** - Never speak in ${targetLangName} except when teaching specific phrases
2. Use the lesson guidance in your knowledge base to structure the conversation
3. Teach the phrases listed in the learning objectives
4. Stay approximately 80% focused on lesson content, but allow natural tangents if they help learning
5. Handle interruptions gracefully - pause and address questions immediately
6. Provide encouraging feedback in ${conversationLangName}
7. Correct pronunciation gently without being discouraging
8. Use real-world examples and context for each phrase

# Conversation Flow
1. Start with a warm greeting (provided in first_message)
2. Explain what will be learned today
3. Teach each phrase with:
   - Clear pronunciation
   - Usage context and examples
   - Practice opportunities
   - Gentle corrections if needed
4. Adapt to student's pace and questions
5. Gently redirect if conversation strays too far off-topic
6. Ensure all learning objectives are covered
7. Conclude with encouragement and preview next lesson

# Handling Questions
- If student asks an on-topic question: Answer thoroughly in ${conversationLangName}
- If student asks a related question: Answer briefly and connect back to lesson
- If student asks an off-topic question: Acknowledge politely and redirect: "वह एक अच्छा सवाल है, लेकिन पहले आइए हम आज के पाठ को पूरा करें।" (That's a good question, but let's complete today's lesson first.)

# Lesson Context
Refer to your knowledge base for:
- Learning objectives (phrases to teach)
- Teaching guidance (how to teach effectively)
- Example conversations
- Common mistakes to address
  `.trim();
}
```

### 4. Knowledge Base Formatting

Lessons are formatted as structured knowledge bases for the agent.

```typescript
function formatLessonAsKnowledgeBase(
  lesson: Lesson,
  conversationLanguage: string
): string {
  const translation = lesson.translations[conversationLanguage];

  return `
# Lesson: ${lesson.title}

## Overview
${lesson.description}

## Learning Objectives
${lesson.learningObjectives.map(obj => `
### ${obj.phrase}
- **Usage:** ${obj.usage}
- **Context:** ${obj.context}
- **Example:** ${obj.example}
`).join('\n')}

## Teaching Guidance
${lesson.teachingGuidance}

## Example Conversations
${lesson.exampleConversations.map(conv => `
**${conv.situation}:**
${conv.dialogue}
`).join('\n')}

## Common Mistakes
${lesson.commonMistakes?.map(mistake => `
- **Mistake:** ${mistake.error}
- **Correction:** ${mistake.correction}
- **Explanation:** ${mistake.explanation}
`).join('\n') || 'None listed'}

## Conclusion Message
${translation.conclusion}
  `.trim();
}
```

### 5. Database Schema Updates

#### New/Updated Tables:

```sql
-- Update users table
ALTER TABLE users ADD COLUMN agent_id VARCHAR(255);
ALTER TABLE users ADD COLUMN preferred_voice_id VARCHAR(255);

-- Create agents table (for tracking)
CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  agent_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  configuration JSONB,
  UNIQUE(user_id)
);

-- Create conversations table
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  agent_id VARCHAR(255) NOT NULL,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id),
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration INTEGER, -- seconds
  transcript JSONB,
  objectives_covered TEXT[],
  metadata JSONB
);

-- Update lessons table
ALTER TABLE lessons ADD COLUMN knowledge_base_id VARCHAR(255);
ALTER TABLE lessons ADD COLUMN learning_objectives JSONB;
ALTER TABLE lessons ADD COLUMN teaching_guidance TEXT;
ALTER TABLE lessons ADD COLUMN example_conversations JSONB;
ALTER TABLE lessons ADD COLUMN difficulty_level VARCHAR(50);
ALTER TABLE lessons ADD COLUMN estimated_duration INTEGER; -- minutes
```

### 6. Frontend-Backend Flow

#### Scenario: User Starts a Lesson

```
1. User clicks "Start Lesson 1"
   ↓
2. Frontend: GET /api/agents/${userId}
   → Checks if agent exists and is configured for current lesson
   ↓
3a. If agent doesn't exist or needs update:
    POST /api/agents/create
    → Backend creates agent with lesson knowledge base
    ↓
3b. If agent exists:
    POST /api/lessons/1/knowledge-base
    → Backend updates agent's knowledge base with new lesson
    ↓
4. Frontend: POST /api/conversations/start
   → Backend creates conversation record
   ↓
5. Frontend: Connect to ElevenLabs WebSocket
   elevenlabs.conversation.start({ agentId })
   ↓
6. Agent greets user and begins lesson
   ↓
7. Natural conversation continues...
   - User speaks freely
   - Agent responds in conversation language
   - User can interrupt anytime
   - Transcript updates in real-time
   ↓
8. Lesson completes (agent covers all objectives)
   ↓
9. Frontend: POST /api/conversations/${id}/complete
   → Backend saves transcript, updates progress
   ↓
10. User sees completion screen
```

## Key Design Decisions

### 1. One Agent Per User vs Shared Agents
**Decision:** One personalized agent per user

**Rationale:**
- Each user has unique language preferences
- Agent maintains user-specific context
- Allows personalized learning pace
- Simplifies state management

### 2. Knowledge Base Per Lesson vs Combined
**Decision:** Load lesson knowledge base dynamically per session

**Rationale:**
- Keeps context focused on current lesson
- Prevents agent from jumping between lessons
- Easier to update individual lessons
- Better control over conversation scope

### 3. WebSocket Direct vs Backend Proxy
**Decision:** Direct WebSocket connection from frontend to ElevenLabs

**Rationale:**
- Lower latency (no backend hop)
- Simpler architecture
- ElevenLabs handles scaling
- Backend only manages agent configuration

### 4. Transcript Storage
**Decision:** Store full transcripts in database

**Rationale:**
- Valuable for analytics
- Users can review past conversations
- Debug conversation issues
- Improve system prompts over time

## Security Considerations

1. **API Key Protection:**
   - ElevenLabs API keys stored server-side only
   - Frontend uses short-lived agent session tokens

2. **Agent Access Control:**
   - Each agent tied to specific user
   - Backend validates user owns agent before operations
   - No cross-user agent access

3. **Rate Limiting:**
   - Limit agent creation frequency
   - Limit conversation duration
   - Prevent abuse of knowledge base updates

4. **Data Privacy:**
   - Transcripts encrypted at rest
   - Option for users to delete conversation history
   - Comply with data retention policies

## Performance Optimization

1. **Agent Creation:**
   - Cache agent configurations
   - Reuse agents when possible
   - Update knowledge base instead of recreating agent

2. **Knowledge Base:**
   - Pre-format lesson content
   - Cache formatted knowledge bases
   - Update only when lesson content changes

3. **WebSocket Connection:**
   - Implement reconnection logic
   - Buffer audio during brief disconnections
   - Graceful degradation on connection issues

4. **Database:**
   - Index frequently queried fields (userId, agentId, lessonId)
   - Paginate conversation history
   - Archive old conversations

## Monitoring and Logging

### Key Metrics:
- Agent creation/update success rate
- WebSocket connection stability
- Average conversation duration
- Lesson completion rate
- User interruption frequency (engagement indicator)
- Agent response latency

### Logging:
- Agent configuration changes
- Conversation start/end events
- Knowledge base updates
- Error conditions and recovery

## Migration Path

### Phase 1: Infrastructure Setup
1. Add ElevenLabs Agents Platform integration
2. Update database schema
3. Create new API endpoints
4. Test agent creation and configuration

### Phase 2: Parallel Implementation
1. Keep existing TTS/STT code functional
2. Implement new agent-based flow
3. A/B test with subset of users
4. Compare metrics and user feedback

### Phase 3: Migration
1. Migrate users to new agent-based system
2. Deprecate old conversation endpoint
3. Remove old TTS/STT integration code
4. Update documentation

### Phase 4: Optimization
1. Fine-tune system prompts based on usage data
2. Optimize knowledge base formats
3. Improve lesson content based on conversation patterns
4. Add advanced features (voice selection, analytics)

## Future Enhancements

1. **Multi-Agent Support:**
   - Different agent personalities
   - Specialized agents for different topics

2. **Advanced Analytics:**
   - Conversation quality scoring
   - Learning effectiveness metrics
   - Personalized learning paths

3. **Real-time Collaboration:**
   - Group lessons with multiple users
   - Peer practice sessions

4. **Voice Cloning:**
   - Custom voices for advanced users
   - Celebrity or famous teacher voices

5. **Integration with LMS:**
   - Export progress to learning management systems
   - Integrate with school curricula

## Conclusion

The agent-based architecture provides a robust foundation for natural, conversational language learning. By leveraging the ElevenLabs Agents Platform, we eliminate complex conversation management logic while providing a superior user experience with interruptions, context awareness, and adaptive teaching.
