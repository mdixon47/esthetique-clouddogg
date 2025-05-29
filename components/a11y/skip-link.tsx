"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export function SkipLink() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Link href="#main-content" className="skip-link">
      Skip to main content
    </Link>
  )
}
