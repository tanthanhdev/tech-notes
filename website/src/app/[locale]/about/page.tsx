import { Metadata } from "next";
import { Locale, getTranslationsFromNamespaces } from "@/lib/i18n/settings";

type Params = Promise<{ locale: Locale }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslationsFromNamespaces(locale, ['common', 'about']);
  const about = translations.about;

  return {
    title: `${about.title} - ${translations.common.site.title}`,
    description: translations.common.site.description,
  };
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  const translations = await getTranslationsFromNamespaces(locale, ['common', 'about']);
  const t = translations.common;
  const about = translations.about;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {about.title}
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">
            {about.intro}
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{about.mission.title}</h2>
          <p>{about.mission.content}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{about.content.title}</h2>
          <p>{about.content.intro}</p>
          <ul className="list-disc pl-6 my-4">
            {Object.entries(t.categories).map(([key, value]) => (
              <li key={key}>{value}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">{about.community.title}</h2>
          <p>{about.community.content}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{about.contact.title}</h2>
          <p>
            {about.contact.content}{' '}
            <a
              href={`mailto:${about.contact.email}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {about.contact.email}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
