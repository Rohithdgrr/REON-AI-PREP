
import { type Metadata } from 'next';
import { RoadmapPage } from "@/components/roadmap-page";

export const metadata: Metadata = {
    title: 'Study Roadmap',
    description: 'Your personalized path to success. Choose between a general 4-week plan or generate a custom AI-powered roadmap tailored to your goals.',
};

export default function Roadmap() {
  return <RoadmapPage />;
}
