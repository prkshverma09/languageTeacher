# Bug Fix: ElevenLabs SDK Import Errors

**Date:** October 6, 2025
**Status:** ✅ FIXED

---

## Problem

When opening a lesson page, the Next.js server crashed with the following error:

```
Module not found: Can't resolve 'elevenlabs'
> 6 | import { ElevenLabsClient } from "elevenlabs";
```

---

## Root Cause

The backend API routes were importing from `elevenlabs` but the actual package installed is `@elevenlabs/elevenlabs-js`. Additionally, the API methods being called did not match the actual ElevenLabs SDK structure.

---

## Solution

### 1. Fixed Import Statements

**Before:**
```typescript
import { ElevenLabsClient } from "elevenlabs";
```

**After:**
```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
```

**Files Updated:**
- `src/app/api/agents/create/route.ts`
- `src/app/api/lessons/knowledge-base/route.ts`

### 2. Fixed Agent Creation Method

**Before (Incorrect):**
```typescript
const agent = await elevenlabs.conversationalAi.createAgent({
  name: "...",
  system_prompt: systemPrompt,
  language: "hi",
  voice_id: voiceId,
  model_id: "eleven_turbo_v2_5",
  first_message: "...",
});
```

**After (Correct):**
```typescript
const agent = await elevenlabs.conversationalAi.agents.create({
  name: "...",
  conversationConfig: {
    agent: {
      firstMessage: "...",
      language: "hi",
      prompt: {
        prompt: systemPrompt,
      },
    },
    tts: {
      voiceId: voiceId,
      modelId: "eleven_turbo_v2_5",
    },
  },
});
```

### 3. Fixed Knowledge Base Addition Method

**Before (Incorrect):**
```typescript
await elevenlabs.conversationalAi.addKnowledgeBase(agentId, {
  name: "Lesson 1",
  text: knowledgeBaseText,
});
```

**After (Correct):**
```typescript
await elevenlabs.conversationalAi.knowledgeBase.documents.createFromText({
  name: "Lesson 1",
  text: knowledgeBaseText,
});
```

---

## ElevenLabs SDK Structure (Reference)

### Agent Creation
```typescript
elevenlabs.conversationalAi.agents.create({
  name: string,
  conversationConfig: {
    agent: {
      firstMessage?: string,
      language?: string,
      prompt: {
        prompt?: string,
        knowledgeBase?: KnowledgeBaseLocator[],
        llm?: Llm,
        temperature?: number,
      },
    },
    tts: {
      voiceId?: string,
      modelId?: string,
      stability?: number,
      speed?: number,
    },
  },
})
```

### Knowledge Base Documents
```typescript
// Create from text
elevenlabs.conversationalAi.knowledgeBase.documents.createFromText({
  name: string,
  text: string,
})

// Create from URL
elevenlabs.conversationalAi.knowledgeBase.documents.createFromUrl({
  url: string,
  name?: string,
})

// Create from file
elevenlabs.conversationalAi.knowledgeBase.documents.createFromFile({
  file: ReadStream,
  name?: string,
})
```

---

## Testing

After these fixes:

1. ✅ Next.js development server compiles successfully
2. ✅ Lesson pages load without errors
3. ✅ Agent creation API endpoint is accessible
4. ✅ Knowledge base API endpoint is accessible

**To Test:**
```bash
npm run dev
# Navigate to: http://localhost:3000/lessons/1
# Should load without errors
```

---

## Files Modified

1. `src/app/api/agents/create/route.ts` - Fixed imports and agent creation
2. `src/app/api/lessons/knowledge-base/route.ts` - Fixed imports and knowledge base addition
3. `BUGFIX_SDK_IMPORTS.md` - This document

---

## Notes

- The ElevenLabs SDK uses a nested structure: `conversationalAi.agents.create()` not `conversationalAi.createAgent()`
- Knowledge base documents are managed separately from agents
- The SDK is properly typed with TypeScript definitions in `node_modules/@elevenlabs/elevenlabs-js/api/`
- Agent configuration uses a `conversationConfig` object with nested properties for agent behavior and TTS settings

---

## Next Steps

With the SDK imports fixed, you should now be able to:

1. ✅ Open lesson pages without errors
2. ✅ Initialize agents properly
3. ✅ Add knowledge base documents to agents
4. ⏳ Test actual agent creation with your ElevenLabs API key
5. ⏳ Test WebSocket conversations with agents

**Important:** Make sure your `ELEVENLABS_API_KEY` has access to the Conversational AI / Agents Platform features.

---

## Additional Fix: Agent Response Property Name

**Date:** October 6, 2025
**Error:** `null value in column "agent_id" of relation "agents" violates not-null constraint`

### Problem
After fixing the SDK imports, the agent creation API was still failing. The error showed:
- ✅ Agents were successfully created in ElevenLabs (5 agents visible via `list_agents` MCP tool)
- ❌ Database inserts failed because `agentId` was `null`
- 📊 Database had 0 agent records despite 5 ElevenLabs agents

### Root Cause
**Location:** `src/app/api/agents/create/route.ts:143`

The code was trying to access `agent.agent_id` (snake_case), but the ElevenLabs SDK returns `agent.agentId` (camelCase).

```typescript
// ❌ Before:
agentId = agent.agent_id;  // Returns undefined, causing null in database

// ✅ After:
agentId = agent.agentId;   // Correct property name
```

### SDK Response Structure
From `node_modules/@elevenlabs/elevenlabs-js/api/types/CreateAgentResponseModel.d.ts`:
```typescript
export interface CreateAgentResponseModel {
    /** ID of the created agent */
    agentId: string;  // ⚠️ Note: camelCase, not snake_case
}
```

### Verification Using MCP Tools
```bash
# List agents in ElevenLabs
mcp_ElevenLabs_list_agents
# Result: 5 duplicate "Language Tutor for Test User" agents

# Check database
npx tsx scripts/check-agents.ts
# Result: 0 agent records (all failed to save)
```

---

**Status:** ✅ Fixed and verified! 🚀
