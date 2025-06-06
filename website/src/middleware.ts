import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from '@/lib/i18n/settings';

// List of countries using Vietnamese as the main language
const VIETNAMESE_COUNTRIES = ['VN', 'VNM'];

// Middleware executed before each request
export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // If pathname starts with /api, /favicon.ico, etc., don't process
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') ||
    pathname.startsWith('/og-image')
  ) {
    return NextResponse.next();
  }

  // If pathname already has locale, don't process
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // If it's the root path, redirect to the appropriate locale
  if (pathname === '/') {
    // Get country code from x-vercel-ip-country header (if running on Vercel)
    // or cf-ipcountry header (if running on Cloudflare)
    // or x-country header (if you configure a different CDN)
    const countryCode =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-country');

    // If the user is from Vietnam, use Vietnamese
    const locale = countryCode && VIETNAMESE_COUNTRIES.includes(countryCode.toUpperCase())
      ? 'vi'
      : defaultLocale;

    // Redirect to the appropriate language version
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // If pathname doesn't have locale, add default locale
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);

  // Redirect to URL with default locale
  return NextResponse.redirect(newUrl);
}

// Define which paths will apply middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
