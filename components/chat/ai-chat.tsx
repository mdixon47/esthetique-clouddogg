"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Send, Loader2, Info, Calendar, Brain, Zap, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { detectClothing, formatClothingWithAttributes } from "@/utils/clothing-detection"
import {
  getCurrentSeason,
  getSeasonalRecommendations,
  getSeasonalAdviceForClothing,
  type SeasonalInfo,
} from "@/utils/seasonal-fashion"
import { useToast } from "@/components/providers/toast-provider"

type Message = {
  role: "user" | "assistant"
  content: string
  provider?: AIProvider
}

type AIProvider = "demo" | "openai" | "grok"

// General fallback responses when no clothing is detected
const GENERAL_FALLBACK_RESPONSES = [
  "I'd be happy to help with your fashion needs. What specific items are you interested in?",
  "I can provide styling advice for various clothing items. What would you like to know about?",
  "Looking for outfit inspiration? I can suggest combinations based on your preferences.",
  "I'm here to help with your fashion questions. Feel free to ask about specific clothing items!",
  "Would you like recommendations for a particular occasion or season?",
  "I can help you find the perfect outfit. What are you shopping for today?",
  "Fashion is all about expressing yourself! What's your style preference?",
  "I can suggest items that would complement your existing wardrobe. What are you looking for?",
  "Need help with color coordination or pattern matching? I'm here to assist!",
  "I can recommend trending styles this season. Any particular category you're interested in?",
]

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<AIProvider>("demo")
  const [error, setError] = useState<string | null>(null)
  const [seasonalInfo, setSeasonalInfo] = useState<SeasonalInfo | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [providerStatus, setProviderStatus] = useState({
    openai: { available: true, checked: false },
    grok: { available: true, checked: false },
  })
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize chat with a seasonal greeting
  useEffect(() => {
    const currentSeasonInfo = getCurrentSeason()
    setSeasonalInfo(currentSeasonInfo)

    const seasonalRecommendations = getSeasonalRecommendations(currentSeasonInfo)

    // Create a seasonal greeting
    const greeting = `Hi there! I'm your StyleAI assistant. It's currently ${currentSeasonInfo.currentSeason} with ${currentSeasonInfo.weatherDescription}. How can I help with your fashion needs today? Some trending items this season include ${seasonalRecommendations.trendingItems.slice(0, 3).join(", ")}.`

    setMessages([
      {
        role: "assistant",
        content: greeting,
        provider: "demo",
      },
    ])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check provider availability when selected
  useEffect(() => {
    if (provider === "openai" && !providerStatus.openai.checked) {
      checkProviderAvailability("openai")
    } else if (provider === "grok" && !providerStatus.grok.checked) {
      checkProviderAvailability("grok")
    }
  }, [provider, providerStatus])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Check if a provider is available
  const checkProviderAvailability = async (providerToCheck: "openai" | "grok") => {
    try {
      // Set a timeout for the fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`/api/check-provider?provider=${providerToCheck}`, {
        signal: controller.signal,
      }).catch((err) => {
        console.error(`Fetch error checking ${providerToCheck}:`, err)
        // Return a fake response object for consistent error handling
        return {
          ok: false,
          status: err.name === "AbortError" ? 408 : 500,
          json: async () => ({
            available: false,
            message:
              err.name === "AbortError"
                ? `${providerToCheck} availability check timed out`
                : `Error checking ${providerToCheck} availability`,
          }),
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.warn(`Provider check failed: ${response.status}`)

        // Mark provider as unavailable
        setProviderStatus((prev) => ({
          ...prev,
          [providerToCheck]: {
            available: false,
            checked: true,
          },
        }))

        if (provider === providerToCheck) {
          toast({
            title: `${providerToCheck === "openai" ? "OpenAI" : "Grok"} unavailable`,
            description: `Could not verify ${providerToCheck === "openai" ? "OpenAI" : "Grok"} availability. Using demo mode instead.`,
          })
          setProvider("demo")
        }

        return
      }

      const data = await response.json()

      setProviderStatus((prev) => ({
        ...prev,
        [providerToCheck]: {
          available: data.available,
          checked: true,
        },
      }))

      if (!data.available) {
        toast({
          title: `${providerToCheck === "openai" ? "OpenAI" : "Grok"} unavailable`,
          description:
            data.message ||
            `${providerToCheck === "openai" ? "OpenAI" : "Grok"} API is currently unavailable. Using demo mode instead.`,
        })

        if (provider === providerToCheck) {
          setProvider("demo")
        }
      }
    } catch (error) {
      console.error(`Error checking ${providerToCheck} availability:`, error)

      // Mark provider as unavailable due to error
      setProviderStatus((prev) => ({
        ...prev,
        [providerToCheck]: {
          available: false,
          checked: true,
        },
      }))

      if (provider === providerToCheck) {
        toast({
          title: `${providerToCheck === "openai" ? "OpenAI" : "Grok"} unavailable`,
          description: `Could not verify ${providerToCheck === "openai" ? "OpenAI" : "Grok"} availability. Using demo mode instead.`,
        })
        setProvider("demo")
      }
    }
  }

  // Get a contextual response based on the user's message
  const getSmartResponse = (userMessage: string, conversationHistory: Message[]) => {
    if (!seasonalInfo) {
      // Fallback if seasonal info isn't loaded yet
      const currentSeasonInfo = getCurrentSeason()
      setSeasonalInfo(currentSeasonInfo)
    }

    // Detect clothing items in the user's message
    const detectedItems = detectClothing(userMessage)

    // If clothing items were detected, generate a specific response with seasonal context
    if (detectedItems.length > 0 && seasonalInfo) {
      const item = detectedItems[0] // Use the highest confidence item
      const formattedItem = formatClothingWithAttributes(item)

      // Get seasonal advice for this clothing item
      const seasonalAdvice = getSeasonalAdviceForClothing(formattedItem, item.category, seasonalInfo)

      return seasonalAdvice
    }

    // Check for season-specific questions
    const lowerMessage = userMessage.toLowerCase()

    if (seasonalInfo) {
      // Handle season-specific questions
      if (
        lowerMessage.includes("what's in season") ||
        lowerMessage.includes("whats in season") ||
        lowerMessage.includes("seasonal trends") ||
        lowerMessage.includes("trending this season")
      ) {
        const recommendations = getSeasonalRecommendations(seasonalInfo)
        return `For ${seasonalInfo.currentSeason}, trending items include ${recommendations.trendingItems.slice(0, 5).join(", ")}. Popular colors are ${recommendations.colorsToWear.slice(0, 4).join(", ")}. Would you like specific recommendations for any of these items?`
      }

      if (lowerMessage.includes("what should i wear") || lowerMessage.includes("outfit suggestion")) {
        const recommendations = getSeasonalRecommendations(seasonalInfo)

        // Check for occasion mentions
        let occasion = "casual"
        if (lowerMessage.includes("work") || lowerMessage.includes("office")) {
          occasion = "work"
        } else if (lowerMessage.includes("date") || lowerMessage.includes("night out")) {
          occasion = "date night"
        } else if (lowerMessage.includes("outdoor") || lowerMessage.includes("outside")) {
          occasion = "outdoor"
        } else if (lowerMessage.includes("beach")) {
          occasion = "beach"
        }

        return `For ${seasonalInfo.currentSeason} with ${seasonalInfo.weatherDescription}, I'd recommend ${recommendations.occasionOutfits[occasion]}. This outfit is perfect for the current weather and is on-trend this season.`
      }

      if (lowerMessage.includes("layering") || lowerMessage.includes("how to layer")) {
        const recommendations = getSeasonalRecommendations(seasonalInfo)
        const layeringTip =
          recommendations.layeringTips[Math.floor(Math.random() * recommendations.layeringTips.length)]
        return `For ${seasonalInfo.currentSeason} layering, here's a tip: ${layeringTip}. This works well with the current ${seasonalInfo.weatherDescription}.`
      }

      if (
        lowerMessage.includes("transition") ||
        lowerMessage.includes("between seasons") ||
        lowerMessage.includes("changing seasons")
      ) {
        const recommendations = getSeasonalRecommendations(seasonalInfo)
        return `As we transition from ${seasonalInfo.currentSeason} to ${seasonalInfo.nextSeason}, here are some tips: ${recommendations.transitionTips.join(" ")} Would you like specific outfit ideas for this transition period?`
      }
    }

    // Check for common fashion questions
    if (lowerMessage.includes("what should i wear")) {
      if (seasonalInfo) {
        const recommendations = getSeasonalRecommendations(seasonalInfo)
        return `For ${seasonalInfo.currentSeason} with ${seasonalInfo.weatherDescription}, I'd recommend focusing on ${recommendations.essentialItems.slice(0, 3).join(", ")}. Could you tell me more about the specific occasion you're dressing for?`
      } else {
        return "I'd need to know more about the occasion, weather, and your style preferences to make a good recommendation. Could you provide more details?"
      }
    }

    if (lowerMessage.includes("how does it look")) {
      return "Based on what I can see, it looks great on you! The fit seems good, and the style complements your look."
    }

    if (lowerMessage.includes("what's trending") || lowerMessage.includes("whats trending")) {
      if (seasonalInfo) {
        const recommendations = getSeasonalRecommendations(seasonalInfo)
        return `This ${seasonalInfo.currentSeason}, trending items include ${recommendations.trendingItems.slice(0, 5).join(", ")}. Would you like specific styling tips for any of these?`
      } else {
        return "Currently, oversized blazers, wide-leg pants, and statement accessories are trending. Would you like specific recommendations?"
      }
    }

    // Check for color advice
    if (lowerMessage.includes("what color")) {
      if (seasonalInfo) {
        const recommendations = getSeasonalRecommendations(seasonalInfo)
        return `For ${seasonalInfo.currentSeason}, popular colors include ${recommendations.colorsToWear.join(", ")}. These colors work well with the current season's aesthetic and can be mixed with neutrals for versatile outfits.`
      } else {
        return "Color choice depends on your skin tone, the occasion, and your personal style. Neutrals like black, white, and navy are versatile, while bold colors can make a statement. What's your preference?"
      }
    }

    // Check for sizing questions
    if (lowerMessage.includes("size") || lowerMessage.includes("fit")) {
      return "For the best fit, I'd recommend checking the size guide for the specific brand. Would you like tips on measuring yourself accurately?"
    }

    // Check for try-on related questions
    if (lowerMessage.includes("try on") || lowerMessage.includes("virtual try")) {
      return "Our virtual try-on feature lets you see how clothes look on you before buying. Simply upload your photo and select the items you want to try!"
    }

    // If no specific context is detected, use a general response
    return GENERAL_FALLBACK_RESPONSES[Math.floor(Math.random() * GENERAL_FALLBACK_RESPONSES.length)]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message to chat
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      if (provider === "demo") {
        // Use enhanced smart responses in demo mode
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
        const smartResponse = getSmartResponse(userMessage.content, messages)
        setMessages((prev) => [...prev, { role: "assistant", content: smartResponse, provider: "demo" }])
      } else {
        // Call API to get AI response
        try {
          // Set a timeout for the fetch request
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [...messages, userMessage],
              seasonalInfo: seasonalInfo, // Pass seasonal info to the API
              provider: provider, // Pass the selected provider
            }),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            throw new Error(`Failed to get response: ${response.status}`)
          }

          const data = await response.json()

          // Add AI response to chat
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.message,
              provider: provider,
            },
          ])
        } catch (apiError) {
          console.error("API Error:", apiError)

          // Fallback to demo mode
          const fallbackResponse = getSmartResponse(userMessage.content, messages)
          const errorMessage =
            apiError.name === "AbortError"
              ? `Request timed out. Switched to demo mode.`
              : `Failed to get response from ${provider === "openai" ? "OpenAI" : "Grok"}. Switched to demo mode.`

          setError(errorMessage)

          // Add a fallback response even when there's an error
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `I'm having trouble connecting to ${provider === "openai" ? "OpenAI" : "Grok"} right now. I'll switch to demo mode to help you. ${fallbackResponse}`,
              provider: "demo",
            },
          ])

          // Update provider status
          if (provider === "openai" || provider === "grok") {
            setProviderStatus((prev) => ({
              ...prev,
              [provider]: {
                available: false,
                checked: true,
              },
            }))
          }

          // Switch to demo mode
          setProvider("demo")
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Failed to get response. Switched to demo mode.")

      // Add a fallback response even when there's an error
      const fallbackResponse = getSmartResponse(userMessage.content, messages)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'm sorry, I encountered an issue. I'll switch to demo mode to continue helping you. ${fallbackResponse}`,
          provider: "demo",
        },
      ])

      // Switch to demo mode
      setProvider("demo")
    } finally {
      setIsLoading(false)
      // Focus back on input after response
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleProviderChange = (newProvider: string) => {
    // If switching to a provider that's not available, show a toast and stay on demo
    if (
      (newProvider === "openai" && providerStatus.openai.checked && !providerStatus.openai.available) ||
      (newProvider === "grok" && providerStatus.grok.checked && !providerStatus.grok.available)
    ) {
      toast({
        title: `${newProvider === "openai" ? "OpenAI" : "Grok"} unavailable`,
        description: `${newProvider === "openai" ? "OpenAI" : "Grok"} API is currently unavailable. Using demo mode instead.`,
      })

      setProvider("demo")
      return
    }

    setProvider(newProvider as AIProvider)

    // If switching to a provider that hasn't been checked, check it
    if (newProvider === "openai" && !providerStatus.openai.checked) {
      checkProviderAvailability("openai")
    } else if (newProvider === "grok" && !providerStatus.grok.checked) {
      checkProviderAvailability("grok")
    }
  }

  const getProviderIcon = (messageProvider?: AIProvider) => {
    const providerToUse = messageProvider || provider

    switch (providerToUse) {
      case "openai":
        return <Brain className="h-4 w-4 mr-2 text-green-500" aria-hidden="true" />
      case "grok":
        return <Zap className="h-4 w-4 mr-2 text-blue-500" aria-hidden="true" />
      default:
        return <Sparkles className="h-4 w-4 mr-2 text-pink-500" aria-hidden="true" />
    }
  }

  const getProviderName = (messageProvider?: AIProvider) => {
    const providerToUse = messageProvider || provider

    switch (providerToUse) {
      case "openai":
        return "OpenAI"
      case "grok":
        return "Grok"
      default:
        return "Style Assistant"
    }
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center">
            {getProviderIcon()}
            {getProviderName()}
            {seasonalInfo && (
              <span className="ml-2 text-xs flex items-center text-gray-500">
                <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                {seasonalInfo.currentSeason.charAt(0).toUpperCase() + seasonalInfo.currentSeason.slice(1)}
              </span>
            )}
          </CardTitle>
          <Tabs value={provider} onValueChange={handleProviderChange} className="h-8">
            <TabsList className="h-8">
              <TabsTrigger value="demo" className="text-xs h-8 px-2">
                Demo
              </TabsTrigger>
              <TabsTrigger value="openai" className="text-xs h-8 px-2 relative">
                OpenAI
                {providerStatus.openai.checked && !providerStatus.openai.available && (
                  <span
                    className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"
                    aria-label="OpenAI unavailable"
                  ></span>
                )}
              </TabsTrigger>
              <TabsTrigger value="grok" className="text-xs h-8 px-2 relative">
                Grok
                {providerStatus.grok.checked && !providerStatus.grok.available && (
                  <span
                    className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"
                    aria-label="Grok unavailable"
                  ></span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      {error && (
        <Alert variant="destructive" className="mx-4 mt-2">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {provider === "openai" && providerStatus.openai.checked && !providerStatus.openai.available && (
        <Alert className="mx-4 mt-2 bg-yellow-50 border-yellow-200">
          <Info className="h-4 w-4 text-yellow-500" aria-hidden="true" />
          <AlertTitle className="text-yellow-700">OpenAI Unavailable</AlertTitle>
          <AlertDescription className="text-yellow-700">
            OpenAI API is currently unavailable. Using demo mode instead.
          </AlertDescription>
        </Alert>
      )}

      {provider === "grok" && providerStatus.grok.checked && !providerStatus.grok.available && (
        <Alert className="mx-4 mt-2 bg-yellow-50 border-yellow-200">
          <Info className="h-4 w-4 text-yellow-500" aria-hidden="true" />
          <AlertTitle className="text-yellow-700">Grok Unavailable</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Grok API is currently unavailable. Using demo mode instead.
          </AlertDescription>
        </Alert>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 mb-4" role="log" aria-label="Chat conversation">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              aria-label={message.role === "user" ? "Your message" : "Assistant's response"}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" alt="AI Assistant" />
                      <AvatarFallback
                        className={`${
                          message.provider === "openai"
                            ? "bg-green-100 text-green-500"
                            : message.provider === "grok"
                              ? "bg-blue-100 text-blue-500"
                              : "bg-pink-100 text-pink-500"
                        }`}
                      >
                        {message.provider === "openai" ? "AI" : message.provider === "grok" ? "GK" : "AI"}
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=You" alt="You" />
                      <AvatarFallback className="bg-gray-100">You</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.provider === "openai"
                        ? "bg-green-50 text-green-900"
                        : message.provider === "grok"
                          ? "bg-blue-50 text-blue-900"
                          : "bg-muted"
                  }`}
                >
                  {message.content}
                  {message.role === "assistant" && message.provider && message.provider !== "demo" && (
                    <div className="mt-1 text-xs opacity-70 flex items-center">
                      {message.provider === "openai" ? (
                        <Brain className="h-3 w-3 mr-1 inline" aria-hidden="true" />
                      ) : (
                        <Zap className="h-3 w-3 mr-1 inline" aria-hidden="true" />
                      )}
                      Powered by {message.provider === "openai" ? "OpenAI" : "Grok"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" alt="AI Assistant" />
                  <AvatarFallback
                    className={`${
                      provider === "openai"
                        ? "bg-green-100 text-green-500"
                        : provider === "grok"
                          ? "bg-blue-100 text-blue-500"
                          : "bg-pink-100 text-pink-500"
                    }`}
                  >
                    {provider === "openai" ? "AI" : provider === "grok" ? "GK" : "AI"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    provider === "openai"
                      ? "bg-green-50 text-green-900"
                      : provider === "grok"
                        ? "bg-blue-50 text-blue-900"
                        : "bg-muted"
                  } flex items-center`}
                  aria-live="polite"
                >
                  <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask about styling, outfits, or try-on help..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
            ref={inputRef}
            aria-label="Type your message"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
