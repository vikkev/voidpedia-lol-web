import { Route } from "react-router-dom"
import { MatchesPage } from "./matches-page"

/** Match detail page route: /matches/:id */
export function MatchesRoute() {
  return <Route path="/matches/:id" element={<MatchesPage />} />
}
