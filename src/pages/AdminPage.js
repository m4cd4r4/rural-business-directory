import React from 'react';
import BusinessFileImporter from '../components/BusinessFileImporter'; // Assuming path is correct

const ADMIN_DATA_KEY = 'importedBusinessesData';
const INDUSTRIES_METADATA_KEY = 'importedIndustriesMetadata';
const STATES_METADATA_KEY = 'importedStatesMetadata';
const REGIONS_METADATA_KEY = 'importedRegionsMetadata';

const AdminPage = () => {
  const handleImportComplete = (result) => {
    if (result && result.businesses) {
      console.log('Imported businesses:', result.businesses);
      try {
        // Store main business data
        localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(result.businesses));

        // Derive and store metadata
        const allIndustries = new Set();
        const allStates = new Set();
        const allRegions = new Set();

        result.businesses.forEach(business => {
          if (business.industry) {
            allIndustries.add(business.industry);
          }
          if (business.location?.state) {
            allStates.add(business.location.state);
          }
          if (business.location?.region) {
            allRegions.add(business.location.region);
          }
        });

        // Storing metadata as simple arrays of strings.
        // The useBusinessData hook might expect objects like { id: '...', name: '...' }
        // This might need adjustment later based on how FilterSidebar consumes this.
        // For now, let's store them as arrays of unique strings.
        // The `industries` from useBusinessData was assumed to be [{id, name, icon}].
        // Let's prepare a slightly more structured metadata for industries.
        const industriesForStorage = Array.from(allIndustries).map(name => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name: name, icon: '🏢' /* Default icon */ }));
        const statesForStorage = Array.from(allStates).map(name => ({ id: name, name: name })); // Assuming state name is its ID
        const regionsForStorage = Array.from(allRegions).map(name => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name: name }));


        localStorage.setItem(INDUSTRIES_METADATA_KEY, JSON.stringify(industriesForStorage));
        localStorage.setItem(STATES_METADATA_KEY, JSON.stringify(statesForStorage));
        localStorage.setItem(REGIONS_METADATA_KEY, JSON.stringify(regionsForStorage));

        alert(`Successfully imported and stored ${result.businesses.length} businesses and derived metadata in localStorage. You might need to refresh other pages to see changes.`);
        console.log('Industries stored:', industriesForStorage);
        console.log('States stored:', statesForStorage);
        console.log('Regions stored:', regionsForStorage);

      } catch (e) {
        console.error('Failed to save imported data to localStorage:', e);
        alert('Failed to save data to localStorage. Check console for details.');
      }
    } else {
      console.error('Import result is invalid:', result);
      alert('Import completed, but no business data was found in the result.');
    }
  };

  const handleImportError = (error) => {
    console.error('Import error:', error);
    alert(`Import failed: ${error.message}`);
  };

  const clearImportedData = () => {
    try {
      localStorage.removeItem(ADMIN_DATA_KEY);
      localStorage.removeItem(INDUSTRIES_METADATA_KEY);
      localStorage.removeItem(STATES_METADATA_KEY);
      localStorage.removeItem(REGIONS_METADATA_KEY);
      alert('Imported business data and metadata cleared from localStorage. Refresh other pages to see changes.');
      console.log('Cleared imported data from localStorage.');
    } catch (e) {
      console.error('Failed to clear data from localStorage:', e);
      alert('Failed to clear data from localStorage. Check console for details.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-8 text-center">
          Admin Data Management
        </h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-stone-700 mb-4">
            Import Business Data
          </h2>
          <p className="text-stone-600 mb-6">
            Upload a CSV or Excel file containing business listings. The data will be stored
            in your browser's local storage and used throughout the application.
          </p>
          <BusinessFileImporter 
            onImportComplete={handleImportComplete}
            onError={handleImportError}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-stone-700 mb-4">
            Manage Local Data
          </h2>
          <p className="text-stone-600 mb-6">
            If you need to clear the imported data from your browser to start fresh or
            to revert to any default data behavior, use the button below.
          </p>
          <button
            onClick={clearImportedData}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Clear Imported Data from LocalStorage
          </button>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
