import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import BusinessCard from '../components/BusinessCard';
import { useBusinessData } from '../hooks/useBusinessData';

/**
 * DirectoryPage component - Main business listing page with search and filtering
 * Features responsive grid layout and comprehensive filtering options
 */
const DirectoryPage = () => {
  const location = useLocation();
  
  // Extract URL parameters for initial filters
  const urlParams = new URLSearchParams(location.search);
  const initialIndustry = urlParams.get('industry');
  const initialSearch = urlParams.get('search');

  // Use new data hook
  const {
    businesses, // This will replace filteredBusinesses
    isLoading,
    error, // New: handle error display if needed
    filters, // Contains search, selectedStates, selectedIndustries, selectedRegions, sortBy
    pagination, // Contains totalItems for totalCount
    hasActiveFilters,
    handleSearchChange, // Directly use this
    toggleStateFilter, // Directly use this
    toggleIndustryFilter, // Directly use this
    toggleRegionFilter, // Directly use this
    updateFilters, // Used for setSortBy
    clearAllFilters, // Directly use this
    regions, // Now from hook, for availableRegions
    // states, // Available from hook if needed for FilterSidebar
    // industries // Available from hook if needed for FilterSidebar
  } = useBusinessData();

  // Initialize filters from URL parameters
  React.useEffect(() => {
    if (initialIndustry && !filters.selectedIndustries.includes(initialIndustry)) {
      toggleIndustryFilter(initialIndustry);
    }
    // Important: Only call handleSearchChange if initialSearch is present AND different from current
    // to avoid re-fetch if search term is already set (e.g. by user typing)
    if (initialSearch && initialSearch !== filters.search) {
      handleSearchChange(initialSearch);
    }
    // Dependencies should ensure this runs when URL params are first available
    // and if they change, but not on every render.
  }, [initialIndustry, initialSearch, filters.selectedIndustries, filters.search, toggleIndustryFilter, handleSearchChange]);

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'location', label: 'Location' },
    { value: 'industry', label: 'Industry' }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-4">
              Rural Business Directory
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-6">
              Discover and connect with businesses across rural and regional Australia
            </p>
            
            {/* Search Bar */}
            <SearchBar 
              onSearch={handleSearchChange}
              placeholder="Search by business name, location, or service..."
              initialValue={filters.search}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <FilterSidebar
                selectedStates={filters.selectedStates}
                selectedIndustries={filters.selectedIndustries}
                selectedRegions={filters.selectedRegions}
                availableRegions={regions} // `regions` is now from useBusinessData
                onStateChange={toggleStateFilter}
                onIndustryChange={toggleIndustryFilter}
                onRegionChange={toggleRegionFilter}
                onClearFilters={clearAllFilters}
                resultCount={businesses.length} // `businesses` is from useBusinessData
                totalCount={pagination.totalItems} // `pagination` is from useBusinessData
              />
            </div>
          </div>

          {/* Business Listings */}
          <div className="lg:col-span-3">
            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error.message || 'Could not load businesses.'}</span>
              </div>
            )}
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-stone-800">
                  {businesses.length === 0 ? 'No businesses found' :
                   businesses.length === 1 ? '1 business found' :
                   `${businesses.length} businesses found`}
                </h2>
                {hasActiveFilters && (
                  <p className="text-sm text-stone-600 mt-1">
                    Filters active - <button 
                      onClick={clearAllFilters}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      clear all
                    </button>
                  </p>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <label htmlFor="sort-select" className="text-sm font-medium text-stone-700">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  className="border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-600 border-t-transparent"></div>
                  <span className="text-stone-600">Searching...</span>
                </div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && businesses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4" role="img" aria-label="No results">🔍</div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">
                  No businesses found
                </h3>
                <p className="text-stone-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
                
                <div className="mt-6 text-sm text-stone-500">
                  <p>Popular searches:</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    <button 
                      onClick={() => handleSearchChange('grain')}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 transition-colors"
                    >
                      Grain
                    </button>
                    <button 
                      onClick={() => handleSearchChange('health')}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 transition-colors"
                    >
                      Health
                    </button>
                    <button 
                      onClick={() => handleSearchChange('transport')}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 transition-colors"
                    >
                      Transport
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Business Grid */}
            {!isLoading && businesses.length > 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {businesses.map((business) => (
                  <BusinessCard 
                    key={business.id} 
                    business={business}
                  />
                ))}
              </div>
            )}

            {/* Load More Button (for future pagination) */}
            {!isLoading && businesses.length > 0 && (
              <div className="mt-12 text-center">
                <button
                  disabled // This button can be enabled if pagination.currentPage < pagination.totalPages
                  // onClick={() => loadPage(pagination.currentPage + 1)} // Example for future
                  className="inline-flex items-center px-6 py-3 bg-stone-300 text-stone-500 font-medium rounded-lg cursor-not-allowed"
                >
                  Load More Businesses (Coming Soon)
                </button>
                <p className="text-sm text-stone-500 mt-2">
                  Showing {businesses.length} of {pagination.totalItems} results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-amber-50 border-t border-amber-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-stone-600 mb-6">
              We're constantly growing our directory of rural Australian businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                disabled
                className="inline-flex items-center px-6 py-3 bg-stone-300 text-stone-500 font-medium rounded-lg cursor-not-allowed"
              >
                <span className="mr-2" role="img" aria-label="Submit">📝</span>
                Submit a Business (Coming Soon)
              </button>
              <button
                disabled
                className="inline-flex items-center px-6 py-3 bg-stone-300 text-stone-500 font-medium rounded-lg cursor-not-allowed"
              >
                <span className="mr-2" role="img" aria-label="Contact">📧</span>
                Contact Us (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
