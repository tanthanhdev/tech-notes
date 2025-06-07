"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Locale } from "@/lib/i18n/settings";
import { useRouter } from "next/navigation";
import { setCookie } from "@/lib/cookies";

interface HeaderProps {
  translations: any;
  locale: Locale;
}

export default function Header({ translations, locale }: HeaderProps) {
  const t = translations.common;
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLanguageChange = (newLocale: Locale) => {
    // Save the preferred locale to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem('preferredLocale', newLocale);

      // Set a cookie for the middleware (which can't access localStorage)
      setCookie('preferredLocale', newLocale, 365); // Valid for 1 year
    }

    router.push(`/${newLocale}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 md:h-20 items-center px-4 md:px-6 lg:px-8">
        <div className="flex items-center flex-shrink-0 mr-2 sm:mr-6">
          <Link href={`/${locale}`} className="flex items-center space-x-2 cursor-pointer">
            <span className="font-bold text-lg sm:text-xl md:text-2xl">{t.site?.title || 'Tech Notes Hub'}</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            <Link
              href={`/${locale}/blog`}
              className="text-sm md:text-base font-medium hover:text-primary transition-colors cursor-pointer"
            >
              {t.nav?.blog || 'Blog'}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-sm md:text-base font-medium hover:text-primary transition-colors cursor-pointer"
            >
              {t.nav?.about || 'About'}
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex sm:items-center sm:space-x-1">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="cursor-pointer">
                {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
              </Button>
              <div className="flex items-center gap-1 ml-2 sm:ml-4 border rounded-full px-1 py-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full px-2 sm:px-3 text-xs sm:text-sm h-7 sm:h-8 ${locale === "en" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => handleLanguageChange("en")}
                >
                  EN
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full px-2 sm:px-3 text-xs sm:text-sm h-7 sm:h-8 ${locale === "vi" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => handleLanguageChange("vi")}
                >
                  VI
                </Button>
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden cursor-pointer"
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] max-w-[400px] sm:max-w-[540px] pr-0 pt-12">
                <SheetTitle className="sr-only">{t.nav?.menu || 'Site Menu'}</SheetTitle>
                <div className="px-6">
                  <div className="flex flex-col space-y-6">
                    <Link
                      href={`/${locale}/blog`}
                      className="text-lg font-medium hover:text-primary transition-colors cursor-pointer"
                    >
                      {t.nav?.blog || 'Blog'}
                    </Link>
                    <Link
                      href={`/${locale}/about`}
                      className="text-lg font-medium hover:text-primary transition-colors cursor-pointer"
                    >
                      {t.nav?.about || 'About'}
                    </Link>
                  </div>
                  <div className="mt-10 pt-6 border-t flex flex-col space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-sm uppercase text-muted-foreground font-medium">{t.languages?.title || 'Languages'}</h3>
                      <div className="flex flex-col space-y-2">
                        <div
                          className={`flex items-center px-3 py-2 rounded-lg cursor-pointer ${locale === "en" ? "bg-primary/10 text-primary" : ""}`}
                          onClick={() => handleLanguageChange("en")}
                        >
                          <span className="text-base">{t.languages?.english || 'English'}</span>
                          {locale === "en" && <span className="ml-auto text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Active</span>}
                        </div>
                        <div
                          className={`flex items-center px-3 py-2 rounded-lg cursor-pointer ${locale === "vi" ? "bg-primary/10 text-primary" : ""}`}
                          onClick={() => handleLanguageChange("vi")}
                        >
                          <span className="text-base">{t.languages?.vietnamese || 'Tiếng Việt'}</span>
                          {locale === "vi" && <span className="ml-auto text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Active</span>}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm uppercase text-muted-foreground font-medium">{t.theme?.title || 'Theme'}</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant={theme === "light" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTheme("light")}
                          className="flex-1 cursor-pointer"
                        >
                          <SunIcon size={16} className="mr-2" />
                          {t.theme?.light || 'Light'}
                        </Button>
                        <Button
                          variant={theme === "dark" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTheme("dark")}
                          className="flex-1 cursor-pointer"
                        >
                          <MoonIcon size={16} className="mr-2" />
                          {t.theme?.dark || 'Dark'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
