import { useLanguage, translations } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  counts?: Record<string, number>;
}

const CATEGORIES = [
  { key: null, translationKey: 'allCategories' },
  { key: 'crypto', translationKey: 'crypto' },
  { key: 'macro_global', translationKey: 'macro_global' },
  { key: 'central_banks', translationKey: 'central_banks' },
  { key: 'commodities', translationKey: 'commodities' },
] as const;

export function CategoryTabs({ selectedCategory, onCategoryChange, counts }: CategoryTabsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.key;
        const label = t(
          (translations[cat.translationKey as keyof typeof translations] as { pt: string; en: string }).pt,
          (translations[cat.translationKey as keyof typeof translations] as { pt: string; en: string }).en
        );
        const count = cat.key ? counts?.[cat.key] : undefined;

        return (
          <button
            key={cat.translationKey}
            onClick={() => onCategoryChange(cat.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200',
              isSelected
                ? 'bg-cyber-green text-cyber-black'
                : 'bg-cyber-dark border border-cyber-green/30 text-gray-400 hover:text-cyber-green hover:border-cyber-green/60'
            )}
          >
            {label}
            {count !== undefined && count > 0 && (
              <span className={cn(
                'ml-2 text-xs px-1.5 py-0.5 rounded',
                isSelected
                  ? 'bg-cyber-black/20 text-cyber-black'
                  : 'bg-cyber-green/10 text-cyber-green/70'
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
