"use client"

import Link from "next/link"
import { Store, Star, Shield, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SellerInfoProps {
  seller: any
}

export default function SellerInfo({ seller }: SellerInfoProps) {
  if (!seller) return null

  // Calculate seller rating (placeholder - you can implement actual rating logic)
  const sellerRating = 4.2
  const totalReviews = 1250

  return (
    <Card>
      <CardContent className="px-4">
        <div className="space-y-4">
          {/* Seller Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Sold by</span>
              </div>
              <Link
                href={`/shop/${seller.id}`}
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {seller.business_name}
              </Link>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>

          {/* Seller Rating */}
          {/* <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= sellerRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {sellerRating} ({totalReviews.toLocaleString()} reviews)
            </span>
          </div> */}

          {/* Seller Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Member since:</span>
              <div className="font-medium">{new Date(seller.created_at).getFullYear()}</div>
            </div>
            <div>
              <span className="text-gray-600">Response time:</span>
              <div className="font-medium text-green-600">Within 2 hours</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/shop/${seller.id}`}>
                <Store className="h-4 w-4 mr-2" />
                Visit Shop
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>

          {/* Seller Policies */}
          {/* <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
            <div>• Ships within 1-2 business days</div>
            <div>• 30-day return policy</div>
            <div>• Secure payment processing</div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
