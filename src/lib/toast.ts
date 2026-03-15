import { toast as sonnerToast } from "sonner"

/**
 * Helpers globais para notificações toast (Sonner).
 * Use em todo o app para erros e sucesso em vez de mensagens inline.
 */
export const toast = {
  error: (message: string, description?: string) => {
    sonnerToast.error(message, { description })
  },
  success: (message: string, description?: string) => {
    sonnerToast.success(message, { description })
  },
  /** Alias para toast padrão (info) */
  message: (message: string, description?: string) => {
    sonnerToast(message, { description })
  },
}
