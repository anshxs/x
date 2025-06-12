'use client'

import { BannerCarousel } from "@/components/banner-carousel"
import CategoryProducts from "@/components/CategoryProducts"
import { EventProducts } from "@/components/event-products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"
import { ArrowBigRight, ArrowBigRightDash, ArrowDownRight, ArrowRight, ArrowRightIcon, Facebook, Instagram, Linkedin, ShoppingCart, Twitter } from "lucide-react"
import { useEffect, useState } from "react"

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Beauty & Health",
  "Books",
  "Automotive",
  "Home",
  "Sports",
  "Games",
]

export default function HomePage() {
  const [productsByCategory, setProductsByCategory] = useState<{ [key: string]: any[] }>({})
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("authorized_by_platform", true)
        .gte("stock", 1)

      if (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
        return
      }

      const categorized: { [key: string]: any[] } = {}

      for (const category of CATEGORIES) {
        categorized[category] = data.filter(
          (product) => product.category === category
        )
      }

      setProductsByCategory(categorized)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  if (loading) return <div className="text-center py-20">Loading products...</div>


  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="container mx-auto px-4 py-8">
        <BannerCarousel />
      </section>

      {/* Other homepage content */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-5xl font-extralight mb-6 text-center">FEATURED PRODUCTS</h2>
        <EventProducts />
        {/* Add your featured products here */}
      </section>
      <section className="container mx-auto px-4 py-8">
      <h2 className="text-5xl font-extralight mb-12 text-center">SHOP BY CATEGORY</h2>
      {CATEGORIES.map((category) => (
        <CategoryProducts
          key={category}
          title={category}
          products={productsByCategory[category]}
        />
      ))}
    </section>
    <footer className="bg-secondary text-secondary-foreground py-12 px-4 md:px-12 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-6 h-6" />
            <h2 className="text-xl font-bold">ShopVerse</h2>
          </div>
          <p className="text-sm">Your one-stop multivendor marketplace for everything you need.</p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-base font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/shop" className="hover:underline">Shop</a></li>
            <li><a href="/vendors" className="hover:underline">Vendors</a></li>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-base font-semibold mb-3">Stay Updated</h3>
          <p className="text-sm mb-3">Subscribe to our newsletter for latest deals and vendor updates.</p>
          <form className="flex items-center space-x-2">
            <Input type="email" placeholder="Enter your email" className="bg-background" />
            <Button>Subscribe</Button>
          </form>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-base font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook"><Facebook className="w-5 h-5 hover:text-primary" /></a>
            <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5 hover:text-primary" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5 hover:text-primary" /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin className="w-5 h-5 hover:text-primary" /></a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-muted mt-10 pt-6 text-sm flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} ShopVerse. All rights reserved.</p>
        <div className="space-x-4 mt-2 md:mt-0">
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/refunds" className="hover:underline">Refunds</a>
        </div>
      </div>
    </footer>
      
    </div>
  )
}
