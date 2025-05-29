import { useState, useEffect, useMemo } from 'react';
import { filterBusinesses, sortBusinesses, debounce } from '../utils/searchUtils';

/**
 * Custom hook for managing business search and filtering functionality
 * @param {Array} businessData - Array of business objects to search/filter
 * @returns {Object} Search state and handlers
 */
export const useBusinessSearch = (businessData) => {
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search to avoid excessive filtering
  const debouncedSearch = useMemo(
    () => debounce((term) => {
      setSearchTerm(term);
      setIsLoading(false);
    }, 300),
    []
  );

  // Handle search input with loading state
  const handleSearchChange = (value) => {
    setIsLoading(true);
    debouncedSearch(value);
  };

  // Filtered and sorted results
  const filteredBusinesses = useMemo(() => {
    const filters = {
      searchTerm,
      selectedStates,
      selectedIndustries,
      selectedRegions
    };

    const filtered = filterBusinesses(businessData, filters);
    return sortBusinesses(filtered, sortBy);
  }, [businessData, searchTerm, selectedStates, selectedIndustries, selectedRegions, sortBy]);

  // Reset all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedStates([]);
    setSelectedIndustries([]);
    setSelectedRegions([]);
    setSortBy('name');
  };

  // Toggle filter selections
  const toggleStateFilter = (state) => {
    setSelectedStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const toggleIndustryFilter = (industry) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const toggleRegionFilter = (region) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || 
    selectedStates.length > 0 || 
    selectedIndustries.length > 0 || 
    selectedRegions.length > 0;

  return {
    // State
    searchTerm,
    selectedStates,
    selectedIndustries,
    selectedRegions,
    sortBy,
    isLoading,
    filteredBusinesses,
    hasActiveFilters,
    
    // Handlers
    handleSearchChange,
    setSelectedStates,
    setSelectedIndustries,
    setSelectedRegions,
    setSortBy,
    toggleStateFilter,
    toggleIndustryFilter,
    toggleRegionFilter,
    clearAllFilters
  };
};
