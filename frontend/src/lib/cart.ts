// Cart management using localStorage
export interface CartItem {
  productId: string
  title: string
  price: number
  quantity: number
  imageUrl?: string
}

const CART_STORAGE_KEY = 'judaica-cart'

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY)
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

export const saveCart = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export const addToCart = (item: CartItem): CartItem[] => {
  const cart = getCart()
  const existingItem = cart.find((ci) => ci.productId === item.productId)

  if (existingItem) {
    existingItem.quantity += item.quantity
  } else {
    cart.push(item)
  }

  saveCart(cart)
  return cart
}

export const removeFromCart = (productId: string): CartItem[] => {
  const cart = getCart().filter((item) => item.productId !== productId)
  saveCart(cart)
  return cart
}

export const updateCartItemQuantity = (productId: string, quantity: number): CartItem[] => {
  const cart = getCart()
  const item = cart.find((ci) => ci.productId === productId)

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }
    item.quantity = quantity
    saveCart(cart)
  }

  return cart
}

export const getCartTotal = (): number => {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0)
}

export const clearCart = (): void => {
  saveCart([])
}
