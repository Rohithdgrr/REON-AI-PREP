
import { type Metadata } from 'next';
import { PodcastsPage } from "@/components/podcasts-page";

export const metadata: Metadata = {
    title: 'AI-Generated Podcasts',
    description: 'Listen to your study materials on the go. Convert any text into a spoken-word audio file using AI.',
};

export default function Podcasts() {
  return <PodcastsPage />;
}
