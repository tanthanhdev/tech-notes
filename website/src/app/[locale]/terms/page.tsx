import { Metadata } from "next";
import { Locale, getTranslationsFromNamespaces } from "@/lib/i18n/settings";

export async function generateMetadata({
  params
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const translations = await getTranslationsFromNamespaces(params.locale, ['common']);
  const t = translations.common;

  return {
    title: t.pages?.terms?.title || 'Terms of Service',
    description: t.pages?.terms?.introduction || 'Terms of service for Tech Notes Hub',
  };
}

export default async function TermsOfServicePage({
  params
}: {
  params: { locale: Locale }
}) {
  const translations = await getTranslationsFromNamespaces(params.locale, ['common']);
  const t = translations.common;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
        {t.pages?.terms?.title || 'Terms of Service'}
      </h1>

      <div className="text-sm text-muted-foreground mb-8">
        {t.pages?.terms?.lastUpdated || 'Last Updated'}: {new Date('2025-06-06').toLocaleDateString(params.locale)}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg mb-8">
          {t.pages?.terms?.introduction || 'These Terms of Service govern your access to and use of our website.'}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {t.pages?.terms?.acceptance || 'Acceptance of Terms'}
        </h2>
        <p>
          {t.pages?.terms?.acceptanceText || 'By accessing or using our website, you agree to be bound by these Terms.'}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {t.pages?.terms?.intellectualProperty || 'Intellectual Property'}
        </h2>
        <p>
          {t.pages?.terms?.intellectualPropertyText || 'The content on our website is owned by us and protected by intellectual property laws.'}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {t.pages?.terms?.userConduct || 'User Conduct'}
        </h2>
        <p>
          {t.pages?.terms?.userConductText || 'You agree not to use our website for any illegal or unauthorized purpose.'}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {t.pages?.terms?.disclaimer || 'Disclaimer'}
        </h2>
        <p>
          {t.pages?.terms?.disclaimerText || 'Our website is provided "as is" without any warranties.'}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {t.pages?.terms?.limitationOfLiability || 'Limitation of Liability'}
        </h2>
        <p>
          {t.pages?.terms?.limitationOfLiabilityText || 'We will not be liable for any damages arising from the use of our website.'}
        </p>
      </div>
    </div>
  );
}
