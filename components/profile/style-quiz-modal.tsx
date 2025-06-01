"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Check } from "lucide-react"

interface StyleQuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StyleQuizModal({ open, onOpenChange }: StyleQuizModalProps) {
  const [step, setStep] = useState(1)
  const [selections, setSelections] = useState({
    styleTypes: [] as string[],
    favoriteColors: [] as string[],
    avoidColors: [] as string[],
    colorfulness: [50],
    formality: [50],
    favoriteCategories: [] as string[],
    avoidCategories: [] as string[],
  })

  const totalSteps = 5

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // In a real app, you would save the quiz results to your database
      console.log("Quiz completed with selections:", selections)
      onOpenChange(false)
      setStep(1) // Reset for next time
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const toggleStyleType = (style: string) => {
    setSelections((prev) => ({
      ...prev,
      styleTypes: prev.styleTypes.includes(style)
        ? prev.styleTypes.filter((s) => s !== style)
        : [...prev.styleTypes, style],
    }))
  }

  const toggleColor = (color: string, type: "favorite" | "avoid") => {
    if (type === "favorite") {
      setSelections((prev) => ({
        ...prev,
        favoriteColors: prev.favoriteColors.includes(color)
          ? prev.favoriteColors.filter((c) => c !== color)
          : [...prev.favoriteColors, color],
      }))
    } else {
      setSelections((prev) => ({
        ...prev,
        avoidColors: prev.avoidColors.includes(color)
          ? prev.avoidColors.filter((c) => c !== color)
          : [...prev.avoidColors, color],
      }))
    }
  }

  const toggleCategory = (category: string, type: "favorite" | "avoid") => {
    if (type === "favorite") {
      setSelections((prev) => ({
        ...prev,
        favoriteCategories: prev.favoriteCategories.includes(category)
          ? prev.favoriteCategories.filter((c) => c !== category)
          : [...prev.favoriteCategories, category],
      }))
    } else {
      setSelections((prev) => ({
        ...prev,
        avoidCategories: prev.avoidCategories.includes(category)
          ? prev.avoidCategories.filter((c) => c !== category)
          : [...prev.avoidCategories, category],
      }))
    }
  }

  // Sample data for the quiz
  const styleTypes = [
    "Minimalist",
    "Casual Chic",
    "Bohemian",
    "Streetwear",
    "Classic",
    "Preppy",
    "Romantic",
    "Edgy",
    "Sporty",
    "Vintage",
  ]

  const colors = [
    "Black",
    "White",
    "Gray",
    "Beige",
    "Navy",
    "Brown",
    "Red",
    "Pink",
    "Orange",
    "Yellow",
    "Green",
    "Blue",
    "Purple",
  ]

  const categories = [
    "T-Shirts",
    "Blouses",
    "Sweaters",
    "Jeans",
    "Trousers",
    "Skirts",
    "Dresses",
    "Blazers",
    "Jackets",
    "Coats",
    "Sneakers",
    "Heels",
    "Boots",
    "Accessories",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Style Preference Quiz</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Style Types */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">What style types do you prefer?</h3>
              <p className="text-sm text-gray-500">Select all that apply to your personal style.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {styleTypes.map((style) => (
                  <div key={style} className="flex items-start space-x-2">
                    <Checkbox
                      id={`style-${style}`}
                      checked={selections.styleTypes.includes(style)}
                      onCheckedChange={() => toggleStyleType(style)}
                    />
                    <Label
                      htmlFor={`style-${style}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {style}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Favorite Colors */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">What colors do you love to wear?</h3>
              <p className="text-sm text-gray-500">Select your favorite colors for clothing.</p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {colors.map((color) => (
                  <div key={color} className="flex items-start space-x-2">
                    <Checkbox
                      id={`fav-color-${color}`}
                      checked={selections.favoriteColors.includes(color)}
                      onCheckedChange={() => toggleColor(color, "favorite")}
                    />
                    <Label
                      htmlFor={`fav-color-${color}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Colors to Avoid */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">What colors do you prefer to avoid?</h3>
              <p className="text-sm text-gray-500">Select colors you don't like wearing.</p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {colors.map((color) => (
                  <div key={color} className="flex items-start space-x-2">
                    <Checkbox
                      id={`avoid-color-${color}`}
                      checked={selections.avoidColors.includes(color)}
                      onCheckedChange={() => toggleColor(color, "avoid")}
                    />
                    <Label
                      htmlFor={`avoid-color-${color}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Style Parameters */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Style Parameters</h3>
              <p className="text-sm text-gray-500">Adjust these sliders to match your preferences.</p>

              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Colorfulness</Label>
                    <span className="text-sm text-gray-500">{selections.colorfulness[0]}%</span>
                  </div>
                  <Slider
                    value={selections.colorfulness}
                    onValueChange={(value) => setSelections((prev) => ({ ...prev, colorfulness: value }))}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Neutral</span>
                    <span>Colorful</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Formality</Label>
                    <span className="text-sm text-gray-500">{selections.formality[0]}%</span>
                  </div>
                  <Slider
                    value={selections.formality}
                    onValueChange={(value) => setSelections((prev) => ({ ...prev, formality: value }))}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Casual</span>
                    <span>Formal</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Category Preferences */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">What clothing categories do you prefer?</h3>
              <p className="text-sm text-gray-500">Select your favorite categories and those you prefer to avoid.</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Favorite Categories</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <div key={category} className="flex items-start space-x-2">
                        <Checkbox
                          id={`fav-cat-${category}`}
                          checked={selections.favoriteCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category, "favorite")}
                        />
                        <Label
                          htmlFor={`fav-cat-${category}`}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Categories to Avoid</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <div key={category} className="flex items-start space-x-2">
                        <Checkbox
                          id={`avoid-cat-${category}`}
                          checked={selections.avoidCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category, "avoid")}
                        />
                        <Label
                          htmlFor={`avoid-cat-${category}`}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
          >
            {step === totalSteps ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Complete
              </>
            ) : (
              "Next"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
