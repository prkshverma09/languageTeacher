/**
 * Extended Lesson Data for Agent-Based Learning
 * This file contains comprehensive lesson content with multiple phrases per lesson
 */

export interface ExtendedLessonObjective {
  phrase: string;
  usage: string;
  context: string;
  example: string;
  pronunciation?: string;
}

export interface ExtendedExampleConversation {
  situation: string;
  dialogue: string;
}

export interface CommonMistake {
  error: string;
  correction: string;
  explanation: string;
}

export interface LessonTranslations {
  greeting: string;
  objectivesIntro: string;
  teachingPoints: string[];
  conclusion: string;
  commonMistakes: CommonMistake[];
}

export interface ExtendedLesson {
  id: number;
  title: string;
  description: string;
  targetLanguage: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  estimatedDuration: number; // minutes
  learningObjectives: ExtendedLessonObjective[];
  teachingGuidance: string;
  exampleConversations: ExtendedExampleConversation[];
  translations: {
    [languageCode: string]: LessonTranslations;
  };
}

export const extendedLessons: ExtendedLesson[] = [
  {
    id: 1,
    title: "Daily Greetings and Introductions",
    description:
      "Learn essential greetings and how to introduce yourself in English",
    targetLanguage: "en",
    difficultyLevel: "beginner",
    estimatedDuration: 15,
    learningObjectives: [
      {
        phrase: "Hello / Hi",
        usage: "General greeting for any time of day",
        context: "Used with friends, colleagues, and strangers",
        example: "Hello! How are you today?",
        pronunciation: "heh-LOH / hahy",
      },
      {
        phrase: "Good morning",
        usage: "Greeting used before noon",
        context: "More formal than 'Hi', suitable for work and formal settings",
        example: "Good morning, everyone!",
        pronunciation: "good MOR-ning",
      },
      {
        phrase: "Good afternoon",
        usage: "Greeting used from noon to evening",
        context: "Polite greeting for business and formal settings",
        example: "Good afternoon, sir.",
        pronunciation: "good af-ter-NOON",
      },
      {
        phrase: "Good evening",
        usage: "Greeting used after sunset",
        context: "Formal greeting for evening time",
        example: "Good evening! Welcome to our restaurant.",
        pronunciation: "good EEV-ning",
      },
      {
        phrase: "How are you?",
        usage: "Asking about someone's wellbeing",
        context: "Common follow-up to greeting",
        example: "Hello! How are you?",
        pronunciation: "how ar yoo",
      },
      {
        phrase: "Nice to meet you",
        usage: "When meeting someone for the first time",
        context: "After introduction or being introduced",
        example: "Hi, I'm John. Nice to meet you!",
        pronunciation: "nahys too meet yoo",
      },
      {
        phrase: "My name is...",
        usage: "Introducing yourself",
        context: "Formal way to state your name",
        example: "My name is Sarah. What's yours?",
        pronunciation: "mahy neym iz",
      },
    ],
    teachingGuidance: `
1. Start with the most common greeting "Hello/Hi"
2. Teach time-specific greetings (morning, afternoon, evening)
3. Introduce "How are you?" and common responses
4. Practice self-introduction with "My name is..."
5. Use role-play scenarios: meeting a new colleague, greeting a shopkeeper
6. Have student practice pronunciation multiple times
7. Create mini-conversations combining multiple phrases
8. Correct gently with encouragement
9. Ensure student understands when to use formal vs. informal greetings
    `.trim(),
    exampleConversations: [
      {
        situation: "Meeting a colleague at work in the morning",
        dialogue: `
Person A: Good morning, John!
Person B: Good morning! How are you?
Person A: I'm fine, thank you. And you?
Person B: I'm good, thanks!
        `.trim(),
      },
      {
        situation: "Introducing yourself to a new neighbor",
        dialogue: `
Person A: Hello! I just moved in next door.
Person B: Oh, welcome! Nice to meet you.
Person A: Thank you! My name is Emma. What's your name?
Person B: I'm David. Nice to meet you too, Emma!
        `.trim(),
      },
      {
        situation: "Greeting a friend in the evening",
        dialogue: `
Person A: Hi! Good evening!
Person B: Hey! Good evening! How are you?
Person A: I'm great, thanks! How about you?
Person B: I'm good too!
        `.trim(),
      },
    ],
    translations: {
      hi: {
        greeting: `नमस्ते! आज हम अंग्रेजी में अभिवादन और परिचय सीखेंगे। यह पहला पाठ है, और हम सात महत्वपूर्ण वाक्यांश सीखेंगे। क्या आप तैयार हैं?`,
        objectivesIntro: `इस पाठ में, हम सीखेंगे कि अंग्रेजी में कैसे अभिवादन करें और अपना परिचय दें। हम "Hello", "Good morning", "How are you" जैसे वाक्यांश सीखेंगे।`,
        teachingPoints: [
          "पहले हम सबसे आम अभिवादन 'Hello' और 'Hi' सीखेंगे",
          "फिर हम दिन के अलग-अलग समय के लिए अभिवादन सीखेंगे",
          "हम यह भी सीखेंगे कि अपना नाम कैसे बताएं",
        ],
        conclusion: `बहुत बढ़िया! आपने आज सात महत्वपूर्ण अंग्रेजी अभिवादन सीखे। अब आप किसी से मिलने पर उसका स्वागत कर सकते हैं और अपना परिचय दे सकते हैं। अगले पाठ में हम और अधिक रोज़मर्रा के वाक्यांश सीखेंगे।`,
        commonMistakes: [
          {
            error: "Good night कहना अभिवादन के लिए",
            correction: "Good evening कहें",
            explanation:
              "अंग्रेजी में 'Good night' केवल विदाई के समय कहते हैं, अभिवादन के लिए नहीं",
          },
          {
            error: "What is your name? की जगह What's you name? कहना",
            correction: "What's your name? या What is your name?",
            explanation: "your को you से बदल देना एक आम गलती है",
          },
        ],
      },
      es: {
        greeting: `¡Hola! Hoy vamos a aprender saludos e introducciones en inglés. Esta es la primera lección y aprenderemos siete frases importantes. ¿Estás listo?`,
        objectivesIntro: `En esta lección, aprenderemos cómo saludar en inglés y presentarnos. Aprenderemos frases como "Hello", "Good morning", "How are you".`,
        teachingPoints: [
          "Primero aprenderemos los saludos más comunes 'Hello' y 'Hi'",
          "Luego aprenderemos saludos para diferentes momentos del día",
          "También aprenderemos cómo decir nuestro nombre",
        ],
        conclusion: `¡Excelente! Hoy has aprendido siete saludos importantes en inglés. Ahora puedes saludar a alguien cuando lo conoces y presentarte. En la próxima lección aprenderemos más frases cotidianas.`,
        commonMistakes: [
          {
            error: "Decir Good night como saludo",
            correction: "Di Good evening",
            explanation:
              "En inglés, 'Good night' solo se usa para despedirse, no para saludar",
          },
          {
            error: "Decir What's you name? en lugar de What's your name?",
            correction: "What's your name? o What is your name?",
            explanation: "Reemplazar your por you es un error común",
          },
        ],
      },
      fr: {
        greeting: `Bonjour ! Aujourd'hui, nous allons apprendre les salutations et présentations en anglais. C'est la première leçon et nous apprendrons sept phrases importantes. Êtes-vous prêt ?`,
        objectivesIntro: `Dans cette leçon, nous apprendrons comment saluer en anglais et nous présenter. Nous apprendrons des phrases comme "Hello", "Good morning", "How are you".`,
        teachingPoints: [
          "D'abord, nous apprendrons les salutations les plus courantes 'Hello' et 'Hi'",
          "Ensuite, nous apprendrons les salutations pour différents moments de la journée",
          "Nous apprendrons aussi comment dire notre nom",
        ],
        conclusion: `Excellent ! Vous avez appris sept salutations importantes en anglais aujourd'hui. Maintenant vous pouvez saluer quelqu'un quand vous le rencontrez et vous présenter. Dans la prochaine leçon, nous apprendrons plus de phrases quotidiennes.`,
        commonMistakes: [
          {
            error: "Dire Good night comme salutation",
            correction: "Dites Good evening",
            explanation:
              "En anglais, 'Good night' s'utilise seulement pour dire au revoir, pas pour saluer",
          },
          {
            error: "Dire What's you name? au lieu de What's your name?",
            correction: "What's your name? ou What is your name?",
            explanation: "Remplacer your par you est une erreur courante",
          },
        ],
      },
      en: {
        greeting: `Hello! Today we'll learn greetings and introductions in English. This is the first lesson and we'll learn seven important phrases. Are you ready?`,
        objectivesIntro: `In this lesson, we'll learn how to greet people in English and introduce ourselves. We'll learn phrases like "Hello", "Good morning", "How are you".`,
        teachingPoints: [
          "First we'll learn the most common greetings 'Hello' and 'Hi'",
          "Then we'll learn time-specific greetings",
          "We'll also learn how to say our name",
        ],
        conclusion: `Excellent! You've learned seven important English greetings today. Now you can greet someone when you meet them and introduce yourself. In the next lesson, we'll learn more everyday phrases.`,
        commonMistakes: [
          {
            error: "Saying Good night as a greeting",
            correction: "Say Good evening",
            explanation:
              "In English, 'Good night' is only used to say goodbye, not to greet",
          },
          {
            error: "Saying What's you name? instead of What's your name?",
            correction: "What's your name? or What is your name?",
            explanation: "Replacing your with you is a common mistake",
          },
        ],
      },
    },
  },
  {
    id: 2,
    title: "Common Courtesy Phrases",
    description: "Learn polite phrases for everyday interactions",
    targetLanguage: "en",
    difficultyLevel: "beginner",
    estimatedDuration: 12,
    learningObjectives: [
      {
        phrase: "Please",
        usage: "Making a polite request",
        context: "Used when asking for something or asking someone to do something",
        example: "Can you help me, please?",
        pronunciation: "pleez",
      },
      {
        phrase: "Thank you / Thanks",
        usage: "Expressing gratitude",
        context: "'Thank you' is more formal, 'Thanks' is casual",
        example: "Thank you very much for your help!",
        pronunciation: "THANGK yoo / thanks",
      },
      {
        phrase: "You're welcome",
        usage: "Responding to thank you",
        context: "Polite response when someone thanks you",
        example: "Thank you! - You're welcome!",
        pronunciation: "yor WEL-kuhm",
      },
      {
        phrase: "Excuse me",
        usage: "Getting attention politely or apologizing",
        context: "Used before asking a question or passing by someone",
        example: "Excuse me, where is the bathroom?",
        pronunciation: "ek-SKYOOZ mee",
      },
      {
        phrase: "I'm sorry / Sorry",
        usage: "Apologizing",
        context: "'I'm sorry' is more formal, 'Sorry' is casual",
        example: "I'm sorry, I didn't mean to bump into you.",
        pronunciation: "ahy-m SOR-ee / SOR-ee",
      },
      {
        phrase: "No problem",
        usage: "Casual response to apology or thanks",
        context: "Informal way to say 'you're welcome' or 'it's okay'",
        example: "Sorry about that! - No problem!",
        pronunciation: "noh PROB-luhm",
      },
    ],
    teachingGuidance: `
1. Start with "Please" and emphasize its importance in polite English
2. Teach "Thank you" and its response "You're welcome"
3. Introduce "Excuse me" for different contexts (getting attention, passing by)
4. Teach "I'm sorry" and appropriate responses
5. Practice with realistic scenarios: shopping, asking for directions, apologizing
6. Emphasize the difference between formal and casual versions
7. Have student practice tone and intonation
8. Create role-play dialogues combining multiple phrases
    `.trim(),
    exampleConversations: [
      {
        situation: "Asking for help in a store",
        dialogue: `
Customer: Excuse me, can you help me, please?
Employee: Of course! What do you need?
Customer: Where can I find the milk?
Employee: It's in aisle 5, on the left.
Customer: Thank you very much!
Employee: You're welcome!
        `.trim(),
      },
      {
        situation: "Apologizing for being late",
        dialogue: `
Person A: I'm sorry I'm late. The traffic was terrible.
Person B: No problem! Don't worry about it.
Person A: Thank you for understanding.
Person B: You're welcome.
        `.trim(),
      },
    ],
    translations: {
      hi: {
        greeting: `नमस्ते! आज हम अंग्रेजी में विनम्र वाक्यांश सीखेंगे। ये वाक्यांश रोज़ाना की बातचीत में बहुत ज़रूरी हैं। चलिए शुरू करते हैं!`,
        objectivesIntro: `इस पाठ में हम "Please", "Thank you", "Excuse me", और "Sorry" जैसे विनम्र वाक्यांश सीखेंगे।`,
        teachingPoints: [
          "पहले हम 'Please' सीखेंगे - यह विनम्रता से मांगने के लिए है",
          "फिर 'Thank you' और उसका जवाब 'You're welcome'",
          "हम 'Excuse me' और 'Sorry' का सही उपयोग भी सीखेंगे",
        ],
        conclusion: `शाबाश! अब आप जानते हैं कि अंग्रेजी में विनम्रता से कैसे बात करें। ये वाक्यांश आपको हर दिन काम आएंगे।`,
        commonMistakes: [],
      },
      es: {
        greeting: `¡Hola! Hoy aprenderemos frases de cortesía en inglés. Estas frases son muy importantes en las conversaciones diarias. ¡Comencemos!`,
        objectivesIntro: `En esta lección aprenderemos frases corteses como "Please", "Thank you", "Excuse me" y "Sorry".`,
        teachingPoints: [
          "Primero aprenderemos 'Please' - para pedir cosas cortésmente",
          "Luego 'Thank you' y su respuesta 'You're welcome'",
          "También aprenderemos el uso correcto de 'Excuse me' y 'Sorry'",
        ],
        conclusion: `¡Bien hecho! Ahora sabes cómo hablar cortésmente en inglés. Estas frases te serán útiles todos los días.`,
        commonMistakes: [],
      },
      fr: {
        greeting: `Bonjour ! Aujourd'hui nous apprendrons des phrases de politesse en anglais. Ces phrases sont très importantes dans les conversations quotidiennes. Commençons !`,
        objectivesIntro: `Dans cette leçon, nous apprendrons des phrases polies comme "Please", "Thank you", "Excuse me" et "Sorry".`,
        teachingPoints: [
          "D'abord nous apprendrons 'Please' - pour demander poliment",
          "Ensuite 'Thank you' et sa réponse 'You're welcome'",
          "Nous apprendrons aussi l'usage correct de 'Excuse me' et 'Sorry'",
        ],
        conclusion: `Bien joué ! Maintenant vous savez comment parler poliment en anglais. Ces phrases vous seront utiles tous les jours.`,
        commonMistakes: [],
      },
      en: {
        greeting: `Hello! Today we'll learn polite phrases in English. These phrases are very important in daily conversations. Let's get started!`,
        objectivesIntro: `In this lesson, we'll learn polite phrases like "Please", "Thank you", "Excuse me", and "Sorry".`,
        teachingPoints: [
          "First we'll learn 'Please' - for making polite requests",
          "Then 'Thank you' and its response 'You're welcome'",
          "We'll also learn the correct use of 'Excuse me' and 'Sorry'",
        ],
        conclusion: `Well done! Now you know how to speak politely in English. These phrases will be useful to you every day.`,
        commonMistakes: [],
      },
    },
  },
];

// Export helper function to get lesson by ID
export function getExtendedLessonById(id: number): ExtendedLesson | undefined {
  return extendedLessons.find((lesson) => lesson.id === id);
}

// Export helper to get lesson translations
export function getLessonTranslations(
  lessonId: number,
  languageCode: string
): LessonTranslations | undefined {
  const lesson = getExtendedLessonById(lessonId);
  return lesson?.translations[languageCode];
}
