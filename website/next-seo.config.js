// Default SEO configuration
const defaultSEOConfig = {
  titleTemplate: '%s - Tech Notes Hub',
  defaultTitle: 'Tech Notes Hub',
  description: 'A collection of tech notes, code snippets, and technical guides for developers',
  canonical: 'https://technotes.example.com',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://technotes.example.com',
    siteName: 'Tech Notes Hub',
    title: 'Tech Notes Hub',
    description: 'A collection of tech notes, code snippets, and technical guides for developers',
    images: [
      {
        url: 'https://technotes.example.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tech Notes Hub',
      },
    ],
  },
  twitter: {
    handle: '@technotes',
    site: '@technotes',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'author',
      content: 'Tech Notes Team',
    },
    {
      name: 'keywords',
      content: 'tech, programming, algorithms, design patterns, databases, devops, linux, system design, testing',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
};

export default defaultSEOConfig;
