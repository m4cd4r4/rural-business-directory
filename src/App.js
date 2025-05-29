import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import AdminPage from './pages/AdminPage'; // Import AdminPage

/**
 * Main App component - Root component managing routing and layout
 * Features React Router for navigation and consistent layout structure
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            {/* Home page route */}
            <Route 
              path="/" 
              element={<HomePage />} 
            />
            
            {/* Business directory listing page */}
            <Route 
              path="/directory" 
              element={<DirectoryPage />} 
            />
            
            {/* Individual business profile page */}
            <Route 
              path="/business/:id" 
              element={<BusinessProfilePage />} 
            />

            {/* Admin page for data import */}
            <Route
              path="/admin"
              element={<AdminPage />}
            />
            
            {/* Placeholder for future submit business page */}
            <Route 
              path="/submit" 
              element={
                <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4" role="img" aria-label="Coming soon">🚧</div>
                    <h1 className="text-2xl font-bold text-stone-800 mb-4">Submit Business - Coming Soon</h1>
                    <p className="text-stone-600 mb-6">
                      We're working on a submission form for new business listings.
                    </p>
                    <a 
                      href="/"
                      className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Return Home
                    </a>
                  </div>
                </div>
              } 
            />
            
            {/* 404 Not Found page */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4" role="img" aria-label="Page not found">🔍</div>
                    <h1 className="text-2xl font-bold text-stone-800 mb-4">Page Not Found</h1>
                    <p className="text-stone-600 mb-6">
                      The page you're looking for doesn't exist or has been moved.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
                      >
                        🏠 Go Home
                      </a>
                      <a 
                        href="/directory"
                        className="inline-flex items-center px-6 py-3 bg-stone-600 hover:bg-stone-700 text-white font-medium rounded-lg transition-colors"
                      >
                        📋 Browse Directory
                      </a>
                    </div>
                  </div>
                </div>
              } 
            />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
