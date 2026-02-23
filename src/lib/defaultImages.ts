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
  europe: [
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80', // European architecture
    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80', // European city
    'https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?w=800&q=80', // EU flags
    'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80', // European parliament
    'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800&q=80', // London financial
  ],
  asia: [
    'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80', // Tokyo
    'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80', // Asian markets
    'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=800&q=80', // Shanghai skyline
    'https://images.unsplash.com/photo-1532236204992-f5e85c024202?w=800&q=80', // Hong Kong
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80', // Singapore
  ],
  latin_america: [
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80', // Rio de Janeiro
    'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800&q=80', // Mexico City
    'https://images.unsplash.com/photo-1544989164-31dc3c645987?w=800&q=80', // Buenos Aires
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&q=80', // São Paulo skyline
    'https://images.unsplash.com/photo-1591901369595-602a5a9c7f74?w=800&q=80', // Latin America business
  ],
  middle_east: [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', // Dubai skyline
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80', // Dubai modern
    'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&q=80', // Middle East architecture
    'https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=800&q=80', // Abu Dhabi
    'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=80', // Middle East mosque
  ],
  africa: [
    'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=80', // Cape Town
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80', // African landscape
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80', // African city
    'https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=800&q=80', // Johannesburg
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80', // African business
  ],
  oceania: [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80', // Sydney Opera House
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80', // Sydney skyline
    'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80', // Melbourne
    'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=800&q=80', // Australia finance
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&q=80', // New Zealand
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
