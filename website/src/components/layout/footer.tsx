"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Locale } from "@/lib/i18n/settings";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Github, Heart } from "lucide-react";

interface FooterProps {
  translations: any;
  locale: Locale;
}

export function Footer({ translations, locale }: FooterProps) {
  const t = translations.common;
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex flex-col sm:flex-row h-auto sm:h-16 md:h-20 items-center px-4 md:px-6 lg:px-8 py-4 sm:py-0">
        <div className="flex flex-1 flex-col sm:flex-row items-center sm:justify-between w-full gap-4 sm:gap-0">
          <div className="flex-shrink-0 text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              {t.footer?.copyright || `© ${currentYear} Tech Notes Hub. MIT License.`}
            </p>
          </div>

          <nav className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            <Link
              href={`/${locale}/privacy`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t.footer?.links?.privacy || 'Privacy Policy'}
            </Link>

            <Link
              href={`/${locale}/terms`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t.footer?.links?.terms || 'Terms of Service'}
            </Link>

            <a
              href="https://github.com/tech-notes-hub/tech-notes"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>

            <div className="hidden md:flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">{t.footer?.madeWith || 'Made with'}</span>
              <Heart className="h-3 w-3 fill-current text-red-500" />
              <span className="text-xs">TNH</span>
            </div>

            <ThemeToggle />
          </nav>
        </div>
      </div>
    </footer>
  );
}
