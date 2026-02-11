'use client'

import React from 'react'
import styles from './Footer.module.css'

interface FooterProps {
  storeInfo?: {
    address?: string
    phone?: string
    email?: string
    whatsapp?: string
  }
}

export default function Footer({ storeInfo }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>Contact Us</h3>
          {storeInfo?.address && <p>📍 {storeInfo.address}</p>}
          {storeInfo?.phone && (
            <p>
              📞{' '}
              <a href={`tel:${storeInfo.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {storeInfo.phone}
              </a>
            </p>
          )}
          {storeInfo?.email && (
            <p>
              📧{' '}
              <a href={`mailto:${storeInfo.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {storeInfo.email}
              </a>
            </p>
          )}
          {storeInfo?.whatsapp && (
            <p>
              💬{' '}
              <a
                href={`https://wa.me/${storeInfo.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                {storeInfo.whatsapp}
              </a>
            </p>
          )}
        </div>

        <div className={styles.section}>
          <h3>Information</h3>
          <ul>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#shipping">Shipping Info</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Follow Us</h3>
          <div className={styles.socialLinks}>
            <a href="#facebook" aria-label="Facebook">
              f
            </a>
            <a href="#instagram" aria-label="Instagram">
              📷
            </a>
            <a href="#twitter" aria-label="Twitter">
              𝕏
            </a>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        <p>&copy; 2026 Judaica Store. All rights reserved.</p>
      </div>
    </footer>
  )
}
