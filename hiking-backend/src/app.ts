import express, { Application, Request, Response, NextFunction } from 'express';
import './db/mongo';
import router from './htpp-middleware/router';
import cors from 'cors';
import { config } from './config';

const app = express();

// CORS configuration - allow specific origins in production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
    // Primary frontend URL from environment variable
    process.env.FRONTEND_URL,
    // Default Netlify URL (will be replaced by FRONTEND_URL if set)
    'https://kosovahike.netlify.app',
    // Additional allowed origins (add more if needed)
    'https://kosovahike.vercel.app',
  ].filter(Boolean) // Remove undefined values
  : ['http://localhost:3000', 'http://localhost:3001'];

console.log('🌐 Allowed CORS origins:', allowedOrigins);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
console.log('🔗 FRONTEND_URL:', process.env.FRONTEND_URL);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('⚠️ Request with no origin - allowing');
      return callback(null, true);
    }

    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Development mode - allowing origin:', origin);
      return callback(null, true);
    }

    // In production, check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ Allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ Blocked origin:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/", router);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: 'KosovaHike API',
    version: '1.0.0',
    status: 'running'
  });
});

const PORT = config.port || 5000;

// Error handling for server startup
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
}).on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the other process or use a different port.`);
  } else {
    console.error('❌ Server startup error:', error);
  }
  process.exit(1);
});
