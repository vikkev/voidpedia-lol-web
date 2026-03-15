import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"
import { useTheme } from "@/components/theme-provider"
import { AppRoutes } from "@/routes"

export function App() {
  const { resolvedTheme } = useTheme()

  return (
    <>
      <Toaster
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        className="toaster-voidepedia"
        toastOptions={{
          classNames: {
            toast: "toast-voidepedia",
            title: "toast-title-voidepedia",
            description: "toast-description-voidepedia",
            actionButton: "toast-action-voidepedia",
            cancelButton: "toast-cancel-voidepedia",
            closeButton: "toast-close-voidepedia",
          },
        }}
        position="top-right"
        closeButton
        richColors={false}
      />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  )
}

export default App
