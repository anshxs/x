"use client"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ProductReviewsProps {
  product: any
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState("newest")

  // Calculate rating statistics
  const ratings = product.ratings || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 }
  const totalRatings = Object.values(ratings).reduce((sum: number, count: any) => sum + count, 0)
  const averageRating =
    totalRatings > 0
      ? Object.entries(ratings).reduce((sum, [rating, count]) => sum + Number.parseInt(rating) * (count as number), 0) /
        totalRatings
      : 0

  // Mock reviews data (in real app, fetch from database)
  const mockReviews = [
    {
      id: 1,
      user: "John D.",
      rating: 5,
      date: "2024-01-15",
      title: "Excellent product!",
      comment: "Really happy with this purchase. Quality is great and delivery was fast.",
      helpful: 12,
      verified: true,
    },
    {
      id: 2,
      user: "Sarah M.",
      rating: 4,
      date: "2024-01-10",
      title: "Good value for money",
      comment: "Product is as described. Good quality and reasonable price.",
      helpful: 8,
      verified: true,
    },
    {
      id: 3,
      user: "Mike R.",
      rating: 5,
      date: "2024-01-05",
      title: "Highly recommended",
      comment: "Exceeded my expectations. Will definitely buy again.",
      helpful: 15,
      verified: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rating Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <div>
                <div className="flex items-center mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">Based on {totalRatings} reviews</div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratings[rating.toString()] || 0
                const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0

                return (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-gray-600">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Write Review */}
          <div className="space-y-4">
            <h3 className="font-semibold">Share your experience</h3>
            <p className="text-sm text-gray-600">Help other customers by writing a review about this product.</p>
            <Button className="w-full">Write a Review</Button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Sort Options */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Reviews ({mockReviews.length})</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border rounded-md px-3 py-1"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {/* Reviews */}
        <div className="divide-y">
          {mockReviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  {/* Review Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user}</span>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div>
                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful})
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                      <ThumbsDown className="h-4 w-4" />
                      Not Helpful
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="p-4 text-center border-t">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      </div>
    </div>
  )
}
