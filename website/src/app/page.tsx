'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n/settings';
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if the locale is already saved in localStorage
    const savedLocale = localStorage.getItem('preferredLocale');

    if (savedLocale) {
      // If there is, use the saved locale
      router.push(`/${savedLocale}`);
    } else {
      // If not, try to determine the locale from the browser
      const browserLang = navigator.language.split('-')[0];
      const locale = browserLang === 'vi' ? 'vi' : defaultLocale;

      // Save to localStorage for future use
      localStorage.setItem('preferredLocale', locale);

      // Redirect to the page with the determined locale
      router.push(`/${locale}`);
    }
  }, [router]);

  // Show loading while waiting for redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    </div>
  );
}
