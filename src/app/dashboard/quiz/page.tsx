
import { type Metadata } from 'next';
import { QuizPage } from "@/components/quiz-page";

export const metadata: Metadata = {
    title: 'Quiz Arena',
    description: 'Test your knowledge with dynamic quizzes. Choose from curated topic-wise quizzes or generate a custom quiz using AI on any subject.',
};

export default function Quiz() {
  return <QuizPage />;
}
