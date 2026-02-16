import { useState, useEffect, createContext, useContext } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (pt: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguageProvider() {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('blog-language');
    if (stored === 'pt' || stored === 'en') return stored;
    return navigator.language.startsWith('pt') ? 'pt' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('blog-language', lang);
  };

  const t = (pt: string, en: string) => language === 'pt' ? pt : en;

  return { language, setLanguage, t };
}

export const LanguageProvider = LanguageContext.Provider;

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const translations = {
  home: { pt: 'Início', en: 'Home' },
  blog: { pt: 'Blog', en: 'Blog' },
  categories: { pt: 'Categorias', en: 'Categories' },
  search: { pt: 'Buscar', en: 'Search' },
  searchPlaceholder: { pt: 'Buscar notícias...', en: 'Search news...' },
  readMore: { pt: 'Ler mais', en: 'Read more' },
  readingTime: { pt: 'min de leitura', en: 'min read' },
  latestNews: { pt: 'Últimas Notícias', en: 'Latest News' },
  noResults: { pt: 'Nenhum resultado encontrado', en: 'No results found' },
  loading: { pt: 'Carregando...', en: 'Loading...' },
  source: { pt: 'Fonte', en: 'Source' },
  publishedAt: { pt: 'Publicado em', en: 'Published on' },
  backToHome: { pt: 'Voltar ao início', en: 'Back to home' },
  allCategories: { pt: 'Todas as categorias', en: 'All categories' },
  notFound: { pt: 'Página não encontrada', en: 'Page not found' },
  mainSite: { pt: 'Site Principal', en: 'Main Site' },
  crypto: { pt: 'Cripto', en: 'Crypto' },
  macro_global: { pt: 'Macro Global', en: 'Global Macro' },
  central_banks: { pt: 'Bancos Centrais', en: 'Central Banks' },
  commodities: { pt: 'Commodities', en: 'Commodities' },
  europe: { pt: 'Europa', en: 'Europe' },
  asia: { pt: 'Ásia', en: 'Asia' },
  latin_america: { pt: 'América Latina', en: 'Latin America' },
  middle_east: { pt: 'Oriente Médio', en: 'Middle East' },
  africa: { pt: 'África', en: 'Africa' },
  oceania: { pt: 'Oceania', en: 'Oceania' },
};
