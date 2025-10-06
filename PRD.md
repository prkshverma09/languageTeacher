# Product Requirements Document: AI Language Tutor Voice Agent

### 1. Introduction and Vision 🗣️

This document outlines the product requirements for an AI-powered Language Tutor, a Next.js web application designed to teach a new language (Language A) to a user who is fluent in another (Language B). The core of the experience is a voice-driven conversation where the AI agent, speaking primarily in Language B, guides the user through structured lessons to learn Language A. The platform will leverage the advanced speech-to-text (STT) and text-to-speech (TTS) capabilities of the ElevenLabs API to create a natural and interactive learning environment.

**The vision** is to create a personalized, accessible, and engaging language learning tool that feels less like a traditional app and more like conversing with a patient, knowledgeable tutor.

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

* **Bilingual Conversation:** The agent will **ALWAYS communicate in the user's native language (Language B)** to explain concepts, give instructions, and provide feedback. It will teach words and phrases from the target language (Language A) as part of the lesson.
  * **Example:** A Hindi speaker learning English will hear: *"चलिए एक सरल अभिवादन से शुरू करते हैं। अंग्रेजी में 'Hello' कैसे कहते हैं?"* (Let's start with a simple greeting. How do you say 'Hello' in English?)
  * **Language Selection:** Users must be able to select their conversation language (Language B - e.g., Hindi, Spanish, French) and their target learning language (Language A - e.g., English).
  * **Mixed Language Input:** The system should handle user responses that mix both languages (e.g., a Hindi-speaking user responding mostly in Hindi with English phrases they're learning).
  * **Configurable per User:** Each user can have their own language preference stored in their profile.
  * **Content Localization:** ALL lesson content (instructions, feedback, prompts) must be available in the user's conversation language. The system uses a multilingual content structure with translations.
* **Speech-to-Text (STT):** The system will use ElevenLabs' ASR model to accurately transcribe the user's spoken responses in both Language A and Language B. The STT must support multi-language detection to handle mixed-language responses.
* **Text-to-Speech (TTS):** All agent dialogue will be generated using ElevenLabs' high-quality, low-latency TTS with the `language_code` parameter set to the user's conversation language. The TTS must use appropriate language models and voices that support the conversation language.
* **Pronunciation Feedback (Future Scope):** While initial implementation will focus on comprehension, a future version could leverage STT analysis to provide basic feedback on the user's pronunciation of Language A.
* **Lesson Progression:** The agent will guide the user through a pre-defined sequence of lessons, tracking their progress and adapting to their pace.
* **Progress Management:** Users should have the ability to reset their progress across all lessons for testing and practice purposes.

#### **Lesson Management System**

* **Dynamic Lesson Structure:** Lessons should not be hard-coded. They will be stored in a database and fetched by the backend.
* **Editable Content:** A simple admin interface or a CMS (Content Management System) should allow non-technical users to create, read, update, and delete lessons.
* **Lesson Components:** Each lesson should be broken down into structured steps or "turns." Each step must include:
    * `step_id`: Unique identifier for the step.
    * `lesson_id`: Which lesson this step belongs to.
    * `target_phrase_a`: The word or phrase to be taught in Language A (e.g., "Hello").
    * `expected_user_response`: The ideal response from the user (can be flexible).
    * `translations`: Object containing translations for each supported conversation language:
        * `agent_prompt_b`: The text the agent speaks in Language B (e.g., in Hindi: "अंग्रेजी में 'Hello' कैसे कहते हैं?").
        * `success_feedback`: What the agent says if the user is correct (e.g., in Hindi: "बहुत बढ़िया! 'Hello' सही है।").
        * `failure_feedback`: What the agent says if the user is incorrect (e.g., in Hindi: "सही उत्तर 'Hello' है। फिर से कोशिश करते हैं।").
    * `next_step_id`: The ID of the next step in the lesson.

    **Example Structure:**
    ```javascript
    {
      id: 1,
      lessonId: 1,
      targetPhraseA: "Hello",
      expectedUserResponse: "Hello",
      translations: {
        en: { agentPromptB: "How do you say 'Hello' in English?", ... },
        hi: { agentPromptB: "अंग्रेजी में 'Hello' कैसे कहते हैं?", ... },
        es: { agentPromptB: "¿Cómo se dice 'Hello' en inglés?", ... }
      },
      nextStepId: 2
    }
    ```

---

### 5. System Architecture

#### **Frontend (Client-Side)**

* **Framework:** **Next.js** (React)
* **UI:** A clean, minimalist interface focused on the voice interaction. It should include:
    * A prominent "Push to Talk" button.
    * Visual feedback to indicate when the agent is listening, processing, or speaking.
    * A text transcript of the conversation for user reference.
    * A simple display of the current lesson and user progress (e.g., "Lesson 1: Greetings").
    * Language selection dropdown or settings (to choose conversation language and target learning language).
    * A "Reset Progress" button to allow users to restart all lessons from the beginning.
* **State Management:** Use React's Context API or a library like Zustand for managing application state (e.g., conversation history, loading status).
* **ElevenLabs Integration:** The frontend will capture microphone input and send it to the backend. It will receive audio streams from the backend to play back the agent's responses.

#### **Backend (Server-Side)**

* **Framework:** **Next.js API Routes** or a standalone **Node.js** server (e.g., with Express).
* **Database:** A relational database like **PostgreSQL** or a NoSQL database like **MongoDB** to store user data and lesson content.
    * **Tables/Collections:**
        * `Users`: To store user profiles and progress.
        * `Lessons`: To store the overall lesson structure.
        * `LessonSteps`: To store the individual conversational turns within each lesson.
* **API Endpoints:**
    * `POST /api/conversation`: The main endpoint to handle user speech. It receives the audio or transcribed text, processes the logic, and returns the agent's audio response.
    * `GET /api/lessons`: To fetch the list of lessons for the user.
    * `GET /api/lessons/:id`: To fetch the specific steps for a given lesson.
* **ElevenLabs Agent Integration:**
    * The backend will be the primary interface with the **ElevenLabs Agents Platform**.
    * When the user speaks, the backend receives the transcribed text from the frontend or directly from the ElevenLabs STT service.
    * It will fetch the current lesson step from the database.
    * It will use this information to decide what the agent should say next.
    * It will then call the ElevenLabs TTS API to generate the audio for the agent's response and stream it back to the frontend.

---

### 6. Technical Stack Summary 🛠️

| Component           | Technology                               | Justification                                                                                                 |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Frontend** | **Next.js (React)** | Provides a powerful, production-ready framework for building modern user interfaces.                          |
| **Backend** | **Next.js API Routes / Node.js** | Simplifies the development process by allowing for a unified codebase for both frontend and backend.            |
| **Database** | **PostgreSQL / MongoDB** | Flexible and scalable options for storing structured lesson content and user data.                            |
| **Voice Services** | **ElevenLabs Agents Platform** | An all-in-one solution for high-quality STT, multi-lingual TTS, and conversational AI logic.                  |
| **Deployment** | **Vercel / AWS / Google Cloud** | Modern cloud platforms that offer seamless deployment and scaling for Next.js applications.                   |

---

### 7. Success Metrics 📈

* **User Engagement:** Daily Active Users (DAU) and session duration.
* **Lesson Completion Rate:** Percentage of users who start a lesson and complete it.
* **User Retention:** Percentage of users who return to the app after their first session.
* **Technical Performance:** Low audio latency (time between user finishing speaking and agent responding).
