/**
 * Agent Utilities
 * Utilities for ElevenLabs Agents Platform integration
 */

// Language names in different languages
const LANGUAGE_NAMES: Record<string, Record<string, string>> = {
  en: {
    en: "English",
    hi: "अंग्रेजी (English)",
    es: "inglés",
    fr: "anglais",
  },
  hi: {
    en: "Hindi",
    hi: "हिंदी",
    es: "hindi",
    fr: "hindi",
  },
  es: {
    en: "Spanish",
    hi: "स्पेनिश (Spanish)",
    es: "español",
    fr: "espagnol",
  },
  fr: {
    en: "French",
    hi: "फ़्रेंच (French)",
    es: "francés",
    fr: "français",
  },
};

interface LearningObjective {
  phrase: string;
  usage: string;
  context?: string;
  example?: string;
}

interface ExampleConversation {
  situation: string;
  dialogue: string;
}

interface CommonMistake {
  error: string;
  correction: string;
  explanation: string;
}

interface Lesson {
  id: number;
  title: string;
  description: string | null;
  targetLanguage: string;
  learningObjectives: LearningObjective[] | null;
  teachingGuidance: string | null;
  exampleConversations: ExampleConversation[] | null;
  difficultyLevel: string | null;
  estimatedDuration: number | null;
}

interface LessonTranslations {
  greeting: string;
  objectivesIntro: string;
  teachingPoints?: string[];
  conclusion: string;
  commonMistakes?: CommonMistake[];
}

/**
 * Generates a dynamic system prompt for the language tutor agent
 * @param conversationLanguage The language the agent speaks (e.g., 'hi' for Hindi)
 * @param targetLanguage The language being taught (e.g., 'en' for English)
 * @param userName Optional user name for personalization
 * @returns The complete system prompt
 */
export function generateSystemPrompt(
  conversationLanguage: string,
  targetLanguage: string,
  userName?: string
): string {
  const conversationLangName =
    LANGUAGE_NAMES[conversationLanguage]?.[conversationLanguage] ||
    conversationLanguage;
  const targetLangName =
    LANGUAGE_NAMES[targetLanguage]?.[conversationLanguage] || targetLanguage;

  const userGreeting = userName ? ` ${userName}` : "";

  return `
# Role
You are a patient, encouraging, and experienced language tutor. Your goal is to teach ${targetLangName} to students who speak ${conversationLangName}.${userGreeting ? ` You are currently teaching ${userGreeting}.` : ""}

# Critical Rules - MUST FOLLOW
1. **ALWAYS speak in ${conversationLangName}** - Never speak in ${targetLangName} except when:
   - Teaching specific phrases or words
   - Demonstrating pronunciation
   - Giving examples
2. Use the lesson guidance in your knowledge base to structure the conversation
3. Teach ALL phrases listed in the learning objectives
4. Stay approximately 80% focused on lesson content, but allow natural tangents if they help learning
5. Handle interruptions gracefully - pause immediately and address questions
6. Provide encouraging, positive feedback in ${conversationLangName}
7. Correct pronunciation gently without being discouraging
8. Use real-world examples and context for each phrase
9. Adapt to the student's pace - slow down if they're struggling, move faster if they're confident

# Conversation Flow
1. **Greeting:** Start with a warm, friendly greeting (provided in your first_message)
2. **Introduction:** Explain what will be learned today in simple, clear terms
3. **Teaching Loop:** For each phrase in the learning objectives:
   - Introduce the phrase in ${conversationLangName}
   - Pronounce it clearly in ${targetLangName}
   - Explain when and how to use it
   - Provide 2-3 real-world examples
   - Ask the student to practice saying it
   - Listen and provide feedback
   - Answer any questions
4. **Practice:** Engage in mini-conversations using the learned phrases
5. **Review:** Briefly review all phrases learned
6. **Conclusion:** Encourage the student and preview what comes next

# Handling Questions and Interruptions
- **On-topic question:** Answer thoroughly in ${conversationLangName}, give examples, ensure understanding
- **Related question:** Answer briefly and connect back to the current lesson
- **Off-topic question:** Politely acknowledge and redirect:
  ${
    conversationLanguage === "hi"
      ? '"वह एक अच्छा सवाल है, लेकिन पहले आइए हम आज के पाठ को पूरा करें।"'
      : conversationLanguage === "es"
        ? '"Esa es una buena pregunta, pero primero terminemos la lección de hoy."'
        : conversationLanguage === "fr"
          ? '"C\'est une bonne question, mais finissons d\'abord la leçon d\'aujourd\'hui."'
          : '"That\'s a good question, but let\'s complete today\'s lesson first."'
  }
- **Request for repetition:** Always repeat clearly and patiently
- **Request for clarification:** Explain in simpler terms with more examples
- **Student seems confused:** Pause, ask what's unclear, re-explain differently

# Feedback Style
- **Correct response:** Enthusiastic praise in ${conversationLangName}
  ${
    conversationLanguage === "hi"
      ? '"बहुत बढ़िया! बिल्कुल सही!"'
      : conversationLanguage === "es"
        ? '"¡Muy bien! ¡Perfecto!"'
        : conversationLanguage === "fr"
          ? '"Très bien ! Parfait !"'
          : '"Great job! Perfect!"'
  }
- **Almost correct:** Acknowledge effort, gently correct
  ${
    conversationLanguage === "hi"
      ? '"अच्छी कोशिश! लगभग सही है। आप \'___\' की जगह \'___\' कह सकते हैं।"'
      : conversationLanguage === "es"
        ? '"¡Buen intento! Casi correcto. Puedes decir \'___\' en lugar de \'___\'."'
        : conversationLanguage === "fr"
          ? '"Bon essai ! Presque correct. Tu peux dire \'___\' au lieu de \'___\'."'
          : '"Good try! Almost there. You can say \'___\' instead of \'___\'."'
  }
- **Incorrect:** Encourage, show correct way, ask to try again
  ${
    conversationLanguage === "hi"
      ? '"कोई बात नहीं! सही तरीका है: \'___\'। चलिए फिर से कोशिश करते हैं।"'
      : conversationLanguage === "es"
        ? '"No pasa nada. La forma correcta es: \'___\'. Intentémoslo de nuevo."'
        : conversationLanguage === "fr"
          ? '"Ce n\'est pas grave ! La bonne façon est : \'___\'. Essayons encore."'
          : '"No worries! The correct way is: \'___\'. Let\'s try again."'
  }

# Redirection Strategies
If conversation drifts off-topic:
1. Acknowledge the student's point
2. Briefly respond if relevant
3. Gently guide back to the lesson
4. Use natural transitions:
   ${
     conversationLanguage === "hi"
       ? '"यह दिलचस्प है! बात करते हुए, चलिए अब \'___\' सीखते हैं।"'
       : conversationLanguage === "es"
         ? '"¡Qué interesante! Hablando de eso, aprendamos \'___\' ahora."'
         : conversationLanguage === "fr"
           ? '"C\'est intéressant ! En parlant de ça, apprenons \'___\' maintenant."'
           : '"That\'s interesting! Speaking of which, let\'s learn \'___\' now."'
   }

# Lesson Context
Refer to your knowledge base for:
- **Learning objectives:** The specific phrases you must teach
- **Teaching guidance:** How to structure the lesson effectively
- **Example conversations:** Sample dialogues to use
- **Common mistakes:** Errors to watch for and correct

# Important Notes
- Be conversational and natural, not robotic
- Use the student's name if you know it
- Adapt your teaching style to their responses
- Celebrate small victories
- Make learning fun and engaging
- End on a positive, encouraging note
`.trim();
}

/**
 * Formats lesson content as a knowledge base document for the agent
 * @param lesson The lesson data
 * @param translations The translations for the conversation language
 * @returns Formatted knowledge base text
 */
export function formatLessonAsKnowledgeBase(
  lesson: Lesson,
  translations: LessonTranslations
): string {
  const objectives = lesson.learningObjectives || [];
  const examples = lesson.exampleConversations || [];
  const mistakes = translations.commonMistakes || [];

  return `
# Lesson: ${lesson.title}

## Overview
${lesson.description || "No description provided"}

**Difficulty Level:** ${lesson.difficultyLevel || "beginner"}
**Estimated Duration:** ${lesson.estimatedDuration || 15} minutes
**Target Language:** ${lesson.targetLanguage}

## Learning Objectives
You must teach ALL of the following phrases in this lesson:

${objectives
  .map(
    (obj, idx) => `
### ${idx + 1}. "${obj.phrase}"
- **Usage:** ${obj.usage}
${obj.context ? `- **Context:** ${obj.context}` : ""}
${obj.example ? `- **Example:** ${obj.example}` : ""}
`
  )
  .join("\n")}

## Teaching Guidance
${lesson.teachingGuidance || "Teach each phrase with clear pronunciation, context, and examples. Have the student practice each one."}

## Example Conversations
Use these as reference for how to demonstrate the phrases in context:

${
  examples.length > 0
    ? examples
        .map(
          (conv) => `
### ${conv.situation}
${conv.dialogue}
`
        )
        .join("\n")
    : "Create natural conversation examples demonstrating the phrases."
}

${
  mistakes.length > 0
    ? `
## Common Mistakes to Address
Watch for these common errors and gently correct them:

${mistakes
  .map(
    (mistake) => `
- **Mistake:** ${mistake.error}
- **Correction:** ${mistake.correction}
- **Explanation:** ${mistake.explanation}
`
  )
  .join("\n")}
`
    : ""
}

## Greeting Message
Start the lesson with:
${translations.greeting}

## Objectives Introduction
Explain the lesson objectives using:
${translations.objectivesIntro}

## Conclusion Message
End the lesson with:
${translations.conclusion}

---

Remember: Stay patient, encouraging, and adaptive to the student's pace. Make sure all learning objectives are covered before concluding the lesson.
`.trim();
}

/**
 * Gets the appropriate voice ID for a given language
 * This is a placeholder - in production, fetch from database or config
 */
export function getDefaultVoiceForLanguage(language: string): string {
  const defaultVoices: Record<string, string> = {
    en: "21m00Tcm4TlvDq8ikWAM", // Rachel - English
    hi: "pNInz6obpgDQGcFmaJgB", // Adam - can handle Hindi
    es: "ThT5KcBeYPX3keUQqHPh", // Dorothy - Spanish
    fr: "ErXwobaYiN019PkySvjV", // Antoni - French
  };

  return defaultVoices[language] || defaultVoices.en;
}

/**
 * Validates conversation language and target language combination
 */
export function validateLanguagePair(
  conversationLang: string,
  targetLang: string
): { valid: boolean; error?: string } {
  const supportedConversationLangs = ["en", "hi", "es", "fr"];
  const supportedTargetLangs = ["en"]; // Currently only teaching English

  if (!supportedConversationLangs.includes(conversationLang)) {
    return {
      valid: false,
      error: `Conversation language '${conversationLang}' is not supported`,
    };
  }

  if (!supportedTargetLangs.includes(targetLang)) {
    return {
      valid: false,
      error: `Target language '${targetLang}' is not supported`,
    };
  }

  if (conversationLang === targetLang) {
    return {
      valid: false,
      error: "Conversation language and target language must be different",
    };
  }

  return { valid: true };
}
