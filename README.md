# Task Flow

A modern task management application built with the MERN stack (MongoDB, Express, React, Node.js) using TypeScript for end-to-end type safety.

## About

Task Flow is a collaborative task management system designed to help teams organize work efficiently. It features drag-and-drop task boards, user authentication, and real-time updates.

### Key Features

- **Task Management**: Create, organize, and track tasks through customizable boards
- **User Authentication**: Secure login and registration with JWT
- **Drag-and-Drop Interface**: Intuitive task organization with React DnD
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Stay synchronized with the latest changes

## Project Architecture

The project follows a standard MERN stack architecture:

- **Client**: React frontend with TypeScript, Vite, and Tailwind CSS
- **Server**: Express API with TypeScript, MongoDB, and JWT authentication
- **Development Tools**: ESLint, Prettier, and Husky for code quality

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local instance or Atlas connection)

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/task-flow.git
   cd task-flow
   ```

2. Create a `.env` file in the server directory:
   ```bash
   # In ./server/.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

### Installation

```bash
# Install dependencies for server and client
npm install
```

### Development

```bash
# Run both client and server in development mode
npm run dev

# Run only the server
npm run dev:server

# Run only the client
npm run dev:client
```

- Client runs on: http://localhost:5173
- Server runs on: http://localhost:5000

### Building for Production

```bash
# Build both client and server
npm run build

# After building, you can start the production server:
cd server
npm run start
```

## Code Quality

```bash
# Run linters
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Tech Stack

### Frontend

- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **React Hook Form**: Form validation
- **Zod**: Schema validation
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **React DnD**: Drag-and-drop functionality
- **React Toastify**: Toast notifications

### Backend

- **Express**: Web framework for Node.js
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Zod**: Schema validation
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Vite**: Build tool and development server
- **Concurrently**: Run multiple commands concurrently

## License

ISC
