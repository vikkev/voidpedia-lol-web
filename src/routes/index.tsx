import { Routes, Route } from "react-router-dom"
import { AppLayout } from "@/components/app-layout"
import { HomePage } from "@/pages/home/home-page"
import { MatchesPage } from "@/pages/matches/matches-page"

/**
 * App routes. Home and Matches share the same layout.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="matches/:id" element={<MatchesPage />} />
      </Route>
    </Routes>
  )
}
