import { redirect } from 'next/navigation';

export default function AdminRedirect({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slug = params.slug?.join('/') ?? '';
  const target = slug ? `/en/admin/${slug}` : '/en/admin';
  redirect(target);
}
