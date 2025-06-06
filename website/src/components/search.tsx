"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import { BlogPost } from '@/lib/types';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/settings';

interface SearchProps {
  locale: Locale;
  allPosts: BlogPost[];
  placeholder?: string;
}

export default function Search({ locale, allPosts, placeholder }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<BlogPost[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter posts by title
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allPosts.filter(post =>
      post.title.toLowerCase().includes(term)
    );

    setResults(filtered);
    setIsSearchOpen(true);
  }, [searchTerm, allPosts]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (results.length > 0) {
      router.push(`/${locale}/blog/${results[0].slug}`);
      setSearchTerm('');
      setIsSearchOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder={placeholder || "Search blog posts..."}
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
          onFocus={() => setIsSearchOpen(true)}
        />
        <SearchIcon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {isSearchOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-background border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
          <div className="p-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Search Results</h3>
            <ul className="space-y-1">
              {results.map(post => (
                <li key={post.id}>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="block p-2 hover:bg-secondary rounded-md text-sm cursor-pointer"
                    onClick={() => {
                      setSearchTerm('');
                      setIsSearchOpen(false);
                    }}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}