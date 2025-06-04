// Backend Server Entry Point

import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';

// Route handlers for authentication and task management
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

// Error handling middleware for handling errors and not found routes
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Load env variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware Setup

// Enable CORS - allows frontend to make API requests
const allowedOrigins = 'http://localhost:5173';

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no origin (e.g., curl or Postman)
      if (!origin || allowedOrigins?.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

// Add security headers to protect web vulnerabilities
app.use(helmet());

app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Add unique request ID to each API request for debugging and tracking
app.use((_req, res, next) => {
  const requestId = uuidv4();
  res.setHeader('X-Request-ID', requestId);
  next();
});

// API Routes Configuration

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health Check Endpoint

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'up',
    timestamp: new Date().toISOString(),
  });
});

// api health check

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'up',
    timestamp: new Date().toISOString(),
    databaseConnected: mongoose.connection.readyState === 1,
  });
});

// Error Handling Middleware

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Server Configuration

const PORT = process.env.PORT || 5000;

// MongoDB connection string from env var or use localMongodb

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-management';

// Database Connection

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.info(`Successfully connected to MongoDB: ${mongoose.connection.name}`);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    // Inform that the app is running in a degraded/failed mode if DB connection fails.
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
