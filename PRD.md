# Product Requirements Document: AI Language Tutor Voice Agent

### 1. Introduction and Vision 🗣️

This document outlines the product requirements for an AI-powered Language Tutor, a Next.js web application designed to teach a new language (Language A) to a user who is fluent in another (Language B). The core of the experience is a **natural, free-flowing voice conversation** with an AI agent that speaks in Language B to teach Language A. The platform leverages the **ElevenLabs Agents Platform** to create truly conversational, interruptible, and contextually-aware learning sessions that feel like talking to a real tutor.

**The vision** is to create a personalized, accessible, and engaging language learning tool that feels like having a natural conversation with a patient, knowledgeable tutor who adapts to your questions, pace, and learning style in real-time.

---

### 2. Goals and Objectives 🎯

* **Primary Goal:** To effectively teach a user the fundamentals of a new language (Language A) through interactive voice conversations.
* **Secondary Goal:** To provide a backend system that allows for easy creation, management, and editing of lesson plans, making the platform scalable and adaptable.
* **User Experience Goal:** To deliver a low-latency, seamless, and natural-sounding conversational experience that keeps users engaged.
* **Technical Goal:** To build a robust and scalable full-stack application using Next.js and the ElevenLabs Agents Platform.

---

### 3. Target Audience 👥

The primary target audience is individuals who are native speakers of one language (e.g., Hindi) and wish to learn another (e.g., English) from a beginner level. They are likely looking for a more practical, conversation-based learning method over traditional textbook or app-based approaches.

---

### 4. Product Features & Functionality

#### **Core Voice Interaction & Learning Experience**

* **Natural Conversational Flow:** The agent will engage in **natural, free-flowing conversations** without requiring users to press a "push to talk" button. The conversation should feel organic and continuous, powered by the ElevenLabs Agents Platform.
  * **Always-On Listening:** The agent is always ready to listen and respond, creating a seamless conversational experience.
  * **Interruptible:** Users can interrupt the agent at any time to ask questions, clarify concepts, or provide responses.
  * **Context-Aware:** The agent maintains conversation context and adapts responses based on the ongoing dialogue.

* **Bilingual Conversation:** The agent will **ALWAYS communicate in the user's native language (Language B)** to explain concepts, give instructions, and provide feedback. It will teach words and phrases from the target language (Language A) as part of the lesson.
  * **Example:** A Hindi speaker learning English will hear: *"नमस्ते! आज हम अंग्रेजी में अभिवादन सीखेंगे। क्या आप तैयार हैं? चलिए 'Hello' से शुरू करते हैं।"* (Hello! Today we'll learn greetings in English. Are you ready? Let's start with 'Hello'.)
  * **Language Selection:** Users select their conversation language (Language B - Hindi, Spanish, French) and target learning language (Language A - English) in their profile.
  * **Mixed Language Input:** The agent naturally handles responses mixing both languages (e.g., a Hindi speaker responding in Hindi with English phrases they're learning).
  * **Configurable per User:** Each user's language preferences are stored in their profile and used to configure their personal learning agent.
  * **Content Localization:** ALL lesson content and agent instructions are available in the user's conversation language.

* **Lesson Greeting & Introduction:** When a user starts a lesson, the agent automatically greets them and explains what the lesson will teach.
  * **Example:** *"नमस्ते! आज के पाठ में हम दैनिक जीवन के महत्वपूर्ण वाक्यांश सीखेंगे - जैसे कि परिचय, अभिवादन, और धन्यवाद कैसे करें। क्या आप शुरू करने के लिए तैयार हैं?"* (Hello! In today's lesson, we'll learn important daily life phrases - like introductions, greetings, and how to say thank you. Are you ready to start?)

* **Flexible Lesson Guidance:** Lessons serve as **guidance rather than strict scripts**, allowing the agent to:
  * Adapt to user questions and tangential discussions
  * Maintain focus on lesson objectives while allowing natural conversation flow
  * Redirect gently when conversation strays too far from learning goals
  * Provide additional examples or explanations based on user needs
  * Repeat or rephrase concepts when users show confusion

* **Extended Lesson Structure:** Lessons teach **multiple related concepts** in a single session rather than single words or phrases:
  * A "Greetings" lesson might cover: Hello, Good morning, How are you?, Thank you, Goodbye
  * A "Restaurant" lesson might cover: ordering food, asking for the bill, dietary restrictions, complimenting the chef
  * Each lesson lasts 10-20 minutes with natural conversation flow

* **Question & Interruption Handling:** Users can freely:
  * Ask questions about pronunciation, grammar, or usage
  * Request clarification or repetition
  * Ask for additional examples
  * Share experiences or make relevant comments
  * The agent responds naturally while keeping the conversation focused on learning

* **Lesson Progression:** The agent guides users through a pre-defined sequence of lessons, tracking progress and adapting to their pace.
* **Progress Management:** Users can reset their progress to restart lessons for practice purposes.

#### **Lesson Management System**

* **Dynamic Lesson Structure:** Lessons are stored in a database as **guidance documents** rather than strict scripts. Each lesson provides the agent with learning objectives and teaching material.

* **Editable Content:** A simple admin interface allows non-technical users to create, read, update, and delete lessons.

* **Lesson Components:** Each lesson is structured as a knowledge base that includes:
    * `lesson_id`: Unique identifier for the lesson
    * `title`: Lesson title (e.g., "Basic Greetings", "Restaurant Conversations")
    * `description`: Brief overview of what the lesson teaches
    * `target_language`: Language being taught (e.g., "en" for English)
    * `difficulty_level`: Beginner, Intermediate, Advanced
    * `estimated_duration`: Expected lesson length (10-20 minutes)
    * `learning_objectives`: List of specific phrases, words, or concepts to teach
    * `teaching_guidance`: Instructions for the agent on how to teach this material
    * `example_conversations`: Sample dialogues demonstrating the concepts
    * `translations`: Multilingual content for all supported conversation languages
        * `greeting`: What the agent says when starting the lesson
        * `objectives_intro`: How to explain the lesson objectives
        * `teaching_points`: Key phrases and their explanations
        * `conclusion`: How to wrap up the lesson

    **Example Structure:**
    ```javascript
    {
      id: 1,
      title: "Daily Greetings",
      targetLanguage: "en",
      difficultyLevel: "beginner",
      estimatedDuration: 15,
      learningObjectives: [
        { phrase: "Hello", usage: "General greeting" },
        { phrase: "Good morning", usage: "Morning greeting" },
        { phrase: "How are you?", usage: "Asking about wellbeing" },
        { phrase: "Thank you", usage: "Expressing gratitude" },
        { phrase: "Goodbye", usage: "Parting greeting" }
      ],
      teachingGuidance: "Teach each greeting, provide usage context, have user practice, correct pronunciation gently, allow questions, give real-world examples",
      translations: {
        hi: {
          greeting: "नमस्ते! आज हम अंग्रेजी में अभिवादन सीखेंगे...",
          objectivesIntro: "इस पाठ में हम पांच महत्वपूर्ण अभिवादन सीखेंगे...",
          teachingPoints: [...],
          conclusion: "बहुत बढ़िया! आपने आज बहुत कुछ सीखा..."
        },
        es: { /* Spanish translations */ },
        fr: { /* French translations */ }
      }
    }
    ```

---

### 5. System Architecture

#### **Frontend (Client-Side)**

* **Framework:** **Next.js** (React)
* **UI:** A clean, minimalist interface focused on natural conversation. It should include:
    * **Conversation Status Indicator:** Visual feedback showing when the agent is listening, thinking, or speaking (e.g., animated pulse, waveform).
    * **Live Transcript Display:** Real-time display of both user speech and agent responses for reference.
    * **Lesson Information Panel:** Shows current lesson title, objectives, and progress.
    * **Connection Controls:** Start/End conversation buttons, connection status indicator.
    * **Language Settings Access:** Quick access to language preferences.
    * **Progress Reset:** Button to restart lessons from the beginning.
    * **Interruption Feedback:** Visual cue when user interrupts (confirming the agent heard and is processing).
* **State Management:** React Context API or Zustand for managing conversation state, connection status, and user progress.
* **ElevenLabs Agent SDK Integration:** Direct integration with ElevenLabs Agents Platform using their WebSocket-based SDK for real-time, bidirectional audio streaming.
    * Handles continuous audio capture from microphone
    * Streams audio directly to the ElevenLabs agent
    * Receives and plays agent responses in real-time
    * Manages interruptions and turn-taking automatically

#### **Backend (Server-Side)**

* **Framework:** **Next.js API Routes** for a unified codebase
* **Database:** **PostgreSQL** (via Drizzle ORM) to store user data and lesson content.
    * **Tables/Collections:**
        * `Users`: User profiles, language preferences, progress, assigned agent ID
        * `Lessons`: Lesson guidance documents with learning objectives
        * `Conversations`: Conversation history and transcripts
        * `UserProgress`: Detailed tracking of lesson completion and performance
* **API Endpoints:**
    * `POST /api/agents/create`: Creates or updates a user's personalized learning agent
    * `GET /api/agents/:userId`: Retrieves user's agent configuration
    * `POST /api/lessons/:id/knowledge-base`: Adds lesson content to agent's knowledge base
    * `GET /api/lessons`: Fetches available lessons
    * `GET /api/lessons/:id`: Fetches specific lesson details
    * `POST /api/conversations/start`: Initiates a new learning session
    * `GET /api/conversations/:id`: Retrieves conversation history and transcript
    * `POST /api/user/progress`: Updates user's lesson progress
    * `POST /api/user/settings`: Updates user language preferences and recreates agent
* **ElevenLabs Agents Platform Integration:**
    * **Agent Creation:** Creates a personalized conversational agent for each user configured with:
        * System prompt defining the agent's role as a language tutor
        * User's conversation language (Language B)
        * User's target learning language (Language A)
        * Appropriate voice for the conversation language
        * LLM configuration (temperature, model selection)
    * **Knowledge Base Management:** For each lesson, creates a knowledge base containing:
        * Lesson objectives and teaching guidance
        * Phrases to teach with usage examples
        * Example conversations and teaching strategies
        * Translated content in user's conversation language
    * **Conversation Management:**
        * Manages agent sessions for each user
        * Tracks conversation history via ElevenLabs API
        * Updates user progress based on lesson completion
        * Handles agent configuration updates when user changes languages
* **Agent Configuration:**
    * **System Prompt Template:** Dynamically generated based on user preferences
    * **Example:** *"You are a patient and encouraging language tutor. You speak exclusively in {conversationLanguage} to teach {targetLanguage}. Follow the lesson guidance provided in your knowledge base. Allow students to ask questions and interrupt. Keep conversations focused on learning objectives while being conversational and adaptive."*

---

### 6. Technical Stack Summary 🛠️

| Component           | Technology                               | Justification                                                                                                 |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Frontend** | **Next.js (React)** | Provides a powerful, production-ready framework for building modern user interfaces with excellent performance. |
| **Backend** | **Next.js API Routes** | Simplifies development with a unified codebase for both frontend and backend in a single deployment. |
| **Database** | **PostgreSQL with Drizzle ORM** | Type-safe, scalable relational database perfect for structured lesson content and user progress tracking. |
| **Conversational AI** | **ElevenLabs Agents Platform** | Comprehensive solution providing natural conversational AI with integrated STT, multilingual TTS, interruption handling, and context awareness. Eliminates need for custom conversation management logic. |
| **ORM** | **Drizzle** | Type-safe database toolkit providing excellent TypeScript integration and developer experience. |
| **Authentication** | **NextAuth.js** | Industry-standard authentication for Next.js with flexible provider support. |
| **Deployment** | **Vercel** | Optimal deployment platform for Next.js with automatic scaling, edge functions, and seamless CI/CD. |

---

### 7. Success Metrics 📈

* **User Engagement:**
    * Daily Active Users (DAU) and session duration
    * Average conversation length per lesson (target: 10-20 minutes)
    * Number of user questions/interruptions per session (indicates engagement)

* **Lesson Completion Rate:**
    * Percentage of users who start a lesson and complete it (target: >70%)
    * Average number of lessons completed per user

* **User Retention:**
    * Percentage of users who return after their first session (target: >40%)
    * Weekly and monthly active users (WAU, MAU)
    * User streak tracking (consecutive days of practice)

* **Conversation Quality:**
    * User satisfaction ratings post-lesson
    * Number of successful interruptions handled
    * Conversation naturalness (via user feedback)
    * Agent staying on-topic rate (lessons completed vs. lessons abandoned)

* **Technical Performance:**
    * Agent response latency (target: <1 second)
    * Audio quality metrics (clarity, no dropouts)
    * Connection stability (uptime, reconnection rate)
    * WebSocket connection success rate

* **Learning Outcomes:**
    * User self-reported confidence in target language
    * Phrase retention (tested through spaced repetition in later lessons)
    * User progression through difficulty levels
