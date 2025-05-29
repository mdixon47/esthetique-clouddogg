import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { xai } from "@ai-sdk/xai"

// Cache provider status to avoid too many API calls
const providerStatus = {
  openai: {
    available: null as boolean | null,
    lastChecked: 0,
    retryAfter: 0,
  },
  grok: {
    available: null as boolean | null,
    lastChecked: 0,
    retryAfter: 0,
  },
}

// How long to cache the status (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

export async function GET(req: Request) {
  try {
    // Get the provider from the query string
    const url = new URL(req.url)
    const provider = url.searchParams.get("provider")

    if (!provider || (provider !== "openai" && provider !== "grok")) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
    }

    // Check if we have a cached status that's still valid
    const now = Date.now()
    if (
      providerStatus[provider].available !== null &&
      now - providerStatus[provider].lastChecked < CACHE_DURATION
    ) {
      return NextResponse.json({
        available: providerStatus[provider].available,
        cached: true,
        message: providerStatus[provider].available
          ? `${provider} API is available`
          : `${provider} API is unavailable. Try again later.`,
      })
    }

    // Check the provider availability
    try {
      if (provider === "openai") {
        return await checkOpenAI()
      } else {
        return await checkGrok()
      }
    } catch (checkError) {
      console.error(`Error checking ${provider} in route handler:`, checkError)

      // Update provider status to unavailable
      providerStatus[provider] = {
        available: false,
        lastChecked: Date.now(),
        retryAfter: 300, // 5 minutes
      }

      return NextResponse.json({
        available: false,
        error: `Failed to check ${provider} availability`,
        message: `An error occurred while checking ${provider} availability`,
      })
    }
  } catch (error) {
    console.error("Error in check-provider API:", error)
    return NextResponse.json(
      {
        available: false,
        error: "Failed to check provider availability",
        message: "An error occurred while checking provider availability",
      },
      { status: 500 }
    )
  }
}

async function checkOpenAI() {
  try {
    // Check if OpenAI API key is available
    const apiKey =
      process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY

    if (!apiKey) {
      providerStatus.openai = {
        available: false,
        lastChecked: Date.now(),
        retryAfter: 3600, // 1 hour
      }

      return NextResponse.json({
        available: false,
        message: "OpenAI API key is not configured",
      })
    }

    // Make a minimal API call to check availability
    await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: "test",
      maxTokens: 5,
    })

    // If we get here, the API is available
    providerStatus.openai = {
      available: true,
      lastChecked: Date.now(),
      retryAfter: 0,
    }

    return NextResponse.json({
      available: true,
      message: "OpenAI API is available",
    })
  } catch (error) {
    console.error("Error checking OpenAI availability:", error)

    // Check if the error is related to quota
    const isQuotaError =
      error.message &&
      (error.message.includes("quota") ||
        error.message.includes("exceeded") ||
        error.message.includes("rate limit") ||
        error.message.includes("billing") ||
        error.status === 429)

    providerStatus.openai = {
      available: false,
      lastChecked: Date.now(),
      retryAfter: isQuotaError ? 3600 : 300, // 1 hour for quota issues, 5 minutes for other errors
    }

    return NextResponse.json({
      available: false,
      error: error.message || "Unknown error",
      message: isQuotaError
        ? "OpenAI API quota exceeded. Try again later."
        : "OpenAI API is currently unavailable",
    })
  }
}

async function checkGrok() {
  try {
    // Check if Grok API key is available
    if (!process.env.XAI_API_KEY) {
      providerStatus.grok = {
        available: false,
        lastChecked: Date.now(),
        retryAfter: 3600, // 1 hour
      }

      return NextResponse.json({
        available: false,
        message: "Grok API key is not configured",
      })
    }

    try {
      // Make a minimal API call to check availability
      await generateText({
        model: xai("grok-2"),
        prompt: "test",
        maxTokens: 5,
      })

      // If we get here, the API is available
      providerStatus.grok = {
        available: true,
        lastChecked: Date.now(),
        retryAfter: 0,
      }

      return NextResponse.json({
        available: true,
        message: "Grok API is available",
      })
    } catch (apiError) {
      console.error("Grok API call error:", apiError)

      providerStatus.grok = {
        available: false,
        lastChecked: Date.now(),
        retryAfter: 300, // 5 minutes
      }

      return NextResponse.json({
        available: false,
        error: apiError.message || "Unknown Grok API error",
        message: "Grok API is currently unavailable",
      })
    }
  } catch (error) {
    console.error("Error in Grok availability check function:", error)

    providerStatus.grok = {
      available: false,
      lastChecked: Date.now(),
      retryAfter: 300, // 5 minutes for other errors
    }

    return NextResponse.json({
      available: false,
      error: error.message || "Unknown error",
      message: "Grok API is currently unavailable due to an error",
    })
  }
}
