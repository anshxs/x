"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, CheckCircle, Minus, Plus } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  short_description?: string;
  brand?: string;
  regular_price: number;
  original_price?: number;
  sale_price?: number;
  stock: number;
  images: string[];
  authorized_by_platform?: boolean;
}

interface Seller {
  business_name: string;
  status: "verified" | "pending" | "rejected";
}

interface EventProduct {
  event_price: number;
}

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
  seller?: Seller;
  event_product?: EventProduct | null;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getEffectivePrice = (item: CartItem): number => {
    if (item.event_product?.event_price) return item.event_product.event_price;
    return item.product?.regular_price || 0;
  };

  useEffect(() => {
    const fetchCart = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from("cart")
        .select(
          `
    *,
    product:product_id(*),
    seller:seller_id(business_name, status),
    event_product:event_products!event_products_product_id_fkey(
      event_price, product_id, shop_id
    )
  `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching cart:", error.message);
      } else {
        setCartItems(data as CartItem[]);
      }

      setLoading(false);
    };

    fetchCart();
  }, []);

  const handleRemove = async (itemId: string) => {
    const { error } = await supabase.from("cart").delete().eq("id", itemId);
    if (!error) {
      setCartItems((items) => items.filter((item) => item.id !== itemId));
    }
  };

  const handleQuantityChange = async (itemId: string, change: number) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (!item || !item.product) return;

    const newQuantity = Math.max(
      1,
      Math.min(item.product.stock, item.quantity + change)
    );

    // Update state immediately for responsiveness
    setCartItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // Update Supabase
    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("id", itemId);

    if (error) {
      console.error("Failed to update quantity in Supabase:", error.message);
      // Optional: rollback state if needed
    }
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const total = cartItems.reduce((sum, item) => {
    const price = getEffectivePrice(item);
    return sum + price * item.quantity;
  }, 0);

  const totalRegular = cartItems.reduce((sum, item) => {
    const price = getEffectivePrice(item);
    return sum + price * item.quantity;
  }, 0);

  const totalOriginal = cartItems.reduce((sum, item) => {
    const original =
      item.product?.original_price || item.product?.regular_price || 0;
    return sum + original * item.quantity;
  }, 0);

  const totalDiscount = totalOriginal - totalRegular;

  // Platform Fee logic
  let platformFee = 0;
  if (totalRegular <= 300) platformFee = 5;
  else if (totalRegular <= 1000) platformFee = 10;
  else if (totalRegular <= 5000) platformFee = 20;
  else if (totalRegular <= 25000) platformFee = 50;
  else platformFee = 100;

  // Delivery fee
  const deliveryFee = 59;

  // Final Amount
  const finalAmount = totalRegular + platformFee + deliveryFee;

  if (loading) return <div className="p-4">Loading your cart...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">
          Your cart is empty. Explore products to add.
        </p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => {
            const product = item.product;
            const price = product?.regular_price || 0;
            const discount =
              product?.original_price && price < product.original_price
                ? Math.round(
                    ((product.original_price - price) /
                      product.original_price) *
                      100
                  )
                : 0;

            return (
              <Card key={item.id} className="border">
                <CardContent className="flex flex-col md:flex-row gap-6 px-4">
                  <div className="flex flex-col items-center">
                    {product?.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover w-24 h-24"
                      />
                    )}
                    <div className="flex items-center mt-2 border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-3 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        disabled={item.quantity >= (product?.stock || 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {product?.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Seller: {item.seller?.business_name}{" "}
                      {item.seller?.status === "verified" && (
                        <span aria-label="Verified Seller">
                          <CheckCircle className="inline w-4 h-4 text-blue-500 ml-1" />
                        </span>
                      )}
                    </p>
                    <div className="text-sm text-gray-700 flex items-baseline gap-2">
                      {product?.original_price && (
                        <span className="line-through text-gray-400">
                          ₹{product.original_price}
                        </span>
                      )}
                      <span className="font-semibold text-2xl text-green-700">
                        ₹{price}
                      </span>
                      {discount > 0 && (
                        <span className="text-white text-xs bg-orange-500 px-2 rounded-full">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Delivery by Jun 20, 2025
                    </p>
                  </div>

                  <div className="flex flex-col justify-between items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Separator />

          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              PRICE DETAILS
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>
                  Price ({itemCount} item{itemCount > 1 ? "s" : ""})
                </span>
                <span>₹{totalOriginal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>− ₹{totalDiscount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>₹{deliveryFee}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total Amount</span>
                <span>₹{finalAmount.toFixed(2)}</span>
              </div>

              <div className="text-sm text-green-700 mt-2">
                You will save ₹{totalDiscount.toFixed(0)} on this order
              </div>
            </div>

            <Button size="lg" className="w-full mt-6">
              Proceed to Checkout
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Safe and Secure Payments. Easy returns. 100% Authentic products.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
