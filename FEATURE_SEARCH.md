# Product Search and Filter Feature

## Overview
The product search and filter feature allows customers to search for Judaica items with multiple filtering options. This feature is fully integrated into the storefront with a clean, intuitive UI.

## Architecture

### Backend Implementation

#### Search Endpoint
**Route:** `GET /api/products/search`

**Query Parameters:**
- `q` (required): Search query string (minimum 2 characters)
- `categoryId` (optional): Filter by category ID
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Classic Silver Menorah",
      "description": "Beautiful handcrafted silver menorah...",
      "price": "149.99",
      "image_url": "https://...",
      "category_id": 1,
      "item_order_index": 1,
      "created_at": "2026-02-10T19:52:11.386Z",
      "updated_at": "2026-02-10T19:52:11.386Z"
    }
  ]
}
```

**Implementation Details:**
- Location: `backend/src/controllers/productController.ts`
- Search performs full-text search on `title` and `description` fields
- Query is case-insensitive using PostgreSQL `LOWER()` function
- Supports partial matching with wildcards (`%query%`)
- Returns results sorted alphabetically by title
- Route must be placed before `/:id` route to prevent conflicts

**Route Configuration:**
- File: `backend/src/routes/products.ts`
- Order: `GET /search` → `GET /list` → `GET /:id` (specific routes before wildcard routes)

### Frontend Implementation

#### SearchBar Component
**Location:** `frontend/src/components/storefront/SearchBar.tsx`

**Features:**
- Real-time search input with minimum character validation
- Category filter dropdown (dynamically populated from available categories)
- Price range filters (min and max price inputs)
- Loading state during search
- Results counter showing number of matches
- Reset button to clear all filters and results

**Props:**
```typescript
interface SearchBarProps {
  categories: Category[]        // Array of available categories
  onSearch: (results: any[]) => void  // Callback when search completes
  onLoading?: (loading: boolean) => void  // Optional loading state callback
}
```

**Styling:**
- File: `frontend/src/components/storefront/SearchBar.module.css`
- Responsive design: Single column on mobile, multi-column form group on tablets/desktop
- Consistent with existing design system
- Accessible form labels and inputs

#### Storefront Integration
**Location:** `frontend/src/app/storefront/page.tsx`

**Search Flow:**
1. User enters search criteria in SearchBar component
2. Component calls `/api/products/search` endpoint
3. Results are transformed to match Product interface
4. Featured products and categories sections are hidden while searching
5. Search results displayed in ProductGrid with same add-to-cart functionality
6. "Clear Search" button allows users to return to home page view

**Key Handlers:**
- `handleSearch()`: Transforms API results and displays them
- `handleClearSearch()`: Resets search state and returns to main view

**Exported:** Added to `frontend/src/components/storefront/index.ts` for easy imports

## Usage Examples

### Search by Product Name
```
Query: "menorah"
Results: Returns all products with "menorah" in title or description
```

### Search with Category Filter
```
Query: "candle" + Category: "Religious Items"
Results: Candle products in the Religious Items category only
```

### Search with Price Range
```
Query: "Judaica" + Min Price: $50 + Max Price: $200
Results: Judaica products between $50-$200
```

### Combined Search
```
Query: "prayer" + Category: "Books" + Min Price: $10 + Max Price: $50
Results: Prayer books in the Books category between $10-$50
```

## Error Handling

### Backend Validation
- Query string must be at least 2 characters
- Returns 400 Bad Request with error message if validation fails
- Invalid price values are coerced to numbers or ignored

### Frontend Error Handling
- Catches network errors and displays user-friendly alert
- Shows "No products found" message for empty results
- Loading state prevents duplicate searches
- Disabled form during search operations

## Performance Considerations

- **Database:** Uses indexed columns for fast full-text search
- **Query Optimization:** Only fetches required fields
- **Sorting:** Results sorted in database (not in application)
- **Pagination:** Not currently implemented (consider adding for large result sets)

## Future Enhancements

1. **Advanced Search:**
   - Multi-word search with AND/OR operators
   - Search result highlighting
   - Search history/suggestions

2. **Pagination:**
   - Limit results per page
   - Next/Previous buttons
   - Infinite scroll option

3. **Filters:**
   - Rating/review filter
   - Availability filter
   - Multiple category selection

4. **Analytics:**
   - Track popular searches
   - Log search queries for analytics
   - Trending searches dashboard

5. **SEO:**
   - URL query parameters for shareable search links
   - Meta tags for search results

## Testing

### Manual Testing Checklist
- [ ] Search with single word query
- [ ] Search with multiple word query
- [ ] Search with empty query (should show error)
- [ ] Search with <2 character query (should show error)
- [ ] Filter by category while searching
- [ ] Filter by min price only
- [ ] Filter by max price only
- [ ] Search with both price filters
- [ ] Verify case-insensitive search (e.g., "MENORAH" vs "menorah")
- [ ] Test special characters in search
- [ ] Verify "Clear Search" returns to home view
- [ ] Test on mobile, tablet, desktop viewports
- [ ] Add products from search results to cart

### API Testing Examples
```bash
# Basic search
curl "http://localhost:3001/api/products/search?q=menorah"

# Search with category
curl "http://localhost:3001/api/products/search?q=candle&categoryId=2"

# Search with price range
curl "http://localhost:3001/api/products/search?q=judaica&minPrice=50&maxPrice=200"

# Combined filters
curl "http://localhost:3001/api/products/search?q=prayer&categoryId=3&minPrice=10&maxPrice=50"

# Error case: short query
curl "http://localhost:3001/api/products/search?q=a"
# Response: { "success": false, "error": "Search query must be at least 2 characters" }
```

## Files Modified/Created

### New Files
- `frontend/src/components/storefront/SearchBar.tsx` - Search component
- `frontend/src/components/storefront/SearchBar.module.css` - Search styling

### Modified Files
- `backend/src/controllers/productController.ts` - Added search() function
- `backend/src/routes/products.ts` - Added /search route
- `frontend/src/components/storefront/index.ts` - Exported SearchBar
- `frontend/src/app/storefront/page.tsx` - Integrated search UI with results display

## Deployment Notes

1. Ensure database indexing is in place for `products.title` and `products.description`
2. Monitor search query performance under load
3. Consider caching popular searches
4. Review database query plan for optimization opportunities
5. Set up logging to track search errors and patterns
