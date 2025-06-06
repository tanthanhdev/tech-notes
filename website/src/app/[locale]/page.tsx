import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Locale, getTranslationsFromNamespaces } from "@/lib/i18n/settings";
import { Metadata } from "next";
import { getContentAsBlogPosts } from "@/lib/content-mapper";

type Params = Promise<{ locale: Locale }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslationsFromNamespaces(locale, ['common', 'home']);

  return {
    title: translations.common.site.title,
    description: translations.common.site.description,
  };
}

export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params;

  // Get translations for home page
  const translations = await getTranslationsFromNamespaces(locale, ['common', 'home']);
  const t = translations.home;
  const commonT = translations.common;

  // Get featured blog posts
  const allPosts = await getContentAsBlogPosts(locale);
  const featuredPosts = allPosts.slice(0, 6); // Get first 6 posts

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {t.hero.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href={`/${locale}/blog`} className="cursor-pointer">
                <Button size="lg">
                  {t.hero.primaryCTA}
                </Button>
              </Link>
              <Link href={`/${locale}/about`} className="cursor-pointer">
                <Button variant="outline" size="lg">
                  {t.hero.secondaryCTA}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.featuredTopics.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.featuredTopics.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{post.description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/${locale}/blog/${post.slug}`} className="w-full cursor-pointer">
                    <Button variant="outline" className="w-full">
                      {commonT.blog.readMore}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href={`/${locale}/blog`} className="cursor-pointer">
              <Button variant="default" size="lg">
                {t.featuredTopics.viewAllCTA}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const featuredTopics = [
  {
    id: "web-development",
    title: "Web Development",
    description: "Frontend and backend technologies",
    content: "Explore modern web development techniques, frameworks, and best practices for building responsive and scalable applications."
  },
  {
    id: "devops",
    title: "DevOps",
    description: "Continuous integration and deployment",
    content: "Learn about DevOps methodologies, tools, and practices to improve collaboration between development and operations teams."
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "Data analysis and machine learning",
    content: "Dive into data science concepts, machine learning algorithms, and practical applications for extracting insights from data."
  },
];
