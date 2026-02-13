import { redirect } from 'next/navigation';

export default function NotFound() {
  // Redirect to the default locale when a page is not found at root level
  redirect('/en');
}
