/**
 * File-based Data Import System for Rural Business Directory
 * Supports CSV, Excel, and JSON file imports with validation and transformation
 */

import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * File import service with validation and transformation
 */
export const fileImportAPI = {
  // Import businesses from CSV file
  importFromCSV: async (file, options = {}) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
        transform: (value) => value?.trim(),
        complete: (results) => {
          try {
            const businesses = results.data.map((row, index) => 
              transformCSVRowToBusiness(row, index + 2) // +2 for header and 1-based indexing
            );
            
            const validation = validateImportedBusinesses(businesses);
            
            resolve({
              businesses: validation.validBusinesses,
              errors: validation.errors,
              summary: {
                total: results.data.length,
                valid: validation.validBusinesses.length,
                invalid: validation.errors.length,
                fields: results.meta.fields
              }
            });
          } catch (error) {
            reject(new Error(`CSV processing error: ${error.message}`));
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  },

  // Import businesses from Excel file
  importFromExcel: async (file, options = {}) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Get the first worksheet or specified sheet
      const sheetName = options.sheetName || workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      if (!worksheet) {
        throw new Error(`Sheet "${sheetName}" not found`);
      }

      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: ''
      });

      if (jsonData.length < 2) {
        throw new Error('Excel file must contain at least a header row and one data row');
      }

      // Transform headers to lowercase with underscores
      const headers = jsonData[0].map(header => 
        String(header).trim().toLowerCase().replace(/\s+/g, '_')
      );

      // Transform data rows to objects
      const dataRows = jsonData.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] ? String(row[index]).trim() : '';
        });
        return obj;
      });

      // Transform to business objects
      const businesses = dataRows.map((row, index) => 
        transformCSVRowToBusiness(row, index + 2)
      );

      const validation = validateImportedBusinesses(businesses);

      return {
        businesses: validation.validBusinesses,
        errors: validation.errors,
        summary: {
          total: dataRows.length,
          valid: validation.validBusinesses.length,
          invalid: validation.errors.length,
          fields: headers,
          sheetName
        }
      };

    } catch (error) {
      throw new Error(`Excel processing error: ${error.message}`);
    }
  },

  // Export businesses to CSV
  exportToCSV: (businesses, filename = 'rural_businesses.csv') => {
    const csvData = businesses.map(business => ({
      name: business.name,
      town: business.location.town,
      state: business.location.state,
      region: business.location.region,
      tagline: business.tagline,
      description: business.description,
      primary_category: business.categories.primary,
      anzsic_code: business.categories.anzsicCode,
      industry: business.industry,
      phone: business.contact?.phone || '',
      email: business.contact?.email || '',
      website: business.contact?.website || '',
      key_features: business.keyFeatures.join('; '),
      service_tags: business.tags.services.join('; '),
      location_tags: business.tags.location.join('; '),
      featured: business.featured ? 'Yes' : 'No'
    }));

    const csv = Papa.unparse(csvData);
    downloadFile(csv, filename, 'text/csv');
  }
};

/**
 * Transform CSV/Excel row to business object
 */
const transformCSVRowToBusiness = (row, rowNumber) => {
  try {
    return {
      id: rowNumber,
      name: row.name || row.business_name || '',
      location: {
        town: row.town || row.city || '',
        state: row.state || '',
        region: row.region || ''
      },
      tagline: row.tagline || row.slogan || '',
      description: row.description || row.about || '',
      keyFeatures: parseDelimitedField(row.key_features || row.features || ''),
      categories: {
        primary: row.primary_category || row.category || '',
        anzsicCode: row.anzsic_code || row.anzsic || '',
        secondary: parseDelimitedField(row.secondary_categories || '')
      },
      tags: {
        location: parseDelimitedField(row.location_tags || ''),
        services: parseDelimitedField(row.service_tags || row.services || '')
      },
      contact: {
        phone: row.phone || '',
        email: row.email || '',
        website: row.website || ''
      },
      industry: row.industry || mapCategoryToIndustry(row.primary_category || ''),
      featured: ['yes', 'true', '1', 'y'].includes((row.featured || '').toLowerCase()),
      // Import metadata
      importSource: 'file',
      importRow: rowNumber,
      importedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Row ${rowNumber}: ${error.message}`);
  }
};

/**
 * Parse delimited field (semicolon, comma, or pipe separated)
 */
const parseDelimitedField = (value) => {
  if (!value || typeof value !== 'string') return [];
  
  return value
    .split(/[;,|]/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

/**
 * Map category to industry for backwards compatibility
 */
const mapCategoryToIndustry = (category) => {
  const categoryMap = {
    'grain': 'agriculture',
    'livestock': 'agriculture',
    'farming': 'agriculture',
    'agricultural': 'agriculture',
    'dairy': 'agriculture',
    'shearing': 'services',
    'machinery': 'services',
    'repair': 'services',
    'supplies': 'retail',
    'hardware': 'retail',
    'medical': 'health',
    'pharmacy': 'health',
    'health': 'health',
    'accommodation': 'tourism',
    'tourism': 'tourism',
    'transport': 'transport',
    'haulage': 'transport',
    'logistics': 'transport',
    'accounting': 'professional',
    'consulting': 'professional',
    'advisory': 'professional'
  };

  const lowerCategory = category.toLowerCase();
  for (const [key, industry] of Object.entries(categoryMap)) {
    if (lowerCategory.includes(key)) {
      return industry;
    }
  }
  
  return 'services'; // Default industry
};

/**
 * Validate imported businesses
 */
const validateImportedBusinesses = (businesses) => {
  const validBusinesses = [];
  const errors = [];

  businesses.forEach((business, index) => {
    const businessErrors = [];

    // Required field validation
    if (!business.name?.trim()) {
      businessErrors.push('Business name is required');
    }

    if (!business.location?.town?.trim()) {
      businessErrors.push('Town is required');
    }

    if (!business.location?.state?.trim()) {
      businessErrors.push('State is required');
    }

    // State validation
    const validStates = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
    if (business.location?.state && !validStates.includes(business.location.state.toUpperCase())) {
      businessErrors.push(`Invalid state: ${business.location.state}. Must be one of: ${validStates.join(', ')}`);
    } else if (business.location?.state) {
      business.location.state = business.location.state.toUpperCase();
    }

    // Industry validation
    const validIndustries = [
      'agriculture', 'services', 'retail', 'health', 'tourism', 'professional', 'transport',
      'hospitality', 'manufacturing', 'energy', 'trades', 'arts_crafts', 'technology' // New distinct categories
    ];
    
    if (business.industry) {
      let standardizedIndustry = business.industry.toLowerCase();
      if (standardizedIndustry === 'arts & crafts') {
        standardizedIndustry = 'arts_crafts';
      }

      if (validIndustries.includes(standardizedIndustry)) {
        business.industry = standardizedIndustry; // Standardize the stored industry value
      } else {
        businessErrors.push(`Invalid industry: "${business.industry}". Must be one of: ${validIndustries.join(', ')} (case-insensitive, "Arts & Crafts" becomes "arts_crafts")`);
      }
    } else {
      // If business.industry is falsy, it means it wasn't in the CSV and mapCategoryToIndustry didn't provide a fallback.
      // mapCategoryToIndustry defaults to 'services', so business.industry should usually be populated.
      // If it's critical for it to always exist, an error could be pushed here.
      // For now, maintaining original behavior of not erroring if business.industry is initially empty.
    }

    // Add validation errors or valid business
    if (businessErrors.length > 0) {
      errors.push({
        row: business.importRow || index + 1,
        business: business.name || 'Unknown',
        errors: businessErrors
      });
    } else {
      validBusinesses.push(business);
    }
  });

  return { validBusinesses, errors };
};

/**
 * Download file utility
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * CSV template for business data
 */
export const generateCSVTemplate = () => {
  const template = [
    {
      name: 'Example Rural Business',
      town: 'Wagga Wagga',
      state: 'NSW',
      region: 'Riverina',
      tagline: 'Your local agricultural supplier',
      description: 'Family-owned business serving the local farming community for over 30 years.',
      primary_category: 'Agricultural Supply Store',
      anzsic_code: '3999',
      industry: 'retail',
      phone: '02 1234 5678',
      email: 'contact@exampleretail.com.au',
      website: 'https://www.exampleretail.com.au',
      key_features: 'Local expertise; Quality products; Competitive prices; Delivery service',
      service_tags: 'Agricultural supplies; Farm equipment; Rural lifestyle',
      location_tags: 'NSW Riverina; Wagga Wagga; Regional NSW',
      featured: 'No'
    }
  ];

  const csv = Papa.unparse(template);
  downloadFile(csv, 'business_template.csv', 'text/csv');
};
