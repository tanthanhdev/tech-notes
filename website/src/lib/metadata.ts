import { Metadata } from 'next';
import { Locale, locales } from './i18n/settings';

const WEBSITE_URL = 'https://tech-notes-hub.vercel.app';

interface MetadataProps {
  title?: string;
  description?: string;
  locale: Locale;
  url?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Generate default metadata for pages with proper SEO settings
 */
export function generateDefaultMetadata({
  title,
  description,
  locale,
  url,
  ogImage = '/og-image.jpg',
  noIndex = false,
}: MetadataProps): Metadata {
  const pageTitle = title ? `${title} - Tech Notes Hub` : 'Tech Notes Hub';
  const pageUrl = url ? `${WEBSITE_URL}${url}` : `${WEBSITE_URL}/${locale}`;

  return {
    title: title,
    description: description,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: pageTitle,
      description: description,
      url: pageUrl,
      siteName: 'Tech Notes Hub',
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${WEBSITE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: description,
      creator: '@technotes',
    },
    alternates: {
      canonical: pageUrl,
      languages: generateLanguageAlternates(url || `/${locale}`),
    },
  };
}

/**
 * Generate language alternates for internationalization
 */
function generateLanguageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  const basePath = path.includes('/') ? path.substring(path.indexOf('/')) : '';

  // If the path already contains a locale, remove it to get the base path
  const cleanPath = basePath.match(/^\/(en|vi)\//)
    ? basePath.replace(/^\/(en|vi)\//, '/')
    : basePath;

  locales.forEach((locale) => {
    alternates[locale] = `${WEBSITE_URL}/${locale}${cleanPath}`;
  });

  return alternates;
}
