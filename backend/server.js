import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoute.js';
import foodRoutes from './routes/foodRoute.js';
import orderRoutes from './routes/orderRoute.js';

// Load environment variables early
dotenv.config({ path: './.env.local' });

const app = express();

// CORS configuration - modify for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://food-delivery-82wu.onrender.com",
      "http://localhost:5173",
      "http://localhost:4000",
      "http://localhost:5174",
      "https://hunger-hive-65wn9eon3-nakul-lagads-projects.vercel.app",
      "https://super-duper-orbit-gjwvp4w5r6pfvq7x-4000.app.github.dev",
      "https://super-duper-orbit-gjwvp4w5r6pfvq7x-5173.app.github.dev"
    ] 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
app.use('/user', userRoutes);
app.use('/food', foodRoutes);
app.use('/orders', orderRoutes);

// Health check endpoint
// Health check endpoint
app.get("/", (req, res) => {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  const formattedUptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hunger Hive API Status</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f9fafb;
            color: #1f2937;
            line-height: 1.6;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
          }
          .container {
            width: 100%;
            max-width: 800px;
          }
          header {
            text-align: center;
            margin-bottom: 2rem;
          }
          .logo {
            max-width: 120px;
            margin-bottom: 1rem;
          }
          h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.5rem;
          }
          .subtitle {
            color: #4b5563;
            font-size: 1.1rem;
          }
          .status-card {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            margin-bottom: 1.5rem;
          }
          .status {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
          }
          .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #10b981;
            margin-right: 0.75rem;
          }
          .status-text {
            font-weight: 600;
            font-size: 1.1rem;
          }
          .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }
          .metric {
            padding: 1rem;
            background-color: #f3f4f6;
            border-radius: 0.5rem;
          }
          .metric-label {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
          }
          .metric-value {
            font-weight: 600;
            font-size: 1.25rem;
          }
          .endpoints {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          .endpoint {
            padding: 1rem 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .endpoint:last-child {
            border-bottom: none;
          }
          .endpoint-route {
            font-family: monospace;
            font-size: 1rem;
            font-weight: 600;
            color: #f97316;
          }
          .endpoint-description {
            color: #4b5563;
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }
          footer {
            margin-top: 2rem;
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
          }
          .pulse {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
            }
          }
          @media (max-width: 640px) {
            body {
              padding: 1rem;
            }
            h1 {
              font-size: 1.5rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <svg class="logo" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="#f97316" />
              <path d="M26 13H10C9.44772 13 9 13.4477 9 14V25C9 25.5523 9.44772 26 10 26H26C26.5523 26 27 25.5523 27 25V14C27 13.4477 26.5523 13 26 13Z" fill="white" />
              <path d="M13 9H23V13H13V9Z" fill="white" />
            </svg>
            <h1>Hunger Hive API</h1>
            <p class="subtitle">✅ API is operational and running properly</p>
          </header>
          
          <section class="status-card">
            <div class="status">
              <div class="status-indicator pulse"></div>
              <div class="status-text">System Online</div>
            </div>
            
            <div class="metrics">
              <div class="metric">
                <div class="metric-label">Environment</div>
                <div class="metric-value">${process.env.NODE_ENV || 'development'}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Uptime</div>
                <div class="metric-value">${formattedUptime}</div>
              </div>
              
              <div class="metric">
                <div class="metric-label">Node Version</div>
                <div class="metric-value">${process.version}</div>
              </div>
            </div>
          </section>
          
          <section class="endpoints">
            <h2 style="margin-bottom: 1rem;">Available Endpoints</h2>
            
            <div class="endpoint">
              <div class="endpoint-route">GET /food/list</div>
              <div class="endpoint-description">Retrieve the list of all food items</div>
            </div>
            
            <div class="endpoint">
              <div class="endpoint-route">POST /user/login</div>
              <div class="endpoint-description">Authenticate user and generate access token</div>
            </div>
            
            <div class="endpoint">
              <div class="endpoint-route">POST /orders</div>
              <div class="endpoint-description">Create a new food order</div>
            </div>
            
            <div class="endpoint">
              <div class="endpoint-route">GET /orders/:id</div>
              <div class="endpoint-description">Get details for a specific order</div>
            </div>
          </section>
          
          <footer>
            <p>Hunger Hive API • Version ${process.env.npm_package_version || '1.0.0'} • &copy; ${new Date().getFullYear()} Hunger Hive</p>
          </footer>
        </div>
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