# Admin Panel — Documentation

> **Tech Stack**: React 19 · Vite · Tailwind CSS · Recharts · React Router v7 · Axios · React Toastify

---

## Quick Start

```bash
# 1. Install dependencies (first time only)
cd admin && npm install

# 2. Start dev server
npm run dev          # → http://localhost:5173

# Prerequisites: backend must be running on port 4000
```

### Admin Login Credentials

| Field    | Value                         |
| -------- | ----------------------------- |
| Email    | `admin@example.com`           |
| Password | `password123`                 |
| URL      | `http://localhost:5173/login` |

---

## Environment Variables

File: `admin/.env.local`

```env
VITE_API_URL=http://localhost:4000
```

> Vite requires the `VITE_` prefix for variables to be accessible in the browser via `import.meta.env.VITE_API_URL`.

---

## Project Structure

```
admin/
├── .env.local                  # VITE_API_URL = backend base URL
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx                # Entry: wraps App in BrowserRouter
    ├── App.jsx                 # Routing (Login public, rest protected)
    ├── index.css               # Global Tailwind base styles
    │
    ├── assets/
    │   └── assets.js           # Exports logo, icons, and `url` constant
    │
    ├── contexts/
    │   └── AuthContext.jsx     # Admin auth state (login, logout, token)
    │
    ├── services/
    │   ├── api.js              # Axios instance with baseURL + interceptors
    │   ├── authService.js      # adminLogin() → POST /user/admin/login
    │   ├── foodService.js      # listFood, addFood, removeFood
    │   └── orderService.js     # listOrders, updateOrderStatus
    │
    ├── components/
    │   ├── ProtectedRoute.jsx  # Redirects to /login if not authenticated
    │   ├── Navbar/
    │   │   └── Navbar.jsx      # Top bar: logo, real admin name, logout
    │   ├── Sidebar/
    │   │   └── Sidebar.jsx     # Navigation: Dashboard, Add, Food Items, Orders
    │   ├── Charts/
    │   │   └── Charts.jsx      # RevenueChart, OrdersBarChart, CategoryPieChart
    │   └── UI/                 # Shared UI primitives (cards, badges, etc.)
    │
    └── pages/
        ├── Login/
        │   └── Login.jsx       # Public login form with email + password
        ├── Dashboard/
        │   └── Dashboard.jsx   # Stats cards + 3 live charts + recent orders
        ├── Add/
        │   └── Add.jsx         # Add new food item (drag-drop image upload)
        ├── List/
        │   └── List.jsx        # View, search, filter, delete food items
        └── Orders/
            └── Orders.jsx      # View, filter, update status of all orders
```

---

## Pages

### `/login` — Login

- Public route (no auth required)
- Calls `POST /user/admin/login` — returns 403 if account is not admin
- On success: saves `adminToken` + `adminUser` to `localStorage`, redirects to `/dashboard`
- Show/hide password toggle

### `/dashboard` — Dashboard

- **Stats cards**: Total Orders, Total Revenue, Food Items, Pending Orders
- **Revenue Chart** (area): last 7 days of revenue
- **Orders by Status** (bar): Pending / Processing / Out for Delivery / Delivered
- **Menu by Category** (donut): breakdown of food items by category
- **Recent Orders** list (last 5)
- **Quick Actions** panel: links to Add, List, Orders

### `/add` — Add Food Item

- Fields: Name, Price, Category (dropdown), Description, Image (drag-and-drop or click)
- Submits as `multipart/form-data` to `POST /food/add`
- After success: form resets automatically

### `/list` — Food Items

- Fetches from `GET /food/list`
- Search by name or description
- Filter by category (auto-populated from data)
- Inline delete confirmation modal
- Food images served via **ImageKit CDN** (stored as full URLs in MongoDB)

### `/orders` — Orders

- Fetches from `GET /orders`
- **Stats**: Total, Pending, Processing, Out for Delivery, Delivered
- Filter by status tabs
- Search by customer name or phone
- Per-order status dropdown → calls `PATCH /orders/:id/status`

---

## Authentication Flow

```
User visits /dashboard
       ↓
ProtectedRoute checks AuthContext.admin
       ↓
No admin? → Redirect /login
       ↓
Login form → POST /user/admin/login
       ↓
Backend checks user.isAdmin === true
       ↓
Returns JWT token + { name, email }
       ↓
Stored in localStorage as adminToken + adminUser
       ↓
All future API calls attach token via Axios interceptor
```

### Creating / Granting Admin Access

Run this **once** from the `/backend` directory to give a registered user admin rights:

```bash
node --input-type=module --env-file=.env.local - <<'EOF'
import mongoose from 'mongoose';
import userModel from './models/userModel.js';
await mongoose.connect(process.env.MONGODB_URI);
const user = await userModel.findOneAndUpdate(
  { email: 'your@email.com' },
  { isAdmin: true },
  { new: true }
);
console.log(user ? `✅ ${user.email} is now admin` : '❌ User not found');
process.exit(0);
EOF
```

---

## API Service Layer

All data fetching goes through `src/services/` — never raw axios in components:

| Service        | Function                        | Method | Endpoint             |
| -------------- | ------------------------------- | ------ | -------------------- |
| `authService`  | `adminLogin(email, pwd)`        | POST   | `/user/admin/login`  |
| `foodService`  | `listFood()`                    | GET    | `/food/list`         |
| `foodService`  | `addFood(formData)`             | POST   | `/food/add`          |
| `foodService`  | `removeFood(id)`                | POST   | `/food/remove`       |
| `orderService` | `listOrders()`                  | GET    | `/orders`            |
| `orderService` | `updateOrderStatus(id, status)` | PATCH  | `/orders/:id/status` |

The `api.js` Axios instance:

- `baseURL` = `import.meta.env.VITE_API_URL`
- `timeout` = 15 seconds
- **Request interceptor**: attaches `Authorization: Bearer <adminToken>` from localStorage
- **Response interceptor**: unwraps `error.response.data.message` for clean error messages

---

## Order Status Values

| Status             | Display Color | Meaning                         |
| ------------------ | ------------- | ------------------------------- |
| `pending`          | Gray          | Newly placed, not yet processed |
| `Food Processing`  | Yellow        | Kitchen is preparing the order  |
| `Out for Delivery` | Blue          | On the way to the customer      |
| `Delivered`        | Green         | Successfully delivered          |

---

## Scripts

```bash
npm run dev      # Start Vite dev server (HMR enabled)
npm run build    # Build production bundle → dist/
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```
