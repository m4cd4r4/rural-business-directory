import React from 'react';
import { Link } from 'react-router-dom';
import { formatLocation, truncateText } from '../utils/searchUtils';
import { industryCategories } from '../data/businessData';

/**
 * BusinessCard component for displaying business information in directory listings
 * Features responsive design with hover effects and accessibility support
 */
const BusinessCard = ({ business, showFullDescription = false }) => {
  // Get industry icon from categories data
  const industryInfo = industryCategories.find(cat => cat.id === business.industry);
  const industryIcon = industryInfo?.icon || '🏢';

  // Truncate description for card view
  const displayDescription = showFullDescription 
    ? business.description 
    : truncateText(business.description, 120);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 hover:shadow-md hover:border-amber-200 transition-all duration-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
              <span className="text-xl" role="img" aria-label={`${business.industry} industry`}>
                {industryIcon}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-stone-800 truncate">
                {business.name}
              </h3>
              <p className="text-sm text-stone-600">
                {formatLocation(business.location)}
              </p>
            </div>
          </div>
        </div>

        {/* Industry Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {business.categories.primary}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {business.location.region}
          </span>
        </div>

        {/* Tagline */}
        <p className="text-sm text-amber-700 font-medium italic mb-3 line-clamp-2">
          {business.tagline}
        </p>

        {/* Description */}
        <p className="text-stone-700 text-sm leading-relaxed mb-4">
          {displayDescription}
          {!showFullDescription && business.description.length > 120 && (
            <span className="text-amber-600 ml-1">Read more...</span>
          )}
        </p>

        {/* Key Features Preview */}
        {business.keyFeatures && business.keyFeatures.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-stone-800 mb-2">Key Features:</h4>
            <ul className="text-xs text-stone-600 space-y-1">
              {business.keyFeatures.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 flex-shrink-0">•</span>
                  <span className="truncate">{feature}</span>
                </li>
              ))}
              {business.keyFeatures.length > 3 && (
                <li className="text-amber-600 text-xs">
                  +{business.keyFeatures.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Service Tags */}
        {business.tags.services && business.tags.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {business.tags.services.slice(0, 3).map((service, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-stone-100 text-stone-700"
              >
                {service}
              </span>
            ))}
            {business.tags.services.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-stone-100 text-stone-700">
                +{business.tags.services.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-stone-50 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <div className="text-xs text-stone-500">
            ANZSIC: {business.categories.anzsicCode}
          </div>
          <Link
            to={`/business/${business.id}`}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 hover:border-amber-300 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label={`View details for ${business.name}`}
          >
            View Details
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
