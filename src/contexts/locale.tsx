/* eslint-disable react-refresh/only-export-components */
"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

const STORAGE_KEY = "locale"

/** Language code. App uses static translations for "en" and "pt-BR"; others fallback to en. */
export type Locale = string

const SUPPORTED: Locale[] = ["en", "pt-BR", "ru", "es", "de", "fr", "ja"]

function getDefaultLocale(): Locale {
  if (typeof window === "undefined") return "en"
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && SUPPORTED.includes(stored)) return stored
  const browser = (navigator.language || navigator.languages?.[0] || "").toLowerCase()
  if (browser.startsWith("pt")) return "pt-BR"
  if (browser.startsWith("en")) return "en"
  if (browser.startsWith("ru")) return "ru"
  if (browser.startsWith("es")) return "es"
  if (browser.startsWith("de")) return "de"
  if (browser.startsWith("fr")) return "fr"
  if (browser.startsWith("ja")) return "ja"
  return "en"
}

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getDefaultLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale }),
    [locale, setLocale]
  )

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return ctx
}
