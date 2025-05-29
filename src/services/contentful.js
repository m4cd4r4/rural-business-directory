/**
 * Contentful CMS Integration for Rural Business Directory
 * Provides headless CMS solution with excellent developer experience
 */

import { createClient } from 'contentful';

// Contentful client configuration
const contentfulClient = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.REACT_APP_CONTENTFUL_ENVIRONMENT || 'master'
});

// Management client for write operations (requires management token)
let managementClient = null;
if (process.env.REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN) {
  import('contentful-management').then(({ createClient: createMgmtClient }) => {
    managementClient = createMgmtClient({
      accessToken: process.env.REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN
    });
  });
}

/**
 * Transform Contentful business data to application format
 */
const transformContentfulBusinessData = (entry) => {
  const fields = entry.fields;
  
  return {
    id: entry.sys.id,
    name: fields.name,
    location: {
      town: fields.town,
      state: fields.state,
      region: fields.region
    },
    tagline: fields.tagline,
    description: fields.description,
    keyFeatures: fields.keyFeatures || [],
    categories: {
      primary: fields.primaryCategory,
      anzsicCode: fields.anzsicCode,
      secondary: fields.secondaryCategories || []
    },
    tags: {
      location: fields.locationTags || [],
      services: fields.serviceTags || []
    },
    industry: fields.industry?.fields?.slug || fields.industrySlug,
    featured: fields.featured || false,
    // Handle asset fields
    logo: fields.logo?.fields?.file?.url ? 
      `https:${fields.logo.fields.file.url}` : null,
    images: fields.images?.map(img => 
      `https:${img.fields.file.url}`
    ) || [],
    // Contentful metadata
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
    contentfulId: entry.sys.id
  };
};

/**
 * Contentful business API functions
 */
export const contentfulBusinessAPI = {
  // Get all businesses with filtering
  getBusinesses: async (filters = {}) => {
    const query = {
      content_type: 'business',
      include: 2, // Include referenced entries
      limit: filters.limit || 25,
      skip: filters.offset || 0,
      order: filters.sortBy ? `fields.${filters.sortBy}` : 'fields.name'
    };

    // Add search filter
    if (filters.search) {
      query['query'] = filters.search;
    }

    // Add field-specific filters
    if (filters.state) {
      query['fields.state'] = filters.state;
    }
    if (filters.region) {
      query['fields.region'] = filters.region;
    }
    if (filters.industry) {
      query['fields.industry.fields.slug'] = filters.industry;
    }
    if (filters.featured) {
      query['fields.featured'] = true;
    }

    try {
      const response = await contentfulClient.getEntries(query);
      
      return {
        businesses: response.items.map(transformContentfulBusinessData),
        pagination: {
          currentPage: Math.floor((filters.offset || 0) / (filters.limit || 25)) + 1,
          totalItems: response.total,
          totalPages: Math.ceil(response.total / (filters.limit || 25)),
          itemsPerPage: filters.limit || 25
        }
      };
    } catch (error) {
      console.error('Contentful getBusinesses error:', error);
      throw error;
    }
  },

  // Get single business by ID
  getBusinessById: async (id) => {
    try {
      const entry = await contentfulClient.getEntry(id, { include: 2 });
      return transformContentfulBusinessData(entry);
    } catch (error) {
      console.error('Contentful getBusinessById error:', error);
      throw error;
    }
  },

  // Get featured businesses
  getFeaturedBusinesses: async (limit = 5) => {
    try {
      const response = await contentfulClient.getEntries({
        content_type: 'business',
        'fields.featured': true,
        include: 2,
        limit,
        order: '-sys.createdAt'
      });
      
      return response.items.map(transformContentfulBusinessData);
    } catch (error) {
      console.error('Contentful getFeaturedBusinesses error:', error);
      throw error;
    }
  },

  // Search businesses with full-text search
  searchBusinesses: async (searchTerm, filters = {}) => {
    try {
      const query = {
        content_type: 'business',
        query: searchTerm,
        include: 2,
        limit: filters.limit || 25,
        skip: filters.offset || 0
      };

      // Add additional filters
      Object.keys(filters).forEach(key => {
        if (key !== 'limit' && key !== 'offset' && filters[key]) {
          if (key === 'industry') {
            query['fields.industry.fields.slug'] = filters[key];
          } else {
            query[`fields.${key}`] = filters[key];
          }
        }
      });

      const response = await contentfulClient.getEntries(query);
      return response.items.map(transformContentfulBusinessData);
    } catch (error) {
      console.error('Contentful searchBusinesses error:', error);
      throw error;
    }
  },

  // Submit new business (requires management API)
  submitBusiness: async (businessData) => {
    if (!managementClient) {
      throw new Error('Management client not available. Check CONTENTFUL_MANAGEMENT_TOKEN.');
    }

    try {
      const space = await managementClient.getSpace(process.env.REACT_APP_CONTENTFUL_SPACE_ID);
      const environment = await space.getEnvironment(
        process.env.REACT_APP_CONTENTFUL_ENVIRONMENT || 'master'
      );

      const entry = await environment.createEntry('business', {
        fields: {
          name: { 'en-US': businessData.name },
          town: { 'en-US': businessData.location.town },
          state: { 'en-US': businessData.location.state },
          region: { 'en-US': businessData.location.region },
          tagline: { 'en-US': businessData.tagline },
          description: { 'en-US': businessData.description },
          keyFeatures: { 'en-US': businessData.keyFeatures },
          primaryCategory: { 'en-US': businessData.categories.primary },
          anzsicCode: { 'en-US': businessData.categories.anzsicCode },
          secondaryCategories: { 'en-US': businessData.categories.secondary },
          locationTags: { 'en-US': businessData.tags.location },
          serviceTags: { 'en-US': businessData.tags.services },
          industrySlug: { 'en-US': businessData.industry },
          featured: { 'en-US': false }
        }
      });

      return entry;
    } catch (error) {
      console.error('Contentful submitBusiness error:', error);
      throw error;
    }
  }
};

/**
 * Contentful metadata API functions
 */
export const contentfulMetadataAPI = {
  // Get all industries
  getIndustries: async () => {
    try {
      const response = await contentfulClient.getEntries({
        content_type: 'industry',
        order: 'fields.name'
      });

      return response.items.map(industry => ({
        id: industry.fields.slug,
        name: industry.fields.name,
        icon: industry.fields.icon,
        description: industry.fields.description
      }));
    } catch (error) {
      console.error('Contentful getIndustries error:', error);
      return [];
    }
  },

  // Get unique states from businesses
  getStates: async () => {
    try {
      const response = await contentfulClient.getEntries({
        content_type: 'business',
        select: 'fields.state',
        limit: 1000
      });

      const states = [...new Set(
        response.items.map(business => business.fields.state)
      )].filter(Boolean).sort();

      return states.map(state => ({ id: state, name: state }));
    } catch (error) {
      console.error('Contentful getStates error:', error);
      return [];
    }
  },

  // Get unique regions from businesses
  getAllRegions: async () => {
    try {
      const response = await contentfulClient.getEntries({
        content_type: 'business',
        select: 'fields.region',
        limit: 1000
      });

      const regions = [...new Set(
        response.items.map(business => business.fields.region)
      )].filter(Boolean).sort();

      return regions;
    } catch (error) {
      console.error('Contentful getAllRegions error:', error);
      return [];
    }
  }
};
