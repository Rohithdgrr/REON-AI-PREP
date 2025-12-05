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

## 🎯 Target Audience

This platform is designed for students and aspirants in India preparing for a wide range of competitive government and public sector examinations. This includes:

- **Railway Exams**: RRB NTPC, Group D, ALP, etc.
- **Banking Exams**: IBPS PO/Clerk, SBI PO/Clerk, RBI Grade B.
- **Staff Selection Commission (SSC)**: CGL, CHSL.
- **Union Public Service Commission (UPSC)**: Civil Services Examination (CSE).
- **Graduate Aptitude Test in Engineering (GATE)**: For PSU recruitment and higher studies.

## 🌟 Advantages

- **Personalized Learning**: Moves away from a one-size-fits-all approach by using AI to create study plans and quizzes tailored to an individual's strengths and weaknesses.
- **Time Efficiency**: The "Weakness Radar" and AI-driven suggestions help users focus their efforts on areas that need the most improvement, saving valuable preparation time.
- **Enhanced Engagement**: Gamified elements like levels, XP points, missions, and a live leaderboard keep users motivated and consistent with their studies.
- **24/7 AI Assistance**: The LIBRA AI assistant acts as a personal tutor, available anytime to explain complex topics, generate practice questions, or offer study advice.
- **Accessibility**: With features like AI-generated podcasts, users can turn any study material into an audio file, enabling learning on the go.

## 💡 Uses

- **End-to-End Exam Preparation**: From creating a study plan to taking mock tests and analyzing performance.
- **Targeted Practice**: Hone skills in specific subjects or topics using the Quiz and Practice Arenas.
- **Performance Tracking**: Monitor progress through the dashboard analytics, RAX-Score, and leaderboard rank.
- **Doubt Clarification**: Use the LIBRA AI assistant to get instant explanations for difficult concepts.
- **Community Learning**: Share notes, ask questions, and compete in challenges with fellow aspirants in the Knowledge Hub.

## 🚀 Future Scope

- **Advanced AI Integration**: Incorporate more sophisticated AI models for video analysis, personalized feedback on written answers, and more accurate performance prediction.
- **Expanded Language Support**: Add support for more regional languages in both the UI and AI-generated content.
- **Live Classes & Mentorship**: Integrate features for live online classes with educators and one-on-one mentorship sessions.
- **Mobile Applications**: Develop dedicated mobile apps for iOS and Android to provide a more seamless on-the-go experience.
- **Enhanced Proctoring**: Implement advanced AI-based proctoring for mock tests to ensure a cheat-proof exam environment.

## 🛠️ Tech Stack

- **Framework**: **[Next.js](https://nextjs.org/) (App Router)** was chosen for its powerful features like server-side rendering (SSR), static site generation (SSG), and the modern App Router, which enables performant, SEO-friendly, and highly scalable web applications. Server Components are used to reduce client-side JavaScript and improve initial load times.

- **Language**: **[TypeScript](https://www.typescriptlang.org/)** is used throughout the project to provide strong typing, which helps catch errors during development, improves code quality, and makes the codebase more maintainable and easier to refactor.

- **Styling**: The UI is built with **[Tailwind CSS](https://tailwindcss.com/)**, a utility-first CSS framework that allows for rapid development of custom designs without leaving the HTML. This is paired with **[shadcn/ui](https://ui.shadcn.com/)**, a collection of beautifully designed, accessible, and reusable components that can be easily customized.

- **Backend & AI**: The application uses a robust backend built on **[Firebase](https://firebase.google.com/)** and **Google AI** for its data management, authentication, and intelligent features. For a detailed explanation of the backend architecture, data models, and security rules, please see the **[Backend Documentation](./docs/backend.md)**.

- **Deployment**: The entire application is deployed on **Firebase App Hosting**, which provides a secure, fast, and globally-distributed hosting solution optimized for modern web frameworks like Next.js.

## 🙏 Citations & Acknowledgements

This project is built upon the work of many open-source projects and free-to-use services. We gratefully acknowledge their contributions.

- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Models**: [Mistral AI](https://mistral.ai/), [Google AI](https://ai.google/), and the [OpenRouter](https://openrouter.ai/) service.
- **Images**: Placeholder images are provided by [Unsplash](https://unsplash.com/) and [Picsum Photos](https://picsum.photos/).
- **Fonts**: [Google Fonts](https://fonts.google.com/)

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

## Project Structure

```
.
├── src
│   ├── app
│   │   ├── dashboard         # Protected routes for the user dashboard
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── login             # Authentication page
│   │   │   └── page.tsx
│   │   ├── page.tsx          # Main landing page
│   │   └── layout.tsx        # Root layout for the entire app
│   ├── components
│   │   ├── dashboard         # Components specific to the dashboard page
│   │   ├── layout            # Reusable layout components (Header, Sidebars)
│   │   ├── libra             # Components for the LIBRA AI assistant
│   │   └── ui                # Shadcn/ui components (Button, Card, etc.)
│   ├── firebase
│   │   ├── auth              # Firebase Auth hooks (useUser)
│   │   ├── firestore         # Firestore hooks (useCollection, useDoc)
│   │   ├── config.ts         # Firebase configuration keys
│   │   └── provider.tsx      # Core Firebase context provider
│   ├── ai
│   │   └── flows             # Genkit flows for AI content generation
│   └── lib
│       ├── placeholder-images.ts # Static data for placeholder images
│       └── utils.ts          # Utility functions (e.g., cn for Tailwind)
├── docs
│   ├── backend.md          # In-depth backend documentation
│   └── backend.json        # Schema definitions for Firebase (entities, Firestore structure)
├── firestore.rules           # Security rules for Firestore database
├── next.config.ts            # Next.js configuration file
└── package.json              # Project dependencies and scripts
```
