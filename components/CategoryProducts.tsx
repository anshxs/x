'use client'

import { useRef } from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import { ProductCard } from "./product-card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const scrollAmount = 300;

interface CategoryProductsProps {
  title: string;
  products: Array<{
    id: string;
    title: string;
    brand: string;
    images: string[];
    original_price: number;
    regular_price: number;
    ratings: {
      "5": number;
      "4": number;
      "3": number;
      "2": number;
      "1": number;
    };
    created_at: string;
  }>;
}

export default function CategoryProducts({
  title,
  products,
}: CategoryProductsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: string) => {
    if (containerRef.current) {
      (containerRef.current as HTMLDivElement).scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products?.length) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <Button variant={"ghost"} onClick={()=>{router.push(`/c/${title.toLowerCase()}`)}} className="text-2xl font-light">
          {title}
        </Button>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll("left")}>
            <ArrowLeftIcon />
          </button>
          <button onClick={() => scroll("right")}>
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex overflow-x-auto space-x-4 scroll-smooth scrollbar-hide px-1"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[200px] md:min-w-[200px] max-w-[300px] flex-shrink-0"
          >
            <ProductCard
              id={product.id}
              title={product.title}
              brand={product.brand}
              images={product.images}
              regular_price={product.original_price}
              event_price={product.regular_price}
              ratings={product.ratings}
              created_at={product.created_at}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
