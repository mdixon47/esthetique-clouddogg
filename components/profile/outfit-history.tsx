"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { OutfitCard } from "@/components/outfits/outfit-card"
import { OutfitDetailsModal } from "@/components/outfits/outfit-details-modal"

export function OutfitHistory() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedOutfit, setSelectedOutfit] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Mock outfit history data - in a real app, this would come from your database
  const outfitHistory = [
    {
      id: 1,
      date: new Date(2023, 6, 15), // July 15, 2023
      outfit: {
        id: 1,
        name: "Casual Weekend Look",
        occasion: "casual",
        style: "minimalist",
        season: "summer",
        items: [
          {
            id: 1,
            name: "White Cotton T-Shirt",
            category: "Tops",
            image: "/placeholder.svg?height=300&width=300&text=White+T-Shirt",
          },
          {
            id: 2,
            name: "Blue Denim Jeans",
            category: "Bottoms",
            image: "/placeholder.svg?height=300&width=300&text=Blue+Jeans",
          },
          {
            id: 5,
            name: "White Sneakers",
            category: "Shoes",
            image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
          },
        ],
        weather: "Suitable for 70-85°F / Sunny or mild weather",
        description: "A comfortable outfit for everyday wear. This timeless combination never goes out of style.",
      },
    },
    {
      id: 2,
      date: new Date(2023, 6, 18), // July 18, 2023
      outfit: {
        id: 2,
        name: "Business Casual Outfit",
        occasion: "work",
        style: "classic",
        season: "fall",
        items: [
          {
            id: 7,
            name: "Red Knit Sweater",
            category: "Tops",
            image: "/placeholder.svg?height=300&width=300&text=Red+Sweater",
          },
          {
            id: 2,
            name: "Blue Denim Jeans",
            category: "Bottoms",
            image: "/placeholder.svg?height=300&width=300&text=Blue+Jeans",
          },
          {
            id: 6,
            name: "Black Formal Blazer",
            category: "Outerwear",
            image: "/placeholder.svg?height=300&width=300&text=Black+Blazer",
          },
          {
            id: 5,
            name: "White Sneakers",
            category: "Shoes",
            image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
          },
        ],
        weather: "Suitable for 55-65°F / Cool weather",
        description: "A polished look for your workday. A balanced mix of classic pieces with modern elements.",
      },
    },
    {
      id: 3,
      date: new Date(2023, 6, 22), // July 22, 2023
      outfit: {
        id: 3,
        name: "Summer Party Outfit",
        occasion: "party",
        style: "trendy",
        season: "summer",
        items: [
          {
            id: 4,
            name: "Floral Summer Dress",
            category: "Dresses",
            image: "/placeholder.svg?height=300&width=300&text=Floral+Dress",
          },
          {
            id: 5,
            name: "White Sneakers",
            category: "Shoes",
            image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
          },
        ],
        weather: "Suitable for 75-90°F / Warm weather",
        description:
          "Stylish outfit for a memorable evening out. Incorporating current fashion trends for a contemporary look.",
      },
    },
  ]

  const handleOutfitClick = (outfit: any) => {
    setSelectedOutfit(outfit)
    setShowDetailsModal(true)
  }

  // Get outfits for the selected date
  const selectedDateOutfits = date
    ? outfitHistory.filter((item) => item.date.toDateString() === date.toDateString()).map((item) => item.outfit)
    : []

  // Get all dates with outfits for the calendar
  const outfitDates = outfitHistory.map((item) => item.date)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6">
            <Card>
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    hasOutfit: outfitDates,
                  }}
                  modifiersStyles={{
                    hasOutfit: {
                      fontWeight: "bold",
                      backgroundColor: "rgba(236, 72, 153, 0.1)",
                      color: "rgb(236, 72, 153)",
                    },
                  }}
                />
              </CardContent>
            </Card>

            <div>
              <h3 className="text-lg font-medium mb-4">
                {date ? <>Outfits worn on {date.toLocaleDateString()}</> : <>Select a date to view outfits</>}
              </h3>

              {selectedDateOutfits.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {selectedDateOutfits.map((outfit) => (
                    <div key={outfit.id} onClick={() => handleOutfitClick(outfit)} className="cursor-pointer">
                      <OutfitCard outfit={outfit} />
                    </div>
                  ))}
                </div>
              ) : date ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-center text-gray-500">No outfits recorded for this date.</p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          {outfitHistory.length > 0 ? (
            <div className="space-y-6">
              {outfitHistory.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-pink-50">
                      {item.date.toLocaleDateString()}
                    </Badge>
                    <h3 className="text-sm font-medium">{item.outfit.name}</h3>
                  </div>
                  <div onClick={() => handleOutfitClick(item.outfit)} className="cursor-pointer">
                    <OutfitCard outfit={item.outfit} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-gray-500">No outfit history recorded yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <OutfitDetailsModal outfit={selectedOutfit} open={showDetailsModal} onOpenChange={setShowDetailsModal} />
    </div>
  )
}
