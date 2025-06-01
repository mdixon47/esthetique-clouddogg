"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { OutfitCard } from "@/components/outfits/outfit-card"
import { Loader2, Brain, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/providers/toast-provider"

// Sample wardrobe data - same as used in the main app
const sampleWardrobe = [
  {
    id: 1,
    name: "White Cotton T-Shirt",
    category: "Tops",
    subcategory: "T-Shirt",
    colors: ["White"],
    seasons: ["Spring", "Summer"],
    occasions: ["Casual"],
    image: "/placeholder.svg?height=300&width=300&text=White+T-Shirt",
  },
  {
    id: 2,
    name: "Blue Denim Jeans",
    category: "Bottoms",
    subcategory: "Jeans",
    colors: ["Blue"],
    seasons: ["Spring", "Fall", "Winter"],
    occasions: ["Casual", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Blue+Jeans",
  },
  {
    id: 3,
    name: "Black Leather Jacket",
    category: "Outerwear",
    subcategory: "Jacket",
    colors: ["Black"],
    seasons: ["Fall", "Winter"],
    occasions: ["Casual"],
    image: "/placeholder.svg?height=300&width=300&text=Black+Jacket",
  },
  {
    id: 4,
    name: "Floral Summer Dress",
    category: "Dresses",
    subcategory: "Casual Dress",
    colors: ["Multicolor", "Pink", "Green"],
    seasons: ["Spring", "Summer"],
    occasions: ["Casual", "Party"],
    image: "/placeholder.svg?height=300&width=300&text=Floral+Dress",
  },
  {
    id: 5,
    name: "White Sneakers",
    category: "Shoes",
    subcategory: "Sneakers",
    colors: ["White"],
    seasons: ["Spring", "Summer", "Fall"],
    occasions: ["Casual", "Sport"],
    image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
  },
  {
    id: 6,
    name: "Black Formal Blazer",
    category: "Outerwear",
    subcategory: "Blazer",
    colors: ["Black"],
    seasons: ["Fall", "Winter", "Spring"],
    occasions: ["Formal", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Black+Blazer",
  },
  {
    id: 7,
    name: "Red Knit Sweater",
    category: "Tops",
    subcategory: "Sweater",
    colors: ["Red"],
    seasons: ["Fall", "Winter"],
    occasions: ["Casual", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Red+Sweater",
  },
  {
    id: 8,
    name: "Beige Trench Coat",
    category: "Outerwear",
    subcategory: "Coat",
    colors: ["Beige"],
    seasons: ["Fall", "Spring"],
    occasions: ["Casual", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Beige+Coat",
  },
]

// Outfit test templates
const outfitTemplates = [
  {
    name: "Casual Weekend",
    occasion: "casual",
    season: "current",
    style: "balanced",
    colorfulness: 50,
    description: "A casual outfit for weekend activities",
  },
  {
    name: "Business Meeting",
    occasion: "work",
    season: "current",
    style: "classic",
    colorfulness: 30,
    description: "Professional outfit for a business meeting",
  },
  {
    name: "Evening Date",
    occasion: "date",
    season: "current",
    style: "trendy",
    colorfulness: 60,
    description: "Stylish outfit for an evening date",
  },
  {
    name: "Summer Beach Day",
    occasion: "casual",
    season: "summer",
    style: "adventurous",
    colorfulness: 80,
    description: "Bright and casual outfit for a day at the beach",
  },
  {
    name: "Winter Formal",
    occasion: "formal",
    season: "winter",
    style: "classic",
    colorfulness: 20,
    description: "Elegant outfit for a winter formal event",
  },
]

export function OpenAIOutfitTest() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [outfits, setOutfits] = useState<any[]>([])
  const [promptText, setPromptText] = useState("")
  const [responseText, setResponseText] = useState("")
  const [activeModel, setActiveModel] = useState("gpt-4o")
  const [showDebug, setShowDebug] = useState(false)
  const [customWardrobe, setCustomWardrobe] = useState(false)
  const [wardrobeText, setWardrobeText] = useState(JSON.stringify(sampleWardrobe, null, 2))

  // Outfit preferences
  const [occasion, setOccasion] = useState("casual")
  const [season, setSeason] = useState("current")
  const [style, setStyle] = useState("balanced")
  const [colorfulness, setColorfulness] = useState([50])
  const [useWeather, setUseWeather] = useState(true)
  const [includeAccessories, setIncludeAccessories] = useState(true)
  const [description, setDescription] = useState("")

  // Load template
  const loadTemplate = (template) => {
    setOccasion(template.occasion)
    setSeason(template.season)
    setStyle(template.style)
    setColorfulness([template.colorfulness])
    setDescription(template.description)
  }

  // Generate a test outfit
  const generateOutfit = async () => {
    setIsLoading(true)
    setError(null)
    setOutfits([])
    setPromptText("")
    setResponseText("")

    try {
      // Prepare the request
      const preferences = {
        occasion,
        season,
        style,
        colorfulness: colorfulness[0],
        useWeather,
        includeAccessories,
        description,
      }

      // Use custom wardrobe if enabled
      let wardrobe = sampleWardrobe
      if (customWardrobe) {
        try {
          wardrobe = JSON.parse(wardrobeText)
        } catch (e) {
          setError("Invalid wardrobe JSON. Using default wardrobe.")
          toast({
            title: "Invalid wardrobe JSON",
            description: "Using default wardrobe instead",
            variant: "destructive",
          })
        }
      }

      // Call the API with debug mode to get the prompt and response
      const response = await fetch("/api/outfit-generator/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences,
          wardrobe,
          count: 4,
          preferredModel: activeModel,
          debug: true, // Request debug info
          temperatures: 0.7, // Value for creativity in output
        }),
      })

      const data = await response.json()

      // Check for error
      if (data.error) {
        setError(data.error)
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }

      // Set prompt and response texts if available
      if (data.debug) {
        setPromptText(data.debug.prompt || "")
        setResponseText(data.debug.response || "")
      }

      // Set outfits if available
      if (data.outfits && Array.isArray(data.outfits)) {
        setOutfits(data.outfits)
      } else {
        // If no outfits but no error, set a general error
        if (!data.error) {
          setError("No outfits returned from the API")
        }
      }
    } catch (err) {
      console.error("Error generating outfits:", err)
      setError(`Error: ${err.message || "Failed to generate outfits"}`)
      toast({
        title: "Error",
        description: err.message || "Failed to generate outfits",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-green-500" />
            OpenAI Outfit Generation Test
          </CardTitle>
          <CardDescription>Test different outfit requests with OpenAI integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Select template */}
          <div className="space-y-2">
            <Label>Load Template</Label>
            <div className="flex flex-wrap gap-2">
              {outfitTemplates.map((template, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => loadTemplate(template)}>
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Outfit preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion</Label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger id="occasion">
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger id="season">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="fall">Fall</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safe">Safe & Classic</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="adventurous">Adventurous & Trendy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">OpenAI Model</Label>
              <Select value={activeModel} onValueChange={setActiveModel}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Colorfulness</Label>
              <span className="text-sm text-gray-500">{colorfulness[0]}%</span>
            </div>
            <Slider value={colorfulness} max={100} step={1} onValueChange={setColorfulness} />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Neutral</span>
              <span>Colorful</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="weather" className="cursor-pointer">
                Weather-based suggestions
              </Label>
              <Switch id="weather" checked={useWeather} onCheckedChange={setUseWeather} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="accessories" className="cursor-pointer">
                Include accessories
              </Label>
              <Switch id="accessories" checked={includeAccessories} onCheckedChange={setIncludeAccessories} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Description</Label>
            <Textarea
              id="description"
              placeholder="Add more details about the outfit you're looking for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="customWardrobe" className="cursor-pointer">
                Use custom wardrobe
              </Label>
              <Switch id="customWardrobe" checked={customWardrobe} onCheckedChange={setCustomWardrobe} />
            </div>
            {customWardrobe && (
              <Textarea
                value={wardrobeText}
                onChange={(e) => setWardrobeText(e.target.value)}
                rows={8}
                className="font-mono text-xs"
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="debug" className="cursor-pointer">
              Show debug information
            </Label>
            <Switch id="debug" checked={showDebug} onCheckedChange={setShowDebug} />
          </div>

          <Button
            className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
            onClick={generateOutfit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate with OpenAI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showDebug && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prompt">Prompt</TabsTrigger>
                <TabsTrigger value="response">Raw Response</TabsTrigger>
              </TabsList>
              <TabsContent value="prompt" className="p-4">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px]">
                  <pre className="text-xs whitespace-pre-wrap">{promptText || "No prompt available"}</pre>
                </div>
              </TabsContent>
              <TabsContent value="response" className="p-4">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px]">
                  <pre className="text-xs whitespace-pre-wrap">{responseText || "No response available"}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {outfits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Outfits</CardTitle>
            <CardDescription>
              {outfits.length} outfits generated using {activeModel}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {outfits.map((outfit) => (
                <OutfitCard key={outfit.id} outfit={outfit} isOpenAIGenerated={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

