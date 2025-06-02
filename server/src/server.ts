// Backend Server Entry Point

import express from 'express';
import 'express-async-errors'; // Automatically catches errors in async route handlers
import dotenv from 'dotenv'; // For loading environment variables
import mongoose from 'mongoose'; // MongoDB ORM
import cors from 'cors'; // Cross-Origin Resource Sharing middleware
import helmet from 'helmet'; // Basic security headers
import { v4 as uuidv4 } from 'uuid'; // For generating unique request IDs

// Import route handlers for authentication and task management
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

// Error handling middleware for handling errors and not found routes
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application to handle HTTP requests
const app = express();

// Middleware Setup

// Enable CORS - allows frontend to make API requests
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no origin (e.g., curl or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

// Add security headers to protect against common web vulnerabilities (e.g. XSS, CSRF, etc.)
app.use(helmet());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// Add unique request ID to each API request for debugging and tracking (e.g. in logs)
app.use((_req, res, next) => {
  const requestId = uuidv4();
  res.setHeader('X-Request-ID', requestId);
  next();
});

// API Routes Configuration

app.use('/api/auth', authRoutes); // Authentication routes (login, register, etc.)
app.use('/api/tasks', taskRoutes); // Task management routes (CRUD operations)

// Health Check Endpoint

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'up',
    timestamp: new Date().toISOString(),
  });
});

// More detailed health check including database connection status

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'up',
    timestamp: new Date().toISOString(),
    databaseConnected: mongoose.connection.readyState === 1, // 1 means connected, 0 disconnected, 2 connecting, 3 disconnecting
  });
});

// Error Handling Middleware

// 404 handler - handles requests to undefined routes
app.use(notFoundHandler);

// Global error handler - processes all errors thrown in routes
app.use(errorHandler);

// Server Configuration

// Get port from environment variables or use default port 5000
const PORT = process.env.PORT || 5000;

// MongoDB connection string from environment variables or use default
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-management';

// Database Connection

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.info(`Successfully connected to MongoDB: ${mongoose.connection.name}`); // Log DB name
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message); // Log only the error message for brevity
    // Inform that the app is running in a degraded mode if DB connection fails.
    console.warn(
      'Server is running WITHOUT a live database connection. Features requiring DB access will not work. Mock data may be used if enabled.',
    );
  });

// Start Server

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});

// Global Error Handlers

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Handle uncaught exceptions - force exit to prevent unexpected behavior
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
