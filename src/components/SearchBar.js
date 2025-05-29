import React, { useState } from 'react';
import { sanitizeSearchInput } from '../utils/searchUtils';

/**
 * SearchBar component for business search functionality
 * Features responsive design with search suggestions and accessibility
 */
const SearchBar = ({ 
  onSearch, 
  placeholder = "Search businesses, locations, or services...",
  initialValue = "",
  showSearchButton = true,
  isLoading = false 
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  // Handle input changes with sanitization
  const handleInputChange = (e) => {
    const value = sanitizeSearchInput(e.target.value);
    setSearchValue(value);
    
    // Trigger search immediately on input for real-time filtering
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle form submission for explicit search
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  // Clear search input
  const handleClear = () => {
    setSearchValue('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative flex items-center bg-white rounded-lg shadow-sm border-2 transition-colors
          ${isFocused 
            ? 'border-amber-400 ring-2 ring-amber-100' 
            : 'border-stone-200 hover:border-stone-300'
          }
        `}>
          {/* Search Icon */}
          <div className="absolute left-4 flex items-center pointer-events-none">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-600 border-t-transparent"></div>
            ) : (
              <svg 
                className="h-5 w-5 text-stone-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            )}
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-20 py-4 text-stone-900 placeholder-stone-500 border-0 rounded-lg focus:outline-none text-lg"
            aria-label="Search businesses"
          />

          {/* Clear Button */}
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-16 p-1 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search Button */}
          {showSearchButton && (
            <button
              type="submit"
              className="absolute right-2 bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label="Submit search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Tips */}
        <div className="mt-2 text-sm text-stone-600">
          <p className="text-center">
            Try searching for: 
            <span className="mx-1 px-2 py-0.5 bg-stone-100 rounded text-stone-700">"grain"</span>
            <span className="mx-1 px-2 py-0.5 bg-stone-100 rounded text-stone-700">"Esperance"</span>
            <span className="mx-1 px-2 py-0.5 bg-stone-100 rounded text-stone-700">"health services"</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
