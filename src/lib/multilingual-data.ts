// Multilingual lesson content
// The agent speaks in the instruction language (e.g., Hindi)
// The user learns the target language (e.g., English)

type MultilingualLessonStep = {
  id: number;
  lessonId: number;
  targetPhraseA: string; // The phrase in the target language (e.g., "Hello" in English)
  expectedUserResponse: string; // What we expect the user to say
  // Translations for different instruction languages
  translations: {
    [languageCode: string]: {
      agentPromptB: string; // Agent's instruction in this language
      successFeedback: string; // Success message in this language
      failureFeedback: string; // Failure message in this language
    };
  };
  nextStepId: number | null;
};

export const multilingualLessons = [
  {
    id: 1,
    title: "Lesson 1: Greetings",
    description: "Learn basic greetings in English.",
    targetLanguage: "en",
    instructionLanguage: "en" // Default, will be overridden
  },
  {
    id: 2,
    title: "Lesson 2: Common Phrases",
    description: "Learn common phrases for everyday conversations.",
    targetLanguage: "en",
    instructionLanguage: "en" // Default, will be overridden
  },
];

export const multilingualLessonSteps: MultilingualLessonStep[] = [
  // Lesson 1 Steps
  {
    id: 1,
    lessonId: 1,
    targetPhraseA: "Hello",
    expectedUserResponse: "Hello",
    translations: {
      en: {
        agentPromptB: "Let's start with a simple greeting. How do you say 'Hello' in English?",
        successFeedback: "Great job! 'Hello' is correct.",
        failureFeedback: "Not quite. The correct answer is 'Hello'. Let's try again.",
      },
      hi: {
        agentPromptB: "चलिए एक सरल अभिवादन से शुरू करते हैं। अंग्रेजी में 'Hello' कैसे कहते हैं?",
        successFeedback: "बहुत बढ़िया! 'Hello' सही है।",
        failureFeedback: "बिल्कुल नहीं। सही उत्तर 'Hello' है। फिर से कोशिश करते हैं।",
      },
      es: {
        agentPromptB: "Comencemos con un saludo simple. ¿Cómo se dice 'Hello' en inglés?",
        successFeedback: "¡Muy bien! 'Hello' es correcto.",
        failureFeedback: "No del todo. La respuesta correcta es 'Hello'. Intentemos de nuevo.",
      },
      fr: {
        agentPromptB: "Commençons par une salutation simple. Comment dit-on 'Hello' en anglais?",
        successFeedback: "Excellent! 'Hello' est correct.",
        failureFeedback: "Pas tout à fait. La bonne réponse est 'Hello'. Essayons encore.",
      },
    },
    nextStepId: 2,
  },
  {
    id: 2,
    lessonId: 1,
    targetPhraseA: "Goodbye",
    expectedUserResponse: "Goodbye",
    translations: {
      en: {
        agentPromptB: "Now, how do you say 'Goodbye' in English?",
        successFeedback: "Excellent! 'Goodbye' is correct.",
        failureFeedback: "That's not it. The correct answer is 'Goodbye'. Let's practice.",
      },
      hi: {
        agentPromptB: "अब, अंग्रेजी में 'Goodbye' कैसे कहते हैं?",
        successFeedback: "उत्कृष्ट! 'Goodbye' सही है।",
        failureFeedback: "यह नहीं है। सही उत्तर 'Goodbye' है। अभ्यास करते हैं।",
      },
      es: {
        agentPromptB: "Ahora, ¿cómo se dice 'Goodbye' en inglés?",
        successFeedback: "¡Excelente! 'Goodbye' es correcto.",
        failureFeedback: "Eso no es. La respuesta correcta es 'Goodbye'. Practiquemos.",
      },
      fr: {
        agentPromptB: "Maintenant, comment dit-on 'Goodbye' en anglais?",
        successFeedback: "Excellent! 'Goodbye' est correct.",
        failureFeedback: "Ce n'est pas ça. La bonne réponse est 'Goodbye'. Pratiquons.",
      },
    },
    nextStepId: null,
  },
  // Lesson 2 Steps
  {
    id: 3,
    lessonId: 2,
    targetPhraseA: "Thank you",
    expectedUserResponse: "Thank you",
    translations: {
      en: {
        agentPromptB: "Let's learn a useful phrase. How do you say 'Thank you' in English?",
        successFeedback: "Perfect! 'Thank you' is a very important phrase.",
        failureFeedback: "Almost there. The correct phrase is 'Thank you'.",
      },
      hi: {
        agentPromptB: "चलिए एक उपयोगी वाक्यांश सीखते हैं। अंग्रेजी में 'Thank you' कैसे कहते हैं?",
        successFeedback: "बिल्कुल सही! 'Thank you' एक बहुत महत्वपूर्ण वाक्यांश है।",
        failureFeedback: "लगभग सही। सही वाक्यांश 'Thank you' है।",
      },
      es: {
        agentPromptB: "Aprendamos una frase útil. ¿Cómo se dice 'Thank you' en inglés?",
        successFeedback: "¡Perfecto! 'Thank you' es una frase muy importante.",
        failureFeedback: "Casi. La frase correcta es 'Thank you'.",
      },
      fr: {
        agentPromptB: "Apprenons une phrase utile. Comment dit-on 'Thank you' en anglais?",
        successFeedback: "Parfait! 'Thank you' est une phrase très importante.",
        failureFeedback: "Presque. La phrase correcte est 'Thank you'.",
      },
    },
    nextStepId: 4,
  },
  {
    id: 4,
    lessonId: 2,
    targetPhraseA: "You're welcome",
    expectedUserResponse: "You're welcome",
    translations: {
      en: {
        agentPromptB: "How about 'You're welcome'?",
        successFeedback: "You've got it!",
        failureFeedback: "Not quite. It's 'You're welcome'.",
      },
      hi: {
        agentPromptB: "'You're welcome' के बारे में क्या?",
        successFeedback: "आपने समझ लिया!",
        failureFeedback: "बिल्कुल नहीं। यह 'You're welcome' है।",
      },
      es: {
        agentPromptB: "¿Qué tal 'You're welcome'?",
        successFeedback: "¡Lo tienes!",
        failureFeedback: "No del todo. Es 'You're welcome'.",
      },
      fr: {
        agentPromptB: "Et 'You're welcome'?",
        successFeedback: "Vous l'avez!",
        failureFeedback: "Pas tout à fait. C'est 'You're welcome'.",
      },
    },
    nextStepId: null,
  },
];

// Helper function to get lesson step content in the user's conversation language
export function getLessonStepContent(
  stepId: number,
  conversationLanguage: string
): {
  targetPhraseA: string;
  expectedUserResponse: string;
  agentPromptB: string;
  successFeedback: string;
  failureFeedback: string;
  nextStepId: number | null;
} | null {
  const step = multilingualLessonSteps.find((s) => s.id === stepId);
  if (!step) return null;

  // Get translations for the conversation language, fallback to English
  const translation = step.translations[conversationLanguage] || step.translations['en'];

  return {
    targetPhraseA: step.targetPhraseA,
    expectedUserResponse: step.expectedUserResponse,
    agentPromptB: translation.agentPromptB,
    successFeedback: translation.successFeedback,
    failureFeedback: translation.failureFeedback,
    nextStepId: step.nextStepId,
  };
}
