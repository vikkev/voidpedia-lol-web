import { Outlet } from "react-router-dom"
import { LocaleProvider } from "@/contexts/locale"
import { PlayerSearchProvider } from "@/contexts/player-search"
import { Header } from "@/components/shared/header/header"

/**
 * App layout: global header with search and content (home / matches).
 * Translations are static (no API); locale is from LocaleProvider.
 */
export function AppLayout() {
  return (
    <LocaleProvider>
      <PlayerSearchProvider>
        <div className="theme-transition min-h-svh flex flex-col bg-background text-foreground">
          <Header />
          <main className="min-h-0 flex-1">
            <Outlet />
          </main>
        </div>
      </PlayerSearchProvider>
    </LocaleProvider>
  )
}
