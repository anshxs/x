"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { getEventProducts } from "@/lib/event-products"

interface EventProduct {
  id: string
  event_id: string
  product_id: string
  shop_id: string
  event_price: number
  created_at: string
  product: {
    id: string
    title: string
    brand: string
    images: string[]
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
  event: {
    title: string
    start_date: string
    end_date: string
  }
}

export function EventProducts() {
  const [eventProducts, setEventProducts] = useState<EventProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEventProducts = async () => {
      try {
        const products = await getEventProducts()
        setEventProducts(products)
      } catch (error) {
        console.error("Error fetching event products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEventProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (eventProducts.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>No featured products available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {eventProducts.map((eventProduct) => (
            <ProductCard
              key={eventProduct.id}
              id={eventProduct.product.id}
              title={eventProduct.product.title}
              brand={eventProduct.product.brand}
              images={eventProduct.product.images}
              regular_price={eventProduct.product.original_price}
              event_price={eventProduct.event_price}
              ratings={eventProduct.product.ratings}
              created_at={eventProduct.product.created_at}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
