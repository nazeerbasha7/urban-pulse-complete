// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/urban';

// Middleware - CORS Configuration
app.use(cors({
  origin: [
    'https://nazeerbasha7.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    const dbType = MONGO_URI.includes('mongodb+srv') || MONGO_URI.includes('mongodb.net')
      ? 'MongoDB Atlas (Production Cloud)'
      : 'Local MongoDB (Development)';
    console.log(`📍 Database Type: ${dbType}`);
    console.log(`📊 Database Name: ${mongoose.connection.name}`);
    console.log(`🌍 Host: ${mongoose.connection.host}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('💡 Check: 1) Network Access in Atlas 2) Username/Password 3) Database name');
    process.exit(1);
  });

const db = mongoose.connection;
db.on('error', (error) => console.error('❌ MongoDB error:', error.message));
db.on('disconnected', () => console.log('⚠️ MongoDB disconnected - will auto-reconnect'));
db.on('reconnected', () => console.log('✅ MongoDB reconnected successfully'));
db.once('open', async () => {
  console.log('🟢 MongoDB connection is READY');
  try {
    const collections = await db.db.listCollections().toArray();
    console.log(`📁 Collections available: ${collections.map(c => c.name).join(', ') || 'none (will be created on first insert)'}`);
  } catch (err) {
    console.log('📁 Collections: Will be created on first insert');
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'UrbanPulse Backend API is Running',
    status: 'active',
    environment: process.env.NODE_ENV || 'development',
    database: db.readyState === 1 ? 'Connected' : 'Disconnected',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/', authRoutes);
app.use('/', complaintRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedPath: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('🚀 UrbanPulse Backend Server Started');
  console.log('═══════════════════════════════════════════════');
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('═══════════════════════════════════════════════');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});
