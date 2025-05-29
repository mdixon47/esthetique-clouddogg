"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ColorSeasonCard } from "@/components/color-analysis/color-season-card"
import { ColorQuiz } from "@/components/color-analysis/color-quiz"
import { ColorResults } from "@/components/color-analysis/color-results"

export default function ColorAnalysisPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [colorSeason, setColorSeason] = useState<string | null>(null)

  const handleQuizComplete = (season: string) => {
    setColorSeason(season)
    setQuizCompleted(true)
    setActiveTab("results")
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setQuizCompleted(false)
    setColorSeason(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Color Analysis</h1>
      <p className="text-muted-foreground mb-8">Discover your perfect color palette based on your natural features.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="seasons">Color Seasons</TabsTrigger>
          <TabsTrigger value="quiz" disabled={quizStarted && !quizCompleted}>
            Color Quiz
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!quizCompleted}>
            Your Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>What is Color Analysis?</CardTitle>
              <CardDescription>Understanding how colors interact with your natural features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Color analysis is a method used to determine which colors best complement your natural features - your
                skin tone, hair color, and eye color. Wearing colors that harmonize with your natural coloring can
                enhance your appearance, making you look more vibrant, healthy, and balanced.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Benefits of Color Analysis</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Create a more cohesive wardrobe</li>
                    <li>Shop more efficiently and effectively</li>
                    <li>Enhance your natural features</li>
                    <li>Appear more vibrant and healthy</li>
                    <li>Reduce decision fatigue when getting dressed</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How It Works</h3>
                  <p>
                    Color analysis categorizes people into four main "seasons" based on the characteristics of their
                    natural coloring. Each season has a palette of colors that harmonize with those natural features.
                  </p>
                  <p className="mt-2">
                    Take our color quiz to discover your season and receive personalized color recommendations!
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setActiveTab("quiz")}
                className="w-full md:w-auto"
                aria-label="Take the color analysis quiz"
              >
                Take the Color Quiz
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="seasons" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorSeasonCard
              season="Spring"
              characteristics="Warm, bright, and clear colors"
              description="Spring types have warm undertones with golden highlights in their hair and a warm glow to their skin."
              colors={["#FFCC33", "#FF6633", "#99CC33", "#33CCCC", "#FF9933"]}
            />
            <ColorSeasonCard
              season="Summer"
              characteristics="Cool, soft, and muted colors"
              description="Summer types have cool undertones with ash tones in their hair and a cool, rosy quality to their skin."
              colors={["#6699CC", "#CC99CC", "#99CCCC", "#CC6699", "#CCCCCC"]}
            />
            <ColorSeasonCard
              season="Autumn"
              characteristics="Warm, muted, and rich colors"
              description="Autumn types have warm undertones with auburn or golden tones in their hair and a warm, golden quality to their skin."
              colors={["#CC6633", "#996633", "#CC9933", "#669933", "#993333"]}
            />
            <ColorSeasonCard
              season="Winter"
              characteristics="Cool, clear, and bright colors"
              description="Winter types have cool undertones with contrasting features, often with dark hair and clear, bright eyes."
              colors={["#3366CC", "#CC3366", "#333333", "#FFFFFF", "#33CCCC"]}
            />
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          {!quizStarted ? (
            <Card>
              <CardHeader>
                <CardTitle>Color Season Quiz</CardTitle>
                <CardDescription>Answer a few questions to discover your color season</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  This quiz will help determine which color season best matches your natural features. You'll answer
                  questions about your skin tone, hair color, eye color, and how certain colors look on you.
                </p>
                <p className="mt-4">For the most accurate results:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Take the quiz in natural lighting</li>
                  <li>Remove any makeup before analyzing your features</li>
                  <li>Have a mirror handy to observe your features</li>
                  <li>Answer honestly rather than what you wish were true</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setQuizStarted(true)}
                  className="w-full md:w-auto"
                  aria-label="Start the color analysis quiz"
                >
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <ColorQuiz onComplete={handleQuizComplete} />
          )}
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {quizCompleted && colorSeason ? (
            <ColorResults season={colorSeason} onReset={resetQuiz} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Color Analysis Results</CardTitle>
                <CardDescription>Take the quiz to see your personalized results</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p>You haven't completed the color analysis quiz yet.</p>
                <Button onClick={() => setActiveTab("quiz")} className="mt-4" aria-label="Take the color analysis quiz">
                  Take the Quiz
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
