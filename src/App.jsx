import { useState } from 'react';
import SidebarNav from './components/SidebarNav';
import HeroCover from './components/HeroCover';
import StatsOverview from './components/StatsOverview';
import RecentLinks from './components/RecentLinks';
import { Link as LinkIcon } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const handleQuickCreate = () => {
    setActiveSection('UTM Builder');
  };

  const SectionHeader = ({ title, description, icon: Icon }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-5 w-5 text-rose-500" /> : null}
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      {description ? (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      ) : null}
    </div>
  );

  const BuilderStub = () => (
    <div className="rounded-xl border bg-white/60 backdrop-blur p-4 md:p-6 shadow-sm">
      <SectionHeader
        title="Create & Save UTM Links"
        description="Fill in campaign parameters and generate a trackable URL."
        icon={LinkIcon}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const base = data.get('base');
          const source = data.get('source');
          const medium = data.get('medium');
          const campaign = data.get('campaign');
          const term = data.get('term');
          const content = data.get('content');
          const params = new URLSearchParams();
          if (source) params.set('utm_source', source);
          if (medium) params.set('utm_medium', medium);
          if (campaign) params.set('utm_campaign', campaign);
          if (term) params.set('utm_term', term);
          if (content) params.set('utm_content', content);
          const url = base ? `${base}${base.includes('?') ? '&' : '?'}${params.toString()}` : '';
          if (url) {
            navigator.clipboard.writeText(url).catch(() => {});
            alert('UTM URL generated and copied to clipboard:\n\n' + url);
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="col-span-1 md:col-span-2">
          <label className="text-sm font-medium">Destination URL</label>
          <input
            name="base"
            required
            type="url"
            placeholder="https://www.example.com/landing"
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium">utm_source</label>
          <input name="source" placeholder="facebook" className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500" />
        </div>
        <div>
          <label className="text-sm font-medium">utm_medium</label>
          <input name="medium" placeholder="cpc" className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500" />
        </div>
        <div>
          <label className="text-sm font-medium">utm_campaign</label>
          <input name="campaign" placeholder="spring_sale" className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500" />
        </div>
        <div>
          <label className="text-sm font-medium">utm_term</label>
          <input name="term" placeholder="running shoes" className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">utm_content</label>
          <input name="content" placeholder="cta_button_a" className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500" />
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 transition-colors">
            Generate & Copy URL
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('Dashboard')}
            className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );

  const SectionStub = ({ title }) => (
    <div className="rounded-xl border bg-white/60 backdrop-blur p-6 shadow-sm">
      <SectionHeader title={title} />
      <p className="text-muted-foreground">This is a prototype view for {title}. Use the sidebar to explore other sections.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50/40 text-gray-900">
      <div className="flex">
        <SidebarNav active={activeSection} onSelect={setActiveSection} />
        <main className="flex-1 ml-0 lg:ml-64">
          {activeSection === 'Dashboard' ? (
            <>
              <HeroCover onQuickCreate={handleQuickCreate} />
              <div className="px-4 md:px-8 -mt-10 relative z-0">
                <StatsOverview />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <div className="lg:col-span-2"><RecentLinks /></div>
                  <div className="lg:col-span-1">
                    <div className="rounded-xl border bg-white p-4 md:p-6 shadow-sm h-full">
                      <h3 className="font-semibold">Team Notifications</h3>
                      <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                        <li>• Mia added a new UTM template: "Meta CPC - US"</li>
                        <li>• Raj exported 24 links to CSV</li>
                        <li>• Ava updated campaign: "Q4 Black Friday"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : activeSection === 'UTM Builder' ? (
            <div className="px-4 md:px-8 pt-6"><BuilderStub /></div>
          ) : activeSection === 'Analytics' ? (
            <div className="px-4 md:px-8 pt-6"><SectionStub title="Analyze Campaign Performance" /></div>
          ) : activeSection === 'Templates' ? (
            <div className="px-4 md:px-8 pt-6"><SectionStub title="Manage UTM Templates" /></div>
          ) : activeSection === 'Exports' ? (
            <div className="px-4 md:px-8 pt-6"><SectionStub title="Export/Share UTM Links" /></div>
          ) : activeSection === 'Comparisons' ? (
            <div className="px-4 md:px-8 pt-6"><SectionStub title="Compare Channel Performance" /></div>
          ) : (
            <div className="px-4 md:px-8 pt-6"><SectionStub title={activeSection} /></div>
          )}
        </main>
      </div>
    </div>
  );
}
