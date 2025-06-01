"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shirt, Calendar, Sparkles, Heart, ThumbsUp } from "lucide-react"

export function ProfileStats() {
  // Mock stats data - in a real app, this would come from your database
  const stats = {
    totalItems: 48,
    totalOutfits: 24,
    daysTracked: 32,
    mostWornItems: [
      { id: 1, name: "Blue Denim Jeans", count: 12 },
      { id: 2, name: "White Cotton T-Shirt", count: 8 },
      { id: 3, name: "Black Leather Jacket", count: 6 },
    ],
    mostWornCategories: [
      { category: "Jeans", count: 15 },
      { category: "T-Shirts", count: 12 },
      { category: "Sneakers", count: 10 },
    ],
    favoriteColors: [
      { color: "Blue", count: 18 },
      { color: "Black", count: 14 },
      { color: "White", count: 12 },
    ],
    favoriteOutfits: [
      { id: 1, name: "Casual Weekend Look", count: 5 },
      { id: 2, name: "Business Casual Outfit", count: 4 },
    ],
    styleInsights: [
      "You tend to prefer casual outfits over formal ones",
      "Your style is consistent with minimalist aesthetics",
      "You could expand your wardrobe with more colorful pieces",
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Shirt className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-gray-500">Items in your wardrobe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outfits</CardTitle>
            <Sparkles className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOutfits}</div>
            <p className="text-xs text-gray-500">Created or saved outfits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Tracked</CardTitle>
            <Calendar className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.daysTracked}</div>
            <p className="text-xs text-gray-500">Days of outfit tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Outfits</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteOutfits.length}</div>
            <p className="text-xs text-gray-500">Outfits you've saved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Worn Items</CardTitle>
            <CardDescription>Your wardrobe favorites</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {stats.mostWornItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                  <Badge variant="outline" className="bg-pink-50">
                    {item.count} times
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Worn Categories</CardTitle>
            <CardDescription>Your category preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {stats.mostWornCategories.map((category) => (
                <li key={category.category} className="flex items-center justify-between">
                  <span className="text-sm">{category.category}</span>
                  <Badge variant="outline" className="bg-pink-50">
                    {category.count} times
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Colors</CardTitle>
            <CardDescription>Colors you wear most often</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {stats.favoriteColors.map((color) => (
                <li key={color.color} className="flex items-center justify-between">
                  <span className="text-sm">{color.color}</span>
                  <Badge variant="outline" className="bg-pink-50">
                    {color.count} items
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Style Insights</CardTitle>
            <CardDescription>AI-generated observations about your style</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {stats.styleInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ThumbsUp className="h-4 w-4 text-pink-500 mt-0.5" />
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
