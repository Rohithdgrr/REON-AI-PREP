# REON AI PREP

REON AI PREP is a comprehensive, AI-powered learning platform designed to help aspirants in India prepare for competitive government exams like Railway, Bank PO, SSC, UPSC, and GATE. The application provides a personalized and interactive study experience, leveraging AI to generate study plans, quizzes, and provide expert suggestions.

## ✨ Features

- **Personalized Dashboard**: A central hub to track progress with stats like level, rank, and RAX-Score. It includes daily tasks, rank-up missions, and a live leaderboard.
- **AI-Powered Roadmap**: Generate a custom, week-by-week study plan based on your target exam, weak subjects, and available study hours.
- **Dynamic Content Generation**:
  - **Quiz & Practice Arenas**: Create unlimited quizzes and practice tests on any topic with varying difficulty levels.
  - **Mock Test Arena**: Simulate real exam conditions with full-length mock tests, including AI-generated custom tests.
- **LIBRA AI Assistant**: An integrated AI chatbot (powered by Mistral via OpenRouter) that can explain concepts, create quizzes, and provide detailed study advice.
- **Knowledge Hub**: A community space to connect with other aspirants, share notes, and participate in challenges.
- **Preparation Hub**: Access a curated library of study materials, including notes, previous year question papers (PYQs), cheatsheets, and video lectures.
- **AI-Generated Podcasts**: Convert any text or study material into a spoken-word audio file to listen on the go.
- **Authentication**: Secure user authentication with Email/Password and Google Sign-In, managed by Firebase Authentication.
- **User Profile & Settings**: Manage your profile, customize the app's appearance with multiple themes, and access support.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for components.
- **Authentication & Database**: [Firebase](https://firebase.google.com/) (Authentication and Firestore)
- **Generative AI**:
  - **Chat & Content**: [Mistral](https://mistral.ai/) via [OpenRouter](https://openrouter.ai/)
  - **Text-to-Speech**: Google AI
- **Deployment**: Firebase App Hosting

## 🚀 Getting Started

This is a Next.js project bootstrapped with `create-next-app` and configured for Firebase Studio.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Running the Development Server

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Project Structure

- `src/app/`: Contains the main application pages and layouts using the Next.js App Router.
  - `src/app/dashboard/`: Protected routes for the user dashboard.
  - `src/app/login/`: The authentication page.
- `src/components/`: Contains all React components used throughout the application.
  - `src/components/libra/`: Components related to the LIBRA AI assistant.
  - `src/components/ui/`: Reusable UI components from shadcn/ui.
- `src/firebase/`: Firebase configuration, providers, and custom hooks (`useUser`, `useCollection`, etc.).
- `src/ai/`: Contains AI-related logic, primarily for generating content.
- `src/lib/`: Utility functions and static data.
- `docs/`: Contains backend configuration files like `backend.json`.
- `firestore.rules`: Security rules for the Firestore database.
