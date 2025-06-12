"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  product: any
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  // Get all images (main images + color variant images)
  const allImages = [...(product.images || []), ...Object.values(product.colors || {})].filter(Boolean)

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        {allImages.length > 0 ? (
          <>
            <Image
              src={allImages[selectedImage] || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {allImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute rounded-full left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute rounded-full right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span>No image available</span>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                selectedImage === index ? "border-blue-500" : "border-gray-200"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${product.title} ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Color Variants */}
      {product.colors && Object.keys(product.colors).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Available Colors:</h4>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(product.colors).map(([color, imageUrl]) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color)
                  const colorImageIndex = allImages.findIndex((img) => img === imageUrl)
                  if (colorImageIndex !== -1) {
                    setSelectedImage(colorImageIndex)
                  }
                }}
                className={`px-3 py-1 text-sm rounded-full border transition-colors capitalize ${
                  selectedColor === color
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
