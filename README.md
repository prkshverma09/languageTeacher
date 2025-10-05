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