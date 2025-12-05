# REON AI PREP: Project-Based Interview Guide

This document provides a comprehensive guide for technical interviews related to the REON AI PREP project. The questions are designed to simulate a real-world interview scenario where you, as the developer, are asked to explain your architectural decisions, technical implementation, and problem-solving approaches.

---

## 1. High-Level & Architectural Questions

These questions assess your understanding of the overall system design and the reasoning behind your technology choices.

#### Q1: Can you give a high-level overview of the REON AI PREP tech stack and justify your choices?

**Strategy**: Start with a concise summary of the main technologies (Next.js, Firebase, Genkit) and then explain the "why" for each, connecting it to the project's requirements.

**Sample Answer**:
> "REON AI PREP is a modern web application built with a Next.js frontend, a Firebase backend, and Google's Genkit for AI features.
>
> -   **Next.js (with the App Router)** was chosen for its performance benefits like Server-Side Rendering (SSR) and Server Components, which are crucial for a good user experience and fast initial load times. Its file-based routing also keeps the project organized.
> -   **Firebase** was selected as the Backend-as-a-Service (BaaS) to accelerate development. **Firestore** provides a scalable, real-time NoSQL database for user data, and its security rules are powerful for enforcing user-specific data access. **Firebase Authentication** offers secure, out-of-the-box sign-in with email/password and Google.
> -   For styling, we used **Tailwind CSS with shadcn/ui** for rapid, consistent, and maintainable UI development.
> -   All AI functionality, like generating study plans or podcasts, is handled by **Genkit**, which provides a structured way to define and manage AI flows, prompts, and model interactions."

#### Q2: How did you design the application to be secure, particularly concerning user data?

**Strategy**: Focus on the two main pillars of security in this stack: Firebase Authentication and Firestore Security Rules. Explain the user ownership model.

**Sample Answer**:
> "Security was a top priority, and it's primarily enforced through Firebase.
>
> 1.  **Authentication**: We use Firebase Authentication to manage user identity. Each user gets a unique `uid` upon signing up.
> 2.  **Data Isolation**: This `uid` is the cornerstone of our database security. In Firestore, all user-specific data (like quizzes, profiles, and notes) is stored in subcollections under that user's unique document path (e.g., `/users/{userId}/quizzes/{quizId}`).
> 3.  **Firestore Security Rules**: The `firestore.rules` file enforces this data isolation. The core rule is `allow read, write: if request.auth.uid == userId;`. This ensures that a user can only ever access documents under their own path. We also explicitly disallow listing the top-level `/users` collection to prevent user enumeration. Writes to global collections like the leaderboard are disabled on the client to prevent cheating, deferring those to a trusted server environment."

---

## 2. Frontend (Next.js & React) Questions

These questions dive into the specifics of your frontend implementation.

#### Q1: You're using the Next.js App Router. Can you explain the benefits and how you've used Server Components vs. Client Components?

**Strategy**: Demonstrate your understanding of the App Router's paradigm. Give examples from the project.

**Sample Answer**:
> "We use the App Router to leverage its performance and organization benefits.
>
> -   **Server Components** are the default in our app. Pages like the main dashboard (`/dashboard/page.tsx`) are initially rendered on the server. This reduces the amount of JavaScript sent to the client, leading to faster page loads. They are great for fetching data that doesn't require user interactivity.
> -   **Client Components** (marked with `'use client'`) are used whenever we need interactivity, state, or browser-only APIs. For example, the entire `DashboardLayout.tsx` is a Client Component because it manages the state for the collapsible sidebar. The `LoginPage.tsx` is another example, as it handles user input, state for form fields, and client-side authentication events."

#### Q2: How is state managed in the application? Did you consider a global state management library like Redux?

**Strategy**: Explain the use of React's built-in hooks and context for state management. Justify why a larger library wasn't needed.

**Sample Answer**:
> "For this project, we primarily rely on React's built-in hooks, `useState` and `useEffect`, for local component state. For cross-component state, we use the **Context API**.
>
> A great example is the `ToolsSidebarProvider` (`src/hooks/use-tools-sidebar.tsx`). It uses a context to manage which tool (like the Calculator or Notes) is currently active in the right sidebar. This allows any component in the tree, like the `Header`, to open or close the sidebar without complex prop drilling.
>
> We considered a library like Redux, but the application's state management needs were simple enough to be handled effectively with Context. This approach avoids adding extra bundle size and complexity, which aligns with our goal of keeping the app lean and performant."

---

## 3. Backend (Firebase & Firestore) Questions

These questions test your knowledge of the backend implementation. Refer to `docs/backend.json` and `firestore.rules`.

#### Q1: Looking at `docs/backend.json`, can you explain the data modeling strategy for Firestore? Why nest user data?

**Strategy**: Explain the concept of path-based security and how nesting data under a user's ID is central to the security rules.

**Sample Answer**:
> "The data model in `backend.json` follows a **user-ownership** principle. The core idea is to isolate each user's data to prevent any possibility of one user accessing another's information.
>
> By nesting collections like `profiles`, `quizzes`, and `materials` under `/users/{userId}`, we create a predictable path structure. This structure is directly tied to our security rules. A rule like `match /users/{userId}/quizzes/{quizId} { allow read: if request.auth.uid == userId; }` becomes very simple and efficient.
>
> This avoids the need for more complex rules that query other documents (using `get()` or `exists()`), which is an anti-pattern in Firestore as it's slower, more expensive, and doesn't scale well. This design ensures our security rules are both secure and performant."

#### Q2: In `firestore.rules`, why are writes to the `/leaderboardEntries` collection disabled? How would you implement updates to it securely?

**Strategy**: This question tests your understanding of secure backend design. Explain the concept of delegating sensitive operations to a trusted server environment.

**Sample Answer**:
> "Client-side writes to `/leaderboardEntries` are disabled (`allow write: if false;`) as a critical security measure to prevent tampering. If clients could write their own scores, it would be trivial to cheat and get the top rank.
>
> The correct way to update the leaderboard is through a trusted server environment. I would implement a **Firebase Cloud Function** that is triggered whenever a user completes a ranked activity, like a mock test.
>
> This Cloud Function would:
> 1.  Validate the test result to ensure its authenticity.
> 2.  Calculate the new XP and score.
> 3.  Use the **Firebase Admin SDK**, which has privileged access, to securely update the user's entry in the `/leaderboardEntries` collection.
>
> This server-centric approach ensures data integrity and prevents any form of client-side cheating."

---

## 4. Generative AI (Genkit & LIBRA) Questions

These questions focus on the AI implementation.

#### Q1: The LIBRA AI assistant uses the OpenRouter API. Can you walk me through how a user's query is processed and how the streaming response is handled on the frontend?

**Strategy**: Describe the end-to-end flow from the user typing a message to the response appearing on screen. Refer to `LibraSidebar.tsx`.

**Sample Answer**:
> "The entire process is handled within the `LibraSidebar.tsx` component.
>
> 1.  When a user sends a message, the `handleAiRequest` function is triggered. It constructs a payload containing the conversation history and a detailed system prompt that instructs the AI on its persona and response format.
> 2.  A `fetch` request is made to the **OpenRouter API endpoint**, passing the API key in the Authorization header and including the required `HTTP-Referer`. The request specifies `stream: true`.
> 3.  The frontend then processes the streaming response. We use `response.body.getReader()` to read the incoming data chunks. A `TextDecoder` converts these chunks into text.
> 4.  The code iterates through the stream, parsing each line of data. It looks for lines starting with `data: `, extracts the JSON content, and appends the `delta.content` to the last message in our React state.
> 5.  This state update causes React to re-render, displaying the AI's response token-by-token, which provides a smooth, real-time experience for the user. We also have an `AbortController` to allow the user to stop the generation mid-stream."

#### Q2: How do you ensure the AI's responses are consistently well-formatted and professional?

**Strategy**: Focus on the importance of the **system prompt**.

**Sample Answer**:
> "The key to ensuring consistent, high-quality responses is the **system prompt**, which is defined in the `buildSystemPrompt` function within `LibraSidebar.tsx`. This prompt acts as a strict set of instructions for the AI on every single request.
>
> It defines the AI's persona ('LIBRA, a professional educational assistant'), its tone, and its expertise. Most importantly, it includes **mandatory formatting guidelines** using Markdown for headings, lists, tables, and bold text. It even provides examples of a good response structure. By sending this detailed context with every query, we heavily guide the model to produce the professional, well-structured output required for the application."

Good luck with your interview