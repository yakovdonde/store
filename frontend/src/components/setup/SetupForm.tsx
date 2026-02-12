'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import styles from './SetupForm.module.css'

interface SetupFormProps {
  onComplete?: (config: any) => void
}

export default function SetupForm({ onComplete }: SetupFormProps) {
  const t = useTranslations()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    storeWhatsapp: '',
    storeAddress: '',
    primaryColor: '#8b2635',
    primaryHoverColor: '#6b2d1f',
    secondaryColor: '#1a2847',
    textColor: '#2c1810',
    footerBgColor: '#1a2847',
    currencies: 'USD,EUR',
    defaultCurrency: 'USD',
    categories: [] as Array<{ name: string; description: string; icon: string }>,
    acceptPayment: false,
    offerShipping: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleAddCategory = () => {
    setFormData({
      ...formData,
      categories: [...formData.categories, { name: '', description: '', icon: '📦' }],
    })
  }

  const handleCategoryChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...formData.categories]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, categories: updated })
  }

  const handleRemoveCategory = (index: number) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onComplete) {
      onComplete(formData)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>🏪 Store Setup Wizard</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Store Information */}
          {step === 1 && (
            <div className={styles.step}>
              <h2>Store Information</h2>
              <div className={styles.formGroup}>
                <label htmlFor="storeName">Store Name</label>
                <input
                  id="storeName"
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  placeholder="e.g., My Judaica Shop"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="storeDescription">Store Description</label>
                <textarea
                  id="storeDescription"
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleInputChange}
                  placeholder="A brief tagline for your store"
                  rows={3}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="storeEmail">Email</label>
                <input
                  id="storeEmail"
                  type="email"
                  name="storeEmail"
                  value={formData.storeEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="storePhone">Phone Number</label>
                <input
                  id="storePhone"
                  type="tel"
                  name="storePhone"
                  value={formData.storePhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="storeWhatsapp">WhatsApp Number</label>
                <input
                  id="storeWhatsapp"
                  type="tel"
                  name="storeWhatsapp"
                  value={formData.storeWhatsapp}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="storeAddress">Store Address</label>
                <input
                  id="storeAddress"
                  type="text"
                  name="storeAddress"
                  value={formData.storeAddress}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, City, Country"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Colors */}
          {step === 2 && (
            <div className={styles.step}>
              <h2>Color Scheme</h2>
              <p className={styles.stepDescription}>
                Customize your store's visual identity
              </p>

              <div className={styles.colorGrid}>
                <div className={styles.colorGroup}>
                  <label htmlFor="primaryColor">Primary Color</label>
                  <div className={styles.colorInput}>
                    <input
                      id="primaryColor"
                      type="color"
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={handleInputChange}
                      name="primaryColor"
                      className={styles.hexInput}
                    />
                  </div>
                </div>

                <div className={styles.colorGroup}>
                  <label htmlFor="primaryHoverColor">Primary Hover Color</label>
                  <div className={styles.colorInput}>
                    <input
                      id="primaryHoverColor"
                      type="color"
                      name="primaryHoverColor"
                      value={formData.primaryHoverColor}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      value={formData.primaryHoverColor}
                      onChange={handleInputChange}
                      name="primaryHoverColor"
                      className={styles.hexInput}
                    />
                  </div>
                </div>

                <div className={styles.colorGroup}>
                  <label htmlFor="secondaryColor">Secondary Color</label>
                  <div className={styles.colorInput}>
                    <input
                      id="secondaryColor"
                      type="color"
                      name="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={handleInputChange}
                      name="secondaryColor"
                      className={styles.hexInput}
                    />
                  </div>
                </div>

                <div className={styles.colorGroup}>
                  <label htmlFor="textColor">Text Color</label>
                  <div className={styles.colorInput}>
                    <input
                      id="textColor"
                      type="color"
                      name="textColor"
                      value={formData.textColor}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      value={formData.textColor}
                      onChange={handleInputChange}
                      name="textColor"
                      className={styles.hexInput}
                    />
                  </div>
                </div>

                <div className={styles.colorGroup}>
                  <label htmlFor="footerBgColor">Footer Background</label>
                  <div className={styles.colorInput}>
                    <input
                      id="footerBgColor"
                      type="color"
                      name="footerBgColor"
                      value={formData.footerBgColor}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      value={formData.footerBgColor}
                      onChange={handleInputChange}
                      name="footerBgColor"
                      className={styles.hexInput}
                    />
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div className={styles.colorPreview}>
                <div
                  className={styles.previewBox}
                  style={{
                    backgroundColor: formData.primaryColor,
                    color: formData.textColor,
                  }}
                >
                  Sample Button
                </div>
                <div
                  className={styles.previewBox}
                  style={{
                    backgroundColor: formData.footerBgColor,
                    color: '#fff',
                  }}
                >
                  Footer Preview
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Currencies & Languages */}
          {step === 3 && (
            <div className={styles.step}>
              <h2>Currencies & Languages</h2>

              <div className={styles.formGroup}>
                <label htmlFor="currencies">Supported Currencies</label>
                <input
                  id="currencies"
                  type="text"
                  name="currencies"
                  value={formData.currencies}
                  onChange={handleInputChange}
                  placeholder="USD,EUR,ILS"
                  required
                />
                <small>Comma-separated currency codes (USD, EUR, GBP, ILS, AZN, etc.)</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="defaultCurrency">Default Currency</label>
                <input
                  id="defaultCurrency"
                  type="text"
                  name="defaultCurrency"
                  value={formData.defaultCurrency}
                  onChange={handleInputChange}
                  placeholder="USD"
                  required
                />
              </div>

              <div className={styles.infoBox}>
                <p>
                  📚 <strong>Multi-language Support</strong><br />
                  Your store will support: English, Hebrew, Russian, and
                  Azerbaijani by default.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Categories */}
          {step === 4 && (
            <div className={styles.step}>
              <h2>Product Categories</h2>
              <p className={styles.stepDescription}>
                Define the main categories for your products
              </p>

              {formData.categories.length === 0 ? (
                <div className={styles.infoBox}>
                  <p>📦 No categories added yet. Click the button below to add your first category.</p>
                </div>
              ) : (
                <div className={styles.categoriesList}>
                  {formData.categories.map((category, index) => (
                    <div key={index} className={styles.categoryItem}>
                      <div className={styles.categoryRow}>
                        <input
                          type="text"
                          placeholder="Category name"
                          value={category.name}
                          onChange={(e) =>
                            handleCategoryChange(index, 'name', e.target.value)
                          }
                          className={styles.categoryInput}
                        />
                        <input
                          type="text"
                          placeholder="Icon/emoji"
                          maxLength={2}
                          value={category.icon}
                          onChange={(e) =>
                            handleCategoryChange(index, 'icon', e.target.value)
                          }
                          className={styles.iconInput}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(index)}
                          className={styles.removeBtn}
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Category description"
                        value={category.description}
                        onChange={(e) =>
                          handleCategoryChange(
                            index,
                            'description',
                            e.target.value
                          )
                        }
                        className={styles.descriptionInput}
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleAddCategory}
                className={styles.addBtn}
              >
                + Add Category
              </button>
            </div>
          )}

          {/* Step 5: Features */}
          {step === 5 && (
            <div className={styles.step}>
              <h2>Store Features</h2>

              <div className={styles.featuresList}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="acceptPayment"
                    checked={formData.acceptPayment}
                    onChange={handleInputChange}
                  />
                  <span>Accept Online Payments</span>
                </label>
                <p className={styles.featureDescription}>
                  Enable payment processing for online orders
                </p>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="offerShipping"
                    checked={formData.offerShipping}
                    onChange={handleInputChange}
                  />
                  <span>Offer Shipping Options</span>
                </label>
                <p className={styles.featureDescription}>
                  Enable shipping calculations and tracking
                </p>
              </div>

              <div className={styles.infoBox}>
                <p>
                  ✅ All stores include:<br />
                  • Multi-language support<br />
                  • Product management<br />
                  • Admin dashboard<br />
                  • Shopping cart<br />
                  • Contact forms
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className={styles.step}>
              <h2>Review Your Configuration</h2>

              <div className={styles.reviewBox}>
                <h3>Store Information</h3>
                <p><strong>Name:</strong> {formData.storeName}</p>
                <p><strong>Email:</strong> {formData.storeEmail}</p>
                <p><strong>Phone:</strong> {formData.storePhone}</p>
                <p><strong>Address:</strong> {formData.storeAddress}</p>

                <h3>Colors</h3>
                <div className={styles.colorPreviewSmall}>
                  <div style={{ backgroundColor: formData.primaryColor, width: '40px', height: '40px', borderRadius: '4px' }} title="Primary" />
                  <div style={{ backgroundColor: formData.secondaryColor, width: '40px', height: '40px', borderRadius: '4px' }} title="Secondary" />
                  <div style={{ backgroundColor: formData.footerBgColor, width: '40px', height: '40px', borderRadius: '4px' }} title="Footer" />
                </div>

                <h3>Currencies</h3>
                <p>{formData.currencies}</p>

                <h3>Categories ({formData.categories.length})</h3>
                {formData.categories.length > 0 ? (
                  <ul>
                    {formData.categories.map((cat, i) => (
                      <li key={i}>{cat.icon} {cat.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No categories configured</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={styles.navigationButtons}>
            {step > 1 && (
              <button type="button" onClick={prevStep} className={styles.secondaryBtn}>
                ← Back
              </button>
            )}

            {step < 6 ? (
              <button type="button" onClick={nextStep} className={styles.primaryBtn}>
                Next →
              </button>
            ) : (
              <button type="submit" className={styles.submitBtn}>
                ✓ Complete Setup
              </button>
            )}
          </div>

          {/* Progress indicator */}
          <div className={styles.progressIndicator}>
            Step {step} of 6
          </div>
        </form>
      </div>
    </div>
  )
}
