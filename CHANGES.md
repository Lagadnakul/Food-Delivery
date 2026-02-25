# 📋 Changes Made to Food-Delivery Project

> All changes were made by **Aayush Vaghela** on top of the original project by [Nakul Lagad](https://github.com/Lagadnakul/Food-Delivery).
> Date: **February 25, 2026**

---

## 🔴 Admin Panel — Full Rebuild & Backend Connection

The admin panel was not connected to the backend at all. All service files were empty and `.env.local` had invalid syntax.

### New Files Created

| File                                      | Purpose                                                          |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `admin/src/services/api.js`               | Axios instance with `baseURL`, timeout, auth token interceptor   |
| `admin/src/services/authService.js`       | `adminLogin()` function                                          |
| `admin/src/services/foodService.js`       | `listFood`, `addFood`, `removeFood`                              |
| `admin/src/services/orderService.js`      | `listOrders`, `updateOrderStatus`                                |
| `admin/src/contexts/AuthContext.jsx`      | Admin auth state (login, logout, localStorage persistence)       |
| `admin/src/components/ProtectedRoute.jsx` | Redirects unauthenticated users to `/login`                      |
| `admin/src/components/Charts/Charts.jsx`  | 3 charts: Revenue (area), Orders by Status (bar), Category (pie) |
| `admin/src/pages/Login/Login.jsx`         | Beautiful admin login page                                       |
| `admin/DOCUMENTATION.md`                  | Full admin panel documentation                                   |

### Modified Files

| File                                      | What Changed                                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `admin/.env.local`                        | Fixed invalid JS syntax → correct `VITE_API_URL=http://localhost:4000`                            |
| `admin/src/App.jsx`                       | Added `AuthProvider`, `ProtectedRoute`, `/login` public route                                     |
| `admin/src/components/Navbar/Navbar.jsx`  | Shows real admin name from auth, working logout button                                            |
| `admin/src/pages/Dashboard/Dashboard.jsx` | Uses `foodService` + `orderService`, added 3 live charts                                          |
| `admin/src/pages/Orders/Orders.jsx`       | Fixed double `/api/` URL bug, fixed PATCH route for status update, added "Pending" status support |
| `admin/src/pages/List/List.jsx`           | Fixed food image URLs (ImageKit CDN), uses service layer                                          |
| `admin/src/pages/Add/Add.jsx`             | Fixed temporal dead zone crash, uses `foodService.addFood()`, removed duplicate Toast             |

---

## 🟡 Backend — New Features & Fixes

### New Files Created

| File                                          | Purpose                                                |
| --------------------------------------------- | ------------------------------------------------------ |
| `backend/middleware/error-handler.js`         | Global error handler + `asyncHandler` wrapper          |
| `backend/middleware/logger.middleware.js`     | HTTP request logging                                   |
| `backend/middleware/rate-limit.middleware.js` | Rate limiting to prevent abuse                         |
| `backend/services/`                           | Service layer (foodService, orderService, userService) |
| `backend/utils/`                              | Error classes (ValidationError, NotFoundError, etc.)   |
| `backend/scripts/makeAdmin.js`                | Script to grant admin rights to a user by email        |
| `backend/DOCUMENTATION.md`                    | Full backend documentation                             |

### Modified Files

| File                                     | What Changed                                                         |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `backend/models/userModel.js`            | Added `isAdmin: Boolean` field                                       |
| `backend/routes/userRoute.js`            | Added `POST /user/admin/login` endpoint (rejects non-admin with 403) |
| `backend/controllers/foodController.js`  | Refactored to use service layer                                      |
| `backend/controllers/orderController.js` | Refactored to use service layer                                      |
| `backend/controllers/userController.js`  | Refactored to use service layer                                      |
| `backend/middleware/authMiddleware.js`   | Improved error handling                                              |
| `backend/config/db.js`                   | Better error handling                                                |
| `backend/server.js`                      | Added rate limiting, request logger, error handler middleware        |

---

## 🟢 Frontend — Bug Fixes & Improvements

### New Files Created

| File                               | Purpose                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| `frontend/src/components/UI/`      | 14 Shadcn/ui components (badge, card, dialog, dropdown-menu, input, label, etc.) |
| `frontend/src/utils/animations.js` | Shared Framer Motion animation presets                                           |
| `frontend/src/hooks/useOrders.js`  | Custom hook for order fetching                                                   |
| `frontend/src/lib/`                | Utility functions                                                                |
| `frontend/DOCUMENTATION.md`        | Full frontend documentation                                                      |
| `frontend/design-system/`          | Design tokens reference                                                          |

### Modified Files

| File                                             | What Changed                                                  |
| ------------------------------------------------ | ------------------------------------------------------------- |
| `frontend/src/services/api.js`                   | Centralized axios instance with token interceptor             |
| `frontend/src/Pages/Dashboard/AddressesPage.jsx` | Replaced raw axios with `api.js` service                      |
| `frontend/src/components/Navbar/Navbar.jsx`      | Added `aria-label` to cart button                             |
| `frontend/src/Pages/Contact.jsx`                 | Fixed smart-quote parse errors in FAQ section                 |
| `frontend/src/contexts/AuthContext.jsx`          | Improved token handling                                       |
| `frontend/src/contexts/CartContext.jsx`          | Bug fixes                                                     |
| `frontend/src/index.css`                         | Tailwind + design system tokens                               |
| `frontend/src/App.jsx`                           | Route structure improvements                                  |
| Various pages                                    | ESLint fixes (unused `motion` imports, `Icon` variable usage) |

---

## 🐛 Key Bugs Fixed

| Bug                                                                               | Where          | Fix                                                               |
| --------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------- |
| Admin `.env.local` had `import.meta.env.VITE_API_URL =` (invalid JS)              | Admin          | Changed to `VITE_API_URL=http://localhost:4000`                   |
| All 3 admin service files were **empty**                                          | Admin services | Implemented all functions                                         |
| Orders fetched from wrong URL: `/api/order/list` (double `/api/`)                 | `Orders.jsx`   | Fixed to `GET /orders`                                            |
| Status update used `POST /api/order/status` instead of `PATCH /orders/:id/status` | `Orders.jsx`   | Fixed HTTP method and path                                        |
| Food images hardcoded as `localhost:4000/uploads/`                                | `List.jsx`     | Fixed to use ImageKit CDN URL from DB                             |
| Duplicate `<ToastContainer>` in every page + `App.jsx`                            | 4 files        | Kept only in `App.jsx`                                            |
| `Cannot access 'handleFileSelection' before initialization` crash                 | `Add.jsx`      | Reordered `useCallback` definitions                               |
| Orders showed "No orders found" even with data                                    | `Orders.jsx`   | Fixed `matchesSearch` to short-circuit when `searchTerm` is empty |
| Smart-quote apostrophes `'` breaking JSX parse                                    | `Contact.jsx`  | Replaced with standard quotes                                     |

---

## ⚠️ Admin Credentials Set Up

```
Email:    admin@example.com
Password: password123
URL:      http://localhost:5173/login
```

The existing `admin@example.com` account in MongoDB was updated with `isAdmin: true`.

---

## 🚀 How to Push to GitHub

Since you cloned from your friend's repo `https://github.com/Lagadnakul/Food-Delivery`, here are your options:

### Option A — Push to a New Branch (Recommended if you don't have write access)

```bash
# 1. Create a new branch for your changes
git checkout -b aayush/admin-fixes-and-improvements

# 2. Stage all your changes
git add .

# 3. Commit with a descriptive message
git commit -m "feat: admin auth, charts, backend fixes, frontend improvements

- Add admin login with JWT auth system + ProtectedRoute
- Fix admin panel API connections (empty service files, wrong URLs)
- Add 3 recharts dashboard charts (Revenue, Orders, Category)
- Add isAdmin field to userModel + /user/admin/login endpoint
- Fix orders status display (pending support, filter bug)
- Fix food image URLs (ImageKit CDN)
- Add shadcn/ui components to frontend
- Add DOCUMENTATION.md for admin, backend, frontend
- Fix 7 critical bugs across admin panel"

# 4. Push to your fork (or origin if you have write access)
git push origin aayush/admin-fixes-and-improvements
```

Then go to `https://github.com/Lagadnakul/Food-Delivery` and click **"Compare & pull request"** to open a PR for your friend to review and merge.

### Option B — Push Directly to Main (Only if your friend gave you write access)

```bash
git add .
git commit -m "feat: admin auth, charts, backend fixes, frontend improvements"
git push origin main
```

### Option C — Fork First (if you don't have any access)

```bash
# 1. Fork the repo on GitHub (click Fork button on github.com/Lagadnakul/Food-Delivery)

# 2. Add your fork as a remote
git remote add my-fork https://github.com/YOUR_USERNAME/Food-Delivery.git

# 3. Push to your fork
git add .
git commit -m "feat: admin auth, charts, backend fixes"
git push my-fork main

# 4. Open a Pull Request from your fork → original repo on GitHub
```

### ⚠️ Before Pushing — Remove Secrets

Make sure these files are in `.gitignore` and NOT committed:

```
backend/.env
backend/.env.local      ← contains DB password, JWT secret
admin/.env.local        ← only has localhost URL, safe to push
```

Check with:

```bash
git diff --cached --name-only | grep .env
```

If `.env` files appear, run:

```bash
git restore --staged backend/.env backend/.env.local
echo "backend/.env.local" >> .gitignore
```
