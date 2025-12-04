
import { type Metadata } from 'next';
import { MockTestPage } from "@/components/mock-test-page";

export const metadata: Metadata = {
    title: 'Mock Test Arena',
    description: 'Simulate real exam conditions with full-length mock tests. Choose from scheduled tests, manual tests, or generate a custom AI mock test.',
};

export default function MockTest() {
  return <MockTestPage />;
}
