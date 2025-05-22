/**
 * Backend Server Entry Point
 *
 * This file is the main entry point for the backend server application.
 * It initializes Express, sets up middleware, connects to MongoDB,
 * configures API routes, and starts the server.
 */

import express from 'express';
import 'express-async-errors'; // Allows async route handlers to automatically catch errors
import dotenv from 'dotenv'; // For loading environment variables
import mongoose from 'mongoose'; // MongoDB ORM
import cors from 'cors'; // Cross-Origin Resource Sharing middleware
import helmet from 'helmet'; // Security headers middleware
import { v4 as uuidv4 } from 'uuid'; // For generating unique request IDs

// Import route handlers
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

// Error handling middleware
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

/**
 * Middleware Setup
 *
 * Middleware functions are executed in the order they are added.
 * Each middleware has access to the request and response objects.
 */

// Enable Cross-Origin Resource Sharing - allows frontend to make API requests
app.use(cors());

// Add security headers to protect against common web vulnerabilities
app.use(helmet());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// Add unique request ID to each API request for debugging and tracking
app.use((_req, res, next) => {
  const requestId = uuidv4();
  res.setHeader('X-Request-ID', requestId);
  next();
});

/**
 * API Routes Configuration
 *
 * Define the base paths for different API endpoints and associate
 * them with their respective route handlers.
 */
app.use('/api/auth', authRoutes); // Authentication routes (login, register, etc.)
app.use('/api/tasks', taskRoutes); // Task management routes (CRUD operations)

/**
 * Health Check Endpoint
 *
 * A simple endpoint to verify that the server is running.
 * Often used by monitoring tools or load balancers.
 */
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'up',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Mock API Endpoints
 *
 * These endpoints provide test data even when MongoDB isn't connected.
 * Useful for development, testing, and demonstration purposes.
 */

// Health check that includes database connection status
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'up',
    timestamp: new Date().toISOString(),
    databaseConnected: !!mongoose.connection.readyState,
  });
});

// Mock login endpoint for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Simple validation with hardcoded credentials
  if (email === 'user@example.com' && password === 'password') {
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'user@example.com',
          role: 'user',
        },
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: 'Invalid email or password',
    });
  }
});

// Mock tasks endpoint that returns sample tasks data
app.get('/api/tasks', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tasks retrieved successfully',
    data: {
      tasks: [
        {
          _id: '1',
          title: 'Complete project setup',
          description: 'Set up the project structure and dependencies',
          status: 'in_progress',
          priority: 'high',
          createdBy: {
            _id: '1',
            name: 'Test User',
            email: 'user@example.com',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: '2',
          title: 'Design user interface',
          description: 'Create wireframes and design mockups',
          status: 'todo',
          priority: 'medium',
          createdBy: {
            _id: '1',
            name: 'Test User',
            email: 'user@example.com',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        pages: 1,
      },
    },
  });
});

/**
 * Error Handling Middleware
 *
 * These middleware functions catch and process errors that occur
 * during request handling.
 */

// 404 handler - handles requests to undefined routes
app.use(notFoundHandler);

// Global error handler - processes all errors thrown in routes
app.use(errorHandler);

/**
 * Server Configuration
 */

// Get port from environment variables or use default port 5000
const PORT = process.env.PORT || 5000;

// MongoDB connection string from environment variables or use default
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager';

/**
 * Database Connection
 *
 * Connect to MongoDB using Mongoose.
 * The application will still run even if MongoDB connection fails,
 * but database-dependent features won't work.
 */
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.info('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    console.warn('Running without database connection. Some features will not work.');
  });

/**
 * Start Server
 *
 * Begin listening for incoming HTTP requests
 */
app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});

/**
 * Global Error Handlers
 *
 * These handlers catch errors that occur outside the Express request pipeline.
 */

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Handle uncaught exceptions - force exit to prevent unexpected behavior
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
