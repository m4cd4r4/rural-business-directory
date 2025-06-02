# 🔗 Real Data Integration Guide

This guide provides step-by-step instructions for integrating real business data into your Rural Business Directory application.

## 📋 Quick Overview

All the necessary integration files have been added to your project:

### 🗂️ New Files Added

#### **Services** (`src/services/`)
- `api.js` - Generic REST API integration
- `strapi.js` - Strapi CMS integration  
- `contentful.js` - Contentful CMS integration
- `firebase.js` - Firebase/Firestore integration
- `supabase.js` - Supabase/PostgreSQL integration
- `abr.js` - Australian Business Register API
- `fileImport.js` - CSV/Excel/JSON import functionality

#### **Hooks** (`src/hooks/`)
- `useBusinessData.js` - Enhanced data hook with API support

#### **Components** (`src/components/`)
- `ErrorBoundary.js` - Error handling component
- `BusinessFileImporter.js` - File upload and import component

#### **Testing** (`src/test/`)
- `integrationTests.js` - Comprehensive testing utilities

#### **Configuration**
- `.env.example` - Environment variables template
- Updated `package.json` with required dependencies

## 🚀 Getting Started

### Step 1: Choose Your Integration Method

Pick the option that best fits your needs:

| Option | Best For | Complexity | Setup Time |
|--------|----------|------------|------------|
| **Supabase** | Quick start, real-time data | Low | 1-2 hours |
| **File Import** | Existing data, simple setup | Very Low | 30 minutes |
| **Strapi** | Content management | Medium | 2-4 hours |
| **Firebase** | Google ecosystem | Medium | 2-3 hours |
| **REST API** | Custom backend | High | 1-2 days |

### Step 2: Install Dependencies

```bash
# Core dependencies (already included)
npm install papaparse xlsx

# Choose your database/CMS (install only what you need)
npm install @supabase/supabase-js  # For Supabase
npm install firebase               # For Firebase
npm install contentful contentful-management  # For Contentful
```

### Step 3: Set Up Environment Variables

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your actual values for your chosen integration method.

## 📊 Integration Options

### 🗄️ Option 1: Supabase (Recommended for Beginners)

**Why choose Supabase:**
- PostgreSQL with real-time subscriptions
- Built-in authentication and storage
- Excellent developer experience
- Full-text search capabilities

**Setup Steps:**

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and anon key

2. **Run Database Setup**
   ```sql
   -- Copy the SQL schema from the Supabase integration comments
   -- Run in Supabase SQL Editor
   ```

3. **Update Environment Variables**
   ```bash
   REACT_APP_SUPABASE_URL=your_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Update Your Components**
   Replace the import in your existing components:
   ```javascript
   // Replace this:
   import { useBusinessSearch } from '../hooks/useBusinessSearch';
   
   // With this:
   import { useBusinessData } from '../hooks/useBusinessData';
   ```

### 📁 Option 2: File Import (Easiest Start)

**Why choose File Import:**
- No external services required
- Work with existing data (CSV/Excel)
- Immediate results
- Perfect for prototyping

**Usage:**

1. **Add the Import Component**
   ```javascript
   import BusinessFileImporter from '../components/BusinessFileImporter';
   
   const AdminPage = () => {
     const handleImportComplete = (result) => {
       console.log('Imported businesses:', result.businesses);
       // Add to your state or database
     };
   
     return (
       <BusinessFileImporter 
         onImportComplete={handleImportComplete}
         onError={(error) => console.error(error)}
       />
     );
   };
   ```

2. **Download Template**
   The component includes a "Download CSV Template" button that provides the correct format.

## 🔄 Migration from Sample Data

### Replace Sample Data Imports

1. **Update DirectoryPage.js:**
   ```javascript
   // Remove this:
   import { businessData } from '../data/businessData';
   import { useBusinessSearch } from '../hooks/useBusinessSearch';
   
   // Add this:
   import { useBusinessData } from '../hooks/useBusinessData';
   
   // Update the hook usage:
   const {
     businesses,
     isLoading,
     error,
     // ... other properties
   } = useBusinessData();
   ```

2. **Update HomePage.js:**
   ```javascript
   // Replace businessData import with API call
   import { useBusinessData } from '../hooks/useBusinessData';
   
   const { featuredBusinesses } = useBusinessData();
   ```

3. **Update BusinessProfilePage.js:**
   ```javascript
   import { useBusinessProfile } from '../hooks/useBusinessData';
   
   const { business, isLoading, error } = useBusinessProfile(id);
   ```

## 🧪 Testing Your Integration

### Run Integration Tests

```bash
# Test your API connectivity
npm run test:integration

# Run all tests with coverage
npm run test:ci
```

### Manual Testing Checklist

- [ ] Homepage loads with featured businesses
- [ ] Directory page shows business listings
- [ ] Search functionality works
- [ ] Filters apply correctly
- [ ] Individual business pages load
- [ ] Error handling works (try invalid URLs)
- [ ] Loading states display properly

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your API/CMS allows requests from localhost:3000
   - Check browser console for specific error messages

2. **Environment Variables Not Loading**
   - Restart development server after adding .env.local
   - Ensure variables start with REACT_APP_

3. **Import Errors**
   - Install missing dependencies: `npm install`
   - Check file paths in import statements

4. **Data Not Displaying**
   - Check browser console for API errors
   - Verify API endpoints are returning expected data format
   - Use browser network tab to inspect requests

## 📈 Next Steps

Once you have basic integration working:

1. **Add Authentication** (if using Supabase/Firebase)
2. **Implement Business Submission** forms
3. **Add Image Upload** functionality
4. **Set Up Analytics** tracking
5. **Deploy to Production** with proper environment variables

## 🎯 Production Deployment

### Environment Setup

Create production environment files:
- `.env.production` for production builds
- Update with production API URLs and keys
- Ensure all secrets are properly secured

### Build and Deploy

```bash
# Build for production
npm run build

# Deploy to your hosting provider
# (Netlify, Vercel, AWS S3, etc.)
```

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Test API endpoints independently
4. Review the integration code examples in the service files
5. Check the testing utilities for debugging help

---

**🎉 Congratulations!** You now have all the tools needed to integrate real data into your Rural Business Directory. Choose the integration method that best fits your needs and follow the step-by-step instructions above.

**Happy coding!** 🚀
