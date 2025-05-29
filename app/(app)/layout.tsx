import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { AiSuggestButton } from "@/components/ai-suggest-button"
import { ToastProvider } from "@/components/providers/toast-provider"
import { CartProvider } from "@/components/providers/cart-provider"

export default function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ToastProvider>
      <CartProvider>
        <div className="flex min-h-screen">
          <header>
            <Sidebar />
          </header>
          <main id="main-content" className="flex-1 overflow-auto pt-16 md:pt-0 pb-20">
            {children}
            <AiSuggestButton />
          </main>
        </div>
      </CartProvider>
    </ToastProvider>
  )
}
