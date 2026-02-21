# Hunger Hive - Quick Setup Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account (free tier works)
- Git installed

## Step 1: Backend Setup

### 1.1 Configure Environment Variables
Create a `.env.local` file in the `backend` folder with your MongoDB credentials:

```env
# MongoDB Connection String (get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/hunger_hive?retryWrites=true&w=majority

# JWT Secret (any random string)
JWT_SECRET=your_super_secret_key_here_12345

# Server Port
PORT=4000

# Node Environment
NODE_ENV=development
```

### 1.2 Install Backend Dependencies
```bash
cd backend
npm install
```

### 1.3 Start Backend Server
```bash
npm run dev
```
The backend should now be running at http://localhost:4000

## Step 2: Frontend Setup

### 2.1 Configure Environment Variables
Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:4000
```

### 2.2 Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2.3 Start Frontend Development Server
```bash
npm run dev
```
The frontend should now be running at http://localhost:5173

## Step 3: Admin Panel Setup (Optional)

### 3.1 Install Admin Dependencies
```bash
cd admin
npm install
```

### 3.2 Start Admin Panel
```bash
npm run dev
```
The admin panel should now be running at http://localhost:5174

## Common Issues & Solutions

### "Please check your internet connection" Error
This error occurs when:
1. **Backend is not running** - Start the backend server first
2. **Wrong API URL** - Check `VITE_API_URL` in frontend `.env`
3. **MongoDB not connected** - Verify your `MONGODB_URI` is correct

### MongoDB Connection Issues
1. Go to MongoDB Atlas → Network Access
2. Add your IP address or use `0.0.0.0/0` for development
3. Check your username/password are correct

### CORS Errors
The backend already has CORS configured for localhost. If you're deploying:
1. Add your frontend URL to the CORS whitelist in `backend/server.js`

## Testing the Setup

1. Open http://localhost:5173 in your browser
2. Register a new account
3. Browse the menu
4. Add items to cart
5. Proceed to checkout
6. Place an order

If all steps work, your setup is complete! 🎉

## Production Deployment

### Backend (Render/Railway)
1. Push your code to GitHub
2. Connect your repo to Render/Railway
3. Set environment variables in the dashboard
4. Deploy

### Frontend (Vercel)
1. Push your code to GitHub
2. Import project in Vercel
3. Set `VITE_API_URL` to your deployed backend URL
4. Deploy

## Need Help?
- Check the main README.md for more details
- Open an issue on GitHub
- Contact: your-email@example.com
