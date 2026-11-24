'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createSeoCampaignAction,
  listEligibleSeoToolsAction,
  listSeoCampaignsAction,
  type SeoCampaign,
  type SeoEligibleTool,
} from '@/server/seo/campaign-actions';

const PILOT_MAX = 20;

export default function SeoCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = React.useState<SeoCampaign[]>([]);
  const [tools, setTools] = React.useState<SeoEligibleTool[]>([]);
  const [name, setName] = React.useState('Finance pilot');
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    Promise.all([listSeoCampaignsAction(), listEligibleSeoToolsAction()]).then(([campaignResult, toolResult]) => {
      if (!campaignResult.success) setError(campaignResult.error || 'Failed to load campaigns.');
      else setCampaigns(campaignResult.data ?? []);
      if (!toolResult.success) setError(toolResult.error || 'Failed to load calculators.');
      else setTools(toolResult.data ?? []);
      setLoading(false);
    });
  }, []);

  const visible = tools.filter((tool) => {
    const haystack = `${tool.name} ${tool.slug} ${tool.pillarName}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= PILOT_MAX) return current;
      return [...current, id];
    });
  }

  async function createCampaign() {
    setSaving(true);
    setError(null);
    const result = await createSeoCampaignAction({ name: name.trim(), toolIds: selected });
    setSaving(false);
    if (!result.success || !result.data) {
      setError(result.error || 'Failed to create the campaign.');
      return;
    }
    router.push(`/admin/seo-campaigns/${result.data.campaign.id}`);
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="SEO campaigns"
        description="Pilot up to 20 active, developed Finance & Business calculators. Publishing does not change active or indexable."
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="space-y-4 rounded-2xl border border-border bg-white p-5">
        <h2 className="text-lg font-semibold text-accent">New pilot</h2>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Campaign name" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search calculators" />
        <p className="text-xs text-muted-foreground">
          {selected.length} / {PILOT_MAX} selected
          {loading ? ' · loading calculators' : ` · ${tools.length} eligible`}
        </p>
        <div className="max-h-80 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
          {visible.map((tool) => (
            <label key={tool.id} className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 hover:bg-muted">
              <input
                type="checkbox"
                className="mt-1"
                checked={selected.includes(tool.id)}
                onChange={() => toggle(tool.id)}
              />
              <span>
                <span className="block text-sm font-medium text-accent">{tool.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {tool.pillarName || 'No pillar'} · {tool.slug}
                </span>
              </span>
            </label>
          ))}
        </div>
        <Button type="button" disabled={saving || selected.length === 0 || name.trim().length === 0} onClick={createCampaign}>
          {saving ? 'Starting…' : 'Start pilot'}
        </Button>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-accent">Campaigns</h2>
        {campaigns.length === 0 ? <p className="text-sm text-muted-foreground">No campaigns yet.</p> : null}
        <ul className="divide-y divide-border rounded-2xl border border-border bg-white">
          {campaigns.map((campaign) => (
            <li key={campaign.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <Link href={`/admin/seo-campaigns/${campaign.id}`} className="font-medium text-accent hover:underline">
                  {campaign.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {campaign.draftCount} tools · location {campaign.locationCode} · {campaign.languageCode}
                </p>
              </div>
              <StatusBadge status={campaign.status} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
