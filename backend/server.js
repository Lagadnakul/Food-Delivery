import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoute.js';
import foodRoutes from './routes/foodRoute.js';
import orderRoutes from './routes/orderRoute.js';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);

// Test route
app.get('/api', (req, res) => {
  res.send('API is running...');
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start server if not imported as a module
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;