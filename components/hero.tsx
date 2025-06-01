import { Button } from "@/components/ui/button"
import Image from 'next/image'

export function Hero() {
  return (
    <section className="py-12 md:py-24 text-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              AI-Powered Personal Stylist
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Your intelligent wardrobe companion that helps you look your best every day, for every occasion.
            </p>
          </div>
          <div className="space-x-4">
            <Button className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500">
              Get Started
            </Button>
            <Button variant="outline" className="border-pink-200 text-pink-500 hover:bg-pink-50">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      <div className="relative mt-12 w-full overflow-hidden rounded-lg">
        <div className="aspect-[2/1] w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Fashion AI Assistant"
            width={1200}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  )
}
