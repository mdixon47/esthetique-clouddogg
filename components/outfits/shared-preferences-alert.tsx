"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Check, X } from "lucide-react"
import { useToast } from "@/components/providers/toast-provider"

interface SharedPreferencesAlertProps {
  preferences: any
  onApply: (preferences: any) => void
  onDismiss: () => void
}

export function SharedPreferencesAlert({ preferences, onApply, onDismiss }: SharedPreferencesAlertProps) {
  const { toast } = useToast()

  const handleApply = () => {
    onApply(preferences)
    toast({
      title: "Preferences applied",
      description: "The shared preferences have been applied to your outfit generator",
    })
  }

  return (
    <Alert className="mb-6 border-pink-200 bg-pink-50">
      <Share2 className="h-4 w-4 text-pink-500" />
      <AlertTitle className="text-pink-700">Shared Preferences</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm text-pink-700 mb-2">Someone has shared their outfit preferences with you:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-white">
            Occasion: {preferences.occasion}
          </Badge>
          <Badge variant="outline" className="bg-white">
            Season: {preferences.season}
          </Badge>
          <Badge variant="outline" className="bg-white">
            Style: {preferences.style}
          </Badge>
          <Badge variant="outline" className="bg-white">
            Colorfulness: {preferences.colorfulness}%
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" onClick={handleApply} className="bg-pink-500 hover:bg-pink-600 text-white">
            <Check className="mr-2 h-4 w-4" />
            Apply Preferences
          </Button>
          <Button size="sm" variant="outline" onClick={onDismiss}>
            <X className="mr-2 h-4 w-4" />
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
