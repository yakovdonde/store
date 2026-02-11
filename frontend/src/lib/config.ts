// Environment configuration
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const apiOrigin = apiUrl.replace(/\/api\/?$/, '')

export const config = {
  apiUrl,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}

export const resolveImageUrl = (url?: string) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return `${apiOrigin}${url}`
  return url
}
