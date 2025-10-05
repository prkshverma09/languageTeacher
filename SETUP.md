# Language Teacher - Setup Guide

## ✅ All Bugs Fixed!

This document provides a complete guide to set up and run the AI Language Tutor application.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- ElevenLabs API account

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/languageteacher"

# ElevenLabs API Configuration
ELEVENLABS_API_KEY="your-elevenlabs-api-key-here"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### How to Get Each Variable:

#### 1. DATABASE_URL
- Install PostgreSQL on your machine
- Create a new database: `createdb languageteacher`
- Format: `postgresql://username:password@host:port/database`
- Example: `postgresql://postgres:mypassword@localhost:5432/languageteacher`

#### 2. ELEVENLABS_API_KEY
- Sign up at https://elevenlabs.io
- Go to your profile settings
- Copy your API key
- **Required Features**: Speech-to-Text AND Text-to-Speech

#### 3. NEXTAUTH_SECRET
- Generate a secure random string:
  ```bash
  openssl rand -base64 32
  ```
- Paste the output as your NEXTAUTH_SECRET

#### 4. NEXTAUTH_URL
- For local development: `http://localhost:3000`
- For production: Your deployed URL (e.g., `https://your-app.vercel.app`)

## Database Setup

1. **Push the schema to your database:**
   ```bash
   npm run db:push
   ```

2. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

   This creates:
   - A test user (email: `test@example.com`, password: `password123`)
   - Two sample lessons with steps

## Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Navigate to http://localhost:3000

3. **Login:**
   - Email: `test@example.com`
   - Password: `password123`

## Using the Application

1. **Select a Lesson:**
   - From the homepage, click on any lesson card

2. **Practice Speaking:**
   - Press and hold the "Push to Talk" button
   - Allow microphone access when prompted
   - Speak the phrase shown in the "Say:" section
   - Release the button when finished

3. **Receive Feedback:**
   - Your speech will be transcribed
   - The AI will respond with audio feedback
   - Green border = Correct response (advances to next step)
   - Red border = Incorrect response (try again)

## Troubleshooting

### Issue: "Can't resolve 'fs'" or similar Node.js module errors
**Fixed!** The lesson page is now properly split into Server and Client Components.

### Issue: "elevenlabs.generate is not a function" or "audioStream.on is not a function"
**Fixed!** Updated to use `elevenlabs.textToSpeech.convert()` with the correct voice ID and properly handle the async iterable response by collecting chunks into a buffer.

### Issue: "params should be awaited"
**Fixed!** All dynamic route params are now properly awaited for Next.js 15 compatibility.

### Issue: Database connection fails
- Verify your DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database credentials

### Issue: ElevenLabs API errors
- Verify your API key is correct
- Ensure your account has both Speech-to-Text and Text-to-Speech enabled
- Check your API usage limits

### Issue: Audio not recording
- Grant microphone permissions in your browser
- Use HTTPS in production (required for microphone access)
- Check browser console for errors

## Project Structure

```
languageTeacher/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth authentication
│   │   │   ├── conversation/        # Voice interaction endpoint
│   │   │   └── lessons/             # Lesson data endpoints
│   │   ├── lessons/[id]/            # Lesson detail page (Server Component)
│   │   ├── login/                   # Login page
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Homepage
│   ├── components/
│   │   ├── AuthStatus.tsx           # Auth status display
│   │   ├── Header.tsx               # App header
│   │   └── LessonClient.tsx         # Lesson interactive component (Client)
│   ├── db/
│   │   └── index.ts                 # Database connection
│   ├── drizzle/
│   │   ├── schema.ts                # Database schema
│   │   └── migrations/              # Database migrations
│   └── lib/
│       └── data.ts                  # Seed data
├── .env                             # Environment variables (create this!)
├── package.json                     # Dependencies
└── README.md                        # Project overview
```

## Technologies Used

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** NextAuth.js
- **Voice AI:** ElevenLabs (Speech-to-Text + Text-to-Speech)
- **Styling:** Tailwind CSS v3
- **Language:** TypeScript

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

**Important:** Set all environment variables in Vercel:
- `DATABASE_URL`
- `ELEVENLABS_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your Vercel URL)

## Support

For issues or questions, please check:
1. This SETUP.md file
2. The README.md file
3. The PRD.md file for project details

## License

Private project - All rights reserved
