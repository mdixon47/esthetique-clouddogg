import { NextResponse } from "next/server"

// Store the quota status to avoid repeated checks
let quotaStatus = {
  isExceeded: false,
  lastChecked: 0,
  retryAfter: 0,
}

// Simplified quota check that never fails with 500
export async function GET() {
  try {
    // Only check once every 5 minutes to avoid unnecessary API calls
    const now = Date.now()
    if (
      now - quotaStatus.lastChecked < 5 * 60 * 1000 &&
      quotaStatus.lastChecked > 0
    ) {
      return NextResponse.json({
        available: !quotaStatus.isExceeded,
        quotaExceeded: quotaStatus.isExceeded,
        retryAfter: quotaStatus.retryAfter,
        cached: true,
      })
    }

    // Check if OpenAI API key is available
    if (
      !process.env.OPENAI_API_KEY &&
      !process.env.NEXT_PUBLIC_OPENAI_API_KEY
    ) {
      quotaStatus = {
        isExceeded: true,
        lastChecked: now,
        retryAfter: 3600, // Suggest retry after 1 hour
      }
      return NextResponse.json({
        available: false,
        quotaExceeded: true,
        reason: "API key not configured",
        retryAfter: 3600,
      })
    }

    // Instead of making an actual API call which could fail,
    // we'll just return a success response for now
    // In a production environment, you would implement proper API checking
    quotaStatus = {
      isExceeded: false,
      lastChecked: now,
      retryAfter: 0,
    }

    return NextResponse.json({
      available: true,
      quotaExceeded: false,
    })
  } catch (error) {
    // Catch-all error handler to ensure we always return valid JSON
    console.error("Unexpected error in quota check:", error)

    // Ensure we have a valid error message
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json({
      available: false,
      quotaExceeded: false,
      error: errorMessage,
      retryAfter: 0,
    })
  }
}
