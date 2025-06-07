import { Locale, getTranslationsFromNamespaces } from "@/lib/i18n/settings";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MarkdownContent from "@/components/blog/markdown-content";
import { getContentAsBlogPosts, findAvailableTranslations } from "@/lib/content-mapper";
import { Code, CalendarClock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import 'highlight.js/styles/github-dark.css';
import CodeSnippet from "@/components/blog/code-snippet";
import { generateDefaultMetadata } from '@/lib/metadata';
import LanguageSwitcher from "@/components/blog/language-switcher";

type Params = Promise<{
  locale: Locale;
  slug: string;
}>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const allPosts = await getContentAsBlogPosts(locale);
  const post = allPosts.find(post => post.slug === slug);

  if (!post) {
    return generateDefaultMetadata({
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.',
      locale,
      url: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return generateDefaultMetadata({
    title: post.title,
    description: post.description || `${post.title} - Tech Notes Hub`,
    locale,
    url: `/blog/${slug}`,
    ogImage: post.coverImage || '/og-image.jpg',
  });
}

export async function generateStaticParams() {
  // Generate params for all locales and posts
  const locales: Locale[] = ['vi', 'en'];
  const params = [];

  for (const locale of locales) {
    const posts = await getContentAsBlogPosts(locale);
    const localeParams = posts.map(post => ({
      locale,
      slug: post.slug,
    }));
    params.push(...localeParams);
  }

  return params;
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const allPosts = await getContentAsBlogPosts(locale);
  const post = allPosts.find(post => post.slug === slug);

  // Get translations
  const translations = await getTranslationsFromNamespaces(locale, ['common']);
  const t = translations.common;

  if (!post) {
    notFound();
  }

  // Find available translations for this post
  const availableTranslations = await findAvailableTranslations(slug);

  // Get translated category name if available
  const categoryKey = post.category.toLowerCase().replace(/\s+/g, '-') as keyof typeof t.categories;
  const translatedCategory = t.categories[categoryKey] || post.category;

  // Get translated source type if available
  const sourceTypeKey = post.sourceType as keyof typeof t.blog.sourceTypes | undefined;
  const translatedSourceType = sourceTypeKey && t.blog.sourceTypes[sourceTypeKey]
    ? t.blog.sourceTypes[sourceTypeKey]
    : post.sourceType;

  // Format dates according to locale
  const dateFormatter = new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const publishDate = post.date ? dateFormatter.format(new Date(post.date)) : '';
  const updateDate = post.update ? dateFormatter.format(new Date(post.update)) : '';

  // Add debug information for development
  const debugInfo = process.env.NODE_ENV === 'development' && (
    <div className="mt-4 p-4 border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-sm">
      <h4 className="font-bold mb-2">Debug Info:</h4>
      <div><strong>Current Slug:</strong> {slug}</div>
      <div><strong>Current Locale:</strong> {locale}</div>
      <div><strong>Source Type:</strong> {post.sourceType}</div>
      <div><strong>Source Path:</strong> {post.sourcePath}</div>
      <div><strong>Relative Path:</strong> {post.relativePath}</div>
      <div><strong>Date:</strong> {post.date}</div>
      <div><strong>Update:</strong> {post.update}</div>
      <div>
        <strong>Available Translations:</strong>
        <pre className="mt-1 p-2 bg-black/10 dark:bg-white/10 rounded overflow-auto">
          {JSON.stringify(availableTranslations, null, 2)}
        </pre>
      </div>
      {post.relatedSnippets && (
        <div>
          <strong>Related Snippets:</strong>
          <pre className="mt-1 p-2 bg-black/10 dark:bg-white/10 rounded overflow-auto">
            {JSON.stringify(post.relatedSnippets.map((s) => s.filename), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <Link href={`/${locale}/blog`} className="cursor-pointer">
          <Button variant="outline" size="sm">
            {t.blog.backToBlog}
          </Button>
        </Link>

        {availableTranslations.length > 1 && (
          <LanguageSwitcher
            currentLocale={locale}
            translations={translations}
            availableTranslations={availableTranslations}
          />
        )}
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
          <span>{`${t.blog.publishedOn} ${publishDate}`}</span>
          <span>•</span>
          <span>{`${t.blog.by} ${post.author}`}</span>
          <span>•</span>
          <span>{translatedCategory}</span>
          {post.sourceType && (
            <>
              <span>•</span>
              <span className="text-primary">{translatedSourceType}</span>
            </>
          )}
        </div>

        {post.update && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <CalendarClock size={14} className="text-primary" />
            <span>{`${t.blog.lastUpdated || 'Last updated'}: ${updateDate}`}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {post.coverImage && (
          <div className="rounded-lg overflow-hidden mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <MarkdownContent content={post.content} />

        {post.relatedSnippets && post.relatedSnippets.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Code size={20} className="text-primary" />
              <h3 className="text-xl font-semibold">{t.blog.codeSnippets}</h3>
            </div>

            <Accordion type="multiple" className="w-full">
              {post.relatedSnippets.map((snippet, index) => (
                <AccordionItem key={index} value={`snippet-${index}`} className="border rounded-md mb-3 overflow-hidden">
                  <AccordionTrigger className="px-4 py-2 hover:bg-secondary/50 font-mono text-sm">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-left">{snippet.filename}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary ml-2">
                        {snippet.language}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-0 relative overflow-hidden">
                      <CodeSnippet
                        language={snippet.language}
                        content={snippet.content}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        <div className="mt-8 pt-4 border-t">
          <h3 className="font-semibold mb-2">{t.blog.tags}:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {post.sourcePath && (
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-semibold mb-2">{t.blog.source}:</h3>
            <p className="text-sm text-muted-foreground">
              {t.blog.sourcedFrom}: <code className="bg-secondary px-2 py-1 rounded">{post.sourcePath.split('/').slice(-3).join('/')}</code>
            </p>
          </div>
        )}

        {process.env.NODE_ENV === 'development' && debugInfo}
      </div>
    </div>
  );
}
