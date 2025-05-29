import React from 'react';

/**
 * ErrorBoundary component for graceful error handling
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Report error to monitoring service if available
    if (window.reportError) {
      window.reportError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-stone-200 p-6 text-center">
            <div className="text-6xl mb-4" role="img" aria-label="Error">⚠️</div>
            
            <h2 className="text-xl font-semibold text-stone-800 mb-2">
              Something went wrong
            </h2>
            
            <p className="text-stone-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-4 p-3 bg-stone-50 rounded border text-sm">
                <summary className="cursor-pointer font-medium text-stone-700 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="whitespace-pre-wrap text-red-600 text-xs">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
              >
                🔄 Refresh Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-4 py-2 bg-stone-600 hover:bg-stone-700 text-white font-medium rounded-lg transition-colors"
              >
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
