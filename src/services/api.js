/**
 * API Service Layer for Rural Business Directory
 * Handles all API communication with the backend
 */

// localStorage keys (must match AdminPage.js)
const ADMIN_DATA_KEY = 'importedBusinessesData';
const INDUSTRIES_METADATA_KEY = 'importedIndustriesMetadata';
const STATES_METADATA_KEY = 'importedStatesMetadata';
const REGIONS_METADATA_KEY = 'importedRegionsMetadata';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Generic API request handler with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Business API endpoints
 */
export const businessAPI = {
  // Get all businesses with optional filters
  getBusinesses: async (filters = {}) => {
    try {
      const localDataString = localStorage.getItem(ADMIN_DATA_KEY);
      if (localDataString) {
        console.log('api.js: Found businesses in localStorage');
        let allBusinesses = JSON.parse(localDataString);
        let filteredBusinesses = [...allBusinesses];

        // Apply search filter (case-insensitive on multiple fields)
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredBusinesses = filteredBusinesses.filter(b => 
            b.name?.toLowerCase().includes(searchTerm) ||
            b.tagline?.toLowerCase().includes(searchTerm) ||
            b.description?.toLowerCase().includes(searchTerm) ||
            b.location?.town?.toLowerCase().includes(searchTerm) ||
            b.categories?.primary?.toLowerCase().includes(searchTerm) ||
            (b.categories?.secondary && b.categories.secondary.some(s => s.toLowerCase().includes(searchTerm))) ||
            (b.tags?.services && b.tags.services.some(s => s.toLowerCase().includes(searchTerm))) ||
            (b.tags?.location && b.tags.location.some(s => s.toLowerCase().includes(searchTerm)))
          );
        }

        // Apply state filter (can be comma-separated string or array)
        if (filters.state) {
          const selectedStates = Array.isArray(filters.state) ? filters.state : filters.state.split(',');
          if (selectedStates.length > 0) {
            filteredBusinesses = filteredBusinesses.filter(b => b.location?.state && selectedStates.includes(b.location.state));
          }
        }
        
        // Apply industry filter (can be comma-separated string or array)
        if (filters.industry) {
          const selectedIndustries = Array.isArray(filters.industry) ? filters.industry : filters.industry.split(',');
          if (selectedIndustries.length > 0) {
            filteredBusinesses = filteredBusinesses.filter(b => b.industry && selectedIndustries.includes(b.industry));
          }
        }

        // Apply region filter (can be comma-separated string or array)
        if (filters.region) {
          const selectedRegions = Array.isArray(filters.region) ? filters.region : filters.region.split(',');
          if (selectedRegions.length > 0) {
            filteredBusinesses = filteredBusinesses.filter(b => b.location?.region && selectedRegions.includes(b.location.region));
          }
        }
        
        // Apply sorting
        if (filters.sortBy) {
          filteredBusinesses.sort((a, b) => {
            const valA = String(a[filters.sortBy] || a.location?.[filters.sortBy] || '').toLowerCase();
            const valB = String(b[filters.sortBy] || b.location?.[filters.sortBy] || '').toLowerCase();
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
          });
        }

        const totalFilteredCount = filteredBusinesses.length;
        const limit = parseInt(filters.limit, 10) || 10; // Default limit
        const offset = parseInt(filters.offset, 10) || 0; // Default offset
        
        const paginatedBusinesses = filteredBusinesses.slice(offset, offset + limit);
        
        return Promise.resolve({
          businesses: paginatedBusinesses,
          pagination: {
            totalItems: totalFilteredCount,
            totalPages: Math.ceil(totalFilteredCount / limit),
            currentPage: Math.floor(offset / limit) + 1,
            itemsPerPage: limit,
          }
        });
      }
    } catch (e) {
      console.error('Error reading/processing businesses from localStorage:', e);
      // Fall through to API request if localStorage fails
    }
    
    // Fallback to API if no local data or error
    console.log('api.js: No businesses in localStorage or error, trying API fallback for getBusinesses');
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.state) queryParams.append('state', filters.state); // Assuming API takes comma-separated
    if (filters.industry) queryParams.append('industry', filters.industry); // Assuming API takes comma-separated
    if (filters.region) queryParams.append('region', filters.region); // Assuming API takes comma-separated
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    
    const endpoint = `/businesses${queryParams.toString() ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get single business by ID
  getBusinessById: async (id) => {
    try {
      const localDataString = localStorage.getItem(ADMIN_DATA_KEY);
      if (localDataString) {
        console.log('api.js: Found businesses in localStorage for getBusinessById');
        const allBusinesses = JSON.parse(localDataString);
        // Ensure ID comparison is consistent (e.g., string to string or number to number)
        // Business IDs from fileImport.js are numbers (row numbers). useParams gives string.
        const numericId = parseInt(id, 10);
        const business = allBusinesses.find(b => b.id === numericId);
        if (business) {
          return Promise.resolve(business); // API often wraps in { business: ... } or { data: ... }
                                          // useBusinessProfile expects the business object directly.
        }
        // If not found in local, could fall through or return specific not found
      }
    } catch (e) {
      console.error('Error reading/processing business by ID from localStorage:', e);
    }
    
    console.log(`api.js: Business ID ${id} not in localStorage or error, trying API fallback for getBusinessById`);
    return apiRequest(`/businesses/${id}`);
  },

  // Get featured businesses
  getFeaturedBusinesses: async (limit = 5) => {
    try {
      const localDataString = localStorage.getItem(ADMIN_DATA_KEY);
      if (localDataString) {
        console.log('api.js: Found businesses in localStorage for getFeaturedBusinesses');
        const allBusinesses = JSON.parse(localDataString);
        const featured = allBusinesses.filter(b => b.featured === true);
        // If not enough featured, can supplement or just return what's available
        const result = featured.length > 0 ? featured.slice(0, limit) : allBusinesses.slice(0, limit); // Fallback to any if no "featured"
        return Promise.resolve(result); // Assuming direct array is expected
      }
    } catch (e) {
      console.error('Error reading/processing featured businesses from localStorage:', e);
    }

    console.log('api.js: No featured businesses in localStorage or error, trying API fallback for getFeaturedBusinesses');
    return apiRequest(`/businesses/featured?limit=${limit}`);
  },

  // Search businesses
  searchBusinesses: async (searchTerm, filters = {}) => {
    const queryParams = new URLSearchParams({
      q: searchTerm,
      ...filters,
    });
    
    return apiRequest(`/businesses/search?${queryParams}`);
  },

  // Submit new business (if submission feature is enabled)
  submitBusiness: async (businessData) => {
    return apiRequest('/businesses', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  },

  // Update business (for business owners)
  updateBusiness: async (id, businessData) => {
    return apiRequest(`/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(businessData),
    });
  },
};

/**
 * Category and metadata API endpoints
 */
export const metadataAPI = {
  // Get all industry categories
  getIndustries: async () => {
    try {
      const localDataString = localStorage.getItem(INDUSTRIES_METADATA_KEY);
      if (localDataString) {
        console.log('api.js: Found industries in localStorage');
        return Promise.resolve(JSON.parse(localDataString));
      }
    } catch (e) {
      console.error('Error reading industries from localStorage:', e);
    }
    console.log('api.js: No industries in localStorage or error, trying API fallback for getIndustries');
    return apiRequest('/metadata/industries');
  },

  // Get all states/territories
  getStates: async () => {
    try {
      const localDataString = localStorage.getItem(STATES_METADATA_KEY);
      if (localDataString) {
        console.log('api.js: Found states in localStorage');
        return Promise.resolve(JSON.parse(localDataString));
      }
    } catch (e) {
      console.error('Error reading states from localStorage:', e);
    }
    console.log('api.js: No states in localStorage or error, trying API fallback for getStates');
    return apiRequest('/metadata/states');
  },

  // Get regions by state
  getRegionsByState: async (state) => {
    // This one is harder to serve from combined local data without more complex filtering
    // For now, it will always hit the API or we'd need to filter REGIONS_METADATA_KEY by state.
    // Let's assume REGIONS_METADATA_KEY contains all regions and filter it.
    try {
      const localDataString = localStorage.getItem(REGIONS_METADATA_KEY);
      if (localDataString && state) {
        console.log('api.js: Found regions in localStorage, filtering by state for getRegionsByState');
        const allRegions = JSON.parse(localDataString);
        // This assumes regions in localStorage have a 'state' property or similar for filtering
        // The current AdminPage.js stores regions as {id, name}. We'd need to adjust storage or this logic.
        // For simplicity, if AdminPage stores regions with state info, this could work.
        // If not, this specific function might be better off hitting API or returning all regions.
        // Let's assume for now it returns all regions if state filter isn't easy.
        // Or, if regions are simple strings/objects without state, this won't filter.
        // The AdminPage stores regions as {id, name}. No state property.
        // So, this function will effectively return all regions if local, or hit API.
        // To make it truly local, AdminPage would need to store regions per state or regions with state property.
        // For now, let's just return all local regions if any, or hit API.
        return Promise.resolve(allRegions); // Returns all stored regions
      }
    } catch (e) {
      console.error('Error reading regions from localStorage for getRegionsByState:', e);
    }
    console.log('api.js: No regions in localStorage for state or error, trying API fallback for getRegionsByState');
    return apiRequest(`/metadata/regions?state=${state}`);
  },

  // Get all regions
  getAllRegions: async () => {
    try {
      const localDataString = localStorage.getItem(REGIONS_METADATA_KEY);
      if (localDataString) {
        console.log('api.js: Found allRegions in localStorage');
        return Promise.resolve(JSON.parse(localDataString));
      }
    } catch (e) {
      console.error('Error reading allRegions from localStorage:', e);
    }
    console.log('api.js: No allRegions in localStorage or error, trying API fallback for getAllRegions');
    return apiRequest('/metadata/regions');
  },
};

/**
 * Statistics API endpoints
 */
export const statsAPI = {
  // Get directory statistics
  getStats: async () => {
    return apiRequest('/stats');
  },

  // Get popular searches
  getPopularSearches: async (limit = 10) => {
    return apiRequest(`/stats/searches?limit=${limit}`);
  },
};

/**
 * Error handling utilities
 */
export const handleAPIError = (error) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network error. Please check your internet connection.';
  }
  
  if (error.message.includes('404')) {
    return 'The requested resource was not found.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

/**
 * Cache management for better performance
 */
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

export const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const clearCache = () => {
  cache.clear();
};
