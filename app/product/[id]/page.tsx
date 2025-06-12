"use client";

import { notFound, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ProductGallery from "@/components/product-gallery";
import ProductInfo from "@/components/product-info";
import SellerInfo from "@/components/seller-info";
import ProductSpecifications from "@/components/product-specifications";
import ProductReviews from "@/components/product-reviews";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

async function getProduct(id: string) {
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
    *,
    sellers (
      id,
      business_name,
      name,
      email,
      phone,
      personal_address,
      created_at
    )
  `
    )
    .eq("id", id)
    .single();

  if (error || !product) {
    return null;
  }

  return product;
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const product = await getProduct(productId);
      setProduct(product);

      if (product) {
        const eventInfo = await getEventProduct(productId);
        setEventData(eventInfo);
      }
    };

    fetchData();
  }, [productId]);

  async function getEventProduct(productId: string) {
    const { data, error } = await supabase
      .from("event_products")
      .select(
        `
      event_price,
      event:events (
        id,
        title,
        end_date
      )
    `
      )
      .eq("product_id", productId)
      .gt("events.end_date", new Date().toISOString()) // only future events
      .maybeSingle();

    if (error) {
      console.error("Error fetching event product:", error);
      return null;
    }

    return data;
  }

  //   const product = getProduct(productId);

  if (product === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    ); // or a spinner
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Gallery */}
          <div className="space-y-4">
            <ProductGallery product={product} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <ProductInfo product={product} eventData={eventData} />
            <SellerInfo seller={product.sellers} />
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <ProductSpecifications product={product} />
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <ProductReviews product={product} />
        </div>
      </div>
    </div>
  );
}
