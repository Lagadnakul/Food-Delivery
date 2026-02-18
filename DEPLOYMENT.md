# 🚀 Hunger Hive - Deployment Guide

## Production Deployment Checklist

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas account
- [ ] Vercel account (for frontend)
- [ ] Render account (for backend)
- [ ] Razorpay account (for payments)
- [ ] Google Cloud account (for Maps API)
- [ ] ImageKit account (for image uploads)

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Environment Variables

Create these environment variables in Render Dashboard:

```bash
# Required
NODE_ENV=production
PORT=4000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/HungerHive

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_chars
COOKIE_SECRET=your_cookie_secret_key

# Frontend URLs (CORS)
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app

# Razorpay (Payment)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# ImageKit (Image Upload)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Restaurant Location
RESTAURANT_LAT=19.0760
RESTAURANT_LNG=72.8777
```

### Step 2: Deploy to Render

1. Connect your GitHub repository to Render
2. Select the `backend` folder as root directory
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables
6. Deploy!

### Step 3: Configure Render Settings

- **Health Check Path**: `/`
- **Auto Deploy**: Enable for main branch
- **Instance Type**: Start with free tier, upgrade as needed

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
VITE_API_URL=https://your-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_RESTAURANT_LAT=19.0760
VITE_RESTAURANT_LNG=72.8777
VITE_ENABLE_PAYMENT=true
VITE_ENABLE_MAPS=true
```

### Step 2: Deploy to Vercel

1. Import your GitHub repository
2. Set the root directory to `frontend`
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables
7. Deploy!

### Step 3: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## 📱 Admin Panel Deployment (Vercel)

Follow the same steps as frontend, but:
- Set root directory to `admin`
- Use different environment variables if needed

---

## 💳 Razorpay Setup

### Step 1: Create Razorpay Account
1. Go to https://razorpay.com
2. Complete KYC verification
3. Enable live mode when ready

### Step 2: Get API Keys
1. Dashboard → Settings → API Keys
2. Generate Key ID and Secret
3. Save securely!

### Step 3: Configure Webhooks
1. Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-backend.onrender.com/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`, `order.paid`
4. Generate webhook secret

---

## 🗺️ Google Maps Setup

### Step 1: Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable billing (required for Maps API)

### Step 2: Enable APIs
Enable these APIs:
- Maps JavaScript API
- Places API
- Distance Matrix API
- Geocoding API

### Step 3: Create API Key
1. APIs & Services → Credentials
2. Create API Key
3. Restrict key to your domains:
   - `https://your-frontend.vercel.app/*`
   - `http://localhost:3000/*` (for development)

---

## 🔒 Security Checklist

### Backend Security
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS only
- [ ] Set secure cookie options
- [ ] Implement rate limiting (recommended)
- [ ] Validate all inputs
- [ ] Sanitize MongoDB queries
- [ ] Keep dependencies updated

### Frontend Security
- [ ] Never expose secret keys in frontend code
- [ ] Use environment variables for all API keys
- [ ] Enable CORS properly
- [ ] Implement proper authentication flow

### Database Security
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Create database user with minimal privileges
- [ ] Enable database encryption
- [ ] Regular backups

---

## 🧪 Testing Checklist

### Before Going Live
- [ ] Test user registration/login
- [ ] Test order placement (COD)
- [ ] Test Razorpay payment flow
- [ ] Test location detection
- [ ] Test order tracking
- [ ] Test on mobile devices
- [ ] Test error handling
- [ ] Check loading states
- [ ] Verify toast notifications

### Razorpay Test Mode
Use test credentials first:
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

---

## 📊 Monitoring & Analytics

### Recommended Tools
1. **Render Dashboard** - Backend logs & metrics
2. **Vercel Analytics** - Frontend performance
3. **MongoDB Atlas** - Database monitoring
4. **Razorpay Dashboard** - Payment analytics

### Error Tracking
Consider adding:
- Sentry (error tracking)
- LogRocket (session replay)

---

## 🔄 CI/CD Pipeline

### Automatic Deployments
Both Vercel and Render support automatic deployments:
1. Push to main branch
2. Builds trigger automatically
3. Zero-downtime deployments

### Branch Previews
- Vercel creates preview URLs for PRs
- Test changes before merging

---

## 🆘 Troubleshooting

### Common Issues

**CORS Errors**
- Check `FRONTEND_URL` in backend env
- Ensure URLs don't have trailing slashes

**Database Connection Failed**
- Verify MongoDB URI
- Check IP whitelist in MongoDB Atlas

**Payment Not Working**
- Verify Razorpay keys
- Check webhook configuration
- Ensure HTTPS is used

**Maps Not Loading**
- Verify API key
- Check domain restrictions
- Enable required APIs

---

## 📞 Support

For issues:
1. Check GitHub Issues
2. Review Render/Vercel logs
3. Contact respective service support

---

## 📝 Quick Start Commands

```bash
# Local Development

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

# Admin
cd admin
npm install
npm run dev
```

---

Happy Deploying! 🎉
