import { BannerCarousel } from "@/components/banner-carousel"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="container mx-auto px-4 py-8">
        <BannerCarousel />
      </section>

      {/* Other homepage content */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        {/* Add your featured products here */}
      </section>
    </div>
  )
}
