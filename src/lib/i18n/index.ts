import type { TranslationKey } from "./types"
import { en } from "./locales/en"
import { ptBR } from "./locales/pt-BR"
import { ru } from "./locales/ru"
import { es } from "./locales/es"
import { de } from "./locales/de"
import { fr } from "./locales/fr"
import { ja } from "./locales/ja"

const FALLBACK_LOCALE = "en"

export type SupportedLocale = "en" | "pt-BR" | "ru" | "es" | "de" | "fr" | "ja"

export const supportedLocales: { code: SupportedLocale; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt-BR", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
]

const translations: Record<string, Record<TranslationKey, string>> = {
  en: en as Record<TranslationKey, string>,
  "pt-BR": ptBR as Record<TranslationKey, string>,
  ru: ru as Record<TranslationKey, string>,
  es: es as Record<TranslationKey, string>,
  de: de as Record<TranslationKey, string>,
  fr: fr as Record<TranslationKey, string>,
  ja: ja as Record<TranslationKey, string>,
}

export function getTranslation(
  locale: string,
  key: TranslationKey
): string {
  const strings = translations[locale] ?? translations[FALLBACK_LOCALE]
  return strings[key] ?? en[key as keyof typeof en] ?? key
}

export type { TranslationKey }
