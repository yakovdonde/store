# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Response Format

All responses follow this format:
```json
{
  "success": true,
  "data": {},
  "error": null,
  "message": null
}
```

## Authentication

### Register User
**POST** `/auth/register`

Request:
```json
{
  "email": "admin@store.com",
  "password": "securepassword123",
  "role": "owner"  // optional: "owner" or "editor"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@store.com",
    "role": "owner",
    "token": "eyJhbGc..."
  }
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "admin@store.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@store.com",
    "role": "owner",
    "token": "eyJhbGc..."
  }
}
```

### Refresh Token
**POST** `/auth/refresh`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc..."
  }
}
```

## Products

### List Products
**GET** `/products`

Query Parameters:
- `categoryId` (optional): Filter by category ID

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Handmade Tallit",
      "description": "Beautiful handwoven wool tallit...",
      "price": 149.99,
      "image_url": "https://...",
      "category_id": 1,
      "item_order_index": 0,
      "created_at": "2026-02-10T...",
      "updated_at": "2026-02-10T..."
    }
  ]
}
```

### Get Product
**GET** `/products/:id`

Response: Single product object (same as above)

### Create Product
**POST** `/products`

Headers: `Authorization: Bearer <admin_token>`

Request:
```json
{
  "title": "Handmade Tallit",
  "description": "Beautiful handwoven wool tallit",
  "price": 149.99,
  "category_id": 1,
  "image_url": "https://...",
  "item_order_index": 0
}
```

Response: Created product object

### Update Product
**PUT** `/products/:id`

Headers: `Authorization: Bearer <admin_token>`

Request: Same as create (all fields optional)

Response: Updated product object

### Delete Product
**DELETE** `/products/:id`

Headers: `Authorization: Bearer <owner_token>`

Response:
```json
{
  "success": true,
  "message": "Product deleted"
}
```

### Reorder Products
**POST** `/products/reorder`

Headers: `Authorization: Bearer <admin_token>`

Request:
```json
{
  "productIds": [3, 1, 2, 4]
}
```

Response: Array of reordered products

## Categories

### List Categories
**GET** `/categories`

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ritual Objects",
      "name_en": "Ritual Objects",
      "name_ru": "Ритуальные предметы",
      "name_he": "חפצי טקס",
      "name_az": "Ritual Əsərləri",
      "description": "Essential ritual items",
      "parent_id": null,
      "order_index": 1,
      "created_at": "2026-02-10T...",
      "updated_at": "2026-02-10T..."
    }
  ]
}
```

### Get Category
**GET** `/categories/:id`

Response: Single category object

### Create Category
**POST** `/categories`

Headers: `Authorization: Bearer <admin_token>`

Request:
```json
{
  "name": "New Category",
  "name_en": "New Category",
  "name_ru": "Новая категория",
  "name_he": "קטגוריה חדשה",
  "name_az": "Yeni Kateqoriya",
  "description": "Category description",
  "parent_id": null,
  "order_index": 7
}
```

**Note:** All language fields (`name_en`, `name_ru`, `name_he`, `name_az`) are optional. The `name` field is used as the internal identifier.

### Update Category
**PUT** `/categories/:id`

Headers: `Authorization: Bearer <admin_token>`

Request: Same as create (all fields optional)

### Delete Category
**DELETE** `/categories/:id`

Headers: `Authorization: Bearer <owner_token>`

### Reorder Categories
**POST** `/categories/reorder`

Headers: `Authorization: Bearer <admin_token>`

Request:
```json
{
  "categoryIds": [1, 3, 2, 4, 5, 6]
}
```

## Settings

### Get Settings
**GET** `/settings`

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "site_title": "Judaica Store",
    "banner_url": "https://...",
    "top_description": "Your premier source...",
    "address": "123 Jewish Way...",
    "phone": "(555) 123-4567",
    "email": "info@store.com",
    "whatsapp": "+1 (555) 123-4567",
    "created_at": "2026-02-10T...",
    "updated_at": "2026-02-10T..."
  }
}
```

### Update Settings
**PUT** `/settings`

Headers: `Authorization: Bearer <owner_token>`

Request:
```json
{
  "site_title": "New Store Name",
  "banner_url": "https://...",
  "address": "456 New Address",
  "phone": "(555) 987-6543"
}
```

Response: Updated settings object

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Product not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "error": "Title, description, price, and category_id required"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Role-Based Access

### Owner
- All admin functions
- Delete products and categories
- Update store settings

### Editor
- Add/Edit products
- Add/Edit categories
- Reorder products and categories
- Cannot delete or change settings

### Guest
- Read all public data
- No authentication required
