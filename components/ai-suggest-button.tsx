"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AiSuggestModal } from "@/components/ai-suggest-modal"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

export function AiSuggestButton() {
  const [showModal, setShowModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Show button after a slight delay for a nice entrance effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className={cn(
                "rounded-full shadow-lg transition-all duration-300",
                isHovered
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-xl"
                  : "bg-gradient-to-r from-pink-400 to-purple-400 shadow-md",
                isMobile ? "h-14 w-14" : "h-12 px-5",
              )}
              size={isMobile ? "icon" : "default"}
              onClick={() => setShowModal(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="Get AI style suggestions"
            >
              <motion.div animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.5 }}>
                <Sparkles className={cn("h-5 w-5", !isMobile && "mr-2")} />
              </motion.div>
              {!isMobile && <span className="font-medium">Style Assistant</span>}

              {/* Pulsing effect for the button */}
              <span className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-500 animate-ping-slow" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AiSuggestModal open={showModal} onOpenChange={setShowModal} />
    </>
  )
}

