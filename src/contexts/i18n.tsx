"use client"

import { useMemo } from "react"
import { useLocale } from "@/contexts/locale"
import { getTranslation } from "@/lib/i18n"
import type { TranslationKey } from "@/lib/i18n"

export type UseTranslationReturn = {
  t: (key: TranslationKey) => string
  isLoading: false
}

/**
 * Static translations: no API calls, no rate limits. Uses the current locale
 * from LocaleProvider and returns the string for that locale (fallback to en).
 */
export function useTranslation(): UseTranslationReturn {
  const { locale } = useLocale()

  const t = useMemo(
    () => (key: TranslationKey) => getTranslation(locale, key),
    [locale]
  )

  return { t, isLoading: false }
}
