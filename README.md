# ApplyAI - Your AI-powered job application copilot

This is a Next.js application built with Firebase and Genkit. It helps you manage your professional profile, track job applications, and automatically draft tailored CVs and cover letters.

To get started, take a look at `src/app/page.tsx`.

## Environment Setup

Before running the application, you need to set up your environment variables.

1.  Create a new file named `.env.local` in the root of the project.
2.  Copy the contents of the `.env` file (if any) into `.env.local`.
3.  Add your Firebase project configuration and your Google AI (Gemini) API key to `.env.local`. You can get your Firebase config from the Firebase console in your project's settings.

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"

# Google AI (Gemini) API Key for Genkit
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

## Installation

Install the necessary dependencies using npm:

```bash
npm install
```

## Running the Application

You can run the application in development mode with the following command. This will start the Next.js development server.

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).
