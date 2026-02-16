import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  variant?: 'pages' | 'loadmore';
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasMore,
  onLoadMore,
  variant = 'pages'
}: PaginationProps) {
  const { t } = useLanguage();

  if (variant === 'loadmore' && onLoadMore) {
    if (!hasMore) return null;

    return (
      <div className="flex justify-center mt-8">
        <button
          onClick={onLoadMore}
          className="cyber-button px-8 py-3"
        >
          {t('Carregar mais', 'Load more')}
        </button>
      </div>
    );
  }

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded border border-cyber-green/30 transition-colors",
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-cyber-green/10 hover:border-cyber-green"
        )}
        aria-label={t('Página anterior', 'Previous page')}
      >
        <ChevronLeft className="h-5 w-5 text-cyber-green" />
      </button>

      {getVisiblePages().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={cn(
              "min-w-[40px] h-10 px-3 rounded border transition-colors",
              currentPage === page
                ? "bg-cyber-green text-cyber-black border-cyber-green font-bold"
                : "border-cyber-green/30 text-gray-400 hover:bg-cyber-green/10 hover:border-cyber-green hover:text-cyber-green"
            )}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2 text-gray-500">...</span>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded border border-cyber-green/30 transition-colors",
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-cyber-green/10 hover:border-cyber-green"
        )}
        aria-label={t('Próxima página', 'Next page')}
      >
        <ChevronRight className="h-5 w-5 text-cyber-green" />
      </button>
    </nav>
  );
}
