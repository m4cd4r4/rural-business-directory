import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * Main entry point for the Rural Business Directory application
 * Renders the root App component with React 18's createRoot API
 */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring (optional)
// You can add performance monitoring here if needed
// reportWebVitals(console.log);
