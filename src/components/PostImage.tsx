import { useState } from 'react';
import { getDefaultImage } from '@/lib/defaultImages';
import { cn } from '@/lib/utils';

interface PostImageProps {
  src: string;
  alt: string;
  category: string;
  postId: number;
  className?: string;
}

/**
 * Componente de imagem com fallback automático para imagem padrão da categoria
 * quando a imagem original falha ao carregar
 */
export function PostImage({ src, alt, category, postId, className }: PostImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getDefaultImage(category, postId));
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn(className)}
      onError={handleError}
    />
  );
}
