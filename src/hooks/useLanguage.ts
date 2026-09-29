import { useState, useCallback, createContext, useContext } from 'react';
import { safeGetItem, safeSetItem } from '@/lib/storage';
import { CATEGORY_LABELS } from '@/lib/constants';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (pt: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguageProvider() {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = safeGetItem('blog-language');
    if (stored === 'pt' || stored === 'en') return stored;
    return navigator.language.startsWith('pt') ? 'pt' : 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    safeSetItem('blog-language', lang);
  }, []);

  const t = useCallback((pt: string, en: string) => language === 'pt' ? pt : en, [language]);

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
  saved: { pt: 'Salvos', en: 'Saved' },
  noResults: { pt: 'Nenhum resultado encontrado', en: 'No results found' },
  loading: { pt: 'Carregando...', en: 'Loading...' },
  source: { pt: 'Fonte', en: 'Source' },
  publishedAt: { pt: 'Publicado em', en: 'Published on' },
  backToHome: { pt: 'Voltar ao início', en: 'Back to home' },
  allCategories: { pt: 'Todas as categorias', en: 'All categories' },
  notFound: { pt: 'Página não encontrada', en: 'Page not found' },
  mainSite: { pt: 'Site Principal', en: 'Main Site' },
  crypto: CATEGORY_LABELS.crypto,
  macro_global: CATEGORY_LABELS.macro_global,
  central_banks: CATEGORY_LABELS.central_banks,
  commodities: CATEGORY_LABELS.commodities,
  europe: { pt: 'Europa', en: 'Europe' },
  asia: { pt: 'Ásia', en: 'Asia' },
  latin_america: { pt: 'América Latina', en: 'Latin America' },
  middle_east: { pt: 'Oriente Médio', en: 'Middle East' },
  africa: { pt: 'África', en: 'Africa' },
  oceania: { pt: 'Oceania', en: 'Oceania' },
  privacy: { pt: 'Privacidade', en: 'Privacy' },
  privacyPolicy: { pt: 'Política de Privacidade', en: 'Privacy Policy' },
  termsOfUse: { pt: 'Termos de Uso', en: 'Terms of Use' },
  about: { pt: 'Sobre', en: 'About' },
  readAlso: { pt: 'Leia também', en: 'Read also' },
  comments: { pt: 'Comentários', en: 'Comments' },
  tableOfContents: { pt: 'Índice', en: 'Table of Contents' },
  share: { pt: 'Compartilhar', en: 'Share' },
  saveArticle: { pt: 'Salvar artigo', en: 'Save article' },
  continueReading: { pt: 'Continue Lendo', en: 'Continue Reading' },
};
