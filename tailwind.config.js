/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Australian-inspired color palette
        'aussie': {
          'red': '#C8102E',
          'gold': '#FFCD00',
          'green': '#00843D',
          'blue': '#0057B7'
        },
        // Extended stone palette for rural theme
        'stone': {
          25: '#fafaf9',
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09'
        },
        // Enhanced amber palette
        'amber': {
          25: '#fffbeb',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        }
      },
      fontFamily: {
        // Australian-friendly font stack
        'sans': [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif'
        ],
        'serif': [
          'Georgia',
          'ui-serif',
          'serif'
        ]
      },
      spacing: {
        // Additional spacing for rural layouts
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      maxWidth: {
        // Content container sizes
        '8xl': '88rem',
        '9xl': '96rem'
      },
      animation: {
        // Custom animations for interactive elements
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        }
      },
      boxShadow: {
        // Custom shadows for depth
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'feature': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      borderRadius: {
        // Consistent border radius values
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      backdropBlur: {
        xs: '2px'
      },
      screens: {
        // Additional breakpoints for better responsive design
        'xs': '475px',
        '3xl': '1600px'
      }
    }
  },
  plugins: [
    // Add form plugin for better form styling
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
    // Add typography plugin for rich text content
    require('@tailwindcss/typography'),
    // Add aspect ratio plugin for media
    require('@tailwindcss/aspect-ratio'),
    // Add line clamp plugin for text truncation
    require('@tailwindcss/line-clamp')
  ],
  // Safelist important classes that might not be detected
  safelist: [
    'animate-spin',
    'animate-pulse',
    'animate-fade-in',
    'line-clamp-2',
    'line-clamp-3',
    {
      pattern: /bg-(stone|amber|green|blue)-(50|100|200|600|700)/,
      variants: ['hover', 'focus']
    },
    {
      pattern: /text-(stone|amber|green|blue)-(600|700|800)/,
      variants: ['hover', 'focus']
    },
    {
      pattern: /border-(stone|amber|green|blue)-(200|300|500)/,
      variants: ['hover', 'focus']
    }
  ]
}
