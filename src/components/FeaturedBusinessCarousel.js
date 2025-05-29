import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatLocation } from '../utils/searchUtils';
import { industryCategories } from '../data/businessData';

/**
 * FeaturedBusinessCarousel component for showcasing highlighted businesses
 * Features automatic rotation and manual navigation controls
 */
const FeaturedBusinessCarousel = ({ businesses, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Get featured businesses (first 5 for carousel)
  const featuredBusinesses = businesses.slice(0, 5);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || featuredBusinesses.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % featuredBusinesses.length
      );
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, featuredBusinesses.length, interval]);

  // Navigation handlers
  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredBusinesses.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % featuredBusinesses.length
    );
    setIsAutoPlaying(false);
  };

  // Resume auto-play
  const resumeAutoPlay = () => {
    setIsAutoPlaying(true);
  };

  if (featuredBusinesses.length === 0) {
    return null;
  }

  const currentBusiness = featuredBusinesses[currentIndex];
  const industryInfo = industryCategories.find(cat => cat.id === currentBusiness.industry);
  const industryIcon = industryInfo?.icon || '🏢';

  return (
    <div className="relative bg-gradient-to-r from-amber-50 to-green-50 rounded-xl overflow-hidden shadow-lg">
      {/* Carousel Content */}
      <div 
        className="relative h-80 lg:h-96"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={resumeAutoPlay}
      >
        <div className="absolute inset-0 p-6 lg:p-8 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Business Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-2xl" role="img" aria-label={`${currentBusiness.industry} industry`}>
                    {industryIcon}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-stone-800 leading-tight">
                    {currentBusiness.name}
                  </h3>
                  <p className="text-lg text-stone-600">
                    {formatLocation(currentBusiness.location)}
                  </p>
                </div>
              </div>

              <p className="text-lg text-amber-700 font-medium italic">
                {currentBusiness.tagline}
              </p>

              <p className="text-stone-700 leading-relaxed line-clamp-3">
                {currentBusiness.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {currentBusiness.categories.primary}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {currentBusiness.location.region}
                </span>
              </div>

              <Link
                to={`/business/${currentBusiness.id}`}
                className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label={`Learn more about ${currentBusiness.name}`}
              >
                Learn More
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Featured Badge */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-6xl mb-4" role="img" aria-label="Featured business">
                  ⭐
                </div>
                <h4 className="text-xl font-semibold text-stone-800 mb-2">
                  Featured Business
                </h4>
                <p className="text-stone-600">
                  Showcasing excellence in rural Australia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={goToPrevious}
          className="ml-4 p-2 bg-white/80 hover:bg-white text-stone-800 rounded-full shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Previous featured business"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={goToNext}
          className="mr-4 p-2 bg-white/80 hover:bg-white text-stone-800 rounded-full shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Next featured business"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {featuredBusinesses.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                index === currentIndex
                  ? 'bg-amber-600'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Auto-play Indicator */}
      {isAutoPlaying && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full text-sm text-stone-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Auto-playing</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedBusinessCarousel;
