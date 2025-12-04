
import { type Metadata } from 'next';
import { PracticePage } from "@/components/practice-page";

export const metadata: Metadata = {
    title: 'Practice Arena',
    description: 'Hone your skills with topic-wise practice tests. Choose from a vast library or let our AI create a custom test for you.',
};

export default function Practice() {
  return <PracticePage />;
}
