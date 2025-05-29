import { useState, useEffect, useCallback, useMemo } from 'react';
import { businessAPI, metadataAPI, handleAPIError, getCachedData, setCachedData } from '../services/api';
import { debounce } from '../utils/searchUtils';

/**
 * Enhanced business data hook with API integration
 * Replaces the original useBusinessSearch hook
 */
export const useBusinessData = () => {
  // Data state
  const [businesses, setBusinesses] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [states, setStates] = useState([]);
  const [regions, setRegions] = useState([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    selectedStates: [],
    selectedIndustries: [],
    selectedRegions: [],
    sortBy: 'name'
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  /**
   * Load initial metadata (industries, states, regions)
   */
  const loadMetadata = useCallback(async () => {
    try {
      // Check cache first
      const cachedIndustries = getCachedData('industries');
      const cachedStates = getCachedData('states');
      const cachedRegions = getCachedData('regions');

      if (cachedIndustries && cachedStates && cachedRegions) {
        setIndustries(cachedIndustries);
        setStates(cachedStates);
        setRegions(cachedRegions);
        return;
      }

      // Load from API
      const [industriesData, statesData, regionsData] = await Promise.all([
        metadataAPI.getIndustries(),
        metadataAPI.getStates(),
        metadataAPI.getAllRegions()
      ]);

      setIndustries(industriesData);
      setStates(statesData);
      setRegions(regionsData);

      // Cache the data
      setCachedData('industries', industriesData);
      setCachedData('states', statesData);
      setCachedData('regions', regionsData);

    } catch (err) {
      console.error('Failed to load metadata:', err);
      setError(handleAPIError(err));
    }
  }, []);

  /**
   * Load businesses with current filters
   */
  const loadBusinesses = useCallback(async (newFilters = filters, page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiFilters = {
        search: newFilters.search,
        state: newFilters.selectedStates.join(','),
        industry: newFilters.selectedIndustries.join(','),
        region: newFilters.selectedRegions.join(','),
        sortBy: newFilters.sortBy,
        limit: pagination.itemsPerPage,
        offset: (page - 1) * pagination.itemsPerPage
      };

      // Remove empty filters
      Object.keys(apiFilters).forEach(key => {
        if (!apiFilters[key] || apiFilters[key] === '') {
          delete apiFilters[key];
        }
      });

      const response = await businessAPI.getBusinesses(apiFilters);
      
      setBusinesses(response.businesses || response.data || response);
      
      // Update pagination if provided by API
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          currentPage: page,
          totalPages: response.pagination.totalPages,
          totalItems: response.pagination.totalItems
        }));
      }

    } catch (err) {
      console.error('Failed to load businesses:', err);
      setError(handleAPIError(err));
      setBusinesses([]);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, [filters, pagination.itemsPerPage]);

  /**
   * Load featured businesses for homepage
   */
  const loadFeaturedBusinesses = useCallback(async () => {
    try {
      const cached = getCachedData('featured-businesses');
      if (cached) {
        setFeaturedBusinesses(cached);
        return;
      }

      const response = await businessAPI.getFeaturedBusinesses(5);
      const featured = response.businesses || response.data || response;
      
      setFeaturedBusinesses(featured);
      setCachedData('featured-businesses', featured);

    } catch (err) {
      console.error('Failed to load featured businesses:', err);
      // Don't set error for featured businesses as it's not critical
    }
  }, []);

  /**
   * Debounced search function
   */
  const debouncedSearch = useMemo(
    () => debounce((searchTerm) => {
      const newFilters = { ...filters, search: searchTerm };
      setFilters(newFilters);
      loadBusinesses(newFilters, 1);
    }, 300),
    [filters, loadBusinesses]
  );

  /**
   * Handle search input changes
   */
  const handleSearchChange = useCallback((searchTerm) => {
    debouncedSearch(searchTerm);
  }, [debouncedSearch]);

  /**
   * Update filters and reload data
   */
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    loadBusinesses(updatedFilters, 1);
  }, [filters, loadBusinesses]);

  /**
   * Toggle filter selections
   */
  const toggleFilter = useCallback((filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    updateFilters({ [filterType]: newValues });
  }, [filters, updateFilters]);

  /**
   * Clear all filters
   */
  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      search: '',
      selectedStates: [],
      selectedIndustries: [],
      selectedRegions: [],
      sortBy: 'name'
    };
    setFilters(clearedFilters);
    loadBusinesses(clearedFilters, 1);
  }, [loadBusinesses]);

  /**
   * Load specific page
   */
  const loadPage = useCallback((page) => {
    loadBusinesses(filters, page);
  }, [filters, loadBusinesses]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(() => {
    loadMetadata();
    loadBusinesses(filters, pagination.currentPage);
    loadFeaturedBusinesses();
  }, [loadMetadata, loadBusinesses, loadFeaturedBusinesses, filters, pagination.currentPage]);

  // Load initial data
  useEffect(() => {
    loadMetadata();
    loadBusinesses();
    loadFeaturedBusinesses();
  }, []); // Only run once on mount

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.search || 
           filters.selectedStates.length > 0 || 
           filters.selectedIndustries.length > 0 || 
           filters.selectedRegions.length > 0;
  }, [filters]);

  return {
    // Data
    businesses,
    featuredBusinesses,
    industries,
    states,
    regions,
    
    // State
    isLoading,
    error,
    hasLoaded,
    filters,
    pagination,
    hasActiveFilters,
    
    // Actions
    handleSearchChange,
    updateFilters,
    toggleFilter,
    clearAllFilters,
    loadPage,
    refreshData,
    
    // Specific toggle functions for backwards compatibility
    toggleStateFilter: (state) => toggleFilter('selectedStates', state),
    toggleIndustryFilter: (industry) => toggleFilter('selectedIndustries', industry),
    toggleRegionFilter: (region) => toggleFilter('selectedRegions', region),
  };
};

/**
 * Hook for loading individual business data
 */
export const useBusinessProfile = (businessId) => {
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBusiness = useCallback(async () => {
    if (!businessId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = getCachedData(`business-${businessId}`);
      if (cached) {
        setBusiness(cached);
        setIsLoading(false);
        return;
      }

      const response = await businessAPI.getBusinessById(businessId);
      const businessData = response.business || response.data || response;
      
      setBusiness(businessData);
      setCachedData(`business-${businessId}`, businessData);

    } catch (err) {
      console.error('Failed to load business:', err);
      setError(handleAPIError(err));
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    loadBusiness();
  }, [loadBusiness]);

  return {
    business,
    isLoading,
    error,
    reload: loadBusiness
  };
};
