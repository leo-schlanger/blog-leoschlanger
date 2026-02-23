import { TradingToolsCard } from './TradingToolsCard';
import { DonationWidget } from './DonationWidget';

export function Sidebar() {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <TradingToolsCard />
      <DonationWidget />
    </aside>
  );
}
