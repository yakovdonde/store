# Judaica Store - Frontend

Next.js 14 storefront and admin dashboard for the Judaica Store platform.

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── storefront/         # Public storefront pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/             # Reusable React components
├── lib/
│   ├── apiClient.ts        # Axios instance with interceptors
│   ├── cart.ts             # Cart management (localStorage)
│   └── config.ts           # Environment configuration
└── styles/                 # Additional stylesheets
```

## Features

- **App Router:** Next.js 14 with the app directory
- **TypeScript:** Full type safety
- **Cart Management:** Client-side cart using localStorage
- **API Integration:** Axios client with JWT auth support
- **Admin & Storefront:** Separate routing for both

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update with your backend API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
