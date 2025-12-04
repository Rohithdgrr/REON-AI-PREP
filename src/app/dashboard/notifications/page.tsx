
import { type Metadata } from 'next';
import { NotificationsPage } from "@/components/notifications-page";

export const metadata: Metadata = {
    title: 'Official Exam Resources',
    description: 'Find verified official links for notifications, applications, admit cards, and results for major government exams like Bank, Railway, SSC, UPSC, and GATE.',
};

export default function Notifications() {
  return <NotificationsPage />;
}
