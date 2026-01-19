import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-gray-100 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full">
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">Something went wrong</h1>
            <pre className="bg-slate-800 p-4 rounded-lg text-sm overflow-auto border border-yellow-500/20 mb-4">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

