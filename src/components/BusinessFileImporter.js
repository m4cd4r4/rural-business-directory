import React, { useState } from 'react';
import { fileImportAPI, generateCSVTemplate } from '../services/fileImport';

/**
 * BusinessFileImporter component for uploading and importing business data
 * Supports CSV, Excel, and JSON files with validation and error reporting
 */
const BusinessFileImporter = ({ onImportComplete, onError }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const [importResult, setImportResult] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress({ stage: 'Reading file...', progress: 25 });
    setImportResult(null);

    try {
      let result;
      const fileExtension = file.name.split('.').pop().toLowerCase();

      setImportProgress({ stage: 'Processing data...', progress: 50 });

      switch (fileExtension) {
        case 'csv':
          result = await fileImportAPI.importFromCSV(file);
          break;
        case 'xlsx':
        case 'xls':
          result = await fileImportAPI.importFromExcel(file);
          break;
        case 'json':
          result = await fileImportAPI.importFromJSON(file);
          break;
        default:
          throw new Error('Unsupported file format. Please use CSV, Excel, or JSON files.');
      }

      setImportProgress({ stage: 'Validating data...', progress: 75 });

      // Simulate validation delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setImportProgress({ stage: 'Complete!', progress: 100 });
      setImportResult(result);

      if (onImportComplete) {
        onImportComplete(result);
      }

    } catch (error) {
      console.error('Import error:', error);
      setImportResult({ error: error.message });
      if (onError) {
        onError(error);
      }
    } finally {
      setIsImporting(false);
      setTimeout(() => {
        setImportProgress(null);
      }, 2000);
      event.target.value = ''; // Reset file input
    }
  };

  const downloadTemplate = () => {
    generateCSVTemplate();
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div className="bg-white rounded-lg border-2 border-dashed border-stone-300 p-8 text-center hover:border-amber-400 transition-colors">
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <h3 className="text-lg font-semibold text-stone-800 mb-2">
              Import Business Data
            </h3>
            <p className="text-stone-600 mb-4">
              Upload a CSV, Excel, or JSON file containing business information
            </p>
          </div>

          {/* Progress Bar */}
          {isImporting && importProgress && (
            <div className="space-y-2">
              <div className="text-sm text-stone-600">{importProgress.stage}</div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* File Input */}
          <input
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            onChange={handleFileUpload}
            disabled={isImporting}
            className="hidden"
            id="business-file-input"
          />
          
          <label
            htmlFor="business-file-input"
            className={`
              inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md cursor-pointer
              ${isImporting 
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-amber-600 text-white hover:bg-amber-700'
              }
              transition-colors
            `}
          >
            {isImporting ? 'Processing...' : 'Choose File'}
          </label>

          <div className="text-xs text-stone-500 space-y-1">
            <p>Supported formats: CSV, Excel (.xlsx, .xls), JSON</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
      </div>

      {/* Import Results */}
      {importResult && (
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          {importResult.error ? (
            <div className="text-red-600">
              <h4 className="font-semibold mb-2">Import Failed</h4>
              <p className="text-sm">{importResult.error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">Import Successful!</h4>
              
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.summary.valid}
                  </div>
                  <div className="text-sm text-green-700">Valid</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.summary.invalid}
                  </div>
                  <div className="text-sm text-red-700">Invalid</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">
                    {importResult.summary.total}
                  </div>
                  <div className="text-sm text-blue-700">Total</div>
                </div>
              </div>

              {/* Errors */}
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4">
                  <h5 className="font-semibold text-red-800 mb-2">
                    Validation Errors ({importResult.errors.length})
                  </h5>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700">
                        <strong>Row {error.row}:</strong> {error.errors.join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
        <h4 className="font-semibold text-amber-800 mb-3">Need Help?</h4>
        <div className="space-y-2 text-sm text-amber-700">
          <p>• Download our CSV template to see the required format</p>
          <p>• Ensure all required fields are included: name, town, state</p>
          <p>• Use valid Australian state codes: NSW, VIC, QLD, WA, SA, TAS, NT, ACT</p>
          <p>• Separate multiple values with semicolons (;)</p>
        </div>
        
        <button
          onClick={downloadTemplate}
          className="mt-4 inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          📄 Download CSV Template
        </button>
      </div>
    </div>
  );
};

export default BusinessFileImporter;
