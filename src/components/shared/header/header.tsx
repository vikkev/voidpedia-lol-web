import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { TextInput } from "@/components/ui/inputs/text-input"
import {
  SelectInput,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs/select-input"
import { usePlayerSearch } from "@/contexts/player-search"
import { useTranslation } from "@/contexts/i18n"
import { REGIONS } from "@/pages/home/utils/riot-id.utils"
import type { RiotRegion } from "@/pages/home/types"
import { ZapIcon } from "lucide-react"
import { ModeToggle } from "../mode-toggle"
import { LanguageSelector } from "../language-selector"

export function Header() {
  const { t } = useTranslation()
  const {
    gameName,
    setGameName,
    tagLine,
    setTagLine,
    region,
    setRegion,
    loading,
    search,
  } = usePlayerSearch()

  return (
    <header className="border-b border-border bg-secondary/95 backdrop-blur px-8 py-4">
        <div className="relative flex h-16 items-center">

        {/* Logo — fixado à esquerda */}
        <div className="absolute left-0">
          <Link
            to="/"
            className="logo-neon group flex items-center gap-2 text-primary transition-colors dark:text-white dark:hover:opacity-90 hover:opacity-90"
            aria-label={t("header.home")}
          >
            <ZapIcon className="size-7 shrink-0 text-primary opacity-90 transition-opacity group-hover:opacity-100 dark:text-white" strokeWidth={3.5} />
            <span className="logo-neon-text font-display text-[1.75rem] font-bold  leading-none tracking-wider">
              VOIDPEDIA
            </span>
          </Link>
        </div>

        {/* Busca — centralizada absolutamente */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <form
            onSubmit={search}
            className="flex h-11 items-center gap-2"
          >
            <div className="flex h-full items-center gap-1.5 rounded-lg border border-border bg-muted/50 pl-3 pr-2.5 py-1.5 transition-colors focus-within:border-primary/50 focus-within:bg-background">
              <TextInput
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder={t("header.search.placeholder.name")}
                disabled={loading}
                autoComplete="off"
                className="h-8 w-32 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              />
              <span className="text-muted-foreground/50">#</span>
              <TextInput
                type="text"
                value={tagLine}
                onChange={(e) => setTagLine(e.target.value)}
                placeholder={t("header.search.placeholder.tag")}
                disabled={loading}
                autoComplete="off"
                className="h-8 w-20 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>

            <SelectInput
              value={region}
              onValueChange={(v) => setRegion(v as RiotRegion)}
              disabled={loading}
            >
              <SelectTrigger className="h-11! w-28 shrink-0 text-sm">
                <SelectValue placeholder={t("header.search.placeholder.region")} />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {t(r.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectInput>

            <Button type="submit" disabled={loading} size="default" className="btn-display h-full shrink-0 text-sm">
              {loading ? t("header.search.button.loading") : t("header.search.button")}
            </Button>
          </form>
        </div>

        {/* Theme + language — right */}
        <div className="absolute right-4 flex items-center gap-2">
          <LanguageSelector />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}