"use strict";
// Backend Server Entry Point
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const uuid_1 = require("uuid");
// Route handlers for authentication and task management
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
// Error handling middleware for handling errors and not found routes
const error_middleware_1 = require("./middleware/error.middleware");
// Load env variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
// Middleware Setup
// Enable CORS - allows frontend to make API requests
const allowedOrigins = 'http://localhost:5173';
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow no origin (e.g., curl or Postman)
        if (!origin || allowedOrigins?.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
// Add security headers to protect web vulnerabilities
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Parse URL-encoded request bodies
app.use(express_1.default.urlencoded({ extended: true }));
// Add unique request ID to each API request for debugging and tracking
app.use((_req, res, next) => {
    const requestId = (0, uuid_1.v4)();
    res.setHeader('X-Request-ID', requestId);
    next();
});
// API Routes Configuration
app.use('/api/auth', auth_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
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
        databaseConnected: mongoose_1.default.connection.readyState === 1,
    });
});
// Error Handling Middleware
// 404 handler
app.use(error_middleware_1.notFoundHandler);
// Global error handler
app.use(error_middleware_1.errorHandler);
// Server Configuration
const PORT = process.env.PORT || 5000;
// MongoDB connection string from env var or use localMongodb
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-management';
// Database Connection
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.info(`Successfully connected to MongoDB: ${mongoose_1.default.connection.name}`);
})
    .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    // Inform that the app is running in a degraded/failed mode if DB connection fails.
    console.warn('Server is running WITHOUT a live database connection. Features requiring DB access will not work. Mock data may be used if enabled.');
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
//# sourceMappingURL=server.js.map