'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SubcategoryGridProps {
  subcategories: string[]
}

export function SubcategoryGrid({ subcategories }: SubcategoryGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (subcategories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No subcategories found</p>
      </div>
    )
  }

  return (
    <div className="relative">

      {/* Subcategories Grid */}
      <div
        ref={scrollRef}
        className="flex flex-wrap overflow-x-auto scrollbar-hide sm:gap-2 md:gap-6 lg:gap-10 pb-4"
        style={{
          gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
        //   maxHeight: '320px'
        }}
      >
        {subcategories.map((subcategory, index) => (
          <Link
            key={subcategory}
            href={`/subcategory/${subcategory.toLowerCase()}`}
            className="group block w-20 duration-200"
          >
            <div>
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <Image
                  src='/x.jpeg'
                  alt={subcategory}
                  fill
                  className="object-cover p-3 rounded-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-1">
                <h3 className="text-xs -mt-2 font-medium text-center capitalize line-clamp-2">
                  {subcategory}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
