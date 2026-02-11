import { query } from '@/config/database'

export async function addCategoryTranslations() {
  try {
    console.log('Adding multi-language support to categories...')

    // Add translation columns
    await query(`
      ALTER TABLE categories
      ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
      ADD COLUMN IF NOT EXISTS name_ru VARCHAR(255),
      ADD COLUMN IF NOT EXISTS name_he VARCHAR(255),
      ADD COLUMN IF NOT EXISTS name_az VARCHAR(255)
    `)
    console.log('✓ Translation columns added')

    // Migrate existing names to name_en
    await query(`
      UPDATE categories
      SET name_en = name
      WHERE name_en IS NULL
    `)
    console.log('✓ Existing names migrated to English')

    console.log('✅ Multi-language migration completed!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

if (require.main === module) {
  addCategoryTranslations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
