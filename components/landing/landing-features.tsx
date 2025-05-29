import { Shirt, Camera, FolderHeart, Palette, Cloud, Calendar, Sparkles, UserCircle, Smartphone } from "lucide-react"

const features = [
  {
    name: "AI Outfit Suggestions",
    description:
      "Get personalized outfit recommendations based on your style preferences, occasion, weather, and current trends.",
    icon: Shirt,
    color: "from-pink-400 to-pink-300",
    hoverColor: "group-hover:from-pink-500 group-hover:to-pink-400",
  },
  {
    name: "Virtual Try-On",
    description: "See how clothes look on you before buying with our virtual fitting room technology.",
    icon: Camera,
    color: "from-purple-400 to-purple-300",
    hoverColor: "group-hover:from-purple-500 group-hover:to-purple-400",
  },
  {
    name: "Smart Wardrobe Organizer",
    description: "Upload and categorize your clothing items with AI-powered recognition and tagging.",
    icon: FolderHeart,
    color: "from-blue-400 to-blue-300",
    hoverColor: "group-hover:from-blue-500 group-hover:to-blue-400",
  },
  {
    name: "Color Analysis",
    description: "Discover your perfect color palette based on your skin tone, hair color, and personal preferences.",
    icon: Palette,
    color: "from-yellow-400 to-yellow-300",
    hoverColor: "group-hover:from-yellow-500 group-hover:to-yellow-400",
  },
  {
    name: "Weather-Based Styling",
    description: "Get outfit recommendations that match the current weather forecast for your location.",
    icon: Cloud,
    color: "from-green-400 to-green-300",
    hoverColor: "group-hover:from-green-500 group-hover:to-green-400",
  },
  {
    name: "Outfit Calendar & Planner",
    description: "Plan your outfits ahead of time and get packing lists for trips and special events.",
    icon: Calendar,
    color: "from-red-400 to-red-300",
    hoverColor: "group-hover:from-red-500 group-hover:to-red-400",
  },
  {
    name: "Style Preference Profile",
    description: "Create a detailed style profile with your preferences, favorite colors, and style goals.",
    icon: UserCircle,
    color: "from-indigo-400 to-indigo-300",
    hoverColor: "group-hover:from-indigo-500 group-hover:to-indigo-400",
  },
  {
    name: "AI Style Assistant",
    description: "Chat with our AI assistant for style advice, shopping recommendations, and fashion tips.",
    icon: Sparkles,
    color: "from-pink-400 to-purple-300",
    hoverColor: "group-hover:from-pink-500 group-hover:to-purple-400",
  },
  {
    name: "Mobile Friendly",
    description: "Access all features on the go with our responsive design that works on all devices.",
    icon: Smartphone,
    color: "from-gray-400 to-gray-300",
    hoverColor: "group-hover:from-gray-500 group-hover:to-gray-400",
  },
]

export function LandingFeatures() {
  return (
    <div id="features" className="py-24 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-pink-500 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for your perfect style
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            StyleAI combines AI technology with fashion expertise to help you look your best every day.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="group pt-6">
                <div className="flow-root rounded-lg bg-white px-6 pb-8 shadow-md transition duration-300 ease-in-out hover:shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span
                        className={`inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-gradient-to-br ${feature.color} ${feature.hoverColor} transition duration-300 ease-in-out`}
                      >
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
