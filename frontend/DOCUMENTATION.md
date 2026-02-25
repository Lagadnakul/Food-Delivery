# 🍔 HungerHive — Frontend Documentation

React 19 + Vite + Tailwind CSS + Shadcn UI frontend for the HungerHive food delivery platform.

---

## 📁 Folder Structure

```
frontend/
├── public/                        # Static assets served as-is
│
└── src/
    ├── App.jsx                    # Root component — router, providers, lazy-loaded routes
    ├── main.jsx                   # Entry point — renders <App /> into the DOM
    ├── index.css                  # Global styles, Tailwind directives, CSS variables
    ├── config.js                  # API URL, currency, and app-wide constants
    │
    ├── assets/                    # Images, icons, logos
    │   └── assets.js              # Central export of all image/asset references
    │
    ├── Pages/                     # Full-page route components (lazy-loaded)
    │   ├── Home.jsx               # Landing page — assembles HomeSection components
    │   ├── Menu.jsx               # Browse food menu with category filters & search
    │   ├── Checkout.jsx           # Multi-step checkout (address → payment → confirm)
    │   ├── OrderConfirmation.jsx  # Post-order success screen with order summary
    │   ├── RestaurantsPage.jsx    # Browse all restaurants with filters/search
    │   ├── RestaurantDetail.jsx   # Single restaurant menu with add-to-cart
    │   ├── Contact.jsx            # Contact form + map + FAQ
    │   ├── MobileApp.jsx          # "Download our app" marketing page
    │   └── Dashboard/             # Protected dashboard section (requires login)
    │       ├── ProfilePage.jsx    # Edit name, email, phone
    │       ├── OrdersPage.jsx     # Order history with status tracking
    │       ├── AddressesPage.jsx  # Manage saved delivery addresses
    │       └── FavoritesPage.jsx  # Saved favourite restaurants/items
    │
    ├── components/                # Reusable UI components (organized by feature)
    │   ├── Navbar/
    │   │   └── Navbar.jsx         # Top navigation bar with search, auth, cart button
    │   ├── Header/
    │   │   └── Header.jsx         # Alternative simpler header (used on some pages)
    │   ├── Footer/
    │   │   └── Footer.jsx         # Site footer with links and branding
    │   ├── HeroSection/
    │   │   └── HeroSection.jsx    # Home page hero banner with CTA buttons
    │   ├── SearchSection/
    │   │   └── SearchSection.jsx  # Search bar section on the home page
    │   ├── MenuCategories/
    │   │   └── MenuCategories.jsx # Horizontal category pill filter row
    │   ├── PopularRestaurants/
    │   │   └── PopularRestaurants.jsx # Home page restaurant card grid
    │   ├── Cart/
    │   │   ├── CartModal.jsx      # Slide-in cart sidebar (Shadcn Sheet)
    │   │   └── CartItem.jsx       # Individual item row inside the cart
    │   ├── LoginPopup/
    │   │   └── LoginPopup.jsx     # Login / Register modal dialog
    │   ├── Dashboard/
    │   │   └── DashboardLayout.jsx # Sidebar + content layout for dashboard pages
    │   ├── Address/
    │   │   └── AddressManager.jsx # Add/edit/delete addresses with form
    │   ├── Order/
    │   │   └── OrderCard.jsx      # Order history card with status badge
    │   ├── Payment/
    │   │   ├── PaymentForm.jsx    # Stripe card input form
    │   │   └── PaymentSummary.jsx # Order total breakdown before payment
    │   ├── Map/                   # Leaflet.js map components
    │   │   ├── DeliveryMap.jsx    # Real-time delivery tracking map
    │   │   ├── RestaurantMap.jsx  # Restaurant location pin map
    │   │   ├── LocationPicker.jsx # Address selection map
    │   │   └── MapWrapper.jsx     # SSR-safe Leaflet wrapper
    │   ├── SearchBar/
    │   │   └── SearchBar.jsx      # Standalone reusable search input component
    │   ├── UI/                    # Shadcn UI primitives (auto-generated, do not edit)
    │   │   ├── button.jsx         # Button component
    │   │   ├── card.jsx           # Card + CardHeader + CardContent
    │   │   ├── input.jsx          # Input field
    │   │   ├── badge.jsx          # Status badge
    │   │   ├── dialog.jsx         # Modal dialog
    │   │   ├── dropdown-menu.jsx  # Dropdown with keyboard navigation
    │   │   ├── sheet.jsx          # Slide-in panel (cart, mobile menu)
    │   │   ├── separator.jsx      # Horizontal divider
    │   │   ├── sonner.jsx         # Toast notification wrapper
    │   │   ├── label.jsx          # Form label
    │   │   ├── textarea.jsx       # Multi-line text input
    │   │   ├── radio-group.jsx    # Radio button group
    │   │   ├── select.jsx         # Dropdown select
    │   │   ├── tabs.jsx           # Tab panel navigation
    │   │   ├── skeleton.jsx       # Loading placeholder
    │   │   └── tooltip.jsx        # Hover tooltip
    │   └── common/                # Misc shared components
    │
    ├── contexts/                  # React Context providers (global state)
    │   ├── AuthContext.jsx        # Current user, login/logout state
    │   ├── CartContext.jsx        # Cart items, count, add/remove/clear
    │   └── MenuContext.jsx        # Food items and categories from the API
    │
    ├── hooks/                     # Custom React hooks
    │   ├── useOrders.js           # Manages order fetching, placing, cancelling with loading/error state
    │   └── useAuth.js             # Auth state helpers (isLoggedIn, user, token)
    │
    ├── services/                  # API call layer (all HTTP requests live here)
    │   ├── api.js                 # Axios instance with base URL + auth interceptor
    │   ├── authService.js         # register(), login(), logout(), getProfile()
    │   ├── orderService.js        # placeOrder(), getUserOrders(), cancelOrder()
    │   ├── paymentService.js      # createPaymentIntent(), verifyPayment()
    │   └── locationService.js     # geocodeAddress(), getNearbyRestaurants()
    │
    ├── utils/                     # Pure utility functions (no React)
    │   ├── animations.js          # Shared framer-motion variants (fadeUp, scalePop, etc.)
    │   ├── toastUtils.js          # showToast.success/error/warning/info wrappers (Sonner)
    │   ├── imageUtils.js          # Image URL helpers, fallback handling
    │   ├── calculateDistance.js   # Haversine distance calculation between coordinates
    │   └── fixLeafletIcon.js      # Fixes default Leaflet marker icons broken by Webpack
    │
    └── lib/
        └── utils.js               # Shadcn's cn() class-merge helper (clsx + tailwind-merge)
```

---

## 🔄 Data Flow

```
User Interaction (click, form submit)
    │
    ▼
Page / Component   ← calls custom hook or context
    │
    ▼
Context / Hook     ← manages local state (loading, error, data)
    │
    ▼
services/          ← makes HTTP request via api.js
    │
    ▼
api.js             ← Axios instance, auto-attaches Authorization header
    │
    ▼
Backend API        ← returns JSON response
    │
    ▼
Context updates state → Components re-render
```

---

## 🌐 Pages & Routes

| Route                     | Page                    | Protected | Description         |
| ------------------------- | ----------------------- | --------- | ------------------- |
| `/`                       | `Home.jsx`              | ❌        | Landing page        |
| `/menu`                   | `Menu.jsx`              | ❌        | Browse food menu    |
| `/restaurants`            | `RestaurantsPage.jsx`   | ❌        | All restaurants     |
| `/restaurants/:id`        | `RestaurantDetail.jsx`  | ❌        | Single restaurant   |
| `/checkout`               | `Checkout.jsx`          | ✅        | Multi-step checkout |
| `/order-confirmation/:id` | `OrderConfirmation.jsx` | ❌        | Post-order screen   |
| `/contact`                | `Contact.jsx`           | ❌        | Contact + FAQ       |
| `/mobile-app`             | `MobileApp.jsx`         | ❌        | App download page   |
| `/dashboard`              | `ProfilePage.jsx`       | ✅        | User dashboard      |
| `/dashboard/orders`       | `OrdersPage.jsx`        | ✅        | Order history       |
| `/dashboard/addresses`    | `AddressesPage.jsx`     | ✅        | Saved addresses     |
| `/dashboard/favorites`    | `FavoritesPage.jsx`     | ✅        | Saved favourites    |

> ✅ = requires login (redirects to `/` if not authenticated)

---

## 🗄️ State Management

| What           | Where            | How                                            |
| -------------- | ---------------- | ---------------------------------------------- |
| Logged-in user | `AuthContext`    | Stored in context + `localStorage`             |
| Auth token     | `AuthContext`    | `localStorage` key `token`                     |
| Cart items     | `CartContext`    | Context state (in-memory, reset on page close) |
| Food/menu data | `MenuContext`    | Fetched once on app mount, cached in context   |
| Order state    | `useOrders` hook | Local hook state per component                 |

---

## 🎨 Design System

| Layer             | Technology                       |
| ----------------- | -------------------------------- |
| CSS Framework     | Tailwind CSS v4                  |
| Component Library | Shadcn UI (Radix UI primitives)  |
| Icons             | Lucide React                     |
| Animations        | Framer Motion                    |
| Notifications     | Sonner (toast)                   |
| Maps              | Leaflet.js + react-leaflet       |
| Font              | System font stack (via Tailwind) |

**Brand Colours:**

- Primary: `orange-500` (#f97316)
- Hover: `orange-600` (#ea580c)
- Accent: `rose-500` / `pink-500` (gradients)
- Neutral: Tailwind `gray-*` scale

---

## 📦 Key Dependencies

| Package                     | Purpose                               |
| --------------------------- | ------------------------------------- |
| `react` + `react-dom`       | UI framework                          |
| `react-router-dom`          | Client-side routing                   |
| `axios`                     | HTTP requests                         |
| `@stripe/react-stripe-js`   | Stripe payment UI elements            |
| `framer-motion`             | Animations                            |
| `lucide-react`              | Icon library                          |
| `sonner`                    | Toast notifications                   |
| `leaflet` + `react-leaflet` | Interactive maps                      |
| `@radix-ui/*`               | Accessible UI primitives (via Shadcn) |
| `tailwind-merge` + `clsx`   | Conditional class merging             |

---

## ⚙️ Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:4000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint check
npm run lint
```

App runs on `http://localhost:5173` by default.

---

## 🏗️ Architecture Decisions

| Decision                                     | Reason                                                                  |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| **Route-level code splitting**               | Only loads the JS for the current page, improves initial load speed     |
| **Services layer**                           | All API calls centralised — easy to swap base URL or add auth headers   |
| **`api.js` interceptor**                     | Automatically attaches `Authorization: Bearer <token>` to every request |
| **Shadcn UI**                                | Accessible, customisable, no opinionated styles — works with Tailwind   |
| **Context API (no Redux)**                   | App state is simple enough — three contexts cover all global state      |
| **Framer Motion only at page/section level** | Keeps JS bundle small, avoids animating tiny elements                   |
| **Sonner (not react-toastify)**              | Smaller bundle, better design, native Shadcn integration                |
