import { supabase } from "./supabaseClient"

export async function getCategoryData(category: string) {

  try {
    // Fetch products for the category
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
        ratings
      `)
      .ilike("category", category)
      .eq("authorized_by_platform", true)

    if (error) {
      console.error("Error fetching products:", error)
      throw error
    }

    // Extract unique subcategories
    const subcategories = Array.from(
      new Set(products?.filter((product) => product.subcategory).map((product) => product.subcategory)),
    ).filter(Boolean) as string[]

    return {
      subcategories,
      products: products || [],
    }
  } catch (error) {
    console.error("Error in getCategoryData:", error)
    throw error
  }
}
