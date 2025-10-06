# Multilingual Design - Language Teacher

## Overview

The Language Teacher application now fully supports multilingual conversations where the AI agent speaks **entirely in the user's native language** (e.g., Hindi) while teaching them a target language (e.g., English).

## Key Design Principle

**The agent ALWAYS communicates in the user's conversation language (Language B) to teach the target language (Language A).**

### Example: Hindi Speaker Learning English

**User Settings:**
- Conversation Language: Hindi (hi)
- Target Language: English (en)

**Conversation Flow:**
1. **Agent (in Hindi):** "चलिए एक सरल अभिवादन से शुरू करते हैं। अंग्रेजी में 'Hello' कैसे कहते हैं?"
   - *Translation: "Let's start with a simple greeting. How do you say 'Hello' in English?"*

2. **User:** "Hello" (speaks the English word)

3. **Agent (in Hindi):** "बहुत बढ़िया! 'Hello' सही है।"
   - *Translation: "Great job! 'Hello' is correct."*

## Implementation

### 1. Multilingual Content System

**File:** `src/lib/multilingual-data.ts`

This file contains all lesson content with translations for multiple languages:

```typescript
{
  id: 1,
  lessonId: 1,
  targetPhraseA: "Hello",  // The English phrase to learn
  expectedUserResponse: "Hello",
  translations: {
    en: {
      agentPromptB: "How do you say 'Hello' in English?",
      successFeedback: "Great job! 'Hello' is correct.",
      failureFeedback: "Not quite. The correct answer is 'Hello'."
    },
    hi: {
      agentPromptB: "अंग्रेजी में 'Hello' कैसे कहते हैं?",
      successFeedback: "बहुत बढ़िया! 'Hello' सही है।",
      failureFeedback: "सही उत्तर 'Hello' है।"
    },
    es: { /* Spanish translations */ },
    fr: { /* French translations */ }
  }
}
```

**Helper Function:**
```typescript
getLessonStepContent(stepId, conversationLanguage)
```
This function retrieves the lesson step content in the user's conversation language.

### 2. Database Schema

**Users Table:**
- `conversationLanguage` (varchar): User's native language (e.g., 'hi', 'es', 'fr')
- `targetLanguage` (varchar): Language they want to learn (e.g., 'en')
- `preferredVoiceId` (varchar): ElevenLabs voice ID for TTS

**Lessons Table:**
- `targetLanguage` (varchar): Language being taught
- `instructionLanguage` (varchar): Default instruction language

### 3. Conversation API Flow

**File:** `src/app/api/conversation/route.ts`

1. **Fetch User Settings:**
   ```typescript
   const conversationLang = user.conversationLanguage || "en";
   ```

2. **Get Localized Content:**
   ```typescript
   const currentStep = getLessonStepContent(user.progress, conversationLang);
   ```

3. **Generate Audio in User's Language:**
   ```typescript
   const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
     text: responseText,
     model_id: "eleven_multilingual_v2",
     language_code: conversationLang  // Critical: TTS in user's language
   });
   ```

### 4. HTTP Header Encoding Fix

**Problem:** Non-ASCII characters (Hindi: देवनागरी, Arabic: العربية) cannot be sent in HTTP headers.

**Solution:** Base64 encoding
```typescript
// Backend
headers.set("X-User-Transcription", Buffer.from(transcribedText).toString('base64'));
headers.set("X-Encoding", "base64");

// Frontend
if (encoding === 'base64') {
  userTranscription = atob(userTranscription);
  agentResponse = atob(agentResponse);
}
```

### 5. User Settings UI

**File:** `src/app/settings/page.tsx`

Users can select:
- **Conversation Language:** The language the agent speaks (Hindi, Spanish, French, English)
- **Target Language:** The language they want to learn (currently English)

## Supported Languages

| Code | Language | Script | Status |
|------|----------|--------|--------|
| `en` | English | Latin | ✅ Full support |
| `hi` | Hindi | Devanagari (देवनागरी) | ✅ Full support |
| `es` | Spanish | Latin | ✅ Full support |
| `fr` | French | Latin | ✅ Full support |

## ElevenLabs Integration

### Text-to-Speech (TTS)
- **Model:** `eleven_multilingual_v2`
- **Language Parameter:** `language_code` set to user's conversation language
- **Voice:** Configurable per user (stored in `preferredVoiceId`)

### Speech-to-Text (STT)
- **Model:** `scribe_v1`
- **Multi-language Detection:** Automatically detects mixed-language input
- **Supported:** User can speak in their native language mixed with target language phrases

## Testing the Feature

1. **Login** to the application
2. **Go to Settings** (`/settings`)
3. **Select Languages:**
   - Conversation Language: Hindi
   - Target Language: English
4. **Save Settings**
5. **Start a Lesson** (`/lessons/1`)
6. **Click "Start Recording"** and speak
7. **Agent Response:** Will be in Hindi, teaching English

## Future Enhancements

### Pending Tasks (from IMPLEMENTATION_PLAN.md)

1. **Display Current Language Pair:**
   - Show "Learning: English | Speaking: Hindi" in header

2. **Voice Selection:**
   - Allow users to choose from Hindi-speaking voices
   - Preview voices before selection

3. **Advanced Response Validation:**
   - Handle mixed-language responses better
   - Fuzzy matching for pronunciation variations
   - Language-specific validation rules

4. **More Languages:**
   - Add support for: Arabic, Mandarin, Japanese, German, etc.
   - Expand target languages beyond English

5. **STT Language Configuration:**
   - Explicitly configure STT for multi-language detection
   - Test with various language combinations

## Technical Notes

### Why This Design?

1. **Pedagogical Effectiveness:** Research shows learners understand better when instructions are in their native language
2. **User Comfort:** Users feel more comfortable and confident
3. **Clear Separation:** Clear distinction between "language I understand" and "language I'm learning"
4. **Scalability:** Easy to add new languages by adding translations

### Challenges Solved

1. **HTTP Header Encoding:** Non-ASCII characters in headers → Base64 encoding
2. **Content Localization:** Hard-coded English content → Translation system
3. **TTS Language:** Agent speaking wrong language → `language_code` parameter
4. **Database Schema:** No language preferences → Added language fields

## Code Examples

### Adding a New Language

To add German support:

1. **Add translations to `multilingual-data.ts`:**
```typescript
de: {
  agentPromptB: "Wie sagt man 'Hello' auf Englisch?",
  successFeedback: "Sehr gut! 'Hello' ist richtig.",
  failureFeedback: "Nicht ganz. Die richtige Antwort ist 'Hello'."
}
```

2. **Update language selection UI** in `settings/page.tsx`:
```typescript
<option value="de">German (Deutsch)</option>
```

3. **Update completion messages** in `conversation/route.ts`:
```typescript
de: "Sie haben alle Lektionen abgeschlossen. Glückwunsch!"
```

That's it! The system will automatically use German for all agent responses.

## Summary

The Language Teacher now provides a truly multilingual experience where:
- ✅ Agent speaks 100% in user's native language
- ✅ User learns target language through native language instruction
- ✅ All content is properly localized
- ✅ HTTP encoding handles all scripts (Latin, Devanagari, etc.)
- ✅ ElevenLabs TTS generates natural-sounding speech in correct language
- ✅ Users can configure their language preferences
- ✅ System supports Hindi, Spanish, French, and English

This design aligns with the PRD requirement for "Bilingual Conversation" and provides a solid foundation for expanding to more languages.
