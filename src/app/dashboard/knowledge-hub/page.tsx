
import { type Metadata } from 'next';
import { KnowledgeHubPage } from "@/components/knowledge-hub-page";

export const metadata: Metadata = {
    title: 'Knowledge Hub',
    description: 'Connect with fellow aspirants, share notes, compete in challenges, and get help from our AI assistant, LIBRA.',
};

export default function KnowledgeHub() {
  return <KnowledgeHubPage />;
}
