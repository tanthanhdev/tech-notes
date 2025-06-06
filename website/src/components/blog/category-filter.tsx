"use client";

import { Category } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Locale } from "@/lib/i18n/settings";

interface BlogCategoryFilterProps {
  categories: (Category & { count: number })[];
  selectedCategory: string;
  locale: Locale;
  allCategoriesLabel?: string;
}

export default function BlogCategoryFilter({
  categories,
  selectedCategory,
  locale,
  allCategoriesLabel = "All Categories"
}: BlogCategoryFilterProps) {
  return (
    <div className="space-y-2">
      <Link
        href={`/${locale}/blog`}
        className={cn(
          "block px-3 py-2 rounded-md hover:bg-secondary/80 transition-colors cursor-pointer",
          !selectedCategory ? "bg-secondary text-secondary-foreground font-medium" : "text-foreground/70"
        )}
      >
        {allCategoriesLabel}
      </Link>

      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/${locale}/blog?category=${category.slug}`}
          className={cn(
            "block px-3 py-2 rounded-md hover:bg-secondary/80 transition-colors flex justify-between cursor-pointer",
            selectedCategory === category.slug ? "bg-secondary text-secondary-foreground font-medium" : "text-foreground/70"
          )}
        >
          <span>{category.name}</span>
          <span className="text-foreground/50 text-sm">{category.count}</span>
        </Link>
      ))}
    </div>
  );
}
