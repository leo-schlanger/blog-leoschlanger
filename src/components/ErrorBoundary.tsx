import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Detect language from localStorage (can't use hooks in class components)
      const lang = typeof window !== 'undefined'
        ? localStorage.getItem('blog-language') || 'en'
        : 'en';
      const isPt = lang === 'pt';

      return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-black">
          <div className="text-center p-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              {isPt ? 'Algo deu errado' : 'Something went wrong'}
            </h1>
            <p className="text-gray-400 mb-6">
              {isPt
                ? 'Ocorreu um erro inesperado. Por favor, tente recarregar a página.'
                : 'An unexpected error occurred. Please try reloading the page.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="cyber-button"
            >
              {isPt ? 'Recarregar página' : 'Reload page'}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
