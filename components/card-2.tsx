"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Users } from "lucide-react"

interface ProductCard2Props {
  id: string
  title: string
  brand: string
  images: string[]
  regular_price: number
  original_price: number
  ratings: {
    "5": number
    "4": number
    "3": number
    "2": number
    "1": number
  }
  created_at: string
}

export function ProductCard2({
  id,
  title,
  brand,
  images,
  regular_price,
  original_price,
  ratings,
  created_at,
}: ProductCard2Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(()=>{
    console.log(original_price)
  })

  // Calculate average rating and total raters
  const totalRaters = Object.values(ratings).reduce((sum, count) => sum + count, 0)
  const totalRatingPoints = Object.entries(ratings).reduce(
    (sum, [rating, count]) => sum + Number.parseInt(rating) * count,
    0,
  )
  const averageRating = totalRaters > 0 ? totalRatingPoints / totalRaters : 0

  // Calculate discount percentage
  const discountAmount = original_price - regular_price
  const discountPercentage = Math.round((discountAmount / regular_price) * 100)

  // Check if product is new (less than 20 raters)
  const isNew = totalRaters < 20

  // Check if product was created in last 30 days
  const isRecentlyCreated = new Date(created_at) > new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  const showNewBadge = isNew || isRecentlyCreated

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 800)

      // Store interval ID to clear it later
      ;(handleMouseEnter as any).intervalId = interval
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCurrentImageIndex(0)
    if ((handleMouseEnter as any).intervalId) {
      clearInterval((handleMouseEnter as any).intervalId)
    }
  }

  return (
    <Link href={`/product/${id}`} className="block group">
      <div
        className="relative bg-white rounded-lg duration-300 overflow-hidden hover:border"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={images[currentImageIndex] || "/placeholder.svg?height=300&width=300"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* New Badge */}
          {showNewBadge && (
            <div className="absolute top-0 left-0 z-10">
              <div className="relative">
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-md">NEW</div>
                <div className="absolute top-0 left-0 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-red-600"></div>
              </div>
            </div>
          )}

          {/* Rating Overlay */}
          {totalRaters > 0 && (
            <div className="absolute bottom-2 gap-1 left-2 rounded-[4px] bg-white text-black px-1 py-1 flex items-center justify-between text-[8px]">
              <div className="flex items-center gap-1">
                
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <Star className="w-2 h-2 fill-green-400 text-green-400" />
              </div>
              <div className="w-px h-2 bg-black"></div>
              <div className="flex items-center gap-1">
                <Users className="w-2 h-2" />
                <span>{totalRaters.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Image Indicators */}
          {images.length > 1 && isHovered && (
            <div className="absolute top-2 right-2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-2">
          {/* Brand */}
          <div className="font-bold text-gray-900 text-sm uppercase tracking-wide">{brand}</div>

          {/* Title */}
          <div className="text-gray-600 text-xs font-light leading-tight line-clamp-2">{title}</div>

          {/* Pricing */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-green-600 font-bold text-sm">₹{regular_price.toLocaleString()}</span>
            <span className="text-gray-400 line-through text-sm">₹{original_price?.toLocaleString()}</span>
            <span className="text-orange-500 text-xs font-medium">({discountPercentage}% off)</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
