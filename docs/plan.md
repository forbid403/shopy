# Implementation Plan

## Current Status

- [x] Project scaffolded (React + Vite + TypeScript, Express + TypeScript)
- [x] Tailwind CSS v4 configured
- [x] Mongoose models: `Product`, `CartItem`
- [x] REST API: `GET/POST /api/products`, `GET/POST/PUT/DELETE /api/cart`
- [x] Seed route: `POST /api/products/seed`
- [x] Client components: `Navbar`, `ProductCard`, `CartDrawer`
- [x] Hooks: `useProducts`, `useCart`
- [x] Category filter + search bar
- [x] Skeleton loading UI
- [x] Error state UI

---

## Remaining Tasks

### 1. UX Polish
- [ ] Toast notification when item is added to cart (e.g. react-hot-toast)
- [ ] Optimistic UI update on quantity change (no lag feel)
- [ ] Animate cart item count badge on change
- [ ] "Back to top" scroll behavior after filter change

### 2. Cart Improvements
- [ ] Show cart error inline inside CartDrawer (not just hook state)
- [ ] Disable checkout button (placeholder — no payment flow needed)

### 3. Server Hardening
- [ ] Validate request body fields in cart routes (missing fields → 400)
- [ ] Validate ObjectId format before DB query (invalid id → 400)

### 4. Deployment
- [ ] Set up MongoDB Atlas free cluster, export connection string
- [ ] Deploy server to Render (free plan, Node environment)
  - Set env vars: `MONGO_URI`, `PORT`
- [ ] Deploy client to Vercel
  - Set env var or hardcode Render server URL via `VITE_API_URL`
  - Update `vite.config.ts` proxy → use `VITE_API_URL` in `api.ts` for production
- [ ] Verify all CRUD operations work on deployed app

### 5. Database Export
- [ ] Export seed data as `database/products.json` for submission

### 6. README
- [ ] Project title + problem summary
- [ ] Tech stack table (frontend / styling / routing / data / deployment)
- [ ] Feature list (bullet points)
- [ ] Folder structure diagram
- [ ] Challenges section (4–5 sentences)

---

## Deployment Architecture

```
Browser
  └─> Vercel (React SPA)
        └─> Render (Express API)
              └─> MongoDB Atlas
```

## Priority Order

1. Toast notifications (UX — rubric: interaction feedback)
2. Server validation (rubric: error handling & security)
3. Deployment setup
4. Database export
5. README
