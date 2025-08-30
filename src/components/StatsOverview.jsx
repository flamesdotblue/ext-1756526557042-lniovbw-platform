import { TrendingUp, MousePointer, Percent, ShoppingCart } from 'lucide-react';

export default function StatsOverview() {
  const cards = [
    { label: 'Total Clicks', value: '128,940', delta: '+8.2%', icon: MousePointer },
    { label: 'Avg. CTR', value: '3.9%', delta: '+0.4%', icon: Percent },
    { label: 'Conversions', value: '9,412', delta: '+5.1%', icon: ShoppingCart },
    { label: 'Top Channel Lift', value: 'Meta Ads', delta: '+12%', icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{c.label}</div>
            <c.icon className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold">{c.value}</div>
          <div className="mt-1 text-xs font-medium text-emerald-600">{c.delta} vs last period</div>
        </div>
      ))}
    </div>
  );
}
