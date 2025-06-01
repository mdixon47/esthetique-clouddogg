"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Edit, Plus, X } from "lucide-react"
import { StyleQuizModal } from "@/components/profile/style-quiz-modal"

export function StylePreferences() {
  const [showStyleQuiz, setShowStyleQuiz] = useState(false)

  // Mock style preference data - in a real app, this would come from your database
  const stylePreferences = {
    styleTypes: ["Minimalist", "Casual Chic", "Sustainable"],
    favoriteColors: ["Black", "White", "Beige", "Navy"],
    avoidColors: ["Neon Green", "Orange"],
    colorfulness: 40,
    formality: 60,
    seasonality: true,
    weatherBased: true,
    favoriteCategories: ["Dresses", "Jeans", "Blazers"],
    avoidCategories: ["Crop Tops", "Mini Skirts"],
  }

  const removeStyleType = (style: string) => {
    // In a real app, you would update this in your database
    console.log("Removing style type:", style)
  }

  const removeColor = (color: string, type: "favorite" | "avoid") => {
    // In a real app, you would update this in your database
    console.log(`Removing ${type} color:`, color)
  }

  const removeCategory = (category: string, type: "favorite" | "avoid") => {
    // In a real app, you would update this in your database
    console.log(`Removing ${type} category:`, category)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Style Preferences</h2>
        <Button
          onClick={() => setShowStyleQuiz(true)}
          className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
        >
          <Edit className="mr-2 h-4 w-4" />
          Update Style Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Style Types</CardTitle>
            <CardDescription>Your preferred fashion styles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stylePreferences.styleTypes.map((style) => (
                <Badge key={style} className="flex items-center gap-1 bg-pink-100 text-pink-800 hover:bg-pink-200">
                  {style}
                  <button onClick={() => removeStyleType(style)} className="ml-1 rounded-full hover:bg-pink-200 p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button variant="outline" size="sm" className="h-6">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Preferences</CardTitle>
            <CardDescription>Your favorite and avoided colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Favorite Colors</h4>
              <div className="flex flex-wrap gap-2">
                {stylePreferences.favoriteColors.map((color) => (
                  <Badge key={color} className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                    {color}
                    <button
                      onClick={() => removeColor(color, "favorite")}
                      className="ml-1 rounded-full hover:bg-green-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="h-6">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Colors to Avoid</h4>
              <div className="flex flex-wrap gap-2">
                {stylePreferences.avoidColors.map((color) => (
                  <Badge key={color} className="flex items-center gap-1 bg-red-100 text-red-800 hover:bg-red-200">
                    {color}
                    <button
                      onClick={() => removeColor(color, "avoid")}
                      className="ml-1 rounded-full hover:bg-red-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="h-6">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Style Parameters</CardTitle>
            <CardDescription>Adjust your style preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Colorfulness</Label>
                <span className="text-sm text-gray-500">{stylePreferences.colorfulness}%</span>
              </div>
              <Slider defaultValue={[stylePreferences.colorfulness]} max={100} step={1} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Neutral</span>
                <span>Colorful</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Formality</Label>
                <span className="text-sm text-gray-500">{stylePreferences.formality}%</span>
              </div>
              <Slider defaultValue={[stylePreferences.formality]} max={100} step={1} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Casual</span>
                <span>Formal</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="seasonality">Seasonal Recommendations</Label>
                  <p className="text-xs text-gray-500">Adjust outfits based on current season</p>
                </div>
                <Switch id="seasonality" checked={stylePreferences.seasonality} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weather">Weather-Based Suggestions</Label>
                  <p className="text-xs text-gray-500">Adjust outfits based on weather forecast</p>
                </div>
                <Switch id="weather" checked={stylePreferences.weatherBased} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Preferences</CardTitle>
            <CardDescription>Your favorite and avoided clothing categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Favorite Categories</h4>
              <div className="flex flex-wrap gap-2">
                {stylePreferences.favoriteCategories.map((category) => (
                  <Badge key={category} className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {category}
                    <button
                      onClick={() => removeCategory(category, "favorite")}
                      className="ml-1 rounded-full hover:bg-blue-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="h-6">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Categories to Avoid</h4>
              <div className="flex flex-wrap gap-2">
                {stylePreferences.avoidCategories.map((category) => (
                  <Badge key={category} className="flex items-center gap-1 bg-red-100 text-red-800 hover:bg-red-200">
                    {category}
                    <button
                      onClick={() => removeCategory(category, "avoid")}
                      className="ml-1 rounded-full hover:bg-red-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="h-6">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <StyleQuizModal open={showStyleQuiz} onOpenChange={setShowStyleQuiz} />
    </div>
  )
}
