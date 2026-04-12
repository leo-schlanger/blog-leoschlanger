import { useMemo } from 'react';
import { List } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface TableOfContentsProps {
  content: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const { t } = useLanguage();

  const headings = useMemo(() => {
    const items: TocItem[] = [];
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/^(#{2,3})\s+(.+)/);
      if (match) {
        items.push({
          id: slugify(match[2]),
          text: match[2],
          level: match[1].length,
        });
      }
    }
    return items;
  }, [content]);

  if (headings.length < 2) return null;

  return (
    <nav className="cyber-card p-5 mb-8" aria-label={t('Índice', 'Table of Contents')}>
      <div className="flex items-center gap-2 mb-3">
        <List className="w-4 h-4 text-cyber-green" />
        <span className="text-cyber-green font-semibold text-sm tracking-wide">
          {t('ÍNDICE', 'TABLE OF CONTENTS')}
        </span>
      </div>
      <ul className="space-y-1.5">
        {headings.map((heading, index) => (
          <li key={index} style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}>
            <a
              href={`#${heading.id}`}
              className="text-gray-400 text-sm hover:text-cyber-green transition-colors block py-0.5"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
