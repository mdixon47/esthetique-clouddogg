import type React from "react"
import { cn } from "@/lib/utils"

interface ScreenReaderTextProps {
  children: React.ReactNode
  className?: string
}

export function ScreenReaderText({ children, className }: ScreenReaderTextProps) {
  return (
    <span className={cn("absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0", className)}>
      {children}
    </span>
  )
}