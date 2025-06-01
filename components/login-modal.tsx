"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Twitter } from "lucide-react"
import { useState } from "react"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateLogin = () => {
    const newErrors: Record<string, string> = {}

    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address"

    if (!password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSignup = () => {
    const newErrors: Record<string, string> = {}

    if (!signupName) newErrors.signupName = "Name is required"

    if (!signupEmail) newErrors.signupEmail = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(signupEmail)) newErrors.signupEmail = "Please enter a valid email address"

    if (!signupPassword) newErrors.signupPassword = "Password is required"
    else if (signupPassword.length < 8) newErrors.signupPassword = "Password must be at least 8 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateLogin()) {
      // Handle login logic
      console.log("Login with:", { email, password })
      onOpenChange(false)
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateSignup()) {
      // Handle signup logic
      console.log("Signup with:", { name: signupName, email: signupEmail, password: signupPassword })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Sign In or Create Account</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6 space-y-4">
            <form onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p id="email-error" className="text-xs text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="password" className={errors.password ? "text-red-500" : ""}>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p id="password-error" className="text-xs text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>
              <Button
                className="w-full mt-4 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                type="submit"
              >
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-6 space-y-4">
            <form onSubmit={handleSignup}>
              <div className="space-y-2">
                <Label htmlFor="signup-name" className={errors.signupName ? "text-red-500" : ""}>
                  Full Name
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Your Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  aria-invalid={!!errors.signupName}
                  aria-describedby={errors.signupName ? "signup-name-error" : undefined}
                  className={errors.signupName ? "border-red-500" : ""}
                />
                {errors.signupName && (
                  <p id="signup-name-error" className="text-xs text-red-500">
                    {errors.signupName}
                  </p>
                )}
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="signup-email" className={errors.signupEmail ? "text-red-500" : ""}>
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  aria-invalid={!!errors.signupEmail}
                  aria-describedby={errors.signupEmail ? "signup-email-error" : undefined}
                  className={errors.signupEmail ? "border-red-500" : ""}
                />
                {errors.signupEmail && (
                  <p id="signup-email-error" className="text-xs text-red-500">
                    {errors.signupEmail}
                  </p>
                )}
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="signup-password" className={errors.signupPassword ? "text-red-500" : ""}>
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  aria-invalid={!!errors.signupPassword}
                  aria-describedby={errors.signupPassword ? "signup-password-error" : undefined}
                  className={errors.signupPassword ? "border-red-500" : ""}
                />
                {errors.signupPassword && (
                  <p id="signup-password-error" className="text-xs text-red-500">
                    {errors.signupPassword}
                  </p>
                )}
              </div>
              <Button
                className="w-full mt-4 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                type="submit"
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" aria-hidden="true" />
              Github
            </Button>
            <Button variant="outline" className="w-full">
              <Twitter className="mr-2 h-4 w-4" aria-hidden="true" />
              Twitter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
