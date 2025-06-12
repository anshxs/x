import { supabase } from "./supabaseClient"

export interface CreateEventProductData {
  event_id: string
  product_id: string
  shop_id: string
  event_price: number
}

export interface UpdateEventProductData {
  event_price?: number
}

export async function createEventProduct(data: CreateEventProductData) {

  const { error } = await supabase.from("event_products").insert([data])

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      throw new Error("This product is already added to this event")
    }
    throw new Error(error.message)
  }
}

export async function getEventProductsByShop(shopId: string) {

  const { data, error } = await supabase
    .from("event_products")
    .select(`
      *,
      event:events(title, start_date, end_date),
      product:products(title, regular_price, images)
    `)
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function updateEventProduct(id: string, data: UpdateEventProductData) {

  const { error } = await supabase.from("event_products").update(data).eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function deleteEventProduct(id: string) {

  const { error } = await supabase.from("event_products").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function getActiveEvents() {

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("events")
    .select("id, title, start_date, end_date")
    .gte("end_date", now) // Only get events that haven't ended
    .order("start_date", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getEventProducts() {

  const { data, error } = await supabase
    .from("event_products")
    .select(`
      *,
      product:products(*),
      event:events(*)
    `)
    .gte("events.start_date", new Date().toISOString())
    .lte("events.end_date", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching event products:", error)
    throw error
  }

  return data || []
}
