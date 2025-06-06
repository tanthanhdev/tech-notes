import { Metadata } from "next";
import { Locale, getTranslationsFromNamespaces } from "@/lib/i18n/settings";

type Params = Promise<{ locale: Locale }>;

export async function generateMetadata({
  params
}: {
  params: Params
}): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslationsFromNamespaces(locale, ['common']);
  const t = translations.common;

  return {
    title: t.pages?.privacy?.title || 'Privacy Policy',
    description: t.pages?.privacy?.introduction || 'Privacy policy for Tech Notes Hub',
  };
}

export default async function PrivacyPolicyPage({
  params
}: {
  params: Params
}) {
  const { locale } = await params;
  const translations = await getTranslationsFromNamespaces(locale, ['common']);
  const t = translations.common;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
        {t.pages?.privacy?.title || 'Privacy Policy'}
      </h1>

      <div className="text-sm text-muted-foreground mb-8">
        {t.pages?.privacy?.lastUpdated || 'Last Updated'}: {new Date('2025-06-06').toLocaleDateString(locale)}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg mb-8">
          {t.pages?.privacy?.introduction || 'This Privacy Policy describes how we collect, use, and share your personal information.'}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {t.pages?.privacy?.informationWeCollect || 'Information We Collect'}
        </h2>
        <p>
          {t.pages?.privacy?.informationWeCollectText || 'When you visit our website, we may collect certain information about your device.'}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {t.pages?.privacy?.howWeUseInformation || 'How We Use Your Information'}
        </h2>
        <p>
          {t.pages?.privacy?.howWeUseInformationText || 'We use the information we collect to improve and optimize our website.'}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {t.pages?.privacy?.sharingYourInformation || 'Sharing Your Information'}
        </h2>
        <p>
          {t.pages?.privacy?.sharingYourInformationText || 'We do not share your personal information with third parties.'}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {t.pages?.privacy?.yourRights || 'Your Rights'}
        </h2>
        <p>
          {t.pages?.privacy?.yourRightsText || 'You have the right to access personal information we hold about you.'}
        </p>
      </div>
    </div>
  );
}
