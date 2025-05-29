import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FeaturedBusinessCarousel from '../components/FeaturedBusinessCarousel';
import { useBusinessData } from '../hooks/useBusinessData';

/**
 * HomePage component - Main landing page for the Rural Business Directory
 * Features hero section, search functionality, and featured business carousel
 */
const HomePage = () => {
  // Use new data hook for featuredBusinesses, all businesses (for counts), and industries
  const { 
    featuredBusinesses, 
    businesses, // Used for industry counts and total stats
    industries, // Replaces industryCategories
    pagination, // For total business count in stats
    isLoading, // Potentially for loading states
    error      // Potentially for error display
  } = useBusinessData();

  // Handle search from homepage (redirect to directory with search term)
  // This function remains as its purpose is navigation, not filtering current page data.
  const handleHomeSearch = (searchTerm) => {
    // In a real app, you would use navigate() from react-router-dom
    // For now, we'll just log the search term
    console.log('Search term:', searchTerm);
    // Example: navigate(`/directory?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-amber-50 via-green-50 to-stone-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Main Heading */}
            <h1 className="text-4xl lg:text-6xl font-bold text-stone-800 mb-6 leading-tight">
              Discover Rural Australia's
              <span className="block text-amber-600">Business Community</span>
            </h1>
            
            {/* Mission Statement */}
            <p className="text-xl lg:text-2xl text-stone-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Connecting Australia's rural communities — discover local businesses, 
              services, and innovation across our regional heartland.
            </p>

            {/* Australian Icons */}
            <div className="flex justify-center space-x-4 mb-8">
              <span className="text-4xl" role="img" aria-label="Australian landscape">🌾</span>
              <span className="text-4xl" role="img" aria-label="Kangaroo">🦘</span>
              <span className="text-4xl" role="img" aria-label="Southern Cross">⭐</span>
              <span className="text-4xl" role="img" aria-label="Boomerang">🪃</span>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <SearchBar 
                onSearch={handleHomeSearch}
                placeholder="Search businesses, towns, or services across rural Australia..."
                showSearchButton={true}
              />
            </div>

            {/* Quick Access Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/directory"
                className="inline-flex items-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <span className="mr-2" role="img" aria-label="Directory">📋</span>
                Browse All Businesses
              </Link>
              <button
                disabled
                className="inline-flex items-center px-8 py-4 bg-stone-300 text-stone-500 font-semibold rounded-lg cursor-not-allowed"
              >
                <span className="mr-2" role="img" aria-label="Add business">➕</span>
                Submit Your Business (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-4">
              Featured Rural Businesses
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Showcasing the diversity and innovation of Australia's rural business community
            </p>
          </div>

          {/* Display loading or error for featured businesses if desired */}
          {isLoading && !featuredBusinesses?.length && <p className="text-center">Loading featured businesses...</p>}
          {error && <p className="text-center text-red-500">Could not load featured businesses.</p>}
          {featuredBusinesses && featuredBusinesses.length > 0 && (
            <FeaturedBusinessCarousel businesses={featuredBusinesses} />
          )}
          {!isLoading && !error && featuredBusinesses?.length === 0 && (
            <p className="text-center">No featured businesses available at the moment.</p>
          )}
        </div>
      </section>

      {/* Industry Categories Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-4">
              Explore by Industry
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              From agriculture to tourism, discover the businesses that power rural Australia
            </p>
          </div>

          {isLoading && !industries?.length && <p className="text-center">Loading industries...</p>}
          {industries && industries.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {industries.map((industry) => {
                // Assuming `businesses` from useBusinessData contains all businesses for accurate counting here
                // And assuming `industry.id` is the correct field for matching.
                const businessCount = businesses ? businesses.filter(b => b.industry === industry.id).length : 0;
                
                return (
                  <Link
                    key={industry.id} // Assuming industry objects have an 'id'
                    to={`/directory?industry=${industry.id}`} // Assuming industry objects have an 'id'
                  className="group bg-white rounded-lg p-6 shadow-sm border border-stone-200 hover:shadow-md hover:border-amber-200 transition-all transform hover:scale-105"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3" role="img" aria-label={industry.name}>
                      {industry.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
                      {industry.name} {/* Assuming industry objects have a 'name' */}
                    </h3>
                    <p className="text-sm text-stone-600">
                      {businessCount} {businessCount === 1 ? 'business' : 'businesses'}
                    </p>
                  </div>
                </Link>
              );
            })}
            </div>
          )}
          {!isLoading && industries?.length === 0 && (
            <p className="text-center">No industries to display at the moment.</p>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Rural Australia by the Numbers
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Supporting the backbone of Australia's economy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {isLoading ? '...' : (pagination?.totalItems || businesses?.length || 0)}
              </div>
              <div className="text-lg opacity-90">Businesses Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {isLoading ? '...' : (industries?.length || 0)}
              </div>
              <div className="text-lg opacity-90">Industry Categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                8
              </div>
              <div className="text-lg opacity-90">States & Territories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                100%
              </div>
              <div className="text-lg opacity-90">Community Focused</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-lg text-stone-600 mb-8 leading-relaxed">
            Help us showcase the incredible diversity and innovation of rural Australian businesses. 
            Whether you're a family farm, local service provider, or regional manufacturer, 
            your story matters to our community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/directory"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span className="mr-2" role="img" aria-label="Explore">🔍</span>
              Explore Directory
            </Link>
            <button
              disabled
              className="inline-flex items-center justify-center px-8 py-4 bg-stone-300 text-stone-500 font-semibold rounded-lg cursor-not-allowed"
            >
              <span className="mr-2" role="img" aria-label="Share">📝</span>
              Share Your Story (Coming Soon)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
