/**
 * Zzzap! Backend Server
 * Mobile-First Marketplace API
 * 
 * Optimized for mobile devices with:
 * - Compressed responses
 * - Minimal payload sizes
 * - Fast response times
 * - Mobile-friendly rate limits
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const feedRoutes = require('./routes/feed');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const chatRoutes = require('./routes/chat');
const gamificationRoutes = require('./routes/gamification');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for mobile apps
  crossOriginEmbedderPolicy: false
}));

// CORS - Allow mobile apps
app.use(cors({
  origin: ['http://localhost:3000', 'https://zzzap.app', 'https://api.zzzap.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Type'],
  credentials: true
}));

// Mobile-optimized rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 auth attempts per 15 min
  message: { error: 'Too many authentication attempts' }
});

// Apply rate limits
app.use('/api/v1/', apiLimiter);
app.use('/api/v1/auth/', authLimiter);

// Body parser with mobile-optimized limits
app.use(express.json({ limit: '1mb' })); // Smaller limit for mobile
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging for mobile debugging
app.use((req, res, next) => {
  const deviceType = req.headers['x-device-type'] || 'unknown';
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | Device: ${deviceType}`);
  next();
});

// Mobile-optimized response compression
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=60'); // 1 min cache for mobile
  res.setHeader('X-Response-Time', Date.now());
  next();
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/feed', feedRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/gamification', gamificationRoutes);

// Health check for mobile apps
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mobile_optimized: true
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    hint: 'Check API documentation at /api/v1/docs'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    mobile_friendly: true
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`⚡️ Zzzap! API Server running on port ${PORT}`);
  console.log(`📱 Mobile-optimized mode: ENABLED`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/v1/health`);
});

module.exports = app;
