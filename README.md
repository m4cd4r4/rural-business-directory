Rural & Regional Australian Business Directory

A modern, accessible web application showcasing rural businesses across Australia with comprehensive profiles covering locations, industries, services, and key features.

## 🌾 Project Overview

This platform connects Australia's rural communities by providing a clean, professional, and accessible interface to discover local businesses across regional heartland. From family farms to local services, the directory celebrates the innovation and community spirit that drives our regional economy.

## ✨ Features

### Core Functionality

- **Homepage**: Hero banner with mission statement, search functionality, and featured business carousel
- **Business Directory**: Responsive grid layout with advanced filtering and search capabilities
- **Business Profiles**: Detailed individual business pages with comprehensive information
- **Search & Filtering**: Filter by location (state, region, town), industry categories, and keywords
- **Admin Data Import**: Enables importing business data from CSV/Excel files via an admin page (`/admin`), storing data in the browser's `localStorage`.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### User Experience

- Clean, modern Australian-themed design with warm, earthy color palette
- Accessibility-first approach with ARIA labels, semantic HTML, and high contrast support
- Smooth animations and hover effects for enhanced interactivity
- Fast search with debounced input and real-time filtering
- Featured business carousel with auto-play and manual navigation

### Technical Features

- React 18 with functional components and hooks
- React Router for client-side navigation
- Tailwind CSS for consistent, utility-first styling
- Custom hooks for search and state management
- Modular component architecture with separation of concerns
- Performance optimized with efficient algorithms

## 🏗️ Project Structure

```
rural-business-directory/
├── public/
│   ├── index.html          # Main HTML template
│   ├── manifest.json       # PWA manifest
│   └── favicon.ico         # Site favicon
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout.js       # Main layout wrapper
│   │   ├── SearchBar.js    # Search input component
│   │   ├── FilterSidebar.js # Filtering controls
│   │   ├── BusinessCard.js # Business listing card
│   │   └── FeaturedBusinessCarousel.js # Homepage carousel
│   ├── pages/              # Page components
│   │   ├── HomePage.js     # Landing page
│   │   ├── DirectoryPage.js # Business listings
│   │   ├── BusinessProfilePage.js # Individual business details
│   │   └── AdminPage.js    # Admin page for data import
│   ├── data/               # Initial sample data and constants
│   │   └── businessData.js # Business profiles and categories (used if no data imported)
│   ├── services/           # API service integrations
│   │   ├── api.js          # Generic REST API client (now supports localStorage)
│   │   ├── fileImport.js   # CSV/Excel import logic and validation
│   │   ├── abr.js          # (Placeholder for ABR API integration)
│   │   ├── strapi.js       # (Placeholder for Strapi integration)
│   │   └── ...             # (Other service integration modules)
│   ├── utils/              # Utility functions
│   │   └── searchUtils.js  # Search and filtering logic
│   ├── hooks/              # Custom React hooks
│   │   └── useBusinessData.js # Enhanced data hook with API/localStorage support
│   ├── App.js              # Main app component with routing
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**

   ```bash
   cd rural-business-directory
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Install required Tailwind CSS plugins**

   ```cmd
   npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio @tailwindcss/line-clamp
   ```
4. **Start the development server**

   ```bash
   npm start
   ```
5. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.
6. **Populate Data (Optional)**: To use your own data, navigate to `http://localhost:3000/admin` and import a CSV or Excel file. Data is stored in the browser's `localStorage`. Otherwise, the application uses initial sample data or configured API fallbacks.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🎨 Design System

### Color Palette

- **Primary**: Amber/Gold tones (#f59e0b, #d97706, #b45309)
- **Secondary**: Stone/Earth tones (#78716c, #57534e, #44403c)
- **Accent**: Green (#10b981, #059669) and Blue (#0ea5e9, #0284c7)
- **Background**: Stone-50 (#fafaf9) with gradient overlays

### Typography

- **Font Family**: Inter (clean, modern sans-serif)
- **Hierarchy**: Responsive text sizing with consistent spacing
- **Accessibility**: High contrast ratios and readable line heights

### Components

- **Cards**: Rounded corners with subtle shadows and hover effects
- **Buttons**: Consistent padding, focus states, and color variations
- **Forms**: Clean inputs with proper labeling and validation states
- **Navigation**: Clear hierarchy with active state indicators

## 📊 Sample Data

The application includes 10 comprehensive business profiles representing:

### Industries Covered

- **Agriculture**: Grain farming, livestock, agricultural machinery
- **Services**: Shearing, accounting, agronomy consulting
- **Retail**: Rural supplies, pharmacy
- **Health**: Medical centers with rural focus
- **Tourism**: Farm stays and cultural experiences
- **Transport**: Grain haulage and logistics

### Geographic Coverage

- **States**: NSW, VIC, QLD, WA, SA, TAS, NT
- **Regions**: Great Southern, Riverina, Central West, Gippsland, and more
- **Communities**: From Esperance to Katherine, showcasing diversity

The application now also supports dynamic data population through an admin interface (`/admin`). Users can import their own datasets from CSV or Excel files, which are then stored in the browser's `localStorage` and used throughout the application. This allows for easy testing and usage with larger or custom datasets without needing an immediate backend setup. The import process includes flexible industry validation.

## 🔧 Development Guidelines

### Component Standards

- Use functional components with hooks
- Implement proper prop validation and defaults
- Include comprehensive JSDoc documentation
- Follow accessibility best practices (ARIA labels, semantic HTML)
- Maintain responsive design across all breakpoints

### Code Organization

- Separate concerns with modular file structure
- Keep components under 200 lines when possible
- Use descriptive naming conventions
- Include meaningful comments for complex logic
- Implement proper error handling and loading states

### Performance Considerations

- Debounced search to prevent excessive API calls
- Efficient filtering algorithms for large datasets
- Optimized images and assets
- Minimal bundle size with code splitting opportunities

## 🔍 Features in Detail

### Search & Filtering System

- **Multi-field Search**: Searches across business names, descriptions, locations, and services
- **Real-time Filtering**: Instant results as you type with debounced input
- **Advanced Filters**: Filter by state, industry, region with multi-select capabilities
- **Sort Options**: Sort by name, location, or industry
- **Filter Persistence**: Maintains filter state during navigation
- **Search Suggestions**: Popular search terms and quick filters

### Accessibility Features

- **Screen Reader Support**: Comprehensive ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **High Contrast**: Support for high contrast mode preferences
- **Reduced Motion**: Respects user preferences for reduced motion
- **Focus Management**: Clear focus indicators and logical tab order
- **Skip Links**: Skip to main content for screen reader users

### Responsive Design

- **Mobile-First**: Optimized for mobile devices with progressive enhancement
- **Breakpoint Strategy**: xs (475px), sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible Layouts**: CSS Grid and Flexbox for complex responsive layouts
- **Touch-Friendly**: Appropriate touch targets and gesture support

## 🧪 Testing Approach

### Component Testing

```javascript
// Example test structure for BusinessCard component
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BusinessCard from './BusinessCard';

const mockBusiness = {
  id: 1,
  name: 'Test Business',
  // ... other properties
};

test('renders business name and location', () => {
  render(
    <BrowserRouter>
      <BusinessCard business={mockBusiness} />
    </BrowserRouter>
  );
  
  expect(screen.getByText('Test Business')).toBeInTheDocument();
  expect(screen.getByText(/location/i)).toBeInTheDocument();
});
```

### Search Functionality Testing

```javascript
// Example test for search hook
import { renderHook, act } from '@testing-library/react';
import { useBusinessData } from '../hooks/useBusinessData'; // Updated to useBusinessData

// Mock initial data or localStorage for testing useBusinessData
const mockInitialBusinesses = [ /* ... some mock business objects ... */ ];

test('filters businesses by search term using useBusinessData', () => {
  // Note: Testing useBusinessData might require mocking localStorage or api.js responses
  // This is a simplified example.
  const { result } = renderHook(() => useBusinessData()); 
  
  // Assuming useBusinessData loads initial data or can be seeded
  // For actual testing, you'd mock the API calls or localStorage reads within useBusinessData
  
  act(() => {
    result.current.handleSearchChange('grain');
  });
  
  expect(result.current.filteredBusinesses).toHaveLength(2);
});
```

## 🚀 Deployment Options

### Static Hosting (Recommended)

- **Netlify**: Deploy directly from Git with automatic builds
- **Vercel**: Zero-configuration deployment with Git integration
- **GitHub Pages**: Free hosting for public repositories
- **AWS S3 + CloudFront**: Scalable static hosting with CDN

### Deployment Steps

1. Build the production version: `npm run build`
2. Upload the `build` folder contents to your hosting provider
3. Configure routing for single-page application (SPA)
4. Set up custom domain and SSL certificate
5. Configure caching headers for optimal performance

## 🔮 Future Enhancement Opportunities

### Immediate Improvements

- **Business Submission Form**: Allow users to submit new businesses
- **Contact Integration**: Direct contact forms and information
- **Map Integration**: Google Maps or OpenStreetMap for location visualization
- **Image Gallery**: Business photos and gallery functionality
- **Reviews & Ratings**: Community-driven business reviews

### Advanced Features

- **User Accounts**: Business owner accounts for profile management
- **Search Analytics**: Track popular searches and trends
- **API Integration**: Connect with external business directories
- **Social Sharing**: Enhanced social media integration
- **Newsletter Signup**: Email marketing integration
- **Mobile App**: React Native mobile application

### Technical Improvements

- **Backend Integration**: Connect to CMS or database
- **Search Engine**: Implement Elasticsearch for advanced search
- **Performance Monitoring**: Add analytics and performance tracking
- **Internationalization**: Multi-language support
- **Progressive Web App**: Enhanced PWA features
- **Accessibility Audit**: Professional accessibility testing

## 📈 SEO Optimization

### Current Implementation

- **Meta Tags**: Comprehensive meta descriptions and keywords
- **Structured Data**: Schema.org markup for business listings
- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **Mobile-Friendly**: Responsive design optimized for mobile
- **Fast Loading**: Optimized assets and efficient code

### Additional SEO Opportunities

- **Sitemap Generation**: Dynamic XML sitemap
- **Local SEO**: Geographic targeting and local business schema
- **Content Marketing**: Blog integration for rural business topics
- **Social Media Integration**: Open Graph and Twitter Card optimization
- **Performance Optimization**: Core Web Vitals optimization

## 🤝 Contributing

### Development Workflow

1. **Fork the Repository**: Create your own fork for development
2. **Create Feature Branch**: `git checkout -b feature/new-feature`
3. **Follow Code Standards**: Maintain consistent code style
4. **Add Tests**: Include tests for new functionality
5. **Update Documentation**: Keep README and comments current
6. **Submit Pull Request**: Provide clear description of changes

### Code Standards

- **ESLint Configuration**: Follow established linting rules
- **Prettier Formatting**: Consistent code formatting
- **Commit Messages**: Use conventional commit format
- **Component Documentation**: Include JSDoc for all components
- **Accessibility Testing**: Test with screen readers and keyboard navigation

## 📞 Support & Contact

### Getting Help

- **Documentation**: Refer to this README for setup and usage
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Community discussions for questions and ideas
- **Code Review**: Request code review for contributions

### Project Maintenance

- **Regular Updates**: Keep dependencies current
- **Security Patches**: Monitor and apply security updates
- **Performance Monitoring**: Regular performance audits
- **User Feedback**: Collect and implement user suggestions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Australian Rural Communities**: For inspiring this project
- **Open Source Community**: For the tools and libraries that make this possible
- **Tailwind CSS**: For the excellent utility-first CSS framework
- **React Team**: For the powerful and flexible JavaScript library
- **Contributors**: All developers who contribute to improving rural business visibility

---

**Built with ❤️ for Rural Australia** 🇦🇺

*Supporting local businesses and communities across regional Australia*
