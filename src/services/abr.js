/**
 * Australian Business Register (ABR) API Integration
 * Provides access to official Australian business data
 */

const ABR_API_BASE = 'https://abr.business.gov.au/json';
const ABR_WEB_SERVICES_BASE = 'https://api.abr.business.gov.au/webservices';
const ABR_GUID = process.env.REACT_APP_ABR_GUID; // Your registered GUID

/**
 * ABR API client for business lookups
 */
export const abrAPI = {
  // Search for businesses by name
  searchByName: async (businessName, filters = {}) => {
    try {
      const params = new URLSearchParams({
        name: businessName,
        guid: ABR_GUID,
        ...(filters.state && { state: filters.state }),
        ...(filters.postcode && { postcode: filters.postcode }),
        ...(filters.activeOnly && { activeOnly: 'Y' }),
        ...(filters.currentOnly && { currentOnly: 'Y' })
      });

      const response = await fetch(`${ABR_API_BASE}/MatchingNames.aspx?${params}`);
      
      if (!response.ok) {
        throw new Error(`ABR API error: ${response.status}`);
      }

      const data = await response.json();
      return transformABRSearchResults(data);

    } catch (error) {
      console.error('ABR searchByName error:', error);
      throw error;
    }
  },

  // Search for business by ABN
  searchByABN: async (abn) => {
    try {
      const params = new URLSearchParams({
        abn: abn.replace(/\s/g, ''), // Remove spaces
        guid: ABR_GUID,
        includeHistoricalDetails: 'Y'
      });

      const response = await fetch(`${ABR_API_BASE}/AbnDetails.aspx?${params}`);
      
      if (!response.ok) {
        throw new Error(`ABR API error: ${response.status}`);
      }

      const data = await response.json();
      return transformABRBusinessDetails(data);

    } catch (error) {
      console.error('ABR searchByABN error:', error);
      throw error;
    }
  },

  // Validate ABN
  validateABN: async (abn) => {
    try {
      const cleanABN = abn.replace(/\s/g, '');
      
      // Client-side ABN validation algorithm
      if (!isValidABNFormat(cleanABN)) {
        return { valid: false, error: 'Invalid ABN format' };
      }

      // Server-side validation via ABR
      const business = await abrAPI.searchByABN(cleanABN);
      return { 
        valid: true, 
        business,
        active: business?.entityStatus?.effectiveFrom && !business?.entityStatus?.effectiveTo
      };

    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
};

/**
 * Transform ABR search results to application format
 */
const transformABRSearchResults = (abrData) => {
  if (!abrData?.Names) return [];

  return abrData.Names.map(business => ({
    abn: business.Abn,
    acn: business.Acn,
    name: business.Name,
    nameType: business.NameType,
    jurisdiction: business.Jurisdiction,
    organisationType: business.OrganisationType,
    status: business.EntityStatus,
    state: business.MainBusinessLocation?.State,
    postcode: business.MainBusinessLocation?.Postcode,
    isCurrentIndicator: business.IsCurrentIndicator === 'Y',
    score: business.Score
  }));
};

/**
 * Transform ABR business details to application format
 */
const transformABRBusinessDetails = (abrData) => {
  if (!abrData?.Abn) return null;

  const business = abrData.Abn;
  
  return {
    abn: business.IdentifierValue,
    acn: business.Entity?.Acn,
    entityType: business.Entity?.EntityType,
    entityStatus: {
      code: business.Entity?.EntityStatus?.EntityStatusCode,
      description: business.Entity?.EntityStatus?.EntityStatusDescription,
      effectiveFrom: business.Entity?.EntityStatus?.EffectiveFrom,
      effectiveTo: business.Entity?.EntityStatus?.EffectiveTo
    },
    gst: {
      registered: business.Goods_and_Services_Tax?.EffectiveFrom && !business.Goods_and_Services_Tax?.EffectiveTo,
      effectiveFrom: business.Goods_and_Services_Tax?.EffectiveFrom,
      effectiveTo: business.Goods_and_Services_Tax?.EffectiveTo
    },
    mainName: business.MainName?.OrganisationName || business.MainName?.PersonNameTitle,
    tradingNames: business.OtherTradingName?.map(name => name.OrganisationName) || [],
    businessNames: business.BusinessName?.map(name => name.OrganisationName) || [],
    mainBusinessLocation: {
      state: business.MainBusinessLocation?.State,
      postcode: business.MainBusinessLocation?.Postcode
    }
  };
};

/**
 * Client-side ABN validation algorithm
 */
const isValidABNFormat = (abn) => {
  if (!/^\d{11}$/.test(abn)) return false;

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  let sum = 0;

  // Subtract 1 from the first digit
  const firstDigit = parseInt(abn.charAt(0)) - 1;
  sum += firstDigit * weights[0];

  // Add weighted sum of remaining digits
  for (let i = 1; i < 11; i++) {
    sum += parseInt(abn.charAt(i)) * weights[i];
  }

  return sum % 89 === 0;
};

/**
 * Enhanced business data service combining ABR with local data
 */
export const enhancedBusinessAPI = {
  // Enrich local business data with ABR information
  enrichBusinessWithABR: async (localBusiness) => {
    try {
      // Try to find ABR match by business name and location
      const abrResults = await abrAPI.searchByName(localBusiness.name, {
        state: localBusiness.location.state,
        activeOnly: true,
        currentOnly: true
      });

      if (abrResults.length > 0) {
        // Find best match based on name similarity and location
        const bestMatch = findBestABRMatch(localBusiness, abrResults);
        
        if (bestMatch) {
          // Get detailed information
          const abrDetails = await abrAPI.searchByABN(bestMatch.abn);
          
          return {
            ...localBusiness,
            abr: abrDetails,
            verified: true,
            abn: bestMatch.abn,
            acn: bestMatch.acn,
            entityType: abrDetails?.entityType,
            gstRegistered: abrDetails?.gst?.registered
          };
        }
      }

      return {
        ...localBusiness,
        abr: null,
        verified: false
      };

    } catch (error) {
      console.error('Error enriching business with ABR data:', error);
      return {
        ...localBusiness,
        abr: null,
        verified: false,
        abrError: error.message
      };
    }
  },

  // Verify business authenticity
  verifyBusiness: async (businessData) => {
    if (!businessData.abn) {
      return { verified: false, reason: 'No ABN provided' };
    }

    try {
      const abrBusiness = await abrAPI.searchByABN(businessData.abn);
      
      if (!abrBusiness) {
        return { verified: false, reason: 'ABN not found in ABR' };
      }

      if (abrBusiness.entityStatus?.effectiveTo) {
        return { verified: false, reason: 'Business is not active' };
      }

      return {
        verified: true,
        abrData: abrBusiness,
        gstRegistered: abrBusiness.gst?.registered,
        entityType: abrBusiness.entityType
      };

    } catch (error) {
      return { verified: false, reason: error.message };
    }
  }
};

/**
 * Utility functions
 */
const findBestABRMatch = (localBusiness, abrResults) => {
  if (abrResults.length === 0) return null;

  // Score each result based on name similarity and location match
  const scoredResults = abrResults.map(abrBusiness => {
    const nameSimilarity = calculateNameSimilarity(
      localBusiness.name,
      abrBusiness.name
    );
    
    const locationMatch = abrBusiness.state === localBusiness.location.state ? 1 : 0;
    
    const score = (nameSimilarity * 0.7) + (locationMatch * 0.3);
    
    return { ...abrBusiness, matchScore: score };
  });

  // Sort by score and return best match if score is above threshold
  scoredResults.sort((a, b) => b.matchScore - a.matchScore);
  
  return scoredResults[0].matchScore > 0.6 ? scoredResults[0] : null;
};

const calculateNameSimilarity = (name1, name2) => {
  if (!name1 || !name2) return 0;
  
  const normalize = (str) => str.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  const n1 = normalize(name1);
  const n2 = normalize(name2);
  
  // Simple Jaccard similarity
  const set1 = new Set(n1.split(' '));
  const set2 = new Set(n2.split(' '));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};
