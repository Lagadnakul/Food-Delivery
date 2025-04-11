import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoute.js';
import foodRoutes from './routes/foodRoute.js';
import orderRoutes from './routes/orderRoute.js';

// Load environment variables early
dotenv.config();

const app = express();

// CORS configuration - modify for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://food-delivery-82wu.onrender.com",
      "http://localhost:5173",
      "http://localhost:4000",
      "http://localhost:5174",
      "https://hunger-hive-65wn9eon3-nakul-lagads-projects.vercel.app" 
    ] 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Add size limit
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Add size limit
app.use('/uploads', express.static('uploads'));

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send(`
      <html>
        <head>
          <title>API Status</title>
        </head>
        <body>
          <h1>API is working</h1>
          <p>Welcome to the Hunger Hive API. Server is running properly.</p>
        </body>
      </html>
    `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 4000;

// For Vercel deployment
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;