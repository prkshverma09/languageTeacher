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