// Utility function to get the localized category name
export interface Category {
  id: number | string
  name: string
  name_en?: string
  name_ru?: string
  name_he?: string
  name_az?: string
  description?: string
  parent_id?: number | null
  order_index?: number
}

export function getLocalizedCategoryName(category: Category, locale: string): string {
  const localeKey = `name_${locale}` as keyof Category
  const localizedName = category[localeKey] as string | undefined
  
  // Return localized name if available, otherwise fallback to name_en, then name
  return localizedName || category.name_en || category.name
}
