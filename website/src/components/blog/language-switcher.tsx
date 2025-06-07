'use client';

import Link from 'next/link';
import { Locale } from '@/lib/i18n/settings';
import { useEffect } from 'react';
import { setCookie } from '@/lib/cookies';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  translations: any;
  availableTranslations: Array<{
    locale: string;
    slug: string;
  }>;
}

export default function LanguageSwitcher({
  currentLocale,
  translations,
  availableTranslations,
}: LanguageSwitcherProps) {
  const t = translations.common;

  // Update preferredLocale in localStorage when the component mounts
  useEffect(() => {
    // Update localStorage and cookie with the current locale
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLocale', currentLocale);
      setCookie('preferredLocale', currentLocale, 365); // Valid for 1 year
    }
  }, [currentLocale]);

  // Handle language change (for analytics or other side effects)
  const handleLanguageClick = (newLocale: string) => {
    // Update localStorage and cookie
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLocale', newLocale);
      setCookie('preferredLocale', newLocale, 365); // Valid for 1 year
    }
  };

  if (availableTranslations.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{t.blog.translatedContent}:</span>
      <div className="flex gap-2">
        {availableTranslations.map(translation => (
          <Link
            key={translation.locale}
            href={`/${translation.locale}/blog/${translation.slug}`}
            onClick={() => handleLanguageClick(translation.locale)}
            className={`text-sm px-2 py-1 rounded cursor-pointer ${
              translation.locale === currentLocale
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {t.languages[translation.locale as keyof typeof t.languages] || translation.locale.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}
