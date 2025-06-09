import { supabase } from "./supabaseClient"

export interface Banner {
  id: string
  title: string
  description: string | null
  image_url: string
  click_route: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface CreateBannerData {
  title: string
  description?: string
  image_url: string
  click_route?: string
  display_order: number
  is_active: boolean
}

export async function getAllBanners(): Promise<Banner[]> {

  const { data, error } = await supabase.from("banners").select("*").order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching banners:", error)
    throw new Error("Failed to fetch banners")
  }

  return data || []
}

export async function getActiveBanners(): Promise<Banner[]> {

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching active banners:", error)
    throw new Error("Failed to fetch active banners")
  }

  return data || []
}

export async function createBanner(bannerData: CreateBannerData): Promise<Banner> {

  const { data, error } = await supabase
    .from("banners")
    .insert([
      {
        ...bannerData,
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating banner:", error)
    throw new Error("Failed to create banner")
  }

  return data
}

export async function updateBanner(id: string, bannerData: Partial<CreateBannerData>): Promise<Banner> {

  const { data, error } = await supabase
    .from("banners")
    .update({
      ...bannerData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating banner:", error)
    throw new Error("Failed to update banner")
  }

  return data
}

export async function deleteBanner(id: string): Promise<void> {

  const { error } = await supabase.from("banners").delete().eq("id", id)

  if (error) {
    console.error("Error deleting banner:", error)
    throw new Error("Failed to delete banner")
  }
}

export async function updateBannerStatus(id: string, isActive: boolean): Promise<void> {

  const { error } = await supabase
    .from("banners")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating banner status:", error)
    throw new Error("Failed to update banner status")
  }
}
