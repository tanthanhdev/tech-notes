import { Metadata } from "next";
import { defaultLocale, getTranslationsFromNamespaces, Locale, locales } from "@/lib/i18n/settings";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as Locale || defaultLocale;
  const translations = await getTranslationsFromNamespaces(locale, ['common']);

  // Access the description directly from translations object as unknown type
  const commonTranslations = translations.common as any;
  const description = commonTranslations?.meta?.description ||
                      commonTranslations?.site?.description ||
                      'A collection of tech notes and snippets';

  return {
    title: {
      template: '%s - Tech Notes Hub',
      default: 'Tech Notes Hub',
    },
    description: description,
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: 'Tech Notes Hub',
      description: description,
      url: `https://technotes.example.com/${locale}`,
      siteName: 'Tech Notes Hub',
      locale: locale,
      type: 'website',
      images: [
        {
          url: 'https://technotes.example.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Tech Notes Hub',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tech Notes Hub',
      description: description,
      creator: '@technotes',
    },
    alternates: {
      canonical: `https://technotes.example.com/${locale}`,
      languages: {
        en: 'https://technotes.example.com/en',
        vi: 'https://technotes.example.com/vi',
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // Make sure params.locale is set to default if it doesn't exist
  const locale = (params?.locale as Locale) || defaultLocale;

  // Ensure getTranslationsFromNamespaces is awaited
  const translations = await getTranslationsFromNamespaces(locale, ['common']);

  return (
    <div className="flex min-h-screen flex-col">
      <Header translations={translations} locale={locale} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer translations={translations} locale={locale} />
    </div>
  );
}
