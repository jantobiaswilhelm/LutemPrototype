import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="max-w-[44ch] w-full text-center">
            <div
              className="flex items-center gap-3 justify-center font-mono text-[0.7rem] tracking-[0.28em] uppercase mb-5"
              style={{ color: 'var(--color-error)' }}
            >
              <span className="inline-block w-6 h-px" style={{ background: 'var(--color-error)' }} />
              <span>Something interrupted</span>
              <span className="inline-block w-6 h-px" style={{ background: 'var(--color-error)' }} />
            </div>

            <h2
              className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.05] tracking-[-0.015em] mb-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              An unexpected error.
            </h2>
            <p
              className="font-serif italic text-[1rem] mb-8"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Something went wrong that Lutem wasn&rsquo;t expecting. Try again, or return to the start.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-8 text-left" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '1rem 0' }}>
                <summary
                  className="cursor-pointer font-mono text-[0.7rem] tracking-[0.18em] uppercase"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Error details
                </summary>
                <pre
                  className="mt-3 p-3 font-mono text-[0.72rem] overflow-auto max-h-40"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-error)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-8 justify-center items-baseline">
              <button
                onClick={this.handleGoHome}
                className="font-mono text-[0.78rem] tracking-[0.14em] uppercase bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors"
                style={{
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                ← Go home
              </button>
              <button
                onClick={this.handleReset}
                className="eb-retry relative font-serif italic font-medium text-[1.2rem] inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500"
                style={{ color: 'var(--color-accent)' }}
              >
                Try again
                <span aria-hidden="true" className="eb-retry-arrow font-sans not-italic transition-transform duration-500">→</span>
                <span
                  aria-hidden="true"
                  className="eb-retry-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
                  style={{ background: 'var(--color-accent)', right: '30%' }}
                />
              </button>
            </div>

            <style>{`
              .eb-retry:hover { letter-spacing: 0.04em; }
              .eb-retry:hover .eb-retry-underline { right: 0 !important; }
              .eb-retry:hover .eb-retry-arrow { transform: translateX(0.4rem); }
            `}</style>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
