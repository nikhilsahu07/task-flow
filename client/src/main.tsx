import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Global styles for the application
import App from './App'; // Main application component

// Create a React root and render the App component.
// StrictMode is a wrapper component that checks for potential problems in an application during development.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
