
import { type Metadata } from 'next';
import { SettingsPage } from "@/components/settings-page";

export const metadata: Metadata = {
    title: 'Settings & Support',
    description: 'Manage your account, customize your app experience, and find help in the FAQ section or by contacting our support team.',
};

export default function Settings() {
  return <SettingsPage />;
}
