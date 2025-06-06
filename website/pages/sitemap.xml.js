import { getContentAsBlogPosts } from '@/lib/content-mapper';

const WEBSITE_URL = 'https://technotes.example.com';
const LOCALES = ['en', 'vi'];

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <!-- Home pages for each locale -->
      ${LOCALES.map(locale => `
        <url>
          <loc>${WEBSITE_URL}/${locale}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
          ${LOCALES.map(altLocale => `
            <xhtml:link
              rel="alternate"
              hreflang="${altLocale}"
              href="${WEBSITE_URL}/${altLocale}"
            />
          `).join('')}
        </url>
      `).join('')}

      <!-- About pages for each locale -->
      ${LOCALES.map(locale => `
        <url>
          <loc>${WEBSITE_URL}/${locale}/about</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
          ${LOCALES.map(altLocale => `
            <xhtml:link
              rel="alternate"
              hreflang="${altLocale}"
              href="${WEBSITE_URL}/${altLocale}/about"
            />
          `).join('')}
        </url>
      `).join('')}

      <!-- Privacy Policy pages for each locale -->
      ${LOCALES.map(locale => `
        <url>
          <loc>${WEBSITE_URL}/${locale}/privacy</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
          ${LOCALES.map(altLocale => `
            <xhtml:link
              rel="alternate"
              hreflang="${altLocale}"
              href="${WEBSITE_URL}/${altLocale}/privacy"
            />
          `).join('')}
        </url>
      `).join('')}

      <!-- Terms of Service pages for each locale -->
      ${LOCALES.map(locale => `
        <url>
          <loc>${WEBSITE_URL}/${locale}/terms</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
          ${LOCALES.map(altLocale => `
            <xhtml:link
              rel="alternate"
              hreflang="${altLocale}"
              href="${WEBSITE_URL}/${altLocale}/terms"
            />
          `).join('')}
        </url>
      `).join('')}

      <!-- Blog list pages for each locale -->
      ${LOCALES.map(locale => `
        <url>
          <loc>${WEBSITE_URL}/${locale}/blog</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
          ${LOCALES.map(altLocale => `
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

export default function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // Fetch all blog posts from all locales
  const allPosts = [];

  for (const locale of LOCALES) {
    const posts = await getContentAsBlogPosts(locale);
    allPosts.push(...posts);
  }

  // Generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(allPosts);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}
