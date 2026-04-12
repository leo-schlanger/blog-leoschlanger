import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Sunrise,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { PostImage } from '@/components/PostImage';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { getBlogPosts, type BlogPost } from '@/lib/supabase';
import { MARKET_DATA_URL } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { getPostImage } from '@/lib/defaultImages';

interface ThermometerData {
  dashboard: {
    fearGreed: { value: number; classification: string; signal: string } | null;
    vix: { value: number; zone: string } | null;
    dxy: { value: number; zone: string; impact: string } | null;
    bitcoin: {
      price: number;
      priceFormatted: string;
      change24h: number;
      changeFormatted: string;
    } | null;
  };
  alerts: Array<{ level: string; title: string; message: string }>;
  meta: { updatedAt: string };
}

function SkeletonCard() {
  return (
    <div className="cyber-card p-5 animate-pulse">
      <div className="h-4 w-24 bg-cyber-green/10 rounded mb-3" />
      <div className="h-8 w-32 bg-cyber-green/10 rounded mb-2" />
      <div className="h-3 w-20 bg-cyber-green/10 rounded" />
    </div>
  );
}

export function Briefing() {
  const { language, t } = useLanguage();

  const today = new Date();
  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  const todayFormatted = formatDate(today, locale);

  const { data: marketData, isLoading: marketLoading } =
    useQuery<ThermometerData>({
      queryKey: ['briefing-market'],
      queryFn: async () => {
        const res = await fetch(MARKET_DATA_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch market data');
        return res.json();
      },
      staleTime: 1000 * 60 * 5,
    });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['briefing-posts', language],
    queryFn: () => getBlogPosts(language, 3, 1),
  });

  const posts: BlogPost[] = postsData?.posts ?? [];
  const dashboard = marketData?.dashboard;
  const alerts = marketData?.alerts ?? [];

  const fearGreedColor = (value: number) => {
    if (value <= 25) return 'text-red-400';
    if (value <= 45) return 'text-orange-400';
    if (value <= 55) return 'text-yellow-400';
    if (value <= 75) return 'text-green-400';
    return 'text-cyber-green';
  };

  const alertColors: Record<string, { border: string; bg: string; text: string; icon: string }> = {
    critical: {
      border: 'border-red-500/40',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      icon: 'text-red-400',
    },
    warning: {
      border: 'border-orange-500/40',
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      icon: 'text-orange-400',
    },
    info: {
      border: 'border-yellow-500/40',
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      icon: 'text-yellow-400',
    },
  };

  return (
    <>
      <SEO
        title={t('Briefing Diario', 'Daily Briefing')}
        description={t(
          'Resumo diario do mercado financeiro com dados em tempo real',
          'Daily financial market summary with real-time data'
        )}
        url="/briefing"
      />

      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <header className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-xl bg-cyber-green/10 border border-cyber-green/20">
              <Sunrise className="h-7 w-7 text-cyber-green" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {t('Briefing Diario', 'Daily Briefing')}
              </h1>
              <p className="text-gray-400 flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                {todayFormatted}
              </p>
            </div>
          </header>

          {/* Section 1: Market Snapshot */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyber-green" />
              {t('Panorama do Mercado', 'Market Snapshot')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fear & Greed */}
              {marketLoading ? (
                <SkeletonCard />
              ) : (
                <div className="cyber-card p-5">
                  <p className="text-gray-400 text-sm mb-1">
                    {t('Medo & Ganancia', 'Fear & Greed')}
                  </p>
                  {dashboard?.fearGreed ? (
                    <>
                      <p
                        className={`text-3xl font-bold ${fearGreedColor(dashboard.fearGreed.value)}`}
                      >
                        {dashboard.fearGreed.value}
                      </p>
                      <p className="text-sm text-gray-300 capitalize mb-2">
                        {dashboard.fearGreed.classification}
                      </p>
                      <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-cyber-green transition-all"
                          style={{ width: `${dashboard.fearGreed.value}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {t('Sem dados', 'No data')}
                    </p>
                  )}
                </div>
              )}

              {/* Bitcoin */}
              {marketLoading ? (
                <SkeletonCard />
              ) : (
                <div className="cyber-card p-5">
                  <p className="text-gray-400 text-sm mb-1">Bitcoin</p>
                  {dashboard?.bitcoin ? (
                    <>
                      <p className="text-3xl font-bold text-white">
                        {dashboard.bitcoin.priceFormatted}
                      </p>
                      <p
                        className={`text-sm flex items-center gap-1 ${
                          dashboard.bitcoin.change24h >= 0
                            ? 'text-cyber-green'
                            : 'text-red-400'
                        }`}
                      >
                        {dashboard.bitcoin.change24h >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {dashboard.bitcoin.changeFormatted} (24h)
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {t('Sem dados', 'No data')}
                    </p>
                  )}
                </div>
              )}

              {/* VIX */}
              {marketLoading ? (
                <SkeletonCard />
              ) : (
                <div className="cyber-card p-5">
                  <p className="text-gray-400 text-sm mb-1">VIX</p>
                  {dashboard?.vix ? (
                    <>
                      <p className="text-3xl font-bold text-white">
                        {dashboard.vix.value?.toFixed(2) ?? '--'}
                      </p>
                      <p className="text-sm text-gray-300 capitalize">
                        {dashboard.vix.zone}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {t('Sem dados', 'No data')}
                    </p>
                  )}
                </div>
              )}

              {/* DXY */}
              {marketLoading ? (
                <SkeletonCard />
              ) : (
                <div className="cyber-card p-5">
                  <p className="text-gray-400 text-sm mb-1">DXY</p>
                  {dashboard?.dxy ? (
                    <>
                      <p className="text-3xl font-bold text-white">
                        {dashboard.dxy.value?.toFixed(2) ?? '--'}
                      </p>
                      <p className="text-sm text-gray-300 capitalize">
                        {dashboard.dxy.zone}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {t('Sem dados', 'No data')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Market Alerts */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-cyber-green" />
              {t('Alertas do Mercado', 'Market Alerts')}
            </h2>

            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert, i) => {
                  const colors = alertColors[alert.level] ?? alertColors.info;
                  return (
                    <div
                      key={i}
                      className={`rounded-lg border p-4 ${colors.border} ${colors.bg}`}
                    >
                      <p className={`font-semibold ${colors.text}`}>
                        {alert.title}
                      </p>
                      <p className="text-gray-300 text-sm mt-1">
                        {alert.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-cyber-green/30 bg-cyber-green/5 p-4">
                <p className="text-cyber-green font-medium">
                  {t(
                    'Tudo tranquilo. Nenhum alerta no momento.',
                    'All clear. No alerts at this time.'
                  )}
                </p>
              </div>
            )}
          </section>

          {/* Section 3: Top Stories */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyber-green" />
              {t('Destaques', 'Top Stories')}
            </h2>

            {postsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="cyber-card p-4 flex gap-4 animate-pulse"
                  >
                    <div className="w-28 h-20 rounded-lg bg-cyber-green/10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-16 bg-cyber-green/10 rounded" />
                      <div className="h-5 w-3/4 bg-cyber-green/10 rounded" />
                      <div className="h-3 w-full bg-cyber-green/10 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => {
                  const postTitle = language === 'pt' ? post.title_pt : post.title_en;
                  const postSlug = language === 'pt' ? post.slug_pt : post.slug_en;
                  const postSummary = language === 'pt' ? post.summary_pt : post.summary_en;
                  return (
                    <Link
                      key={post.id}
                      to={`/post/${postSlug}`}
                      className="cyber-card p-4 flex gap-4 group hover:border-cyber-green/40 transition-colors"
                    >
                      <div className="w-28 h-20 rounded-lg overflow-hidden shrink-0">
                        <PostImage
                          src={getPostImage(post.image_url, post.category, post.id)}
                          alt={postTitle}
                          category={post.category}
                          postId={post.id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-cyber-green uppercase tracking-wider">
                          {t(
                            (translations[post.category as keyof typeof translations] as { pt: string; en: string })?.pt ?? post.category,
                            (translations[post.category as keyof typeof translations] as { pt: string; en: string })?.en ?? post.category
                          )}
                        </span>
                        <h3 className="text-white font-semibold mt-1 truncate group-hover:text-cyber-green transition-colors">
                          {postTitle}
                        </h3>
                        {postSummary && (
                          <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                            {postSummary}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          {formatDate(post.published_at || post.created_at, locale)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                {t(translations.noResults.pt, translations.noResults.en)}
              </p>
            )}
          </section>

          {/* Section 4: CTA Links */}
          <section className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/tools"
              className="cyber-button flex-1 flex items-center justify-center gap-2 text-center"
            >
              <Activity className="h-4 w-4" />
              {t('Ferramentas de Trading', 'Trading Tools')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="cyber-button flex-1 flex items-center justify-center gap-2 text-center"
            >
              <Sunrise className="h-4 w-4" />
              {t('Todas as Noticias', 'All News')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
