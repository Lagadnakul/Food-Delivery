# 🍔 HungerHive — Backend Documentation

Node.js + Express REST API powering the HungerHive food delivery platform.

---

## 📁 Folder Structure

```
backend/
├── config/                  # External service configurations
│   ├── db.js                # MongoDB connection setup
│   └── imagekit.js          # ImageKit CDN client setup
│
├── controllers/             # Request handlers (thin layer — business logic lives in services/)
│   ├── foodController.js    # Get food items, categories
│   ├── locationController.js# Geocoding & nearby restaurants
│   ├── orderController.js   # Place, get, update orders
│   ├── paymentController.js # Payment intent creation & webhook
│   └── userController.js    # Register, login, profile, addresses
│
├── middleware/              # Express middleware (runs before controllers)
│   ├── authMiddleware.js    # JWT verification — protects private routes
│   ├── error-handler.js     # Global error handler (catches all thrown errors)
│   ├── imageUpload.js       # Multer + ImageKit upload pipeline
│   ├── logger.middleware.js # HTTP request logger (dev/prod)
│   └── rate-limit.middleware.js # Rate limiting to prevent abuse
│
├── models/                  # Mongoose database schemas
│   ├── foodModel.js         # Food item schema (name, price, image, category)
│   ├── orderModel.js        # Order schema (items, user, status, payment)
│   └── userModel.js         # User schema (name, email, password hash, addresses)
│
├── routes/                  # Express route definitions — maps URL → controller
│   ├── foodRoute.js         # GET /api/food — list foods/categories
│   ├── locationRoute.js     # GET /api/location — geocoding & nearby search
│   ├── orderRoute.js        # POST/GET /api/orders — CRUD for orders
│   ├── paymentRoute.js      # POST /api/payment — Stripe payment flow
│   └── userRoute.js         # POST /api/user — auth & profile management
│
├── services/                # Business logic (called by controllers)
│   ├── foodService.js       # Fetch & filter food/restaurant data from DB
│   ├── orderService.js      # Order creation, status updates, validation
│   └── userService.js       # Auth (JWT), password hashing, address management
│
├── utils/
│   └── errors.js            # Custom error classes (AppError, ValidationError, etc.)
│
├── server.js                # App entry point — Express setup, middleware, routes
├── package.json             # Dependencies and npm scripts
├── .env.local               # Environment variables (never commit this!)
├── vercel.json              # Vercel deployment config
└── render.yaml              # Render.com deployment config
```

---

## 🔄 Request Flow

```
Client Request
    │
    ▼
server.js           ← Registers all middleware & routes
    │
    ▼
middleware/         ← Logger → Rate Limiter → Auth (if protected)
    │
    ▼
routes/             ← Matches URL pattern, calls correct controller
    │
    ▼
controllers/        ← Validates request, calls service, sends response
    │
    ▼
services/           ← Database queries, business logic, error throwing
    │
    ▼
models/             ← Mongoose schemas interact with MongoDB
```

---

## 📡 API Routes

### Authentication & Users — `/api/user`

| Method | Endpoint                          | Auth | Description              |
| ------ | --------------------------------- | ---- | ------------------------ |
| POST   | `/api/user/register`              | ❌   | Register new account     |
| POST   | `/api/user/login`                 | ❌   | Login, returns JWT token |
| GET    | `/api/user/profile`               | ✅   | Get current user profile |
| PUT    | `/api/user/profile`               | ✅   | Update name, phone, etc. |
| POST   | `/api/user/addresses`             | ✅   | Add a new address        |
| PUT    | `/api/user/addresses/:id`         | ✅   | Edit an existing address |
| DELETE | `/api/user/addresses/:id`         | ✅   | Remove an address        |
| PUT    | `/api/user/addresses/:id/default` | ✅   | Set default address      |

### Food & Restaurants — `/api/food`

| Method | Endpoint                   | Auth | Description                |
| ------ | -------------------------- | ---- | -------------------------- |
| GET    | `/api/food`                | ❌   | Get all food items         |
| GET    | `/api/food/categories`     | ❌   | Get all categories         |
| GET    | `/api/food/restaurant/:id` | ❌   | Get foods for a restaurant |

### Orders — `/api/orders`

| Method | Endpoint                 | Auth | Description                     |
| ------ | ------------------------ | ---- | ------------------------------- |
| POST   | `/api/orders`            | ✅   | Place a new order               |
| GET    | `/api/orders`            | ✅   | Get all orders for current user |
| GET    | `/api/orders/:id`        | ✅   | Get a single order              |
| PUT    | `/api/orders/:id/cancel` | ✅   | Cancel an order                 |

### Payments — `/api/payment`

| Method | Endpoint                     | Auth | Description                  |
| ------ | ---------------------------- | ---- | ---------------------------- |
| POST   | `/api/payment/create-intent` | ✅   | Create Stripe payment intent |
| POST   | `/api/payment/webhook`       | ❌   | Stripe webhook (raw body)    |
| POST   | `/api/payment/verify`        | ✅   | Verify & confirm payment     |

### Location — `/api/location`

| Method | Endpoint                | Auth | Description                   |
| ------ | ----------------------- | ---- | ----------------------------- |
| GET    | `/api/location/geocode` | ❌   | Convert address → coordinates |
| GET    | `/api/location/nearby`  | ❌   | Find nearby restaurants       |

---

## 📦 Key Dependencies

| Package              | Purpose                              |
| -------------------- | ------------------------------------ |
| `express`            | Web framework                        |
| `mongoose`           | MongoDB ODM                          |
| `jsonwebtoken`       | JWT auth tokens                      |
| `bcryptjs`           | Password hashing                     |
| `stripe`             | Payment processing                   |
| `imagekit`           | Image CDN (upload, transform, serve) |
| `multer`             | Multipart file handling              |
| `cors`               | Cross-origin request headers         |
| `dotenv`             | Environment variable loader          |
| `express-rate-limit` | API rate limiting                    |

---

## ⚙️ Environment Variables (`.env.local`)

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/hungerhive

# JWT
JWT_SECRET=your_super_secret_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ImageKit
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server (with auto-restart)
npm run dev

# Start production server
npm start
```

Server runs on `http://localhost:4000` by default.

---

## 🏗️ Architecture Decisions

| Decision                         | Reason                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| **Controllers → Services split** | Controllers handle HTTP concerns (req/res), services handle business logic — easy to test |
| **JWT in Authorization header**  | Stateless auth, no session storage needed                                                 |
| **ImageKit for images**          | CDN delivery, automatic resizing, no S3 setup needed                                      |
| **Custom error classes**         | Consistent error responses across the entire API                                          |
| **Rate limiting middleware**     | Protects against brute-force and DDoS                                                     |
