# Shopy

An e-commerce shopping cart web application where users can register, browse products, manage a personal cart, and place orders. Admins can manage products and view all users' shopping carts. Built as a single-page application with React and backed by a Node.js REST API with MongoDB.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JWT, bcrypt |
| File Upload | Multer |

## Features

- User registration and login with JWT authentication
- Role-based access control (admin / user)
- Browse products with infinite scroll pagination
- Live search — filters the product list in real-time as the user types
- Filter products by category
- View detailed product information on a dedicated page
- Add products to a personal cart and adjust quantities
- Save products to a favorites list
- Checkout flow that creates a saved order record
- Order history page showing past purchases
- User profile page
- Admin dashboard — view all users and their order history
- Product management page — create, edit, delete products with image upload
- Responsive design for mobile and desktop
- Toast notifications for user actions
- Fallback image handling for broken image URLs

## CRUD Operations

| Entity | Operation | Endpoint |
|--------|-----------|----------|
| **User** | Create | `POST /api/auth/register` |
| **User** | Read | `GET /api/admin/users` |
| **User** | Delete | `DELETE /api/admin/users/:id` |
| **Product** | Create | `POST /api/products` |
| **Product** | Read | `GET /api/products`, `GET /api/products/:id` |
| **Product** | Update | `PUT /api/products/:id` |
| **Product** | Delete | `DELETE /api/products/:id` |
| **Cart** | Create | `POST /api/cart` |
| **Cart** | Read | `GET /api/cart` |
| **Cart** | Update | `PUT /api/cart/:id` |
| **Cart** | Delete | `DELETE /api/cart/:id` |
| **Order** | Create | `POST /api/orders` |
| **Order** | Read | `GET /api/orders` |

## Folder Structure

```
project/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.tsx      # Top nav with auth state and cart badge
│   │   │   ├── CartDrawer.tsx  # Slide-out cart panel
│   │   │   ├── ProductCard.tsx # Product grid item
│   │   │   └── ProtectedRoute.tsx # Redirects unauthenticated users
│   │   ├── contexts/           # React Context providers
│   │   │   ├── AuthContext.tsx # Current user, login, logout, register
│   │   │   ├── CartContext.tsx # Cart state synced with backend
│   │   │   └── FavoritesContext.tsx
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── useCart.ts
│   │   │   ├── useProducts.ts
│   │   │   └── useFavorites.ts
│   │   ├── pages/              # Route-level page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── OrderHistoryPage.tsx
│   │   │   ├── FavoritesPage.tsx
│   │   │   ├── ManageProductsPage.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── services/
│   │   │   └── api.ts          # All Axios calls with auth interceptor
│   │   ├── types/              # TypeScript interfaces
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── fallbackImage.ts
│   ├── index.html              # Single HTML entry point (SPA)
│   └── vite.config.ts
├── server/                     # Express backend
│   ├── middleware/
│   │   ├── auth.ts             # JWT verification, attaches req.user
│   │   └── requireAdmin.ts     # Role guard for admin-only routes
│   ├── models/                 # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Cart.ts
│   │   ├── Favorite.ts
│   │   └── Order.ts
│   ├── routes/                 # REST API route handlers
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── favorites.ts
│   │   ├── orders.ts
│   │   ├── admin.ts
│   │   └── upload.ts
│   └── index.ts                # Server entry point
├── database/                   # MongoDB collection exports
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
   Set `MONGO_URI` and `JWT_SECRET` in `server/.env`.

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

### Default Admin Account

After seeding, create an account then manually set `role: "admin"` in MongoDB, or use the seeded admin:
- Email: `admin@shopy.com`
- Password: `admin1234`

## Team & Workload Allocation

This project was initially developed by forbid403 as Assignment 1. For Assignment 2, noey-bing and CokanZero joined the team to extend the application with user authentication, per-user cart and favorites, order management, and an admin dashboard.


| Member | GitHub | Responsibilities |
|--------|--------|-----------------|
| forbid403 | [@forbid403](https://github.com/forbid403) | Authentication backend + frontend |
| noey-bing | [@noey-bing](https://github.com/noey-bing) | Cart ownership, favorites, admin dashboard |
| CokanZero | [@CokanZero](https://github.com/CokanZero) | Orders, profile, routing, README, DB export |

### forbid403

| File | Description |
|------|-------------|
| `server/models/User.ts` | User schema with bcrypt password hashing |
| `server/routes/auth.ts` | Register and login endpoints |
| `server/middleware/auth.ts` | JWT verification middleware |
| `server/middleware/requireAdmin.ts` | Admin role guard |
| `client/src/contexts/AuthContext.tsx` | Auth state, login, logout, register |
| `client/src/pages/LoginPage.tsx` | Login form |
| `client/src/pages/RegisterPage.tsx` | Registration form |
| `client/src/components/ProtectedRoute.tsx` | Auth-gated route wrapper |
| `client/src/components/Navbar.tsx` | Auth state in nav (login/logout button) |
| `client/src/services/api.ts` | Axios auth interceptor |

### noey-bing

| File | Description |
|------|-------------|
| `server/models/Cart.ts` | Added userId field for per-user cart |
| `server/routes/cart.ts` | Auth-scoped cart routes |
| `server/models/Favorite.ts` | Added userId field |
| `server/routes/favorites.ts` | Auth-scoped favorites routes |
| `server/routes/admin.ts` | Admin endpoints (list users, list all orders) |
| `client/src/pages/AdminPage.tsx` | Admin dashboard UI |
| `client/src/hooks/useCart.ts` | Cart hook update for auth |
| `client/src/contexts/CartContext.tsx` | Cart context update for auth |

### CokanZero

| File | Description |
|------|-------------|
| `server/models/Order.ts` | Order schema |
| `server/routes/orders.ts` | Order creation and history endpoints |
| `client/src/pages/OrderHistoryPage.tsx` | User order history page |
| `client/src/pages/ProfilePage.tsx` | User profile page |
| `client/src/pages/CheckoutPage.tsx` | Updated to create order on submit |
| `client/src/App.tsx` | Route definitions for new pages |
| `client/src/main.tsx` | Context provider wiring |
| `client/src/types/index.ts` | User and Order type definitions |
| `client/src/pages/HomePage.tsx` | Guest login prompt |
| `database/` | MongoDB collection exports |
