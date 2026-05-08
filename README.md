# Shopy

An e-commerce shopping cart web application where users can browse products, manage a shopping cart, save favorites, and complete a checkout flow. Built as a single-page application with React and backed by a Node.js REST API with MongoDB.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| File Upload | Multer |

## Features

- Browse products with infinite scroll pagination
- Filter products by category and search by name
- View detailed product information on a dedicated page
- Add products to a shopping cart and adjust quantities
- Save products to a favorites list
- Checkout flow with shipping and payment form
- Product management page (create, edit, delete products with image upload)
- Responsive design for mobile and desktop
- Toast notifications for user actions
- Fallback image handling for broken image URLs
- Keyboard accessible (Escape to close drawers, tab navigation)

## CRUD Operations

| Operation | Resource | Endpoint |
|-----------|----------|----------|
| **Create** | Product | `POST /api/products` |
| **Read** | Products | `GET /api/products`, `GET /api/products/:id` |
| **Update** | Product | `PUT /api/products/:id` |
| **Delete** | Product | `DELETE /api/products/:id` |
| **Create** | Cart Item | `POST /api/cart` |
| **Read** | Cart | `GET /api/cart` |
| **Update** | Cart Item | `PUT /api/cart/:id` |
| **Delete** | Cart Item | `DELETE /api/cart/:id` |

## Folder Structure

```
project/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, ProductCard, CartDrawer)
│   │   ├── contexts/         # React Context providers (Cart, Favorites)
│   │   ├── hooks/            # Custom hooks (useCart, useProducts, useFavorites)
│   │   ├── pages/            # Route-level page components
│   │   ├── services/         # API client (all Axios calls)
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions (fallback image handler)
│   │   ├── App.tsx           # Root layout with Navbar, CartDrawer, Outlet
│   │   └── main.tsx          # Entry point with router and context providers
│   ├── index.html            # Single HTML entry point (SPA)
│   └── vite.config.ts        # Vite config with API proxy
├── server/                   # Express backend
│   ├── models/               # Mongoose schemas (Product, Cart, Favorite)
│   ├── routes/               # REST API route handlers
│   ├── uploads/              # Uploaded product images (gitignored)
│   └── index.ts              # Server entry point
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Setup

1. Clone the repository

2. Install dependencies
   ```
   cd client && npm install
   cd ../server && npm install
   ```

3. Configure environment variables
   ```
   cp server/.env.example server/.env
   ```
   Set `MONGO_URI` in `server/.env` to your MongoDB connection string.

4. Seed the database with sample products
   ```
   curl -X POST http://localhost:5001/api/products/seed
   ```

5. Start the development servers
   ```
   cd server && npm run dev
   cd client && npm run dev
   ```

6. Open `http://localhost:5173` in your browser

## Team

| Member | GitHub |
|--------|--------|
| forbid403 | [@forbid403](https://github.com/forbid403) |
| noey-bing | [@noey-bing](https://github.com/noey-bing) |

## Challenges Overcome

Building the cart state management across multiple pages required lifting the state into a React Context so that the Navbar badge, CartDrawer, and Checkout page all stay in sync without redundant API calls. The same pattern was applied to the favorites feature. Implementing infinite scroll with an IntersectionObserver required careful ref management to avoid stale closure issues with the loadMore callback. Handling image uploads involved coordinating multer on the server with a FormData request from the client, and setting up Vite's dev proxy to forward both `/api` and `/uploads` paths to the backend so uploaded images render correctly during development.
