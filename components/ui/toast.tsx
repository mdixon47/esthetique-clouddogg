"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
  onDismiss: (id: string) => void
}

export function Toast({ id, title, description, variant = "default", onDismiss }: ToastProps) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "default"
          ? "border-border bg-background text-foreground"
          : "destructive border-destructive bg-destructive text-destructive-foreground",
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold">{title}</div>
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
          variant === "destructive" && "text-destructive-foreground/50 hover:text-destructive-foreground",
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}
