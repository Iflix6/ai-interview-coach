"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User } from "lucide-react"

interface WelcomePageProps {
  onSubmit: (name: string, image: string | null) => void
}

export default function WelcomePage({ onSubmit }: WelcomePageProps) {
  const [name, setName] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setIsLoading(true)
      // Simulate loading
      setTimeout(() => {
        onSubmit(name, image)
        setIsLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">AI Interview Coach</CardTitle>
          <CardDescription>Enter your details to start your interview</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-24 h-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {image ? (
                  <AvatarImage src={image || "/placeholder.svg"} alt={name} />
                ) : (
                  <AvatarFallback className="bg-gray-200 text-gray-500">
                    <Upload className="h-8 w-8" />
                  </AvatarFallback>
                )}
              </Avatar>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <p className="text-sm text-gray-500 mt-2">Click to upload your photo</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <User className="h-4 w-4" />
                </span>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? "Loading..." : "Start Interview"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
