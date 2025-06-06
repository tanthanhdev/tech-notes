export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  coverImage?: string;
  sourcePath: string;
  sourceType: string;
  language: string;
  relativePath: string;
  relatedSnippets?: Array<{
    path: string;
    language: string;
    filename: string;
    content: string;
  }>;
}
