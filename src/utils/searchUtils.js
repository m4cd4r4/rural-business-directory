/**
 * Utility functions for searching and filtering business data
 */

/**
 * Filters businesses based on search criteria
 * @param {Array} businesses - Array of business objects
 * @param {Object} filters - Filter criteria object
 * @returns {Array} Filtered array of businesses
 */
export const filterBusinesses = (businesses, filters) => {
  const { searchTerm, selectedStates, selectedIndustries, selectedRegions } = filters;

  return businesses.filter(business => {
    // Text search across multiple fields
    const matchesSearch = !searchTerm || 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.location.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.location.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.categories.primary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.tags.services.some(service => 
        service.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // State filter
    const matchesState = selectedStates.length === 0 || 
      selectedStates.includes(business.location.state);

    // Industry filter
    const matchesIndustry = selectedIndustries.length === 0 || 
      selectedIndustries.includes(business.industry);

    // Region filter
    const matchesRegion = selectedRegions.length === 0 || 
      selectedRegions.includes(business.location.region);

    return matchesSearch && matchesState && matchesIndustry && matchesRegion;
  });
};

/**
 * Sorts businesses by specified criteria
 * @param {Array} businesses - Array of business objects
 * @param {string} sortBy - Sort criteria ('name', 'location', 'industry')
 * @returns {Array} Sorted array of businesses
 */
export const sortBusinesses = (businesses, sortBy) => {
  const sorted = [...businesses];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'location':
      return sorted.sort((a, b) => {
        const locationA = `${a.location.town}, ${a.location.state}`;
        const locationB = `${b.location.town}, ${b.location.state}`;
        return locationA.localeCompare(locationB);
      });
    case 'industry':
      return sorted.sort((a, b) => a.industry.localeCompare(b.industry));
    default:
      return sorted;
  }
};

/**
 * Gets unique values from business data for filter options
 * @param {Array} businesses - Array of business objects
 * @param {string} field - Field to extract unique values from
 * @returns {Array} Array of unique values
 */
export const getUniqueValues = (businesses, field) => {
  const values = new Set();
  
  businesses.forEach(business => {
    switch (field) {
      case 'states':
        values.add(business.location.state);
        break;
      case 'regions':
        values.add(business.location.region);
        break;
      case 'industries':
        values.add(business.industry);
        break;
      case 'towns':
        values.add(business.location.town);
        break;
      default:
        break;
    }
  });

  return Array.from(values).sort();
};

/**
 * Validates search input and sanitizes it
 * @param {string} input - User search input
 * @returns {string} Sanitized search term
 */
export const sanitizeSearchInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove potentially harmful characters and trim whitespace
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Debounce function to limit search frequency
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Formats location string for display
 * @param {Object} location - Location object with town, state, region
 * @returns {string} Formatted location string
 */
export const formatLocation = (location) => {
  return `${location.town}, ${location.state}`;
};

/**
 * Formats location with region for detailed display
 * @param {Object} location - Location object with town, state, region
 * @returns {string} Formatted location string with region
 */
export const formatLocationWithRegion = (location) => {
  return `${location.town}, ${location.region}, ${location.state}`;
};

/**
 * Truncates text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};
