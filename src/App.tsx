import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LanguageProvider, useLanguageProvider } from '@/hooks/useLanguage';

const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const Post = lazy(() => import('@/pages/Post').then(m => ({ default: m.Post })));
const TradingTools = lazy(() => import('@/pages/TradingTools').then(m => ({ default: m.TradingTools })));
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfUse = lazy(() => import('@/pages/TermsOfUse').then(m => ({ default: m.TermsOfUse })));
const Category = lazy(() => import('@/pages/Category').then(m => ({ default: m.Category })));
const About = lazy(() => import('@/pages/About').then(m => ({ default: m.About })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const languageValue = useLanguageProvider();

  return (
    <LanguageProvider value={languageValue}>
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* Skip to content - a11y */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyber-green focus:text-cyber-black focus:font-bold focus:rounded"
        >
          Skip to content
        </a>
        <main id="main-content" className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-2 border-cyber-green/30 border-t-cyber-green rounded-full animate-spin" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tools" element={<TradingTools />} />
              <Route path="/post/:slug" element={<Post />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
