import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Main layout component providing consistent navigation and structure
 * Features responsive design with Australian-themed styling
 */
const Layout = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/directory', label: 'Business Directory', icon: '📋' },
    { path: '/submit', label: 'Submit Business', icon: '➕', disabled: true }
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Brand */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              aria-label="Rural Business Directory Home"
            >
              <div className="bg-amber-100 p-2 rounded-lg">
                <span className="text-2xl" role="img" aria-label="Australian map">🗺️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-800">
                  Rural Australia Business Directory
                </h1>
                <p className="text-sm text-stone-600">
                  Connecting rural communities across Australia
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-1" role="navigation">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.disabled ? '#' : item.path}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${item.disabled 
                      ? 'text-stone-400 cursor-not-allowed' 
                      : currentPath === item.path
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                    }
                  `}
                  aria-current={currentPath === item.path ? 'page' : undefined}
                  aria-disabled={item.disabled}
                >
                  <span className="mr-2" role="img" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                  {item.disabled && (
                    <span className="ml-1 text-xs">(Coming Soon)</span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button - would typically open a mobile navigation drawer */}
            <button 
              className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
              aria-label="Open mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-200">
                About the Directory
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                Showcasing the diverse businesses that form the backbone of rural and regional 
                Australia. From family farms to local services, we celebrate the innovation 
                and community spirit that drives our regional economy.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-200">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link 
                    to="/" 
                    className="text-stone-300 hover:text-amber-200 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/directory" 
                    className="text-stone-300 hover:text-amber-200 transition-colors"
                  >
                    Browse Businesses
                  </Link>
                </li>
                <li>
                  <span className="text-stone-500">Submit Business (Coming Soon)</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-200">
                Support Rural Australia
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed mb-4">
                Help us grow this directory by sharing it with rural businesses 
                and communities across Australia.
              </p>
              <div className="flex space-x-3">
                <span className="text-2xl" role="img" aria-label="Australia flag">🇦🇺</span>
                <span className="text-2xl" role="img" aria-label="Handshake">🤝</span>
                <span className="text-2xl" role="img" aria-label="Heart">❤️</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-stone-700 mt-8 pt-6 text-center">
            <p className="text-stone-400 text-sm">
              © 2025 Rural Australia Business Directory. Supporting rural communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
