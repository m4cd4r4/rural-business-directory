import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBusinessProfile, useBusinessData } from '../hooks/useBusinessData';
import { formatLocationWithRegion } from '../utils/searchUtils';

/**
 * BusinessProfilePage component - Detailed view of individual business profiles
 * Features comprehensive business information with accessible design
 */
const BusinessProfilePage = () => {
  const { id } = useParams();
  const { business, isLoading, error, reload: reloadBusiness } = useBusinessProfile(id);
  // Fetch industries for icons/names and allBusinesses for "Similar Businesses"
  const { industries, businesses: allBusinesses, isLoading: metadataLoading, error: metadataError } = useBusinessData();

  if (isLoading || metadataLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
          <span className="text-xl text-stone-700">Loading Business Details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <div className="text-6xl mb-4 text-red-500" role="img" aria-label="Error">😟</div>
          <h1 className="text-2xl font-bold text-stone-800 mb-4">Error Loading Business</h1>
          <p className="text-stone-600 mb-6">
            {error.message || "We couldn't fetch the business details. Please try again later."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => reloadBusiness()}
              className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/directory"
              className="inline-flex items-center px-6 py-3 bg-stone-500 hover:bg-stone-600 text-white font-medium rounded-lg transition-colors"
            >
              Back to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!business) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <div className="text-6xl mb-4" role="img" aria-label="Not found">❓</div>
          <h1 className="text-2xl font-bold text-stone-800 mb-4">Business Not Found</h1>
          <p className="text-stone-600 mb-6">
            The business you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/directory"
            className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  // Get industry information
  const industryInfo = industries?.find(cat => cat.id === business.industry);
  const industryIcon = industryInfo?.icon || '🏢';

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            <Link
              to="/"
              className="text-stone-500 hover:text-stone-700 transition-colors"
            >
              Home
            </Link>
            <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link
              to="/directory"
              className="text-stone-500 hover:text-stone-700 transition-colors"
            >
              Directory
            </Link>
            <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-stone-800 font-medium truncate">
              {business.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Business Profile Header */}
      <div className="bg-gradient-to-r from-amber-50 to-green-50 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start space-x-6">
            {/* Business Icon */}
            <div className="bg-white p-4 rounded-xl shadow-sm flex-shrink-0">
              <span className="text-4xl" role="img" aria-label={`${business.industry} industry`}>
                {industryIcon}
              </span>
            </div>

            {/* Business Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-2">
                {business.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <p className="text-lg text-stone-600 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {formatLocationWithRegion(business.location)}
                </p>
              </div>

              <p className="text-xl text-amber-700 font-medium italic mb-6">
                {business.tagline}
              </p>

              {/* Category Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {business.categories.primary}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  ANZSIC: {business.categories.anzsicCode}
                </span>
                {business.categories.secondary.map((category, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-stone-800 mb-4">About This Business</h2>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
                <p className="text-stone-700 leading-relaxed text-lg">
                  {business.description}
                </p>
              </div>
            </section>

            {/* Key Features */}
            <section>
              <h2 className="text-2xl font-bold text-stone-800 mb-4">Key Features & Services</h2>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
                <ul className="space-y-3">
                  {business.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 flex-shrink-0 mt-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-stone-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Service Tags */}
            <section>
              <h2 className="text-2xl font-bold text-stone-800 mb-4">Services & Specialties</h2>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
                <div className="flex flex-wrap gap-2">
                  {business.tags.services.map((service, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-stone-100 text-stone-700 border border-stone-200"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200 sticky top-8">
              <h3 className="text-lg font-semibold text-stone-800 mb-4">Quick Information</h3>
              
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-stone-600">Industry</dt>
                  <dd className="text-stone-800 flex items-center">
                    <span className="mr-2" role="img" aria-hidden="true">{industryIcon}</span>
                    {industryInfo?.name || business.industry}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-stone-600">Location</dt>
                  <dd className="text-stone-800">
                    <div>{business.location.town}</div>
                    <div className="text-sm text-stone-600">
                      {business.location.region}, {business.location.state}
                    </div>
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-stone-600">Primary Category</dt>
                  <dd className="text-stone-800">{business.categories.primary}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-stone-600">ANZSIC Code</dt>
                  <dd className="text-stone-800 font-mono">{business.categories.anzsicCode}</dd>
                </div>

                {/* Contact Information */}
                {business.contact?.phone && (
                  <div>
                    <dt className="text-sm font-medium text-stone-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-stone-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Phone
                    </dt>
                    <dd className="text-stone-800">
                      <a href={`tel:${business.contact.phone}`} className="hover:text-amber-600">{business.contact.phone}</a>
                    </dd>
                  </div>
                )}
                {business.contact?.email && (
                  <div>
                    <dt className="text-sm font-medium text-stone-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-stone-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Email
                    </dt>
                    <dd className="text-stone-800">
                      <a href={`mailto:${business.contact.email}`} className="hover:text-amber-600 truncate block">{business.contact.email}</a>
                    </dd>
                  </div>
                )}
                {business.contact?.website && (
                  <div>
                    <dt className="text-sm font-medium text-stone-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-stone-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-4-4a2 2 0 012.828-2.828L8 7.172l2.586-2.586zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M4.343 15.657a2 2 0 010-2.828l7-7a2 2 0 012.828 0l1.414 1.414-1.414 1.414a4 4 0 00-5.656 5.656l-3 3a2 2 0 01-2.828-2.828l1.414-1.414L4.343 15.657z" clipRule="evenodd" />
                      </svg>
                      Website
                    </dt>
                    <dd className="text-stone-800">
                      <a href={business.contact.website.startsWith('http') ? business.contact.website : `https://${business.contact.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 truncate block">
                        {business.contact.website}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  disabled
                  className="w-full bg-stone-300 text-stone-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
                >
                  📞 Contact Business (Coming Soon)
                </button>
                
                <button
                  disabled
                  className="w-full bg-stone-300 text-stone-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
                >
                  📍 View on Map (Coming Soon)
                </button>
                
                <button
                  disabled
                  className="w-full bg-stone-300 text-stone-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
                >
                  📤 Share Business (Coming Soon)
                </button>
              </div>
            </div>

            {/* Related Businesses */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
              <h3 className="text-lg font-semibold text-stone-800 mb-4">Similar Businesses</h3>
              <div className="space-y-3">
                {allBusinesses && allBusinesses.length > 0 ? (
                  allBusinesses
                  .filter(b => 
                    b.id !== business.id && 
                    (b.industry === business.industry || b.location?.state === business.location?.state)
                  )
                  .slice(0, 3)
                  .map((relatedBusiness) => {
                    const relatedIndustryInfo = industries?.find(cat => cat.id === relatedBusiness.industry);
                    return (
                      <Link
                        key={relatedBusiness.id}
                        to={`/business/${relatedBusiness.id}`}
                        className="block p-3 rounded-lg border border-stone-200 hover:border-amber-200 hover:bg-amber-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg" role="img" aria-hidden="true">
                            {relatedIndustryInfo?.icon || '🏢'}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium text-stone-800 truncate">
                              {relatedBusiness.name}
                            </h4>
                            <p className="text-xs text-stone-600">
                              {relatedBusiness.location.town}, {relatedBusiness.location.state}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-sm text-stone-500 italic">Loading similar businesses...</p>
                )}
                
                {allBusinesses && allBusinesses.filter(b => 
                  b.id !== business.id && 
                  (b.industry === business.industry || b.location?.state === business.location?.state)
                ).length === 0 && (
                  <p className="text-sm text-stone-500 italic">
                    No similar businesses found.
                  </p>
                )}
              </div>
              
              <Link
                to={`/directory?industry=${business.industry}`}
                className="block mt-4 text-center text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View all {industryInfo?.name || business.industry} businesses →
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-stone-200">
          <Link
            to="/directory"
            className="inline-flex items-center px-6 py-3 bg-stone-600 hover:bg-stone-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
          >
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Directory
          </Link>
          
          <div className="flex items-center space-x-4 text-sm text-stone-500">
            <span>Found this helpful?</span>
            <button
              disabled
              className="text-amber-600 hover:text-amber-700 font-medium cursor-not-allowed opacity-50"
            >
              Share this business
            </button>
          </div>
        </div>
      </div>

      {/* Location Tags for SEO/Context */}
      <div className="bg-stone-100 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-stone-600 mb-3">
              This business serves the {business.location.region} region
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {business.tags.location.map((locationTag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-stone-200 text-stone-700"
                >
                  📍 {locationTag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;
