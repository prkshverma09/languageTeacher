# Implementation Plan: AI Language Tutor

This document breaks down the implementation of the AI Language Tutor project into distinct tasks.

## Task 1: Core Voice Interaction (Client-Side)

*   **Description:** Implement the core user-facing features for voice interaction on the frontend.
*   **Sub-tasks:**
    *   Integrate the ElevenLabs SDK or necessary libraries for microphone access.
    *   Implement the "Push to Talk" button functionality to capture user audio.
    *   Send the captured audio to the backend `/api/conversation` endpoint.
    *   Receive the agent's audio response from the backend and play it back to the user.
    *   Implement visual feedback for listening, processing, and speaking states.
    *   Display a real-time transcript of the conversation.

## Task 2: Backend Conversation Logic

*   **Description:** Build the backend logic to handle the conversational flow.
*   **Sub-tasks:**
    *   Create the `POST /api/conversation` endpoint.
    *   Receive the user's transcribed text from the frontend or an STT service.
    *   Fetch the current lesson and step from the database based on user progress.
    *   Implement the logic to compare the user's response with the `expected_user_response`.
    *   Based on the comparison, select either the `success_feedback` or `failure_feedback`.
    *   Update the user's progress to the `next_step_id`.
    *   Integrate with the ElevenLabs TTS service to convert the selected feedback text into an audio stream.
    *   Stream the audio back to the frontend.

## Task 3: Database and Lesson Management

*   **Description:** Set up the database and create a system for managing lessons.
*   **Sub-tasks:**
    *   Finalize and apply the database schema using Drizzle ORM migrations.
    *   Populate the database with initial lesson data.
    *   (Optional, based on priority) Create a simple admin UI or a set of scripts to allow for creating, updating, and deleting lessons and lesson steps. This would replace the current hardcoded mock data.

## Task 4: User Management and Progress Tracking

*   **Description:** Implement user accounts and track their progress through the lessons.
*   **Sub-tasks:**
    *   Implement a simple user authentication system (e.g., using NextAuth.js).
    *   Associate conversation history and progress with the logged-in user.
    *   Persist the user's `progress` (e.g., `current_lesson_id`, `current_step_id`) in the `Users` table.
    *   Ensure the conversation logic correctly loads and updates the user's progress.

## Task 5: Advanced Features and Polish

*   **Description:** Add features to improve the user experience and overall quality.
*   **Sub-tasks:**
    *   **Pronunciation Feedback (Future Scope):** Investigate how to provide basic pronunciation feedback.
    *   **UI/UX Polish:** Refine the user interface, add animations, and improve visual feedback.
    *   **Error Handling:** Implement robust error handling on both the frontend and backend.
    *   **Deployment:** Prepare the application for deployment to a platform like Vercel.