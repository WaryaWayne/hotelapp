"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"

interface LogoUploadProps {
  onLogoChange: (logo: string | null) => void
  currentLogo: string | null
}

export default function LogoUpload({ onLogoChange, currentLogo }: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setPreviewUrl(result)
      onLogoChange(result)
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setPreviewUrl(null)
    onLogoChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Company Logo"
                className="max-h-32 max-w-full mx-auto object-contain border rounded p-2"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0 h-6 w-6 rounded-full"
                onClick={removeLogo}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Upload your company logo</p>
              <p className="text-xs text-gray-400">Recommended size: 300x100px, Max: 2MB</p>
            </div>
          )}

          <div className="flex justify-center">
            <Button variant="outline" size="sm" asChild className="relative">
              <label className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                {previewUrl ? "Change Logo" : "Upload Logo"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
