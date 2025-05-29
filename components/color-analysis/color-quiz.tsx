"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface Question {
  id: number
  text: string
  options: {
    id: string
    text: string
    season: string
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "What is the undertone of your skin?",
    options: [
      { id: "1a", text: "Warm, golden or peachy", season: "Spring" },
      { id: "1b", text: "Cool, pink or rosy", season: "Summer" },
      { id: "1c", text: "Warm, golden or olive", season: "Autumn" },
      { id: "1d", text: "Cool, blue or pale", season: "Winter" },
    ],
  },
  {
    id: 2,
    text: "What color are your eyes?",
    options: [
      { id: "2a", text: "Bright blue, turquoise, or clear green", season: "Spring" },
      { id: "2b", text: "Soft blue, gray-blue, or soft green", season: "Summer" },
      { id: "2c", text: "Hazel, amber, warm brown, or warm green", season: "Autumn" },
      { id: "2d", text: "Dark brown, black-brown, or clear blue", season: "Winter" },
    ],
  },
  {
    id: 3,
    text: "What is your natural hair color?",
    options: [
      { id: "3a", text: "Golden blonde, strawberry blonde, or warm light brown", season: "Spring" },
      { id: "3b", text: "Ash blonde, light brown with no golden tones", season: "Summer" },
      { id: "3c", text: "Auburn, copper red, golden brown, or chestnut", season: "Autumn" },
      { id: "3d", text: "Dark brown, black, or cool dark brown", season: "Winter" },
    ],
  },
  {
    id: 4,
    text: "Which jewelry typically looks best on you?",
    options: [
      { id: "4a", text: "Gold or bronze", season: "Spring" },
      { id: "4b", text: "Silver or platinum", season: "Summer" },
      { id: "4c", text: "Bronze or copper", season: "Autumn" },
      { id: "4d", text: "Silver or white gold", season: "Winter" },
    ],
  },
  {
    id: 5,
    text: "Which colors tend to make you look washed out or tired?",
    options: [
      { id: "5a", text: "Dark, muted colors like burgundy or navy", season: "Spring" },
      { id: "5b", text: "Bright, vibrant colors like orange or bright yellow", season: "Summer" },
      { id: "5c", text: "Cool pastels like lavender or baby blue", season: "Autumn" },
      { id: "5d", text: "Earth tones like olive green or terracotta", season: "Winter" },
    ],
  },
  {
    id: 6,
    text: "When you tan, what happens to your skin?",
    options: [
      { id: "6a", text: "I tan easily to a golden color", season: "Spring" },
      { id: "6b", text: "I burn first, then tan lightly", season: "Summer" },
      { id: "6c", text: "I tan easily to a deep bronze", season: "Autumn" },
      { id: "6d", text: "I burn easily or don't tan much at all", season: "Winter" },
    ],
  },
  {
    id: 7,
    text: "Which of these colors would you most likely receive compliments when wearing?",
    options: [
      { id: "7a", text: "Peach, coral, or warm green", season: "Spring" },
      { id: "7b", text: "Soft pink, periwinkle blue, or sage green", season: "Summer" },
      { id: "7c", text: "Rust, olive green, or terracotta", season: "Autumn" },
      { id: "7d", text: "True red, royal blue, or emerald green", season: "Winter" },
    ],
  },
]

interface ColorQuizProps {
  onComplete: (season: string) => void
}

export function ColorQuiz({ onComplete }: ColorQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleNext = () => {
    if (selectedOption) {
      setAnswers({ ...answers, [currentQuestion]: selectedOption })
      setSelectedOption(null)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Calculate results
        const seasonCounts: Record<string, number> = {
          Spring: 0,
          Summer: 0,
          Autumn: 0,
          Winter: 0,
        }

        Object.values(answers).forEach((optionId) => {
          const question = questions.find((q) => q.options.some((opt) => opt.id === optionId))
          if (question) {
            const option = question.options.find((opt) => opt.id === optionId)
            if (option) {
              seasonCounts[option.season]++
            }
          }
        })

        // Add the last answer
        const lastQuestion = questions[currentQuestion]
        const lastOption = lastQuestion.options.find((opt) => opt.id === selectedOption)
        if (lastOption) {
          seasonCounts[lastOption.season]++
        }

        // Find the season with the highest count
        let maxCount = 0
        let resultSeason = ""

        Object.entries(seasonCounts).forEach(([season, count]) => {
          if (count > maxCount) {
            maxCount = count
            resultSeason = season
          }
        })

        onComplete(resultSeason)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption(answers[currentQuestion - 1] || null)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Season Quiz</CardTitle>
        <Progress
          value={progress}
          className="w-full mt-2"
          aria-label={`Question ${currentQuestion + 1} of ${questions.length}`}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <p className="text-base">{questions[currentQuestion].text}</p>

          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} aria-labelledby={`label-${option.id}`} />
                  <Label htmlFor={option.id} id={`label-${option.id}`} className="cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          aria-label="Previous question"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedOption}
          aria-label={currentQuestion < questions.length - 1 ? "Next question" : "Complete quiz"}
        >
          {currentQuestion < questions.length - 1 ? "Next" : "Complete"}
        </Button>
      </CardFooter>
    </Card>
  )
}
