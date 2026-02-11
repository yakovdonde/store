# Product Requirements Document (PRD): Judaica Store Platform

## 1. Executive Summary

**Project Goal:** To build a specialized, highly visual e-commerce and inventory management platform for a Judaica store. The platform will allow administrators to manage ritual items, books, and art, while providing guests with a seamless browsing and "wishlist-style" cart experience.

**Status:** ✅ Production Ready (Core features complete, deployment config in place)

## 2. User Roles

- **Super Admin (Owner):** Full control over site branding, team management, and all inventory.
- **Admin (Editor):** Can manage products and categories but cannot change site-wide settings or manage other users.
- **Guest (User):** Public visitors who can browse the catalog and add items to a local cart.

## 3. Functional Requirements

### 3.1 Admin Features (Management Suite)

#### User Management:
- **Status:** ✅ Completed
- Invite other admins/editors via email (manual creation supported).
- Revoke access for any user (status control).
- Role-based permissions (Owner vs. Editor).

#### Category Management:
- **Status:** ✅ Completed
- Create/Edit/Delete categories.
- **Multi-language Support:** Set category names in English, Russian, Hebrew, and Azerbaijani.
- **Global Sorting:** Index-based reordering of categories on the main page.
- **Sub-categories:** Parent/child category support implemented.

#### Product Management:
- **Status:** ✅ Completed
- **Fields:** Image upload, Title, Price, and Rich-text Description.
- **Assignment:** Map products to one or multiple categories.
- **Internal Sorting:** Order items within a specific category.

#### Storefront Customization:
- **Status:** ✅ Completed
- **Header:** Upload hero banner image, site title, and store description.
- **Footer:** Edit contact information (Address, Phone, Email, WhatsApp).

### 3.2 Guest Features (The Storefront)

#### Browsing:
- **Status:** ✅ Completed
- View the main page with branding (Banner/Title/Description).
- Navigate through the 6 core Judaica categories (Ritual Objects, Shabbat, Holiday, Lifecycle, Books, Art).
- **Multi-language Support:** Browse in English, Russian, or Hebrew with localized category names.
- Deep-dive into specific product pages with high-res imagery and pricing.

#### The Cart Experience:
- **Status:** ✅ Completed
- **Add to Cart:** Save items without needing an account.
- **Persistence:** Cart contents are saved via browser storage (Local Storage) so items remain if the user returns later.
- **Manage Cart:** Update quantities or remove items.
- **Subtotal:** View a running total of the items selected.

## 4. Information Architecture (Default Categories)

1. **Ritual Objects:** Tallit, Tefillin, Mezuzot, Kippot.
2. **Shabbat Essentials:** Candlesticks, Challah Gear, Kiddush Cups, Havdalah Sets.
3. **Holiday-Specific:** Passover, Hanukkah, Rosh Hashanah, Sukkot.
4. **Lifecycle & Simcha:** Brit Milah, Bar/Bat Mitzvah, Wedding.
5. **Books & Media:** Sacred Texts, Educational, Children's Corner.
6. **Art & Home Decor:** Hamsas, Home Blessings, Jewelry.

## 5. Technical Specifications

### 5.1 Database Schema (Relational)

- **users:** ID, email, password_hash, role (owner/editor), status. ✅ CREATED
- **categories:** ID, name, name_en, name_ru, name_he, name_az, description, parent_id, order_index. ✅ CREATED
- **products:** ID, title, description, price, image_url, category_id, item_order_index. ✅ CREATED
- **store_settings:** ID, site_title, banner_url, top_description, contact_info. ✅ CREATED

### 5.2 Performance & Security

- **Persistence:** Use localStorage for the guest cart to ensure data survives page refreshes. ✅ Implemented
- **Image Optimization:** Serve images in .webp format for fast loading of high-detail silver/art items. ✅ Implemented
- **Authentication:** JWT-based login for Admins to ensure secure management. ✅ IMPLEMENTED

## 6. UI/UX Requirements

- **The "Main Page" Grid:** Categories should be clearly separated. If a holiday is approaching, the Admin can move that category to the top. ✅ Implemented
- **Sticky Header:** The cart icon and main category links should stay at the top as the user scrolls. ✅ Implemented
- **Mobile-First Design:** The product grid must be highly legible on mobile devices, as most gift shopping is done on-the-go. ✅ Implemented
- **Contact CTA:** Since Judaica often requires consultation (e.g., checking a scroll's size), the "Contact" or "WhatsApp" button should be easily accessible from the product page. ✅ Implemented

## 7. Success Metrics

- **Admin Efficiency:** Time to add/categorize a new item should be under 1 minute.
- **Engagement:** Guest "Add to Cart" rate.
- **Speed:** Main page load time under 1.5 seconds.

---

## 8. Implementation Progress

### ✅ Completed Tasks

1. **Project Infrastructure**
   - Docker setup (PostgreSQL, Backend, Frontend)
   - Database migrations and schema creation
   - Default categories seeded
   - Sample products loaded

2. **Authentication & Authorization**
   - JWT-based auth system implemented
   - Login endpoint (`POST /api/auth/login`)
   - Register endpoint (`POST /api/auth/register`)
   - Token refresh endpoint (`POST /api/auth/refresh`)
   - Default admin user created (admin@store.local / admin123)
   - Auth context with global state management
   - Protected routes for admin area

3. **Frontend Core**
   - Next.js 13+ setup with App Router
   - Admin dashboard layout
   - Navigation component with logout
   - CSS Module fixes
   - Auth context provider integrated into root layout

4. **Admin Dashboard**
   - Login page with clean UI
   - Dashboard overview
   - Navigation menu
   - Logout functionality with user email display

5. **Admin Panel - Product Management**
   - Full CRUD operations (Create, Read, Update, Delete)
   - API integration with backend
   - Real-time product list
   - Category assignment UI
   - Product form with validation
   - Error handling and loading states

6. **Admin Panel - Category Management**
   - Full CRUD operations for categories
   - Drag-and-drop equivalent (up/down reordering)
   - Display order management
   - Real-time category updates

7. **Admin Panel - Storefront Settings**
   - Store title customization
   - Hero description editing
   - Banner image URL management
   - Contact information (address, phone, email, WhatsApp)
   - Real-time settings persistence

8. **Guest Storefront - Browsing**
   - Main storefront page
   - Category grid display with navigation
   - Product listing by category
   - Product detail pages
   - Real-time data from backend
   - Responsive design

9. **Shopping Cart System**
   - Add to cart functionality
   - LocalStorage persistence
   - Cart sidebar with items
   - Quantity management
   - Item removal
   - Subtotal calculation
   - Cart item count in header

### 🔄 In Progress

1. **Testing Framework**
   - Jest + Supertest setup
   - Basic API test coverage

### ⏳ To Do

1. **Testing & Quality**
   - Expand unit test coverage
   - Integration tests
   - E2E testing

---

## 9. Current Development Credentials

**Admin Login:**
- Email: `admin@store.local`
- Password: `admin123`
- Access URL: `http://localhost:3000/login`

**API Base URL:** `http://localhost:3001/api`
