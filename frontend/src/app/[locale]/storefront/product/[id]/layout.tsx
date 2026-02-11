import type { Metadata } from 'next'

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const response = await fetch(`${apiBase}/products/${params.id}`, {
      next: { revalidate: 60 },
    })
    const payload = await response.json()

    if (payload?.success && payload.data) {
      const product = payload.data
      const description = product.description
        ? String(product.description).slice(0, 160)
        : 'Product details and pricing'

      return {
        title: product.title || 'Product Details',
        description,
        openGraph: {
          title: product.title || 'Product Details',
          description,
          type: 'product',
          images: product.image_url ? [{ url: product.image_url }] : [],
        },
      }
    }
  } catch (error) {
    // Ignore metadata fetch errors
  }

  return {
    title: 'Product Details',
    description: 'Product details and pricing',
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
