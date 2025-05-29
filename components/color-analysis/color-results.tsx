"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Download, Redo } from "lucide-react"

interface SeasonData {
  title: string
  description: string
  characteristics: string[]
  colors: string[]
  bestColors: string[]
  avoidColors: string[]
  celebrities: string[]
}

const seasonData: Record<string, SeasonData> = {
  Spring: {
    title: "You are a Spring!",
    description: "Springs have warm, clear, and bright coloring with golden undertones.",
    characteristics: [
      "Golden or peachy skin undertones",
      "Hair ranges from golden blonde to warm light brown",
      "Eyes are typically bright blue, turquoise, or clear green",
      "Look best in warm, clear, and bright colors",
    ],
    colors: ["#FFCC33", "#FF6633", "#99CC33", "#33CCCC", "#FF9933", "#CC6699", "#FFCC99", "#66CC99"],
    bestColors: ["Peach", "Coral", "Warm green", "Golden yellow", "Bright turquoise", "Warm pink"],
    avoidColors: ["Black", "Dark navy", "Burgundy", "Gray", "Cool pastels"],
    celebrities: ["Nicole Kidman", "Emma Stone", "Jessica Chastain", "Sienna Miller"],
  },
  Summer: {
    title: "You are a Summer!",
    description: "Summers have cool, soft, and muted coloring with blue undertones.",
    characteristics: [
      "Cool, pink or rosy skin undertones",
      "Hair ranges from ash blonde to light brown with no golden tones",
      "Eyes are typically soft blue, gray-blue, or soft green",
      "Look best in cool, soft, and muted colors",
    ],
    colors: ["#6699CC", "#CC99CC", "#99CCCC", "#CC6699", "#CCCCCC", "#99CC99", "#CC9999", "#9999CC"],
    bestColors: ["Soft pink", "Periwinkle blue", "Lavender", "Sage green", "Powder blue", "Mauve"],
    avoidColors: ["Orange", "Bright yellow", "Tomato red", "Bright gold", "Black"],
    celebrities: ["Taylor Swift", "Kate Middleton", "Jennifer Aniston", "Reese Witherspoon"],
  },
  Autumn: {
    title: "You are an Autumn!",
    description: "Autumns have warm, muted, and rich coloring with golden-orange undertones.",
    characteristics: [
      "Warm, golden or olive skin undertones",
      "Hair ranges from auburn to copper red to golden brown",
      "Eyes are typically hazel, amber, warm brown, or warm green",
      "Look best in warm, muted, and rich colors",
    ],
    colors: ["#CC6633", "#996633", "#CC9933", "#669933", "#993333", "#CC9966", "#666633", "#CC6666"],
    bestColors: ["Rust", "Olive green", "Terracotta", "Mustard yellow", "Warm brown", "Teal"],
    avoidColors: ["Cool pastels", "Bright pink", "Icy blue", "Pure white", "Black"],
    celebrities: ["Julia Roberts", "Jennifer Lopez", "Drew Barrymore", "Amy Adams"],
  },
  Winter: {
    title: "You are a Winter!",
    description: "Winters have cool, clear, and bright coloring with blue undertones.",
    characteristics: [
      "Cool, blue or pale skin undertones",
      "Hair ranges from dark brown to black",
      "Eyes are typically dark brown, black-brown, or clear blue",
      "Look best in cool, clear, and bright colors",
    ],
    colors: ["#3366CC", "#CC3366", "#333333", "#FFFFFF", "#33CCCC", "#9933CC", "#CC0033", "#006699"],
    bestColors: ["True red", "Royal blue", "Emerald green", "Pure white", "Black", "Fuchsia"],
    avoidColors: ["Orange", "Warm brown", "Camel", "Muted colors", "Off-white"],
    celebrities: ["Anne Hathaway", "Lupita Nyong'o", "Zooey Deschanel", "Katy Perry"],
  },
}

interface ColorResultsProps {
  season: string
  onReset: () => void
}

export function ColorResults({ season, onReset }: ColorResultsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const data = seasonData[season]

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Could not find data for your color season.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please try taking the quiz again.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onReset}>Retake Quiz</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="palette">Color Palette</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Your Characteristics</h3>
              <ul className="list-disc pl-5 space-y-1">
                {data.characteristics.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Celebrity Examples</h3>
              <p>Celebrities with similar coloring include: {data.celebrities.join(", ")}</p>
            </div>
          </TabsContent>

          <TabsContent value="palette" className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Your Color Palette</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {data.colors.map((color, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-md border border-gray-200 flex items-center justify-center"
                    style={{ backgroundColor: color }}
                    aria-label={`Color swatch ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Best Colors</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {data.bestColors.map((color, index) => (
                    <li key={index}>{color}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Colors to Avoid</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {data.avoidColors.map((color, index) => (
                    <li key={index}>{color}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Wardrobe Recommendations</h3>
              <p className="mb-2">
                Based on your {season} color season, here are some recommendations for your wardrobe:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Focus on building a core wardrobe with your best colors</li>
                <li>Use your most flattering colors near your face</li>
                <li>Consider your season colors when shopping for makeup</li>
                <li>
                  Jewelry should complement your undertones (
                  {season === "Summer" || season === "Winter" ? "silver tones" : "gold tones"} work best)
                </li>
                <li>When in doubt, refer to your color palette for guidance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Next Steps</h3>
              <p>Now that you know your color season, explore our outfit suggestions tailored to your color palette.</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share Results</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Save Palette</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onReset}
          className="flex items-center gap-2"
          aria-label="Retake the color analysis quiz"
        >
          <Redo className="h-4 w-4" />
          <span>Retake Quiz</span>
        </Button>
        <Button
          onClick={() => (window.location.href = "/outfit-suggestions")}
          aria-label="Get outfit suggestions based on your color season"
        >
          Get Outfit Suggestions
        </Button>
      </CardFooter>
    </Card>
  )
}
