import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { en } from "./languages/en";
import { de } from "./languages/de";
import { ru } from "./languages/ru";

type Language = "en" | "de" | "ru";

type TranslationValue = string | { [key: string]: TranslationValue };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations = {
  en,
  de,
  ru,
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = "en",
}) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const keys = key.split(".");
      let value: TranslationValue = translations[language];

      for (const k of keys) {
        if (value === undefined || typeof value === "string") {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
        value = value[k];
      }

      if (typeof value !== "string") {
        console.warn(`Translation value is not a string: ${key}`);
        return key;
      }

      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
          const param = params[key];
          return param !== undefined ? String(param) : `{{${key}}}`;
        });
      }

      return value;
    },
    [language]
  );

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
