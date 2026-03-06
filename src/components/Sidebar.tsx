import { TradingToolsCard } from './TradingToolsCard';
import { RecommendedToolsCard } from './RecommendedToolsCard';
import { DonationWidget } from './DonationWidget';

export function Sidebar() {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <TradingToolsCard />
      <RecommendedToolsCard />
      <DonationWidget />
    </aside>
  );
}
