import { Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const sampleLinks = [
  {
    id: '1',
    name: 'Spring Sale - FB CPC',
    url: 'https://shop.example.com/landing?utm_source=facebook&utm_medium=cpc&utm_campaign=spring_sale',
    tags: ['facebook', 'cpc', 'sale'],
    clicks: 4821,
  },
  {
    id: '2',
    name: 'Newsletter April',
    url: 'https://shop.example.com/blog?utm_source=email&utm_medium=newsletter&utm_campaign=apr_update',
    tags: ['email', 'newsletter'],
    clicks: 1920,
  },
  {
    id: '3',
    name: 'Influencer IG Story',
    url: 'https://shop.example.com/new?utm_source=instagram&utm_medium=social&utm_campaign=creator_story',
    tags: ['instagram', 'social', 'creator'],
    clicks: 2756,
  },
];

export default function RecentLinks() {
  const [copiedId, setCopiedId] = useState(null);

  const copy = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {}
  };

  return (
    <div className="rounded-xl border bg-white p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold tracking-tight">Recent UTM Links</h3>
        <button className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50">Export CSV</button>
      </div>
      <ul className="space-y-4">
        {sampleLinks.map((l) => (
          <li key={l.id} className="rounded-lg border p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="font-medium">{l.name}</div>
                <div className="text-xs text-muted-foreground break-all mt-1">{l.url}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {l.tags.map((t) => (
                    <span key={t} className="text-[11px] rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 border border-rose-100">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-xs text-muted-foreground">{l.clicks.toLocaleString()} clicks</span>
                <a
                  className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm hover:bg-gray-50"
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => copy(l.url, l.id)}
                  className="inline-flex items-center gap-1 rounded-lg bg-rose-600 text-white px-2.5 py-1.5 text-sm hover:bg-rose-700"
                >
                  {copiedId === l.id ? 'Copied' : 'Copy'} <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
