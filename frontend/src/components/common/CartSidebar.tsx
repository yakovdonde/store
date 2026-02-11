'use client'

import React from 'react'
import styles from './CartSidebar.module.css'
import { CartItem } from '@/lib/cart'

interface CartSidebarProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
}

export default function CartSidebar({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
}: CartSidebarProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Shopping Cart</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.items}>
          {items.length === 0 ? (
            <p className={styles.empty}>Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.productId} className={styles.cartItem}>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className={styles.image} />
                )}
                <div className={styles.details}>
                  <h4>{item.title}</h4>
                  <p className={styles.price}>${item.price.toFixed(2)}</p>
                  <div className={styles.quantity}>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))
                      }
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateQuantity(item.productId, parseInt(e.target.value) || 1)
                      }
                    />
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={() => onRemoveItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <strong>Total:</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button className={styles.checkoutButton}>Proceed to Checkout</button>
          </div>
        )}
      </aside>
    </>
  )
}
