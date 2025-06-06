"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { Locale } from '@/lib/i18n/settings';

type TranslationContextType = {
  locale: Locale;
  t: (namespace: string, key: string, params?: Record<string, string>) => string;
  translations: Record<string, Record<string, string>>;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: ReactNode;
  locale: Locale;
  translations: Record<string, Record<string, string>>;
}

export function TranslationProvider({
  children,
  locale,
  translations
}: TranslationProviderProps) {
  const t = (namespace: string, key: string, params?: Record<string, string>): string => {
    try {
      const keys = key.split('.');
      let value: any = translations[namespace];

      for (const k of keys) {
        if (!value || !value[k]) return key;
        value = value[k];
      }

      if (typeof value === 'string') {
        if (params) {
          return Object.entries(params).reduce(
            (acc: string, [paramKey, paramValue]) =>
              acc.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue),
            value
          );
        }
        return value;
      }

      return key;
    } catch (error) {
      console.error(`Translation error for ${namespace}.${key}`, error);
      return key;
    }
  };

  return (
    <TranslationContext.Provider value={{ locale, t, translations }}>
      {children}
    </TranslationContext.Provider>
  );
}
