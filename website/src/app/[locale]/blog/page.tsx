import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Locale, getTranslationsFromNamespaces } from "@/lib/i18n/settings";
import { Metadata } from "next";
import { getContentAsBlogPosts, getCategoriesWithCounts, CATEGORY_SLUGS } from "@/lib/content-mapper";
import BlogCategoryFilter from "@/components/blog/category-filter";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Search from "@/components/search";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const translations = await getTranslationsFromNamespaces(params.locale, ['common']);

  return {
    title: `${translations.common.nav.blog} - ${translations.common.site.title}`,
    description: translations.common.site.description,
  };
}

interface BlogPageProps {
  params: {
    locale: Locale;
  };
  searchParams?: {
    category?: string;
    page?: string;
  }
}

const POSTS_PER_PAGE = 20;

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = params;
  const selectedCategory = searchParams?.category || '';
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;

  // Get translations
  const translations = await getTranslationsFromNamespaces(locale, ['common']);
  const t = translations.common;

  // Get blog posts with the appropriate locale
  const blogPosts = await getContentAsBlogPosts(locale);

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`Total blog posts for locale ${locale}: ${blogPosts.length}`);
    console.log(`Selected category: "${selectedCategory}"`);

    // Log all categories found in posts
    const allCategories = new Set(blogPosts.map(post => post.category));
    console.log('Available categories in posts:', Array.from(allCategories));

    // Log posts with design-patterns category
    const designPatternPosts = blogPosts.filter(post =>
      post.category.toLowerCase() === 'design-patterns' ||
      post.category.toLowerCase() === 'design patterns'
    );
    console.log(`Design pattern posts: ${designPatternPosts.length}`);
    designPatternPosts.forEach(post => {
      console.log(`- ${post.title} (category: "${post.category}", slug: ${post.slug})`);
    });
  }

  // Filter by category if specified
  const filteredPosts = selectedCategory
    ? blogPosts.filter(post => {
        const postCategory = post.category;
        const postCategorySlug = CATEGORY_SLUGS[postCategory as keyof typeof CATEGORY_SLUGS] ||
                                post.category.toLowerCase().replace(/\s+/g, '-');
        const searchCategory = selectedCategory.toLowerCase();

        // Match by category slug, category name, or tags
        const matchCategorySlug = postCategorySlug.toLowerCase() === searchCategory;
        const matchCategoryName = post.category.toLowerCase() === searchCategory;
        const matchCategoryNameWithDash = post.category.toLowerCase().replace(/\s+/g, '-') === searchCategory;
        const matchTags = post.tags.some(tag => tag.toLowerCase() === searchCategory);

        if (process.env.NODE_ENV === 'development' && selectedCategory.toLowerCase() === 'design-patterns') {
          console.log(`Post "${post.title}" - category: "${post.category}", slug: "${postCategorySlug}"`);
          console.log(`Matches: slug=${matchCategorySlug}, name=${matchCategoryName}, name-dash=${matchCategoryNameWithDash}, tags=${matchTags}`);
        }

        return matchCategorySlug || matchCategoryName || matchCategoryNameWithDash || matchTags;
      })
    : blogPosts;

  // Pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Get categories with counts for the sidebar
  const categories = await getCategoriesWithCounts(locale);

  if (blogPosts.length === 0) {
    return notFound();
  }

  // Map category names to translated versions
  const translatedCategories = categories.map(category => ({
    ...category,
    name: t.categories[category.id as keyof typeof t.categories] || category.name
  }));

  // Generate pagination URL
  const getPaginationUrl = (page: number) => {
    const baseUrl = `/${locale}/blog`;
    const categoryParam = selectedCategory ? `category=${selectedCategory}` : '';
    const pageParam = page > 1 ? `page=${page}` : '';

    if (categoryParam && pageParam) {
      return `${baseUrl}?${categoryParam}&${pageParam}`;
    } else if (categoryParam) {
      return `${baseUrl}?${categoryParam}`;
    } else if (pageParam) {
      return `${baseUrl}?${pageParam}`;
    }
    return baseUrl;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {t.nav.blog}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-[700px] mx-auto">
          {t.site.description}
        </p>
        <div className="mt-6 flex justify-center">
          <Search
            locale={locale}
            allPosts={blogPosts}
            placeholder={t.blog.searchPlaceholder || "Search blog posts..."}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 flex-shrink-0">
          <div className="sticky top-8">
            <h2 className="text-xl font-bold mb-4">{t.blog.categories}</h2>
            <BlogCategoryFilter
              categories={translatedCategories}
              selectedCategory={selectedCategory}
              locale={locale}
              allCategoriesLabel={t.blog.allCategories}
            />
          </div>
        </aside>

        <div className="flex-grow">
          {paginatedPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">{t.blog.noPostsFound}</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {t.blog.tryDifferentCategory}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map(post => {
                  // Get translated category name if available
                  const categoryKey = post.category.toLowerCase().replace(/\s+/g, '-') as keyof typeof t.categories;
                  const translatedCategory = t.categories[categoryKey] || post.category;

                  // Get translated source type if available
                  const sourceTypeKey = post.sourceType as keyof typeof t.blog.sourceTypes | undefined;
                  const translatedSourceType = sourceTypeKey && t.blog.sourceTypes[sourceTypeKey]
                    ? t.blog.sourceTypes[sourceTypeKey]
                    : post.sourceType;

                  return (
                    <Card key={post.id} className="flex flex-col h-full">
                      <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>
                          {`${t.blog.publishedOn} ${new Date(post.date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}`} | {translatedCategory}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-gray-500 dark:text-gray-400">{post.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map(tag => (
                            <span
                              key={tag}
                              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {post.sourceType && (
                          <div className="mt-3">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                              {translatedSourceType}
                            </span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Link href={`/${locale}/blog/${post.slug}`} className="cursor-pointer">
                          <Button variant="outline">{t.blog.readMore}</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-1">
                    <Link
                      href={getPaginationUrl(1)}
                      className={`${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                    >
                      <Button variant="outline" size="icon">
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link
                      href={getPaginationUrl(Math.max(1, currentPage - 1))}
                      className={`${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                    >
                      <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </Link>

                    <span className="mx-2 text-sm">
                      {t.blog.page} {currentPage} {t.blog.of} {totalPages}
                    </span>

                    <Link
                      href={getPaginationUrl(Math.min(totalPages, currentPage + 1))}
                      className={`${currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                    >
                      <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link
                      href={getPaginationUrl(totalPages)}
                      className={`${currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                    >
                      <Button variant="outline" size="icon">
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </nav>
                </div>
              )}

              {/* Post count information */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {t.blog.showing} {(currentPage - 1) * POSTS_PER_PAGE + 1}-
                {Math.min(currentPage * POSTS_PER_PAGE, totalPosts)} {t.blog.of} {totalPosts} {t.blog.posts}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
