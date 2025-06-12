"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard2 } from "./card-2";

interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  regular_price: number;
  original_price: number;
  images: string[];
  created_at: string;
  ratings: any;
}

interface SubcategoryProductsProps {
  products: Product[];
  subcategories: string[];
}

export function SubcategoryProducts({
  products,
  subcategories,
}: SubcategoryProductsProps) {
  // Group products by subcategory and randomize
  const groupedProducts = subcategories.reduce((acc, subcategory) => {
    const subcategoryProducts = products
      .filter(
        (product) =>
          product.subcategory?.toLowerCase() === subcategory.toLowerCase()
      )
      .sort(() => Math.random() - 0.5); // Randomize order

    if (subcategoryProducts.length > 0) {
      acc[subcategory] = subcategoryProducts;
    }
    return acc;
  }, {} as Record<string, Product[]>);

  if (Object.keys(groupedProducts).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No products found in this category</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {Object.entries(groupedProducts).map(
        ([subcategory, subcategoryProducts]) => (
          <SubcategorySection
            key={subcategory}
            subcategory={subcategory}
            products={subcategoryProducts}
          />
        )
      )}
    </div>
  );
}

interface SubcategorySectionProps {
  subcategory: string;
  products: Product[];
}

function SubcategorySection({
  subcategory,
  products,
}: SubcategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="rounded-lg bg-gray-50 px-4 py-2 mb-6">
      {/* Subcategory Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium capitalize my-4">{subcategory}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Horizontal Scroll */}
      <section>
        <div className="container mx-auto mb-4">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 scrollbar-hide lg:grid-cols-4 xl:grid-cols-5 gap-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <ProductCard2
                key={product.id}
                id={product.id}
                title={product.title}
                brand={product.brand}
                regular_price={product.regular_price}
                original_price={product.original_price}
                images={product.images}
                ratings={product.ratings}
                created_at={product.created_at}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
