import { useMemo, useState } from 'react';
import { Bell, Copy, Download, Plus } from 'lucide-react';

export default function MainView({ activeSection, setActiveSection, utmLinks, onCreateLink, templates, onSaveTemplate, notifications }) {
  const [builderState, setBuilderState] = useState({
    baseUrl: 'https://example.com/product',
    utm_source: 'facebook',
    utm_medium: 'cpc',
    utm_campaign: 'spring_sale',
    utm_term: '',
    utm_content: '',
  });

  const finalUrl = useMemo(() => buildUtm(builderState), [builderState]);

  const handleBuilderSubmit = (e) => {
    e.preventDefault();
    onCreateLink({ ...builderState, finalUrl });
    setActiveSection('dashboard');
  };

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <section id="main" className="relative">
      {activeSection === 'dashboard' && (
        <Dashboard
          utmLinks={utmLinks}
          notifications={notifications}
          onQuickCreate={() => setActiveSection('builder')}
          onCopy={copy}
        />
      )}

      {activeSection === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create & Save UTM Link</h2>
            </div>
            <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleBuilderSubmit}>
              <Input label="Base URL" value={builderState.baseUrl} onChange={(v) => setBuilderState({ ...builderState, baseUrl: v })} placeholder="https://yourdomain.com/page" required />
              <Select label="Template" value="" onChange={(tplId) => {
                const tpl = templates.find(t => t.id === tplId);
                if (tpl) setBuilderState((s) => ({ ...s, ...tpl.params }));
              }} options={[{ value: '', label: 'None' }, ...templates.map(t => ({ value: t.id, label: t.name }))]} />
              <Input label="utm_source" value={builderState.utm_source} onChange={(v) => setBuilderState({ ...builderState, utm_source: v })} placeholder="facebook" />
              <Input label="utm_medium" value={builderState.utm_medium} onChange={(v) => setBuilderState({ ...builderState, utm_medium: v })} placeholder="cpc" />
              <Input label="utm_campaign" value={builderState.utm_campaign} onChange={(v) => setBuilderState({ ...builderState, utm_campaign: v })} placeholder="spring_sale" />
              <Input label="utm_term" value={builderState.utm_term} onChange={(v) => setBuilderState({ ...builderState, utm_term: v })} placeholder="shoes" />
              <Input label="utm_content" value={builderState.utm_content} onChange={(v) => setBuilderState({ ...builderState, utm_content: v })} placeholder="cta_button" />

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-neutral-600">Preview</label>
                <div className="mt-1 flex items-center justify-between rounded-md border bg-neutral-50 px-3 py-2">
                  <code className="text-xs text-neutral-800 break-all">{finalUrl}</code>
                  <button type="button" onClick={() => copy(finalUrl)} className="ml-3 inline-flex items-center gap-2 rounded-md border bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">
                    <Copy size={14} /> Copy
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600">
                  <Plus size={16} /> Save Link
                </button>
                <button type="button" onClick={() => setActiveSection('dashboard')} className="text-sm text-neutral-600 hover:text-neutral-900">Cancel</button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border p-5">
              <h3 className="text-sm font-semibold">Save as Template</h3>
              <TemplateForm onSave={onSaveTemplate} defaults={builderState} />
            </div>

            <div className="bg-white rounded-xl border p-5">
              <h3 className="text-sm font-semibold">Tips</h3>
              <ul className="mt-2 list-disc pl-4 text-sm text-neutral-700 space-y-1">
                <li>Use consistent lowercase values for cleaner analytics.</li>
                <li>Keep campaign names short and descriptive.</li>
                <li>Leverage templates for repeatable structures.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'analytics' && (
        <AnalyticsPanel utmLinks={utmLinks} onCopy={copy} />
      )}

      {activeSection === 'templates' && (
        <TemplatesPanel templates={templates} />
      )}

      {activeSection === 'exports' && (
        <ExportsPanel utmLinks={utmLinks} />
      )}

      {activeSection === 'comparisons' && (
        <ComparisonsPanel utmLinks={utmLinks} />
      )}
    </section>
  );
}

function Dashboard({ utmLinks, notifications, onQuickCreate, onCopy }) {
  const top5 = utmLinks.slice(0, 5);
  const totalClicks = utmLinks.reduce((a, b) => a + (b.clicks || 0), 0);
  const campaigns = Object.values(
    utmLinks.reduce((acc, l) => {
      const k = l.utm_campaign || 'unknown';
      acc[k] = acc[k] || { name: k, clicks: 0 };
      acc[k].clicks += l.clicks || 0;
      return acc;
    }, {})
  ).sort((a, b) => b.clicks - a.clicks).slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent UTM Links</h2>
            <button onClick={onQuickCreate} className="inline-flex items-center gap-2 rounded-md bg-red-500 text-white px-3 py-1.5 text-sm hover:bg-red-600">
              <Plus size={14} /> Quick-create
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-neutral-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">Final URL</th>
                  <th className="py-2 pr-4 font-medium">Source</th>
                  <th className="py-2 pr-4 font-medium">Medium</th>
                  <th className="py-2 pr-4 font-medium">Campaign</th>
                  <th className="py-2 pr-4 font-medium">Clicks</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {top5.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-neutral-500">No links yet. Create your first UTM to get started.</td>
                  </tr>
                )}
                {top5.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="py-2 pr-4 max-w-[360px] truncate" title={l.finalUrl}>{l.finalUrl}</td>
                    <td className="py-2 pr-4">{l.utm_source}</td>
                    <td className="py-2 pr-4">{l.utm_medium}</td>
                    <td className="py-2 pr-4">{l.utm_campaign}</td>
                    <td className="py-2 pr-4">{l.clicks}</td>
                    <td className="py-2">
                      <button onClick={() => onCopy(l.finalUrl)} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-neutral-50">
                        <Copy size={12} /> Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Links" value={utmLinks.length} />
          <StatCard title="Total Clicks" value={totalClicks} />
          <StatCard title="Top Campaign" value={campaigns[0]?.name || '—'} subtitle={`${campaigns[0]?.clicks ?? 0} clicks`} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-2 text-neutral-700">
            <Bell size={16} />
            <h3 className="text-sm font-semibold">Team Updates</h3>
          </div>
          <ul className="mt-3 space-y-3">
            {notifications.map((n) => (
              <li key={n.id} className="text-sm text-neutral-700 flex items-center justify-between">
                <span>{n.text}</span>
                <span className="text-neutral-400 text-xs">{n.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h3 className="text-sm font-semibold">Quick Actions</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button onClick={onQuickCreate} className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50">New UTM</button>
            <a href="#" className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50">Import CSV</a>
            <a href="#" className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50">Invite teammate</a>
            <a href="#" className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50">Docs</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPanel({ utmLinks, onCopy }) {
  const bySource = Object.values(
    utmLinks.reduce((acc, l) => {
      const k = l.utm_source || 'unknown';
      acc[k] = acc[k] || { name: k, clicks: 0, count: 0 };
      acc[k].clicks += l.clicks || 0;
      acc[k].count += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Channel Performance</h2>
        <div className="mt-4 space-y-3">
          {bySource.length === 0 && <p className="text-sm text-neutral-500">No data yet. Create links to see analytics.</p>}
          {bySource.map((row) => (
            <div key={row.name} className="">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize">{row.name}</span>
                <span className="text-neutral-600">{row.clicks} clicks</span>
              </div>
              <div className="mt-2 h-2 rounded bg-neutral-100">
                <div className="h-2 rounded bg-red-500" style={{ width: `${Math.min(100, (row.clicks / Math.max(1, bySource[0]?.clicks || 1)) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-5">
          <h3 className="text-sm font-semibold">Top Links</h3>
          <ul className="mt-3 space-y-3">
            {utmLinks.slice(0, 5).map((l) => (
              <li key={l.id} className="text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate" title={l.finalUrl}>{l.finalUrl}</span>
                  <span className="text-neutral-600 whitespace-nowrap">{l.clicks} clicks</span>
                </div>
                <button onClick={() => onCopy(l.finalUrl)} className="mt-1 text-xs text-neutral-600 hover:text-neutral-900">Copy URL</button>
              </li>
            ))}
            {utmLinks.length === 0 && <li className="text-sm text-neutral-500">No links to show.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TemplatesPanel({ templates }) {
  return (
    <div className="bg-white rounded-xl border p-5">
      <h2 className="text-lg font-semibold">Manage UTM Templates</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-500">
            <tr>
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">utm_source</th>
              <th className="py-2 pr-4 font-medium">utm_medium</th>
              <th className="py-2 pr-4 font-medium">utm_campaign</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="py-2 pr-4">{t.name}</td>
                <td className="py-2 pr-4">{t.params.utm_source}</td>
                <td className="py-2 pr-4">{t.params.utm_medium}</td>
                <td className="py-2 pr-4">{t.params.utm_campaign}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExportsPanel({ utmLinks }) {
  const csv = toCsv(utmLinks);
  const downloadCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utm-links.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border p-5">
      <h2 className="text-lg font-semibold">Export / Share</h2>
      <p className="mt-2 text-sm text-neutral-600">Export your UTM links to CSV or copy inline for quick sharing.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={downloadCsv} className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm hover:bg-neutral-50">
          <Download size={16} /> Download CSV
        </button>
        <button onClick={() => navigator.clipboard.writeText(csv)} className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm hover:bg-neutral-50">
          <Copy size={16} /> Copy CSV
        </button>
      </div>
      <pre className="mt-4 max-h-64 overflow-auto rounded-md border bg-neutral-50 p-3 text-xs whitespace-pre-wrap">{csv}</pre>
    </div>
  );
}

function ComparisonsPanel({ utmLinks }) {
  const byChannel = Object.values(
    utmLinks.reduce((acc, l) => {
      const k = l.utm_source || 'unknown';
      acc[k] = acc[k] || { name: k, clicks: 0, links: 0 };
      acc[k].clicks += l.clicks || 0;
      acc[k].links += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="bg-white rounded-xl border p-5">
      <h2 className="text-lg font-semibold">Compare Channel Performance</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {byChannel.map((c) => (
          <div key={c.name} className="rounded-lg border p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium capitalize">{c.name}</div>
              <div className="text-neutral-600">{c.clicks} clicks • {c.links} links</div>
            </div>
            <div className="mt-3 h-2 rounded bg-neutral-100">
              <div className="h-2 rounded bg-red-500" style={{ width: `${Math.min(100, (c.clicks / Math.max(1, byChannel[0]?.clicks || 1)) * 100)}%` }} />
            </div>
          </div>
        ))}
        {byChannel.length === 0 && <p className="text-sm text-neutral-500">No channels to compare yet.</p>}
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="text-xs text-neutral-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-neutral-500">{subtitle}</div>}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-600">{label}</label>
      <input
        className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-600">{label}</label>
      <select
        className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200 bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function TemplateForm({ onSave, defaults }) {
  const [name, setName] = useState('New Template');
  const [params, setParams] = useState({
    utm_source: defaults.utm_source || '',
    utm_medium: defaults.utm_medium || '',
    utm_campaign: defaults.utm_campaign || '',
  });

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), params });
    setName('New Template');
  };

  return (
    <form className="mt-3 space-y-3" onSubmit={submit}>
      <div>
        <label className="text-xs font-medium text-neutral-600">Template Name</label>
        <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="utm_source" value={params.utm_source} onChange={(e) => setParams({ ...params, utm_source: e.target.value })} />
        <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="utm_medium" value={params.utm_medium} onChange={(e) => setParams({ ...params, utm_medium: e.target.value })} />
        <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="utm_campaign" value={params.utm_campaign} onChange={(e) => setParams({ ...params, utm_campaign: e.target.value })} />
      </div>
      <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white px-3 py-2 text-sm hover:bg-black">Save Template</button>
    </form>
  );
}

function buildUtm({ baseUrl, ...params }) {
  try {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
    return url.toString();
  } catch (e) {
    // if invalid URL, create manual query string
    const qs = Object.entries(params)
      .filter(([, v]) => v)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${qs}`;
  }
}

function toCsv(rows) {
  const headers = ['finalUrl','baseUrl','utm_source','utm_medium','utm_campaign','utm_term','utm_content','clicks','createdAt'];
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.join(',')].concat(
    rows.map(r => headers.map(h => escape(r[h])).join(','))
  );
  return lines.join('\n');
}
