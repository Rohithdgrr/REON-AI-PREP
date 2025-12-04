
import { type Metadata } from 'next';
import { PrepPage } from "@/components/prep-page";

export const metadata: Metadata = {
    title: 'Preparation Hub',
    description: 'Access all your study materials in one place. Find notes, previous year papers (PYQs), cheatsheets, and video lectures.',
};

export default function Prep() {
  return <PrepPage />;
}
