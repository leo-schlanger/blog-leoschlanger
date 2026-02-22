import { MarketThermometer } from './MarketThermometer';
import { DonationWidget } from './DonationWidget';

export function Sidebar() {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <MarketThermometer />
      <DonationWidget />
    </aside>
  );
}
