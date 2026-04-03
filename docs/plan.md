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
- [x] Toast notifications (react-hot-toast)
- [x] Server-side request validation + ObjectId validation
- [x] `VITE_API_URL` env var for production API base URL

---

## Remaining Tasks

### 1. UX Polish (Rubric: Presentation & UX — 10pts)
- [x] Optimistic UI update on quantity change (no visible lag)
- [x] Animate cart item count badge on change (scale bounce)
- [x] Scroll to top on category/filter change
- [x] Add keyboard accessibility: focus rings, Escape to close cart drawer
- [x] Ensure sufficient color contrast ratios (text vs background)
- [x] Add subtle transitions: product grid items fade-in on load

### 2. Cart Improvements (Rubric: Business Logic — 10pts)
- [ ] Show cart-specific error messages inline in CartDrawer
- [ ] Disable or label checkout button as placeholder (no payment flow)
- [ ] Show item subtotals and item count summary in cart footer

### 3. Deployment (Rubric: indirect — needed for demo)
- [ ] Set up MongoDB Atlas free cluster
- [ ] Deploy server to Render (env vars: `MONGO_URI`, `PORT`)
- [ ] Deploy client to Vercel (env var: `VITE_API_URL`)
- [ ] Verify all CRUD operations work end-to-end on deployed app

### 4. Database Export (Rubric: submission requirement)
- [ ] Export seed data as `database/products.json`

### 5. README (Rubric: README — 6pts)
- [ ] Project title
- [ ] Problem summary (what this app solves)
- [ ] Tech stack breakdown (frontend, styling, routing, data, deployment)
- [ ] Feature list (bullet points)
- [ ] Folder structure diagram
- [ ] Challenges overcome (4-5 sentences)

---

## Rubric Checklist

| Criteria | Points | Status |
|---|---|---|
| Single-Page Application | 3 | Done — one index.html, React SPA |
| All CRUD Operations | 4 | Done — POST/GET/PUT/DELETE on cart |
| Business Logic | 10 | Mostly done, minor polish needed |
| Presentation & UX | 10 | Core done, needs accessibility + animations |
| README | 6 | Not started |
| Code Quality | 6 | Good — organized folders, validation, error handling |
| In-person Q&A | 1 | N/A (in tutorial) |

## Deployment Architecture

```
Browser
  └─> Vercel (React SPA)
        └─> Render (Express API)
              └─> MongoDB Atlas
```

## Priority Order

1. **README** (6pts, currently 0 — highest ROI)
2. **UX polish** (animations, accessibility — rubric explicitly checks these)
3. **Database export** (submission requirement)
4. **Deployment** (needed for demo)
5. **Cart improvements** (minor business logic polish)
