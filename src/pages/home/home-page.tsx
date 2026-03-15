import { SavedPlayerSection } from "./components/saved-player-section"

export function HomePage() {
  return (
    <div className="flex min-h-full w-full p-6">
      <div className="flex min-w-0 flex-1 flex-col gap-6 text-sm leading-loose text-foreground">
        <SavedPlayerSection />
      </div>
    </div>
  )
}
