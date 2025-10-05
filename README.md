# AI Language Tutor

This project is an AI-powered language tutor that helps users learn a new language through voice-based conversations. It uses the ElevenLabs API for speech-to-text and text-to-speech, creating an interactive and engaging learning experience.

## Project Overview

The application is a Next.js project with a React frontend and a Node.js backend using Next.js API routes. The backend manages lesson content, which is stored in a database, and communicates with the ElevenLabs API to handle the voice interaction.

For more detailed information about the project's vision, features, and architecture, please see the [Product Requirements Document (PRD.md)](./PRD.md).

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database

This project uses `drizzle-orm` for database interactions. The schema is defined in `drizzle/schema.ts`. To generate database migrations, you will need to set up a PostgreSQL database and provide the connection string in a `.env` file. You can then run:

```bash
npm run db:generate
```

This will generate the necessary SQL migration files in the `drizzle/migrations` directory.

## Deployment

This application is configured for deployment on [Vercel](https://vercel.com/).

### Environment Variables

To deploy the application, you will need to set the following environment variables in your Vercel project settings:

-   `DATABASE_URL`: The connection string for your PostgreSQL database.
-   `ELEVENLABS_API_KEY`: Your API key for the ElevenLabs service.
-   `NEXTAUTH_SECRET`: A secret key for NextAuth.js. You can generate one using `openssl rand -base64 32`.
-   `NEXTAUTH_URL`: The canonical URL of your deployed application (e.g., `https://your-app-name.vercel.app`).

After setting the environment variables, you can deploy the application by connecting your Git repository to Vercel.

## Running and Testing Locally

To run and test the application on your local machine, follow these steps:

### 1. Prerequisites

-   [Node.js](https://nodejs.org/en/) and npm installed.
-   [Docker](https://www.docker.com/get-started) installed.
-   An ElevenLabs API key.

### 2. Setup

1.  **Start a PostgreSQL database using Docker:**
    If you don't have a local PostgreSQL instance, you can easily start one using Docker. Run the following command in your terminal:
    ```bash
    docker run --name language-tutor-db -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=myuser -e POSTGRES_DB=languagetutor -p 5432:5432 -d postgres
    ```
    This command will start a PostgreSQL container named `language-tutor-db` and make it accessible on port 5432.

2.  **Clone the repository:**

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd language-tutor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables. Use the credentials from the Docker command for the `DATABASE_URL`.
    ```
    DATABASE_URL="postgresql://myuser:mysecretpassword@localhost:5432/languagetutor"
    ELEVENLABS_API_KEY="your-elevenlabs-api-key"
    NEXTAUTH_SECRET="your-nextauth-secret" # Generate with: openssl rand -base64 32
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Run database migrations:**
    This command will apply the schema to your database.
    ```bash
    npm run db:push
    ```

5.  **Seed the database:**
    Populate the database with initial lessons and a test user.
    ```bash
    npm run db:seed
    ```

6.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running at [http://localhost:3000](http://localhost:3000).

### 3. Logging In

The `db:seed` command creates a default test user with the following credentials:

-   **Email:** `test@example.com`
-   **Password:** `password123`

Navigate to the login page and use these credentials to sign in and start testing the application.

### 4. Testing Features

Once you are logged in, you can test the core features of the application:

1.  **Select a Lesson:** From the homepage, you will see a list of available lessons. Click on one to start.
2.  **Start the Conversation:** On the lesson page, you will see the current task.
3.  **Use Push to Talk:**
    -   Press and hold the "Push to Talk" button.
    -   Your browser will likely ask for microphone permission. Please allow it.
    -   Speak the phrase indicated in the "Say:" section of the task card.
    -   Release the button when you are finished speaking.
4.  **Observe the Result:**
    -   The application will process your speech.
    -   You will see your transcribed text appear in a chat bubble on the right.
    -   The agent will respond with audio feedback, and its response will appear in a chat bubble on the left.
    -   If your response was correct, your chat bubble will have a green border, and you will advance to the next step. If it was incorrect, it will have a red border, and you can try again.