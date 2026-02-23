import { MarketThermometer } from './MarketThermometer';
import { EconomicCalendar } from './EconomicCalendar';
import { DonationWidget } from './DonationWidget';

export function Sidebar() {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <MarketThermometer />
      <EconomicCalendar />
      <DonationWidget />
    </aside>
  );
}
