export const defaultLocale = 'vi';
export const locales = ['vi', 'en'] as const;
export type Locale = (typeof locales)[number];

export interface CommonTranslations {
  site: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    blog: string;
    about: string;
  };
  blog: {
    readMore: string;
    publishedOn: string;
    lastUpdated: string;
    by: string;
    categories: string;
    tags: string;
    allCategories: string;
    noPostsFound: string;
    tryDifferentCategory: string;
    source: string;
    sourcedFrom: string;
    backToBlog: string;
    filter: {
      category: string;
    };
    sourceTypes: {
      docs: string;
      snippets: string;
      i18n: string;
    };
    page?: string;
    of?: string;
    showing?: string;
    posts?: string;
    translatedContent?: string;
    codeSnippets?: string;
    postsFound?: string;
    searchPlaceholder?: string;
  };
  languages: {
    english: string;
    vietnamese: string;
    spanish: string;
  };
  common: {
    search: string;
    loading: string;
    notFound: string;
    back: string;
  };
  footer: {
    copyright?: string;
    rights?: string;
    privacyPolicy?: string;
    termsOfService?: string;
    links?: {
      github: string;
      twitter: string;
      privacy: string;
      terms: string;
    };
    madeWith?: string;
  };
  categories: {
    algorithms: string;
    databases: string;
    'design-patterns': string;
    devops: string;
    linux: string;
    'system-design': string;
    testing: string;
  };
  pages?: {
    privacy?: {
      title: string;
      lastUpdated: string;
      introduction: string;
      informationWeCollect: string;
      informationWeCollectText: string;
      howWeUseInformation: string;
      howWeUseInformationText: string;
      sharingYourInformation: string;
      sharingYourInformationText: string;
      yourRights: string;
      yourRightsText: string;
    };
    terms?: {
      title: string;
      lastUpdated: string;
      introduction: string;
      acceptance: string;
      acceptanceText: string;
      intellectualProperty: string;
      intellectualPropertyText: string;
      userConduct: string;
      userConductText: string;
      disclaimer: string;
      disclaimerText: string;
      limitationOfLiability: string;
      limitationOfLiabilityText: string;
    };
  };
}

export interface Translations {
  common: CommonTranslations;
  [key: string]: any;
}

export const getLocalePartsFrom = ({ pathname }: { pathname: string }): {
  locale: Locale;
  pathnamePart: string;
} => {
  const segments = pathname.split('/');
  const localeSegmentIndex = segments.findIndex(segment =>
    locales.includes(segment as Locale)
  );

  if (localeSegmentIndex === -1) {
    return {
      locale: defaultLocale,
      pathnamePart: pathname,
    };
  }

  const locale = segments[localeSegmentIndex] as Locale;
  const pathnamePart = `/${segments.slice(localeSegmentIndex + 1).join('/')}`;

  return {
    locale,
    pathnamePart,
  };
};

export const getTranslationsFromNamespaces = async (
  locale: Locale,
  namespaces: string[]
): Promise<Translations> => {
  const translations: Record<string, Record<string, any>> = {};

  for (const namespace of namespaces) {
    try {
      translations[namespace] = (await import(`../../data/i18n/${locale}/${namespace}.json`)).default;
    } catch (error) {
      console.error(`Error loading translation for ${locale} and namespace ${namespace}`, error);
      translations[namespace] = {};
    }
  }

  return translations as Translations;
};
