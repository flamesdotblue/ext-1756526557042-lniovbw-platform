import { Link, BarChart3, Layers, Download, LineChart, Settings, Home } from 'lucide-react';

const items = [
  { key: 'Dashboard', label: 'Dashboard', icon: Home },
  { key: 'UTM Builder', label: 'UTM Builder', icon: Link },
  { key: 'Analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'Templates', label: 'Templates', icon: Layers },
  { key: 'Exports', label: 'Exports', icon: Download },
  { key: 'Comparisons', label: 'Comparisons', icon: LineChart },
  { key: 'Settings', label: 'Settings', icon: Settings },
];

export default function SidebarNav({ active, onSelect }) {
  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r bg-white/80 backdrop-blur z-10">
      <div className="px-5 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-rose-600" />
          <div>
            <div className="text-sm text-muted-foreground">Campaign OS</div>
            <div className="font-semibold tracking-tight">UTM Command</div>
          </div>
        </div>
      </div>
      <nav className="p-3 space-y-1">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect?.(key)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive ? 'bg-rose-600 text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t text-xs text-muted-foreground">
        v0.1 Prototype • Desktop
      </div>
    </aside>
  );
}
