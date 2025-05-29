import React, { useState } from 'react';
import { industryCategories, australianStates } from '../data/businessData';

/**
 * FilterSidebar component for filtering business listings
 * Features collapsible sections and multi-select functionality
 */
const FilterSidebar = ({
  selectedStates,
  selectedIndustries,
  selectedRegions,
  availableRegions,
  onStateChange,
  onIndustryChange,
  onRegionChange,
  onClearFilters,
  resultCount,
  totalCount
}) => {
  // Collapsible section state
  const [expandedSections, setExpandedSections] = useState({
    states: true,
    industries: true,
    regions: false
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Check if any filters are active
  const hasActiveFilters = selectedStates.length > 0 || 
    selectedIndustries.length > 0 || 
    selectedRegions.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-stone-800">
          Filter Results
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 p-3 bg-stone-50 rounded-lg">
        <p className="text-sm text-stone-700">
          Showing <span className="font-semibold text-amber-700">{resultCount}</span> of{' '}
          <span className="font-semibold">{totalCount}</span> businesses
        </p>
      </div>

      {/* States Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('states')}
          className="flex items-center justify-between w-full text-left mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
          aria-expanded={expandedSections.states}
        >
          <h3 className="text-sm font-medium text-stone-800 uppercase tracking-wide">
            States & Territories
          </h3>
          <svg 
            className={`w-4 h-4 text-stone-500 transition-transform ${
              expandedSections.states ? 'rotate-180' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.states && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {australianStates.map((state) => (
              <label key={state.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedStates.includes(state.id)}
                  onChange={() => onStateChange(state.id)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                />
                <span className="ml-3 text-sm text-stone-700">
                  {state.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Industries Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('industries')}
          className="flex items-center justify-between w-full text-left mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
          aria-expanded={expandedSections.industries}
        >
          <h3 className="text-sm font-medium text-stone-800 uppercase tracking-wide">
            Industries
          </h3>
          <svg 
            className={`w-4 h-4 text-stone-500 transition-transform ${
              expandedSections.industries ? 'rotate-180' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.industries && (
          <div className="space-y-2">
            {industryCategories.map((industry) => (
              <label key={industry.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedIndustries.includes(industry.id)}
                  onChange={() => onIndustryChange(industry.id)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                />
                <span className="ml-3 text-sm text-stone-700 flex items-center">
                  <span className="mr-2" role="img" aria-hidden="true">
                    {industry.icon}
                  </span>
                  {industry.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Regions Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('regions')}
          className="flex items-center justify-between w-full text-left mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
          aria-expanded={expandedSections.regions}
        >
          <h3 className="text-sm font-medium text-stone-800 uppercase tracking-wide">
            Regions
          </h3>
          <svg 
            className={`w-4 h-4 text-stone-500 transition-transform ${
              expandedSections.regions ? 'rotate-180' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.regions && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableRegions.map((region) => (
              <label key={region} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(region)}
                  onChange={() => onRegionChange(region)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                />
                <span className="ml-3 text-sm text-stone-700">
                  {region}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-stone-200">
          <h4 className="text-sm font-medium text-stone-800 mb-3">Active Filters:</h4>
          <div className="space-y-2">
            {/* Selected States */}
            {selectedStates.map((stateId) => {
              const state = australianStates.find(s => s.id === stateId);
              return (
                <div key={stateId} className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded text-xs">
                  <span className="text-blue-800">{state?.name}</span>
                  <button
                    onClick={() => onStateChange(stateId)}
                    className="text-blue-600 hover:text-blue-800 ml-2"
                    aria-label={`Remove ${state?.name} filter`}
                  >
                    ×
                  </button>
                </div>
              );
            })}

            {/* Selected Industries */}
            {selectedIndustries.map((industryId) => {
              const industry = industryCategories.find(i => i.id === industryId);
              return (
                <div key={industryId} className="flex items-center justify-between bg-green-50 px-2 py-1 rounded text-xs">
                  <span className="text-green-800">{industry?.name}</span>
                  <button
                    onClick={() => onIndustryChange(industryId)}
                    className="text-green-600 hover:text-green-800 ml-2"
                    aria-label={`Remove ${industry?.name} filter`}
                  >
                    ×
                  </button>
                </div>
              );
            })}

            {/* Selected Regions */}
            {selectedRegions.map((region) => (
              <div key={region} className="flex items-center justify-between bg-amber-50 px-2 py-1 rounded text-xs">
                <span className="text-amber-800">{region}</span>
                <button
                  onClick={() => onRegionChange(region)}
                  className="text-amber-600 hover:text-amber-800 ml-2"
                  aria-label={`Remove ${region} filter`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
