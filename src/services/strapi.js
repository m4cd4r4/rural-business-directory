/**
 * Strapi CMS Integration for Rural Business Directory
 * Provides easy content management for non-technical users
 */

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.REACT_APP_STRAPI_API_TOKEN;

/**
 * Strapi API client with authentication
 */
const strapiRequest = async (endpoint, options = {}) => {
  const url = `${STRAPI_URL}/api${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN && { 
        'Authorization': `Bearer ${STRAPI_API_TOKEN}` 
      }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`Strapi API error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Strapi request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Transform Strapi business data to application format
 */
const transformStrapiBusinessData = (strapiData) => {
  const business = strapiData.attributes;
  
  return {
    id: strapiData.id,
    name: business.name,
    location: {
      town: business.town,
      state: business.state,
      region: business.region
    },
    tagline: business.tagline,
    description: business.description,
    keyFeatures: business.keyFeatures || [],
    categories: {
      primary: business.primaryCategory,
      anzsicCode: business.anzsicCode,
      secondary: business.secondaryCategories || []
    },
    tags: {
      location: business.locationTags || [],
      services: business.serviceTags || []
    },
    industry: business.industry?.data?.attributes?.slug || business.industrySlug,
    featured: business.featured || false,
    // Handle media fields
    logo: business.logo?.data?.attributes?.url ? 
      `${STRAPI_URL}${business.logo.data.attributes.url}` : null,
    images: business.images?.data?.map(img => 
      `${STRAPI_URL}${img.attributes.url}`
    ) || [],
    // Additional Strapi-specific fields
    publishedAt: business.publishedAt,
    createdAt: business.createdAt,
    updatedAt: business.updatedAt
  };
};

/**
 * Strapi business API functions
 */
export const strapiBusinessAPI = {
  // Get all businesses with population of related data
  getBusinesses: async (filters = {}) => {
    const queryParams = new URLSearchParams({
      'populate': 'logo,images,industry',
      'pagination[pageSize]': filters.limit || 25,
      'pagination[page]': filters.page || 1,
      'sort': filters.sortBy ? `${filters.sortBy}:asc` : 'name:asc'
    });

    // Add search filter
    if (filters.search) {
      queryParams.append('filters[$or][0][name][$containsi]', filters.search);
      queryParams.append('filters[$or][1][description][$containsi]', filters.search);
      queryParams.append('filters[$or][2][town][$containsi]', filters.search);
    }

    // Add location filters
    if (filters.state) {
      queryParams.append('filters[state][$eq]', filters.state);
    }
    if (filters.region) {
      queryParams.append('filters[region][$eq]', filters.region);
    }

    // Add industry filter
    if (filters.industry) {
      queryParams.append('filters[industry][slug][$eq]', filters.industry);
    }

    // Add featured filter
    if (filters.featured) {
      queryParams.append('filters[featured][$eq]', true);
    }

    const response = await strapiRequest(`/businesses?${queryParams}`);
    
    return {
      businesses: response.data.map(transformStrapiBusinessData),
      pagination: {
        currentPage: response.meta.pagination.page,
        totalPages: response.meta.pagination.pageCount,
        totalItems: response.meta.pagination.total,
        itemsPerPage: response.meta.pagination.pageSize
      }
    };
  },

  // Get single business by ID
  getBusinessById: async (id) => {
    const response = await strapiRequest(
      `/businesses/${id}?populate=logo,images,industry`
    );
    return transformStrapiBusinessData(response.data);
  },

  // Get featured businesses
  getFeaturedBusinesses: async (limit = 5) => {
    const response = await strapiRequest(
      `/businesses?filters[featured][$eq]=true&populate=logo,images,industry&pagination[pageSize]=${limit}`
    );
    return response.data.map(transformStrapiBusinessData);
  },

  // Submit new business (requires authentication)
  submitBusiness: async (businessData) => {
    const strapiData = {
      data: {
        name: businessData.name,
        town: businessData.location.town,
        state: businessData.location.state,
        region: businessData.location.region,
        tagline: businessData.tagline,
        description: businessData.description,
        keyFeatures: businessData.keyFeatures,
        primaryCategory: businessData.categories.primary,
        anzsicCode: businessData.categories.anzsicCode,
        secondaryCategories: businessData.categories.secondary,
        locationTags: businessData.tags.location,
        serviceTags: businessData.tags.services,
        industrySlug: businessData.industry,
        publishedAt: null // Save as draft initially
      }
    };

    return strapiRequest('/businesses', {
      method: 'POST',
      body: JSON.stringify(strapiData)
    });
  }
};

/**
 * Strapi metadata API functions
 */
export const strapiMetadataAPI = {
  // Get all industries
  getIndustries: async () => {
    const response = await strapiRequest('/industries?sort=name:asc');
    return response.data.map(industry => ({
      id: industry.attributes.slug,
      name: industry.attributes.name,
      icon: industry.attributes.icon,
      description: industry.attributes.description
    }));
  },

  // Get unique states from businesses
  getStates: async () => {
    const response = await strapiRequest('/businesses?fields=state');
    const states = [...new Set(
      response.data.map(business => business.attributes.state)
    )].filter(Boolean).sort();
    
    return states.map(state => ({ id: state, name: state }));
  },

  // Get unique regions from businesses
  getAllRegions: async () => {
    const response = await strapiRequest('/businesses?fields=region');
    const regions = [...new Set(
      response.data.map(business => business.attributes.region)
    )].filter(Boolean).sort();
    
    return regions;
  }
};
