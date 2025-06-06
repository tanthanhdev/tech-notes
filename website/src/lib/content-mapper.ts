import { promises as fs } from 'fs';
import path from 'path';
import { BlogPost, Category } from '@/lib/types';
import { Locale } from './i18n/settings';

// Root paths for content directories
const DOCS_DIR = path.join(process.cwd(), '..', 'docs');
const I18N_DIR = path.join(process.cwd(), '..', 'i18n');
const SNIPPETS_DIR = path.join(process.cwd(), '..', 'snippets');

// Maps the categories to their respective directories
const CATEGORY_DIRECTORY_MAP: Record<string, string[]> = {
  'Algorithms': ['algorithms'],
  'Databases': ['databases'],
  'Design Patterns': ['design-patterns'],
  'DevOps': ['devops'],
  'Linux': ['linux'],
  'System Design': ['system-design'],
  'Testing': ['testing'],
};

// Các slug cho danh mục
export const CATEGORY_SLUGS = {
  'Algorithms': 'algorithms',
  'Databases': 'databases',
  'Design Patterns': 'design-patterns',
  'DevOps': 'devops',
  'Linux': 'linux',
  'System Design': 'system-design',
  'Testing': 'testing',
};

export const CATEGORIES: Category[] = [
  { id: 'algorithms', name: 'Algorithms', description: 'Algorithms and data structures', slug: 'algorithms' },
  { id: 'databases', name: 'Databases', description: 'Database systems and SQL', slug: 'databases' },
  { id: 'design-patterns', name: 'Design Patterns', description: 'Software design patterns', slug: 'design-patterns' },
  { id: 'devops', name: 'DevOps', description: 'DevOps practices and tools', slug: 'devops' },
  { id: 'linux', name: 'Linux', description: 'Linux systems and commands', slug: 'linux' },
  { id: 'system-design', name: 'System Design', description: 'System architecture and design', slug: 'system-design' },
  { id: 'testing', name: 'Testing', description: 'Software testing methodologies', slug: 'testing' },
];

/**
 * Read and parse a markdown file to extract metadata and content
 */
async function parseMarkdownFile(filePath: string): Promise<{ metadata: Record<string, any>; content: string }> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const metadataRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const metadataMatch = fileContent.match(metadataRegex);

    if (!metadataMatch) {
      return {
        metadata: {},
        content: fileContent,
      };
    }

    const metadataStr = metadataMatch[1];
    const content = fileContent.slice(metadataMatch[0].length);

    // Parse metadata
    const metadata: Record<string, any> = {};
    metadataStr.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        const value = valueParts.join(':').trim();
        metadata[key.trim()] = value;
      }
    });

    return { metadata, content };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return { metadata: {}, content: '' };
  }
}

/**
 * Get all markdown files from a directory recursively
 */
async function getAllMarkdownFiles(dir: string): Promise<string[]> {
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });

    const files = await Promise.all(
      dirents.map(dirent => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getAllMarkdownFiles(res) : res;
      })
    );

    return Array.prototype.concat(...files).filter(file => file.endsWith('.md'));
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

/**
 * Determine the category of a file based on its path
 */
function getCategoryFromPath(filePath: string): string {
  for (const [category, dirs] of Object.entries(CATEGORY_DIRECTORY_MAP)) {
    if (dirs.some(dir => filePath.includes(`/${dir}/`))) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Category found for ${filePath}: ${category}`);
      }
      return category;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`No category found for ${filePath}, using Uncategorized`);
  }
  return 'Uncategorized';
}

/**
 * Get language from file path
 */
function getLanguageFromPath(filePath: string): Locale {
  if (filePath.includes('/vi/')) return 'vi';
  return 'en'; // Default to English
}

/**
 * Extract base filename without language prefix
 */
function getBaseFilename(filePath: string): string {
  const fileName = path.basename(filePath, '.md');
  // Remove language prefix if exists
  return fileName.replace(/^(en|vi)-/, '');
}

/**
 * Get relative path without base directory
 */
function getRelativePath(filePath: string): string {
  if (filePath.includes('/docs/')) {
    return filePath.split('/docs/')[1];
  } else if (filePath.includes('/snippets/')) {
    return filePath.split('/snippets/')[1];
  } else if (filePath.includes('/i18n/')) {
    // For i18n paths, extract language and remove it from path
    const afterI18n = filePath.split('/i18n/')[1];
    const parts = afterI18n.split('/');

    // Skip language part (first segment) if it exists
    if (parts.length > 1) {
      // Remove language part (first segment)
      parts.shift();
      return parts.join('/');
    } else {
      // If only one part, it's probably the language itself
      // In this case, just return the filename
      return path.basename(filePath);
    }
  }
  return path.basename(filePath);
}

/**
 * Generate a unique slug for a blog post
 */
function generateSlug(sourceType: string, fileName: string): string {
  // Remove language prefix if it exists
  const baseFileName = fileName.replace(/^(en|vi)-/, '');
  // Remove _vi or _en suffix if it exists
  const cleanFileName = baseFileName.replace(/_(vi|en)$/, '');
  // Don't include sourceType in the slug
  return cleanFileName.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Normalize a slug to remove language-specific parts
 */
function normalizeSlug(slug: string): string {
  // First check if it's a full slug with source type prefix
  if (slug.startsWith('docs-') || slug.startsWith('i18n-')) {
    // Extract the source type
    const parts = slug.split('-');
    const sourceType = parts[0];
    // Get the rest of the slug without the source type
    const restOfSlug = parts.slice(1).join('-');
    // Remove language suffix and reconstruct
    return `${sourceType}-${restOfSlug.replace(/_(vi|en)$/, '')}`;
  }

  // If it's just a plain slug without source type prefix
  return slug.replace(/_(vi|en)$/, '');
}

/**
 * Map docs and i18n to blog posts
 */
export async function getContentAsBlogPosts(locale: string = 'en'): Promise<BlogPost[]> {
  try {
    console.log(`Getting blog posts for locale: ${locale}`);

    // Get all markdown files from docs and i18n directories
    const docsFiles = await getAllMarkdownFiles(DOCS_DIR);
    const i18nFiles = await getAllMarkdownFiles(I18N_DIR);
    const snippetsFiles = await getAllMarkdownFiles(SNIPPETS_DIR);

    console.log(`Found ${docsFiles.length} docs files, ${i18nFiles.length} i18n files, ${snippetsFiles.length} snippets files`);

    // Create a mapping of relative paths to files for easy lookup
    const filesByRelativePath: Record<string, {
      sourcePath: string,
      language: string,
      sourceType: 'docs' | 'i18n' | 'snippets'
    }> = {};

    // Process docs files (always English)
    for (const filePath of docsFiles) {
      const relativePath = getRelativePath(filePath);
      filesByRelativePath[relativePath] = {
        sourcePath: filePath,
        language: 'en',
        sourceType: 'docs'
      };
    }

    // Process i18n files (for other languages)
    for (const filePath of i18nFiles) {
      const language = getLanguageFromPath(filePath);
      if (language !== 'en') {
        const relativePath = getRelativePath(filePath);
        filesByRelativePath[relativePath] = {
          sourcePath: filePath,
          language,
          sourceType: 'i18n'
        };
      }
    }

    // Also track snippets, but don't include them as separate posts
    const snippetsByBasePath: Record<string, string[]> = {};

    for (const filePath of snippetsFiles) {
      const relativePath = getRelativePath(filePath);
      const category = relativePath.split('/')[0]; // e.g., 'algorithms'
      const basePath = relativePath.split('/')[1]?.split('.')[0]; // e.g., 'sorting-algorithms'

      if (basePath) {
        if (!snippetsByBasePath[basePath]) {
          snippetsByBasePath[basePath] = [];
        }
        snippetsByBasePath[basePath].push(filePath);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Snippets by base path:', snippetsByBasePath);
    }

    // Combine all files for main content
    const allFiles = [...docsFiles, ...i18nFiles];

    // Parse each file and convert to blog post format
    const posts: BlogPost[] = [];

    for (const filePath of allFiles) {
      const { metadata, content } = await parseMarkdownFile(filePath);
      const fileName = path.basename(filePath, '.md');
      const fileLanguage = getLanguageFromPath(filePath);

      // For language selection, prefer requested locale, fallback to English
      // Skip files that don't match the requested locale unless they're English and no localized version exists
      const relativePath = getRelativePath(filePath);
      const isCorrectLanguage = fileLanguage === locale;
      const isEnglishFallback = fileLanguage === 'en' &&
        (!filesByRelativePath[relativePath] || filesByRelativePath[relativePath].language !== locale);

      if (!(isCorrectLanguage || isEnglishFallback)) {
        continue;
      }

      const category = getCategoryFromPath(filePath);
      const sourceType = filePath.includes('/docs/') ? 'docs' : 'i18n';

      // Create a slug based on the file path
      const baseSlug = path.basename(relativePath, '.md');
      const slug = generateSlug(sourceType, baseSlug);

      if (process.env.NODE_ENV === 'development') {
        console.log(`Processing file: ${filePath}`);
        console.log(`Relative Path: ${relativePath}`);
        console.log(`Language: ${fileLanguage}`);
        console.log(`Base Slug: ${baseSlug}`);
        console.log(`Final Slug: ${slug}`);
      }

      // Extract title from the first heading if not in metadata
      let title = metadata.title;
      if (!title) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        title = titleMatch ? titleMatch[1] : fileName;
      }

      // Extract date from metadata or use file stats
      const date = metadata.date || new Date().toISOString().split('T')[0];

      // Extract update from metadata or use file stats
      const update = metadata.update || new Date().toISOString().split('T')[0];

      // Extract tags from metadata or default based on category
      const tags = metadata.tags
        ? metadata.tags.split(',').map((tag: string) => tag.trim())
        : [category.toLowerCase()];

      // For debugging: output information about the current file being processed
      if (process.env.NODE_ENV === 'development') {
        console.log(`Processing file: ${filePath}`);
        console.log(`  Title: ${title}`);
        console.log(`  Category: ${category}`);
        console.log(`  Slug: ${slug}`);
        console.log(`  Relative Path: ${relativePath}`);
      }

      // Check if there are related snippets for this post
      let relatedSnippets: Array<{
        path: string;
        language: string;
        filename: string;
        content: string;
      }> = [];

      // Try to find snippets in the category directory with the base name
      const basePathForSnippets = path.basename(relativePath, '.md');

      if (process.env.NODE_ENV === 'development') {
        console.log(`Base path for snippets: ${basePathForSnippets}`);
      }

      // Find snippets with the same base path
      const categoryDir = category.toLowerCase().replace(/\s+/g, '-');

      if (process.env.NODE_ENV === 'development') {
        console.log(`Looking for snippets for: ${basePathForSnippets}`);
        console.log(`Checking category dir: ${categoryDir}`);
      }

      // Check if snippets exist directly by base path
      if (snippetsByBasePath[basePathForSnippets]) {
        for (const snippetPath of snippetsByBasePath[basePathForSnippets]) {
          try {
            const snippetContent = await fs.readFile(snippetPath, 'utf-8');
            const fileExtension = path.extname(snippetPath).slice(1);
            const filename = path.basename(snippetPath);

            relatedSnippets.push({
              path: snippetPath,
              language: fileExtension,
              filename,
              content: snippetContent
            });
          } catch (error) {
            console.error(`Error reading snippet file ${snippetPath}:`, error);
          }
        }
      }

      // Also try to find snippets in category directory
      if (relatedSnippets.length === 0) {
        // Find all snippet files in the category directory
        const categorySnippetDir = path.join(SNIPPETS_DIR, categoryDir);
        try {
          const categorySnippetFiles = await getAllMarkdownFiles(categorySnippetDir);
          if (categorySnippetFiles.length > 0) {
            for (const snippetPath of categorySnippetFiles) {
              try {
                const snippetContent = await fs.readFile(snippetPath, 'utf-8');
                const fileExtension = path.extname(snippetPath).slice(1);
                const filename = path.basename(snippetPath);

                relatedSnippets.push({
                  path: snippetPath,
                  language: fileExtension,
                  filename,
                  content: snippetContent
                });
              } catch (error) {
                console.error(`Error reading snippet file ${snippetPath}:`, error);
              }
            }
          }
        } catch (err) {
          // Category snippet directory might not exist, that's okay
          if (process.env.NODE_ENV === 'development') {
            console.log(`No snippet directory found at ${categorySnippetDir}`);
          }
        }
      }

      // Try to find code snippets in subdirectories for any category
      // if (relatedSnippets.length === 0) {
      // Extract topic name from the slug, removing any prefix like docs- or i18n-
      const topicName = baseSlug.replace(/^(docs-|i18n-)/, '');

      if (topicName) {
        try {
          // Check if a subdirectory with the topic name exists in the category directory
          const topicDir = path.join(SNIPPETS_DIR, categoryDir, topicName);

          if (process.env.NODE_ENV === 'development') {
            console.log(`Looking for snippets in: ${topicDir}`);
            console.log(`For slug: ${slug}, baseSlug: ${baseSlug}, topicName: ${topicName}`);
            console.log(`Category directory: ${categoryDir}`);
          }

          try {
            const files = await fs.readdir(topicDir);
            for (const file of files) {
              // Include all files, including .md files
              const snippetPath = path.join(topicDir, file);
              try {
                const snippetContent = await fs.readFile(snippetPath, 'utf-8');
                const fileExtension = path.extname(snippetPath).slice(1) || 'txt';

                relatedSnippets.push({
                  path: snippetPath,
                  language: fileExtension,
                  filename: file,
                  content: snippetContent
                });
              } catch (error) {
                console.error(`Error reading snippet file ${snippetPath}:`, error);
              }
            }
          } catch (err) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`No files found in topic directory: ${topicDir}`);
            }
          }
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Error accessing topic directory: ${err}`);
          }
        }
      }
      // }

      if (process.env.NODE_ENV === 'development' && relatedSnippets.length > 0) {
        console.log(`Found ${relatedSnippets.length} snippets for ${baseSlug}`);
      }

      posts.push({
        id: slug,
        title,
        description: metadata.description || `${title} - ${category} ${sourceType}`,
        content,
        slug,
        date,
        update,
        author: metadata.author || 'Tech Notes Hub',
        category,
        tags,
        coverImage: metadata.coverImage,
        sourcePath: filePath,
        sourceType,
        language: fileLanguage,
        relativePath,
        relatedSnippets: relatedSnippets.length > 0 ? relatedSnippets : undefined
      });
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting content as blog posts:', error);
    return [];
  }
}

/**
 * Get categories with post counts
 */
export async function getCategoriesWithCounts(locale: string = 'en'): Promise<(Category & { count: number })[]> {
  const posts = await getContentAsBlogPosts(locale);

  if (process.env.NODE_ENV === 'development') {
    console.log('Categories for posts:');
    posts.forEach(post => {
      console.log(`- ${post.title}: ${post.category}`);
    });
  }

  return CATEGORIES.map(category => {
    // Check both by name and by slug
    const categoryName = category.name;
    const categorySlug = CATEGORY_SLUGS[categoryName as keyof typeof CATEGORY_SLUGS] ||
                         category.name.toLowerCase().replace(/\s+/g, '-');

    // Count posts that match either the category name or slug
    const count = posts.filter(post => {
      const postCategoryName = post.category;
      const postCategorySlug = CATEGORY_SLUGS[postCategoryName as keyof typeof CATEGORY_SLUGS] ||
                              post.category.toLowerCase().replace(/\s+/g, '-');

      return postCategoryName === categoryName ||
             postCategorySlug === categorySlug ||
             postCategoryName.toLowerCase() === categoryName.toLowerCase() ||
             postCategorySlug.toLowerCase() === categorySlug.toLowerCase();
    }).length;

    if (process.env.NODE_ENV === 'development') {
      console.log(`Category "${categoryName}" (slug: ${categorySlug}) has ${count} posts`);
    }

    return { ...category, count };
  }).filter(category => category.count > 0);
}

/**
 * Get a blog post by its slug
 */
export async function getBlogPostBySlug(slug: string, locale: string = 'en'): Promise<BlogPost | null> {
  const posts = await getContentAsBlogPosts(locale);
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Find all available markdown files by file pattern
 */
function findFileByPattern(files: string[], pattern: string): string[] {
  const regex = new RegExp(pattern, 'i');
  return files.filter(file => regex.test(file));
}

/**
 * Get a consistent base name for translation mapping
 */
function getBaseNameForTranslation(fileName: string): string {
  // Handle special cases like 'readme'
  if (fileName === 'readme') {
    return 'readme';
  }

  // Remove language suffix
  return fileName.replace(/_(vi|en)$/, '');
}

/**
 * Find available translations for a blog post
 */
export async function findAvailableTranslations(slug: string): Promise<{locale: string, slug: string}[]> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Finding translations for slug: ${slug}`);
  }

  // Get all posts
  const allPosts = await getContentAsBlogPosts();

  // Find the exact post with this slug
  const post = allPosts.find(p => p.slug === slug);

  if (!post) {
    console.error(`No post found for slug: ${slug}`);
    return [];
  }

  // Get base name for translations
  const baseSlugName = getBaseNameForTranslation(slug);

  if (process.env.NODE_ENV === 'development') {
    console.log(`Post found: ${post.title}`);
    console.log(`Base slug for translation: ${baseSlugName}`);
    console.log(`Source type: ${post.sourceType}`);
    console.log(`Relative path: ${post.relativePath}`);
  }

  const locales = ['en', 'vi'];
  const translations: {locale: string, slug: string}[] = [];

  for (const locale of locales) {
    const localePosts = await getContentAsBlogPosts(locale);

    // Try different matching strategies
    const matchingPosts = localePosts.filter(p => {
      const postBaseSlug = getBaseNameForTranslation(p.slug);

      // Check if base names match
      return baseSlugName === postBaseSlug;
    });

    if (matchingPosts.length > 0) {
      // If multiple matches, use the first one
      const matchingPost = matchingPosts[0];

      if (process.env.NODE_ENV === 'development') {
        console.log(`Found translation for ${locale}: ${matchingPost.slug} (${matchingPost.sourceType})`);
      }

      translations.push({
        locale,
        slug: matchingPost.slug
      });
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`No translation found for ${locale}`);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Final translations:', translations);
  }

  return translations;
}
