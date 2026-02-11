import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

// This is just a redirect layout - the actual layout is in [locale]/layout.tsx
export default function RootLayout() {
  redirect(`/${defaultLocale}`);
}
