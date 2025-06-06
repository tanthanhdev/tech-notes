# Tech Notes Hub Website

A modern blog website built with Next.js, Tailwind CSS, shadcn UI, and i18n support for multilingual content (Vietnamese and English).

## Features

- **Modern UI**: Clean, minimal design with Tailwind CSS and shadcn UI components
- **Bilingual Support**: Full i18n integration with Vietnamese and English translations
- **Blog System**: Complete blog functionality with Markdown content rendering
- **Dark/Light Mode**: Theme switching with system preference detection
- **SEO Optimized**: Complete SEO setup with meta tags, OpenGraph data, dynamic sitemap.xml, robots.txt, structured metadata, canonical URLs and language alternates
- **Responsive Design**: Mobile-first approach, works on all devices

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn UI](https://ui.shadcn.com/) - UI component library
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown renderer
- [i18n](https://nextjs.org/docs/app/building-your-application/routing/internationalization) - Internationalization
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd website
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## Project Structure

```
website/
├── public/              # Static assets
├── src/
│   ├── app/             # App router pages
│   │   ├── [locale]/    # Locale-specific routes
│   │   │   ├── blog/    # Blog pages
│   │   │   ├── about/   # About page
│   │   ├── components/      # React components
│   │   │   ├── ui/          # UI components (shadcn)
│   │   │   ├── layout/      # Layout components
│   │   │   ├── blog/        # Blog-specific components
│   │   ├── data/            # Data sources
│   │   │   ├── i18n/        # Translation files
│   │   │   ├── blog-posts.ts # Blog post data
│   │   ├── lib/             # Utility functions
│   │   │   ├── i18n/        # i18n utilities
│   │   │   ├── utils.ts     # Helper functions
│   │   │   ├── types.ts     # TypeScript types
├── next.config.ts       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
```

## Adding Content

### Blog Posts

To add new blog posts, edit the `src/data/blog-posts.ts` file. Each post should follow the BlogPost interface defined in `src/lib/types.ts`.

### Translations

Add or edit translations in the following files:
- `src/data/i18n/en/common.json` - English translations
- `src/data/i18n/vi/common.json` - Vietnamese translations

## Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Deploy to Vercel

The easiest way to deploy the application is to use the [Vercel Platform](https://vercel.com/).

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project to Vercel
3. Vercel will detect Next.js and configure the build settings automatically
4. Click "Deploy"

### Other Deployment Options

You can also deploy to other platforms like Netlify, AWS Amplify, or traditional hosting with a Node.js server.

For static export:

```bash
npm run build
npm run export
```

This will generate a static version of the site in the `out` directory that can be served by any static hosting service.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
