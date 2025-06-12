"use client";

import { useState } from "react";
import { Star, Truck, RotateCcw, Shield, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Countdown } from "@/components/Countdown";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
  product: any;
  eventData?: any; // make optional if not always present
}

export default function ProductInfo({ product, eventData }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAddToCart = async () => {
  const { data: user, error } = await supabase.auth.getUser();

  if (error || !user?.user) {
    alert("You must be logged in to add to cart.");
    return;
  }

  const { id: user_id } = user.user;

  const { data, error: insertError } = await supabase.from("cart").insert([
    {
      user_id,
      product_id: product.id,
      quantity,
    },
  ]);
  router.push('/cart')

  if (insertError) {
    console.error("Error adding to cart:", insertError.message);
    alert("Something went wrong. Please try again.");
  } else {
    alert("Product added to cart!");
  }
};


  // Calculate average rating
  const ratings = product.ratings || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  const totalRatings = Object.values(ratings).reduce(
    (sum: number, count: any) => sum + count,
    0
  );
  const averageRating =
    totalRatings > 0
      ? Object.entries(ratings).reduce(
          (sum, [rating, count]) =>
            sum + Number.parseInt(rating) * (count as number),
          0
        ) / totalRatings
      : 0;

  // Calculate discount percentage
  const discountPercentage =
    product.sale_price && product.regular_price
      ? Math.round(
          ((product.regular_price - product.sale_price) /
            product.regular_price) *
            100
        )
      : 0;

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stock, prev + change)));
  };

  return (
    <div className="space-y-2">
      {/* Brand */}
      {product.brand && (
        <div>
          <span className="text-sm text-blue-600 font-medium">
            {product.brand}
          </span>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {product.title}
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          {product.short_description}
        </p>
      </div>

      {/* Rating */}
      {totalRatings > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= averageRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {averageRating.toFixed(1)} ({totalRatings} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-green-600">
            ₹
            {eventData?.event_price ||
              product.regular_price ||
              product.original_price}
          </span>

          {/* Discount display logic */}
          {(eventData?.event_price &&
            product.original_price &&
            eventData.event_price < product.original_price) ||
          (product.regular_price &&
            product.original_price &&
            product.regular_price < product.original_price) ? (
            <>
              <span className="text-lg text-gray-500 line-through">
                ₹{product.original_price}
              </span>
              <Badge variant="destructive" className="bg-orange-500">
                {Math.round(
                  100 -
                    ((eventData?.event_price || product.regular_price) /
                      product.original_price) *
                      100
                )}
                % OFF
              </Badge>
            </>
          ) : null}
        </div>

        {/* Savings message */}
        {(eventData?.event_price || product.regular_price) &&
          product.original_price &&
          (eventData?.event_price || product.regular_price) <
            product.original_price && (
            <p className="text-xs text-green-600">
              You save ₹
              {product.original_price -
                (eventData?.event_price || product.regular_price)}
            </p>
          )}

        {/* Countdown timer if event is active */}
        {eventData?.event?.end_date && (
          <p className="text-md text-red-600">
            Sale ends in: <Countdown targetDate={eventData.event.end_date} />
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div>
        {product.stock > 0 ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 font-medium">
              In Stock ({product.stock} available)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-red-600 font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Quantity Selector */}
      {product.stock > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="fixed bottom-5 left-0 right-0 px-4 md:static md:px-0 z-50 mb-6">
            <div className="flex gap-3 md:p-0 md:bg-transparent">
              <Button className="flex-1" size="lg" onClick={handleAddToCart}>
  Add to Cart
</Button>

              <Button variant="outline" className="flex-1" size="lg">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
        {product.delivery_free && (
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-green-600" />
            <span>Free Delivery</span>
          </div>
        )}
        {product.cod_available && (
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-blue-600" />
            <span>Cash on Delivery</span>
          </div>
        )}
        {product.replacement_return?.available && (
          <div className="flex items-center gap-2 text-sm">
            <RotateCcw className="h-4 w-4 text-purple-600" />
            <span>{product.replacement_return.days} Days Return</span>
          </div>
        )}
      </div>
    </div>
  );
}
