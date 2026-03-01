/**
 * Internationalization (i18n) Provider
 * Manages language state and provides translations throughout the app
 */

"use client";

import { create } from "zustand";
import fr, { Translations } from "@/i18n/fr";

type Language = "fr" | "en";

interface I18nState {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const translations: Record<Language, Translations> = {
  fr,
  en: fr, // Fallback to French as default since user requested French
};

export const useI18n = create<I18nState>((set) => ({
  language: "fr",
  translations: fr,
  setLanguage: (language) =>
    set({
      language,
      translations: translations[language],
    }),
  t: fr,
}));

// Helper hook for easy access to translations
export function useTranslation() {
  return useI18n();
}
