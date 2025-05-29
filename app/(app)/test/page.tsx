import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Camera, Sparkles } from "lucide-react"

export default function TestCenterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Test Center</h1>
        <p className="mt-2 text-gray-500">Test various features and integrations of the StyleAI platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/test/openai">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-green-500" />
                Test OpenAI
              </CardTitle>
              <CardDescription>Test OpenAI integration with different outfit requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Generate outfit suggestions using OpenAI models with various parameters and see the results.
              </p>
              <Button className="mt-4 w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700">
                <Brain className="mr-2 h-4 w-4" />
                Test OpenAI
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/test/try-on">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2 text-pink-500" />
                Test Virtual Try-On
              </CardTitle>
              <CardDescription>Test the virtual try-on API with different images</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Upload user images and clothing items to test the virtual try-on functionality.
              </p>
              <Button className="mt-4 w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500">
                <Camera className="mr-2 h-4 w-4" />
                Test Try-On
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/test/grok">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                Test Grok
              </CardTitle>
              <CardDescription>Test Grok AI integration with different outfit requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Generate outfit suggestions using Grok AI with various parameters and see the results.
              </p>
              <Button className="mt-4 w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Test Grok
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
