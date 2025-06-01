"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, RefreshCw, CloudSun, Shirt, Palette, Info, Zap, Brain, Share2, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SharePreferencesModal } from "@/components/outfits/share-preferences-modal"
import { useToast } from "@/components/providers/toast-provider"

interface OutfitPreferencesProps {
  onGenerateOutfits?: (preferences: {
    occasion: string
    season: string
    style: string
    colorfulness: number[]
    useWeather: boolean
    includeAccessories: boolean
    useAI: boolean
    useGrok: boolean
    useOpenAI: boolean
    preferredModel?: string
  }) => void
  isGenerating?: boolean
  initialUseAI?: boolean
  initialUseGrok?: boolean
  initialUseOpenAI?: boolean
  onUseAIChange?: (useAI: boolean) => void
  onUseGrokChange?: (useGrok: boolean) => void
  onUseOpenAIChange?: (useOpenAI: boolean) => void
  initialPreferences?: any
  modelStatus?: Record<string, { available: boolean; resetIn: number; failureCount: number }>
}

export function OutfitPreferences({
  onGenerateOutfits,
  isGenerating = false,
  initialUseAI = true,
  initialUseGrok = false,
  initialUseOpenAI = false,
  onUseAIChange,
  onUseGrokChange,
  onUseOpenAIChange,
  initialPreferences,
  modelStatus,
}: OutfitPreferencesProps) {
  const [occasion, setOccasion] = useState(initialPreferences?.occasion || "casual")
  const [season, setSeason] = useState(initialPreferences?.season || "current")
  const [style, setStyle] = useState(initialPreferences?.style || "balanced")
  const [colorfulness, setColorfulness] = useState(initialPreferences?.colorfulness || [50])
  const [useWeather, setUseWeather] = useState(initialPreferences?.useWeather ?? true)
  const [includeAccessories, setIncludeAccessories] = useState(initialPreferences?.includeAccessories ?? true)
  const [useAI, setUseAI] = useState(initialPreferences?.useAI ?? initialUseAI)
  const [useGrok, setUseGrok] = useState(initialPreferences?.useGrok ?? initialUseGrok)
  const [useOpenAI, setUseOpenAI] = useState(initialPreferences?.useOpenAI ?? initialUseOpenAI)
  const [preferredModel, setPreferredModel] = useState(initialPreferences?.preferredModel || "gpt-4o")
  const [generationMode, setGenerationMode] = useState(
    initialPreferences?.generationMode ||
      (initialUseOpenAI ? "openai" : initialUseGrok ? "grok" : initialUseAI ? "ai" : "basic"),
  )
  const [showShareModal, setShowShareModal] = useState(false)
  const [openAIAvailable, setOpenAIAvailable] = useState(true)
  const [isCheckingQuota, setIsCheckingQuota] = useState(false)
  const [quotaRetryTime, setQuotaRetryTime] = useState<string | null>(null)
  const { toast } = useToast()

  // Check OpenAI quota status when component mounts or when switching to OpenAI mode
  useEffect(() => {
    if (generationMode === "openai") {
      checkOpenAIQuota()
    }
  }, [generationMode])

  const checkOpenAIQuota = async () => {
    try {
      setIsCheckingQuota(true)
      const response = await fetch("/api/quota-check")
      const data = await response.json()

      setOpenAIAvailable(!data.quotaExceeded)

      if (data.quotaExceeded) {
        // Format retry time
        const retryMinutes = Math.ceil(data.retryAfter / 60)
        setQuotaRetryTime(retryMinutes > 60 ? `${Math.floor(retryMinutes / 60)} hour(s)` : `${retryMinutes} minutes`)

        // If OpenAI is not available and user selected it, show a toast
        if (generationMode === "openai") {
          toast({
            title: "OpenAI quota exceeded",
            description: "Switched to standard AI due to quota limitations",
          })
        }
      } else {
        setQuotaRetryTime(null)
      }
    } catch (error) {
      console.error("Error checking quota:", error)
      setOpenAIAvailable(false)
    } finally {
      setIsCheckingQuota(false)
    }
  }

  const handleGenerateOutfits = () => {
    if (onGenerateOutfits) {
      // If OpenAI is selected but not available, switch to standard AI
      const effectiveGenerationMode = generationMode === "openai" && !openAIAvailable ? "ai" : generationMode

      // Set useAI, useGrok, and useOpenAI based on effective generation mode
      const useAI =
        effectiveGenerationMode === "ai" || effectiveGenerationMode === "grok" || effectiveGenerationMode === "openai"
      const useGrok = effectiveGenerationMode === "grok"
      const useOpenAI = effectiveGenerationMode === "openai" && openAIAvailable

      onGenerateOutfits({
        occasion,
        season,
        style,
        colorfulness,
        useWeather,
        includeAccessories,
        useAI,
        useGrok,
        useOpenAI,
        preferredModel: useOpenAI ? preferredModel : undefined,
      })
    }
  }

  const handleReset = () => {
    setOccasion("casual")
    setSeason("current")
    setStyle("balanced")
    setColorfulness([50])
    setUseWeather(true)
    setIncludeAccessories(true)
    setGenerationMode("ai")
    setPreferredModel("gpt-4o")

    // Update parent component state
    if (onUseAIChange) onUseAIChange(true)
    if (onUseGrokChange) onUseGrokChange(false)
    if (onUseOpenAIChange) onUseOpenAIChange(false)
  }

  // Update the generation mode when changed
  const handleGenerationModeChange = (mode: string) => {
    setGenerationMode(mode)

    // If switching to OpenAI, check quota
    if (mode === "openai") {
      checkOpenAIQuota()
    }

    // Update the parent component's state
    if (onUseAIChange) {
      onUseAIChange(mode === "ai" || mode === "grok" || mode === "openai")
    }

    if (onUseGrokChange) {
      onUseGrokChange(mode === "grok")
    }

    if (onUseOpenAIChange) {
      onUseOpenAIChange(mode === "openai")
    }
  }

  // Get current preferences for sharing
  const getCurrentPreferences = () => {
    return {
      occasion,
      season,
      style,
      colorfulness,
      useWeather,
      includeAccessories,
      useAI: generationMode === "ai" || generationMode === "grok" || generationMode === "openai",
      useGrok: generationMode === "grok",
      useOpenAI: generationMode === "openai",
      preferredModel,
      generationMode,
    }
  }

  // Map occasion to emoji
  const occasionEmoji = {
    casual: "👕",
    business: "💼",
    formal: "👔",
    party: "🎉",
    date: "❤️",
    sports: "🏃‍♂️",
  }

  // Map season to emoji
  const seasonEmoji = {
    current: "📅",
    spring: "🌸",
    summer: "☀️",
    autumn: "🍂",
    winter: "❄️",
  }

  // Format model status for display
  const getModelStatusText = (model: string) => {
    if (!modelStatus || !modelStatus[model]) {
      return "Unknown"
    }

    const status = modelStatus[model]
    if (!status.available) {
      return `Unavailable (retry in ${Math.ceil(status.resetIn / 60)} min)`
    }

    if (status.failureCount > 0) {
      return `Available (${status.failureCount} recent failures)`
    }

    return "Available"
  }

  return (
    <>
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-lg">
              <Palette className="mr-2 h-5 w-5 text-pink-500" />
              Outfit Preferences
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-pink-500"
              onClick={() => setShowShareModal(true)}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
          <CardDescription>Customize your outfit suggestions</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pb-4">
          <Tabs value={generationMode} onValueChange={handleGenerationModeChange}>
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="grok">Grok</TabsTrigger>
              <TabsTrigger value="openai">OpenAI</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Alert className="bg-gray-50 border-gray-200">
                <Info className="h-4 w-4 text-gray-500" />
                <AlertDescription className="text-gray-700 text-xs">
                  Uses a simple algorithm to match items based on basic rules.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="ai">
              <Alert className="bg-purple-50 border-purple-200">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <AlertDescription className="text-purple-700 text-xs">
                  Uses AI to create more creative outfit combinations with detailed styling advice.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="grok">
              <Alert className="bg-blue-50 border-blue-200">
                <Zap className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700 text-xs">
                  Uses Grok for enhanced creativity and fashion-forward outfit suggestions.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="openai">
              <Alert className="bg-green-50 border-green-200">
                <Brain className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700 text-xs">
                  Uses OpenAI models for highly detailed and personalized outfit recommendations.
                </AlertDescription>
              </Alert>

              {/* Model selection for OpenAI */}
              <div className="mt-4 space-y-2">
                <Label htmlFor="openai-model">Preferred Model</Label>
                <Select value={preferredModel} onValueChange={setPreferredModel}>
                  <SelectTrigger id="openai-model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">
                      GPT-4o{" "}
                      {modelStatus && modelStatus["gpt-4o"] && (
                        <span className="text-xs ml-2 opacity-70">({getModelStatusText("gpt-4o")})</span>
                      )}
                    </SelectItem>
                    <SelectItem value="gpt-4">
                      GPT-4{" "}
                      {modelStatus && modelStatus["gpt-4"] && (
                        <span className="text-xs ml-2 opacity-70">({getModelStatusText("gpt-4")})</span>
                      )}
                    </SelectItem>
                    <SelectItem value="gpt-3.5-turbo">
                      GPT-3.5 Turbo{" "}
                      {modelStatus && modelStatus["gpt-3.5-turbo"] && (
                        <span className="text-xs ml-2 opacity-70">({getModelStatusText("gpt-3.5-turbo")})</span>
                      )}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  If your preferred model is unavailable, the system will automatically try other models.
                </p>
              </div>

              {/* OpenAI quota status */}
              {generationMode === "openai" && (
                <Alert
                  className={`mt-2 ${openAIAvailable ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
                >
                  {openAIAvailable ? (
                    <>
                      <Info className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-700 text-xs">
                        OpenAI API is available and ready to use.
                      </AlertDescription>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <AlertDescription className="text-yellow-700 text-xs">
                        OpenAI quota currently exceeded.{" "}
                        {quotaRetryTime && `Try again in approximately ${quotaRetryTime}.`}
                        Selecting this option will automatically fall back to standard AI.
                        <Button
                          variant="link"
                          size="sm"
                          className="text-xs p-0 h-auto text-yellow-700 underline"
                          onClick={checkOpenAIQuota}
                          disabled={isCheckingQuota}
                        >
                          {isCheckingQuota ? "Checking..." : "Check again"}
                        </Button>
                      </AlertDescription>
                    </>
                  )}
                </Alert>
              )}
            </TabsContent>
          </Tabs>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Occasion</Label>
              <Badge variant="outline" className="font-normal">
                {occasionEmoji[occasion]} {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
              </Badge>
            </div>
            <Select value={occasion} onValueChange={setOccasion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select occasion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">👕 Casual</SelectItem>
                <SelectItem value="business">💼 Business</SelectItem>
                <SelectItem value="formal">👔 Formal</SelectItem>
                <SelectItem value="party">🎉 Party</SelectItem>
                <SelectItem value="date">❤️ Date</SelectItem>
                <SelectItem value="sports">🏃‍♂️ Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Season</Label>
              <Badge variant="outline" className="font-normal">
                {seasonEmoji[season]} {season.charAt(0).toUpperCase() + season.slice(1)}
              </Badge>
            </div>
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">📅 Current</SelectItem>
                <SelectItem value="spring">🌸 Spring</SelectItem>
                <SelectItem value="summer">☀️ Summer</SelectItem>
                <SelectItem value="autumn">🍂 Autumn</SelectItem>
                <SelectItem value="winter">❄️ Winter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Style</Label>
              <Badge variant="outline" className="font-normal">
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </Badge>
            </div>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safe">Safe & Classic</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="adventurous">Adventurous & Trendy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Colorfulness</Label>
              <Badge variant="outline" className="font-normal">
                {colorfulness[0]}%
              </Badge>
            </div>
            <Slider
              value={colorfulness}
              max={100}
              step={1}
              onValueChange={(value) => setColorfulness(value)}
              className="py-1"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Neutral</span>
              <span>Colorful</span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CloudSun className="h-4 w-4 text-pink-500" />
                <Label htmlFor="weather" className="text-sm font-medium cursor-pointer">
                  Weather-based
                </Label>
              </div>
              <Switch id="weather" checked={useWeather} onCheckedChange={(checked) => setUseWeather(checked)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shirt className="h-4 w-4 text-pink-500" />
                <Label htmlFor="accessories" className="text-sm font-medium cursor-pointer">
                  Include accessories
                </Label>
              </div>
              <Switch
                id="accessories"
                checked={includeAccessories}
                onCheckedChange={(checked) => setIncludeAccessories(checked)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-0">
          <Button
            className={`w-full ${
              generationMode === "openai" && openAIAvailable
                ? "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
                : generationMode === "openai" && !openAIAvailable
                  ? "bg-gradient-to-r from-purple-400 to-purple-400 hover:from-purple-500 hover:to-purple-500"
                  : generationMode === "grok"
                    ? "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
                    : "bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
            }`}
            onClick={handleGenerateOutfits}
            disabled={isGenerating}
          >
            {isGenerating ? (
              "Generating..."
            ) : (
              <>
                {generationMode === "openai" && openAIAvailable ? (
                  <Brain className="mr-2 h-4 w-4" />
                ) : generationMode === "openai" && !openAIAvailable ? (
                  <Sparkles className="mr-2 h-4 w-4" />
                ) : generationMode === "grok" ? (
                  <Zap className="mr-2 h-4 w-4" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Outfits
                {generationMode === "openai" && !openAIAvailable && " (using Standard AI)"}
              </>
            )}
          </Button>

          <Button variant="outline" className="w-full" onClick={handleReset} disabled={isGenerating}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Preferences
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setShowShareModal(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Preferences
          </Button>
        </CardFooter>
      </Card>

      {/* Share Preferences Modal */}
      <SharePreferencesModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        preferences={{
          occasion,
          season,
          style,
          colorfulness: colorfulness[0],
          useWeather,
          includeAccessories,
          generationMode,
          preferredModel: generationMode === "openai" ? preferredModel : undefined,
        }}
      />
    </>
  )
}
