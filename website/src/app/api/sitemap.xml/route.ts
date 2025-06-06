import { getContentAsBlogPosts } from '@/lib/content-mapper';
import { locales } from '@/lib/i18n/settings';

const WEBSITE_URL = 'https://tech-notes-hub.vercel.app';

export async function GET() {
  // Fetch all blog posts from all locales
  const allPosts = [];

  for (const locale of locales) {
    const posts = await getContentAsBlogPosts(locale);
    allPosts.push(...posts);
  }

  // Generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(allPosts);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}

function generateSiteMap(posts: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <!-- Home pages for each locale -->
      ${locales.map(locale => `
        <url>
          <loc>${WEBSITE_URL}/${locale}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
          ${locales.map(altLocale => `
            <xhtml:link
              rel="alternate"
              hreflang="${altLocale}"
              href="${WEBSITE_URL}/${altLocale}"
            />
          `).join('')}
        </url>
      `).join('')}

      <!-- About pages for each locale -->
      ${locales.map(locale => `
        <url>
          <loc>${WEBSITE_URL}/${locale}/about</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
          ${locales.map(altLocale => `
            <xhtml:link
              rel="alternate"
              hreflang="${altLocale}"
              href="${WEBSITE_URL}/${altLocale}/about"
            />
          `).join('')}
        </url>
      `).join('')}

      <!-- Privacy Policy pages for each locale -->
      ${locales.map(locale => `
        <url>
          <loc>${WEBSITE_URL}/${locale}/privacy</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
          ${locales.map(altLocale => `
            <xhtml:link
              rel="alternate"
              hreflang="${altLocale}"
              href="${WEBSITE_URL}/${altLocale}/privacy"
            />
          `).join('')}
        </url>
      `).join('')}

      <!-- Terms of Service pages for each locale -->
      ${locales.map(locale => `
        <url>
          <loc>${WEBSITE_URL}/${locale}/terms</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
          ${locales.map(altLocale => `
            <xhtml:link
              rel="alternate"
              hreflang="${altLocale}"
              href="${WEBSITE_URL}/${altLocale}/terms"
            />
          `).join('')}
        </url>
      `).join('')}

      <!-- Blog list pages for each locale -->
      ${locales.map(locale => `
        <url>
          <loc>${WEBSITE_URL}/${locale}/blog</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
          ${locales.map(altLocale => `
            <xhtml:link
              rel="alternate"
              hreflang="${altLocale}"
              href="${WEBSITE_URL}/${altLocale}/blog"
            />
          `).join('')}
        </url>
      `).join('')}

      <!-- Blog post pages -->
      ${posts.map(post => {
        // Find translations for this post
        const translations = posts.filter(p =>
          p.slug !== post.slug &&
          p.relativePath === post.relativePath
        );

        return `
          <url>
            <loc>${WEBSITE_URL}/${post.language}/blog/${post.slug}</loc>
            <lastmod>${post.date || new Date().toISOString().split('T')[0]}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
            ${
              // Add links to translations if they exist
              translations.map(translation => `
                <xhtml:link
                  rel="alternate"
                  hreflang="${translation.language}"
                  href="${WEBSITE_URL}/${translation.language}/blog/${translation.slug}"
                />
              `).join('')
            }
          </url>
        `;
      }).join('')}
    </urlset>
  `;
}
