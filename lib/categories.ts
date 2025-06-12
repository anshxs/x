import { supabase } from "./supabaseClient"

export async function getCategoryData(category: string) {
  try {
    // Fetch products for the category with potential event prices
    const { data: products, error } = await supabase
      .from("products")
      .select(`
        id,
        title,
        brand,
        category,
        subcategory,
        regular_price,
        original_price,
        sale_price,
        images,
        ratings,
        event_products (
          event_price
        )
      `)
      .ilike("category", category)
      .eq("authorized_by_platform", true)
      .gte("stock", 1)

    if (error) {
      console.error("Error fetching products:", error)
      throw error
    }

    // Apply event price if available
    const updatedProducts = (products || []).map((product) => {
      const eventPrice = product.event_products?.[0]?.event_price
      return {
        ...product,
        regular_price: eventPrice ?? product.regular_price,
      }
    })

    // Extract unique subcategories
    const subcategories = Array.from(
      new Set(updatedProducts.filter((product) => product.subcategory).map((product) => product.subcategory))
    ).filter(Boolean) as string[]

    return {
      subcategories,
      products: updatedProducts,
    }
  } catch (error) {
    console.error("Error in getCategoryData:", error)
    throw error
  }
}
