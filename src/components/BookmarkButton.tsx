import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useLanguage } from '@/hooks/useLanguage';

interface BookmarkButtonProps {
  postId: number;
  size?: 'sm' | 'md';
}

export function BookmarkButton({ postId, size = 'md' }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { t } = useLanguage();
  const saved = isBookmarked(postId);

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  const padding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(postId);
      }}
      className={`${padding} rounded-lg transition-all ${
        saved
          ? 'text-cyber-green bg-cyber-green/10 border border-cyber-green/30'
          : 'text-gray-400 hover:text-cyber-green border border-transparent hover:border-cyber-green/20 hover:bg-cyber-green/5'
      }`}
      aria-label={saved ? t('Remover dos salvos', 'Remove from saved') : t('Salvar artigo', 'Save article')}
      title={saved ? t('Remover dos salvos', 'Remove from saved') : t('Salvar artigo', 'Save article')}
    >
      <Bookmark className={iconSize} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
