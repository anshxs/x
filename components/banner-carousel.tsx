"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getActiveBanners } from "@/lib/banners"
import { useRouter } from "next/navigation"

interface Banner {
  id: string
  title: string
  description: string | null
  image_url: string
  click_route: string | null
  display_order: number
  is_active: boolean
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchBanners();
    console.log('banners',banners);
  }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
      }, 5000) // Auto-advance every 5 seconds

      return () => clearInterval(interval)
    }
  }, [banners.length])

  const fetchBanners = async () => {
    try {
      const data = await getActiveBanners()
      setBanners(data)
      console.log('banners',banners)
    } catch (error) {
      console.error("Error fetching banners:", error)
    } finally {
      setLoading(false)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const handleBannerClick = (banner: Banner) => {
    if (banner.click_route) {
      if (banner.click_route.startsWith("http")) {
        window.open(banner.click_route, "_blank")
      } else {
        router.push(banner.click_route)
      }
    }
  }

  if (loading) {
    return <div className="w-full h-64 md:h-96 bg-gray-200 animate-pulse rounded-lg" />
  }

  if (banners.length === 0) {
    return null
  }

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg group">
      {/* Banner Images */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="w-full h-full flex-shrink-0 relative cursor-pointer"
            onClick={() => handleBannerClick(banner)}
          >
            <img
              src={banner.image_url}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay with text */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white p-4">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                {banner.description && <p className="text-sm md:text-lg opacity-90">{banner.description}</p>}
                {banner.click_route && (
                  <Button
                    className="mt-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBannerClick(banner)
                    }}
                  >
                    Shop Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {/* {banners.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )} */}

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
