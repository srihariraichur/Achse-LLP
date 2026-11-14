import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Unexpected rendering error',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ACHSE Application ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
            <div className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
              ACHSE LLP Portal
            </div>
            <h1 className="text-xl font-bold text-[#0F2A4A]">
              Unable to display this view
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              A browser script error occurred while loading this page. Please reload or return to the homepage.
            </p>
            {this.state.message && (
              <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs font-mono-spec text-slate-700 break-words">
                {this.state.message}
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.location.hash = 'home';
                  window.location.href = '/';
                }}
                className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] cursor-pointer"
              >
                Reload Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
