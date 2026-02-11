import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already starts with a supported locale
  const pathnameHasLocale = locales.some(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Pathname already has a locale, let it through
    return NextResponse.next();
  }

  // If it's the root path, redirect to the default locale
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}`, request.url)
    );
  }

  // For any other path without a locale, redirect to the path with the default locale
  return NextResponse.redirect(
    new URL(`/${defaultLocale}${pathname}`, request.url)
  );
}

export const config = {
  // Match all paths except static assets and Next.js internals
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)']
};

