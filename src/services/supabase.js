/**
 * Supabase Integration for Rural Business Directory
 * Provides PostgreSQL database with real-time subscriptions and full-text search
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Supabase business operations
 */
export const supabaseBusinessAPI = {
  // Get all businesses with filtering and pagination
  getBusinesses: async (filters = {}) => {
    try {
      let query = supabase
        .from('businesses')
        .select(`
          *,
          industry:industries(name, slug, icon)
        `);

      // Add filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,town.ilike.%${filters.search}%`);
      }

      if (filters.state && filters.state.length > 0) {
        if (Array.isArray(filters.state)) {
          query = query.in('state', filters.state);
        } else {
          query = query.eq('state', filters.state);
        }
      }

      if (filters.industry && filters.industry.length > 0) {
        if (Array.isArray(filters.industry)) {
          query = query.in('industry_slug', filters.industry);
        } else {
          query = query.eq('industry_slug', filters.industry);
        }
      }

      if (filters.region) {
        query = query.eq('region', filters.region);
      }

      if (filters.featured) {
        query = query.eq('featured', true);
      }

      // Add sorting
      const sortField = filters.sortBy || 'name';
      const sortDirection = filters.sortDirection || 'asc';
      query = query.order(sortField, { ascending: sortDirection === 'asc' });

      // Add pagination
      const page = filters.page || 1;
      const limit = filters.limit || 25;
      const offset = (page - 1) * limit;
      
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        businesses: data || [],
        pagination: {
          currentPage: page,
          totalItems: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
          itemsPerPage: limit
        }
      };

    } catch (error) {
      console.error('Supabase getBusinesses error:', error);
      throw error;
    }
  },

  // Get single business by ID
  getBusinessById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          industry:industries(name, slug, icon, description)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Supabase getBusinessById error:', error);
      throw error;
    }
  },

  // Get featured businesses
  getFeaturedBusinesses: async (limit = 5) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          industry:industries(name, slug, icon)
        `)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Supabase getFeaturedBusinesses error:', error);
      throw error;
    }
  },

  // Add new business
  addBusiness: async (businessData) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert([{
          name: businessData.name,
          town: businessData.location.town,
          state: businessData.location.state,
          region: businessData.location.region,
          tagline: businessData.tagline,
          description: businessData.description,
          key_features: businessData.keyFeatures,
          primary_category: businessData.categories.primary,
          anzsic_code: businessData.categories.anzsicCode,
          secondary_categories: businessData.categories.secondary,
          location_tags: businessData.tags.location,
          service_tags: businessData.tags.services,
          industry_slug: businessData.industry,
          featured: false
        }])
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Supabase addBusiness error:', error);
      throw error;
    }
  }
};

/**
 * Supabase metadata operations
 */
export const supabaseMetadataAPI = {
  // Get all industries
  getIndustries: async () => {
    try {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Supabase getIndustries error:', error);
      return [];
    }
  },

  // Get unique states from businesses
  getStates: async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('state')
        .not('state', 'is', null);

      if (error) throw error;

      const states = [...new Set(data.map(item => item.state))].sort();
      return states.map(state => ({ id: state, name: state }));

    } catch (error) {
      console.error('Supabase getStates error:', error);
      return [];
    }
  },

  // Get unique regions from businesses
  getAllRegions: async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('region')
        .not('region', 'is', null);

      if (error) throw error;

      const regions = [...new Set(data.map(item => item.region))].sort();
      return regions;

    } catch (error) {
      console.error('Supabase getAllRegions error:', error);
      return [];
    }
  }
};

/**
 * Supabase real-time subscriptions
 */
export const supabaseSubscriptions = {
  // Subscribe to businesses table changes
  subscribeToBusinesses: (callback, filters = {}) => {
    let channel = supabase
      .channel('businesses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'businesses'
        },
        (payload) => {
          console.log('Business change received:', payload);
          // Reload data when changes occur
          supabaseBusinessAPI.getBusinesses(filters).then(data => {
            callback(data.businesses);
          });
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }
};
