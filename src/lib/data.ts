export const lessons = [
  { id: 1, title: "Lesson 1: Greetings", description: "Learn basic greetings in English." },
  { id: 2, title: "Lesson 2: Common Phrases", description: "Learn common phrases for everyday conversations." },
];

export const lessonSteps = [
  // Lesson 1 Steps
  {
    id: 1,
    lessonId: 1,
    agentPromptB: "Let's start with a simple greeting. How do you say 'Hello' in English?",
    targetPhraseA: "Hello",
    expectedUserResponse: "Hello",
    successFeedback: "Great job! 'Hello' is correct.",
    failureFeedback: "Not quite. The correct answer is 'Hello'. Let's try again.",
    nextStepId: 2,
  },
  {
    id: 2,
    lessonId: 1,
    agentPromptB: "Now, how do you say 'Goodbye' in English?",
    targetPhraseA: "Goodbye",
    expectedUserResponse: "Goodbye",
    successFeedback: "Excellent! 'Goodbye' is correct.",
    failureFeedback: "That's not it. The correct answer is 'Goodbye'. Let's practice.",
    nextStepId: null,
  },
  // Lesson 2 Steps
  {
    id: 3,
    lessonId: 2,
    agentPromptB: "Let's learn a useful phrase. How do you say 'Thank you' in English?",
    targetPhraseA: "Thank you",
    expectedUserResponse: "Thank you",
    successFeedback: "Perfect! 'Thank you' is a very important phrase.",
    failureFeedback: "Almost there. The correct phrase is 'Thank you'.",
    nextStepId: 4,
  },
  {
    id: 4,
    lessonId: 2,
    agentPromptB: "How about 'You're welcome'?",
    targetPhraseA: "You're welcome",
    expectedUserResponse: "You're welcome",
    successFeedback: "You've got it!",
    failureFeedback: "Not quite. It's 'You're welcome'.",
    nextStepId: null,
  },
];