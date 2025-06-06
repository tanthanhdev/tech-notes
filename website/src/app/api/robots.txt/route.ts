const WEBSITE_URL = 'https://tech-notes-hub.vercel.app';

export async function GET() {
  const robotsTxt = `
# Allow all web crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${WEBSITE_URL}/api/sitemap.xml

# Disallow admin paths
User-agent: *
Disallow: /admin/
Disallow: /api/

# Special instructions for specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Baiduspider
Disallow: /

# Crawl-delay suggestion
User-agent: *
Crawl-delay: 10
`.trim();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
