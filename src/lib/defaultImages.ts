// Imagens padrão por categoria para posts sem capa
// Usa múltiplas imagens por categoria para variedade

const categoryImages: Record<string, string[]> = {
  crypto: [
    'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80', // Bitcoin dourado
    'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80', // Crypto coins
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80', // Ethereum
    'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80', // Bitcoin chart
    'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&q=80', // Bitcoin stack
  ],
  macro_global: [
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80', // Globe economia
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80', // Trading screens
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80', // Stock market
    'https://images.unsplash.com/photo-1468254095679-bbcba94a7066?w=800&q=80', // World map
    'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80', // Finance chart
  ],
  central_banks: [
    'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80', // Bank building
    'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80', // Federal Reserve
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80', // Trading floor
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80', // Financial documents
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80', // Money/rates
  ],
  commodities: [
    'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80', // Gold bars
    'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=800&q=80', // Oil barrels
    'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80', // Gold coins
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', // Wheat/agriculture
    'https://images.unsplash.com/photo-1589824783334-fed9c8937341?w=800&q=80', // Commodities
  ],
};

// Imagem padrão genérica caso a categoria não seja encontrada
const defaultFallback = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80';

/**
 * Retorna uma imagem de fallback baseada na categoria do post
 * Usa o ID do post para selecionar uma imagem diferente da lista,
 * garantindo variedade visual mesmo entre posts da mesma categoria
 */
export function getDefaultImage(category: string, postId: number): string {
  const images = categoryImages[category];

  if (!images || images.length === 0) {
    return defaultFallback;
  }

  // Usa o ID do post para selecionar uma imagem diferente
  const index = postId % images.length;
  return images[index];
}

/**
 * Retorna a imagem do post ou uma imagem de fallback
 */
export function getPostImage(imageUrl: string | null, category: string, postId: number): string {
  if (imageUrl) {
    return imageUrl;
  }
  return getDefaultImage(category, postId);
}
