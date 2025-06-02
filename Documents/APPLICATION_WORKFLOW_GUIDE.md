# 📝 Application Workflow Guide - Rural Business Directory

## 1. Introduction

**Purpose**: This guide provides an in-depth explanation of the Rural Business Directory application's current structure, data flow, key operational aspects, and development considerations. It's intended for developers working on or maintaining the project.

**Application Overview**: The Rural Business Directory is a React-based web application designed to showcase rural and regional Australian businesses. It features business listings, detailed profiles, search and filtering capabilities, and an admin interface for data import.

## 2. Core Architecture

*   **Frontend Framework**: React 18 (utilizing functional components and Hooks).
*   **Routing**: React Router DOM for client-side navigation between pages.
*   **Styling**: Tailwind CSS for utility-first styling and responsive design.
*   **Primary Data Handling**: The application primarily operates with client-side data management, especially for the "File Import" feature.
    *   Imported data is persisted in the browser's `localStorage`.
    *   There's a fallback mechanism to attempt API calls if local data is not present.
*   **State Management**: Primarily through React's built-in state (useState, useContext) and custom hooks.

## 3. Data Management & Flow

The application handles data from two main sources: initial sample data and user-imported data.

### 3.1. Initial Sample Data

*   **Location**: `src/data/businessData.js`
*   **Role**: This file contains a small, static set of sample business profiles and category information.
*   **Usage**: It was the primary data source before the implementation of dynamic data hooks and import features. Some parts of the application might still reference it if no dynamic data is loaded or if certain static configurations (like initial industry categories before metadata loading) are needed. However, the primary display logic now relies on `useBusinessData.js`.

### 3.2. File Import Feature (`/admin` page)

This is the primary mechanism for populating the directory with custom or larger datasets without a dedicated backend.

*   **Access**: The import functionality is available on the admin page, accessible via the `/admin` route (configured in `src/App.js`).
*   **User Interface**:
    *   `src/pages/AdminPage.js`: Contains the UI for the admin section, including the file importer and a button to clear `localStorage` data.
    *   `src/components/BusinessFileImporter.js`: The reusable React component that provides the file selection and upload interface.
*   **Processing Logic (`src/services/fileImport.js`)**:
    *   **Parsing**: Handles CSV and Excel file parsing using `papaparse` and `xlsx` libraries.
    *   **Transformation**: The `transformCSVRowToBusiness` function converts each row from the imported file into a structured business object. This object includes:
        *   Basic info: `id` (row number), `name`
        *   Location: `location: { town, state, region }`
        *   Details: `tagline`, `description`, `keyFeatures` (array)
        *   Categorization: `categories: { primary, anzsicCode, secondary (array) }`, `industry`
        *   Tags: `tags: { location (array), services (array) }`
        *   **Contact Info**: `contact: { phone, email, website }` (recently added)
        *   Status: `featured` (boolean)
        *   Import metadata: `importSource`, `importRow`, `importedAt`.
    *   **Validation**: The `validateImportedBusinesses` function checks each transformed business object for:
        *   Required fields (name, town, state).
        *   Valid state codes.
        *   Valid industry codes: The list of `validIndustries` has been expanded and the check is case-insensitive (e.g., "Agriculture" is accepted and standardized to "agriculture"; "Arts & Crafts" becomes "arts_crafts").
*   **`localStorage` Usage**:
    *   Successfully validated and transformed businesses are stored as a JSON string in `localStorage` under the key: `importedBusinessesData`.
    *   Derived metadata (unique lists of industries, states, and regions from the imported data) are also stored:
        *   Industries: `importedIndustriesMetadata` (as an array of objects: `{ id, name, icon }`)
        *   States: `importedStatesMetadata` (as an array of objects: `{ id, name }`)
        *   Regions: `importedRegionsMetadata` (as an array of objects: `{ id, name }`)
*   **Clearing Data**: The `/admin` page provides a button to remove all these keys from `localStorage`, allowing users to revert to a clean state or API fallback.

### 3.3. Data Service Layer (`src/services/api.js`)

This file acts as the central point for all data fetching operations, abstracting the data source from the rest of the application.

*   **`localStorage` Priority**: Functions like `businessAPI.getBusinesses`, `businessAPI.getBusinessById`, `businessAPI.getFeaturedBusinesses`, `metadataAPI.getIndustries`, `metadataAPI.getStates`, and `metadataAPI.getAllRegions` have been modified to:
    1.  First, attempt to load data from the corresponding keys in `localStorage`.
    2.  If data is found, it's parsed, and for business lists, server-side-like filtering (search, category filters) and pagination are applied directly to the `localStorage` array.
*   **API Fallback**: If data is not found in `localStorage` or an error occurs during local processing, these functions fall back to making network API requests using the `apiRequest` utility.
*   **Default API Endpoint**: The `API_BASE_URL` defaults to `http://localhost:3001/api`, implying an expectation of a local development backend if `localStorage` is not used.

### 3.4. Custom Hooks (`src/hooks/useBusinessData.js`)

These hooks encapsulate data fetching logic and state management for UI components.

*   **`useBusinessData`**:
    *   Replaces the older `useBusinessSearch` hook.
    *   Fetches lists of businesses (all and featured) and metadata (industries, states, regions) by calling functions from `src/services/api.js`.
    *   Manages loading states, error states, filter parameters (search term, selected categories, sort order), and pagination state.
    *   Provides functions to components for updating filters, handling search, and navigation.
*   **`useBusinessProfile`**:
    *   Fetches data for a single business profile by its ID, also by calling `src/services/api.js`.
    *   Manages loading and error states for the individual profile view.

## 4. Key Pages & Components

*   **`src/App.js`**: The root application component that sets up `React Router` and defines the main page routes, including the new `/admin` route.
*   **`src/components/Layout.js`**: Provides the overall page structure (e.g., header, footer, main content area) for consistency across different views.
*   **`src/pages/HomePage.js`**: The landing page. Displays featured businesses and industry category links, sourcing data via `useBusinessData`.
*   **`src/pages/DirectoryPage.js`**: The main business listing page. Displays businesses in a grid, provides search and filter controls (sidebar), and handles sorting. Uses `useBusinessData` extensively.
*   **`src/pages/BusinessProfilePage.js`**: Shows detailed information for a selected business, including the newly added contact details. Uses `useBusinessProfile` for the main business data and `useBusinessData` for related data like industry icons or similar businesses.
*   **`src/pages/AdminPage.js`**: The administrative interface for importing business data via CSV/Excel files and managing the `localStorage` data.

## 5. Current Data Schema (for CSV Import)

The `src/services/fileImport.js` expects CSV/Excel files with headers that (after being lowercased and having spaces replaced with underscores by `transformHeader`) map to these fields. Key fields include:

*   `name` (String)
*   `town` (String)
*   `state` (String, e.g., "NSW", "VIC")
*   `region` (String)
*   `tagline` (String)
*   `description` (String)
*   `primary_category` (String)
*   `anzsic_code` (String)
*   `industry` (String - see `validIndustries` in `fileImport.js` for accepted values; case-insensitive)
*   `phone` (String) - New
*   `email` (String) - New
*   `website` (String) - New
*   `key_features` (String, items separated by semicolon, comma, or pipe)
*   `service_tags` (String, items separated by semicolon, comma, or pipe)
*   `location_tags` (String, items separated by semicolon, comma, or pipe)
*   `featured` (String, e.g., "Yes", "No", "true", "false")

The `generateCSVTemplate()` function in `fileImport.js` provides an example.

## 6. Development Notes & Testing Tips

*   **Testing File Import**:
    1.  Ensure the development server (`npm start`) is running.
    2.  Navigate to `/admin`.
    3.  Use the "Clear Imported Data from LocalStorage" button before a new import test to ensure a clean slate.
    4.  Import a CSV/Excel file matching the expected schema.
    5.  Check the browser's console for any error messages or success logs.
    6.  Use browser developer tools (Application > Local Storage) to inspect the data stored under keys like `importedBusinessesData`.
    7.  Navigate to `HomePage`, `DirectoryPage`, and individual `BusinessProfilePage`s to verify data is displayed correctly and filters work as expected with the imported data.
*   **Data Persistence**: Remember that `localStorage` is browser-specific. Data imported in one browser will not be available in another.
*   **API Fallback**: If `localStorage` is empty, `api.js` will attempt to make network calls. If you don't have the corresponding backend running at `http://localhost:3001/api`, these calls will likely fail, and the UI should ideally handle this by showing loading/error states or empty results.

## 7. Future Development

For planned future enhancements and broader project goals, please refer to the "Future Enhancement Opportunities" section in the main `README.md` file. This includes items like backend integration, user accounts, map integration, and more.

---
This guide should help in understanding the current operational flow of the Rural Business Directory application.
