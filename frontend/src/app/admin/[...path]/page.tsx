import { redirect } from 'next/navigation';

export default function AdminSubRouteRedirect({
  params,
}: {
  params: { path: string[] };
}) {
  const path = params.path?.join('/') || '';
  redirect(`/en/admin/${path}`);
}
