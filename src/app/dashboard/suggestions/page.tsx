
import { type Metadata } from 'next';
import { SuggestionsPage } from "@/components/suggestions-page";

export const metadata: Metadata = {
    title: 'Suggestions for Aspirants',
    description: 'Get expert guidance for cracking Indian Government Jobs. Access general tips or generate personalized AI-powered suggestions for your target exam.',
};

export default function Suggestions() {
  return <SuggestionsPage />;
}
