"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fa } from "@/locales/fa";
import { en } from "@/locales/en";

type Locale = "fa" | "en";
type TranslationType = typeof fa;

interface LanguageContextType {
  locale: Locale;
  t: TranslationType;
  dir: "rtl" | "ltr";
  toggleLanguage: () => void;
  setLanguage: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>("fa");

  useEffect(() => {
    // Load saved language from localStorage if available
    const savedLocale = localStorage.getItem("elite-startup-locale") as Locale;
    if (savedLocale === "fa" || savedLocale === "en") {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    // Update html tag attributes
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    localStorage.setItem("elite-startup-locale", locale);
  }, [locale]);

  const toggleLanguage = () => {
    setLocale((prev) => (prev === "fa" ? "en" : "fa"));
  };

  const setLanguage = (lang: Locale) => {
    setLocale(lang);
  };

  const t = locale === "fa" ? fa : en;
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ locale, t, dir, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
