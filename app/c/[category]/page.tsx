"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { SubcategoryGrid } from "@/components/subcategory-grid";
import { SubcategoryProducts } from "@/components/subcategory-products";
import { getCategoryData } from "@/lib/categories";

interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  regular_price: number;
  original_price: number;
  created_at: string;
  images: string[];
  ratings: any;
}

interface CategoryData {
  subcategories: string[];
  products: Product[];
}

export default function CategoryPage() {
  const params = useParams();
  const category = decodeURIComponent(params.category as string);
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const data = await getCategoryData(category);

      // Override price if event_price exists
      const fixedProducts = data.products.map((product: any) => {
        const eventPrice = product.event_products?.[0]?.event_price;
        return {
          ...product,
          original_price: product.original_price,
          created_at: product.created_at,
          regular_price: eventPrice ?? product.regular_price,
        };
      });

      setCategoryData({
        ...data,
        products: fixedProducts,
      });
    } catch (error) {
      console.error("Error fetching category data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (category) {
    fetchCategoryData();
  }
}, [category]);


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-64 w-48 flex-shrink-0" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-gray-600">
            The category you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {categoryName}
      </h1>

      {/* Subcategories Grid */}
      <div>
        <SubcategoryGrid subcategories={categoryData.subcategories} />
      </div>

      {/* Products by Subcategory */}
      <SubcategoryProducts
        products={categoryData.products}
        subcategories={categoryData.subcategories}
      />
    </div>
  );
}
