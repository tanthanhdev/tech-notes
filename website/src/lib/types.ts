export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  date: string;
  update?: string;
  author: string;
  category: string;
  tags: string[];
  coverImage?: string;
  sourcePath?: string;
  sourceType?: 'docs' | 'snippets' | 'i18n';
  language?: string;
  relativePath?: string;
  availableTranslations?: string[];
  translations?: Record<string, string>;
  relatedSnippets?: Array<{
    path: string;
    language: string;
    filename: string;
    content: string;
  }>;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
}
