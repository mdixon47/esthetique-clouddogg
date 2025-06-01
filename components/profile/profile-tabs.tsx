"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StylePreferences } from "@/components/profile/style-preferences"
import { OutfitHistory } from "@/components/profile/outfit-history"
import { SavedOutfits } from "@/components/profile/saved-outfits"
import { ProfileStats } from "@/components/profile/profile-stats"
import { useMediaQuery } from "@/hooks/use-media-query"

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("style")
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Adjust tab labels for mobile
  const tabLabels = {
    style: isMobile ? "Style" : "Style Preferences",
    outfits: isMobile ? "Saved" : "Saved Outfits",
    history: isMobile ? "History" : "Outfit History",
    stats: "Stats",
  }

  return (
    <Tabs defaultValue="style" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="style">{tabLabels.style}</TabsTrigger>
        <TabsTrigger value="outfits">{tabLabels.outfits}</TabsTrigger>
        <TabsTrigger value="history">{tabLabels.history}</TabsTrigger>
        <TabsTrigger value="stats">{tabLabels.stats}</TabsTrigger>
      </TabsList>

      <TabsContent value="style" className="mt-0">
        <StylePreferences />
      </TabsContent>

      <TabsContent value="outfits" className="mt-0">
        <SavedOutfits />
      </TabsContent>

      <TabsContent value="history" className="mt-0">
        <OutfitHistory />
      </TabsContent>

      <TabsContent value="stats" className="mt-0">
        <ProfileStats />
      </TabsContent>
    </Tabs>
  )
}
