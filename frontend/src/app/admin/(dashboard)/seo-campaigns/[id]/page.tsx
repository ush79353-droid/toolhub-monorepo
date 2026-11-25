'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { getSeoCampaignAction, type SeoCampaign, type SeoDraftListItem } from '@/server/seo/campaign-actions';

const ACTIVE = new Set(['queued', 'researching', 'serp', 'generating', 'validating']);

export default function SeoCampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const [campaign, setCampaign] = React.useState<SeoCampaign | null>(null);
  const [drafts, setDrafts] = React.useState<SeoDraftListItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const result = await getSeoCampaignAction(params.id);
    if (!result.success || !result.data) {
      setError(result.error || 'Campaign was not found.');
      return;
    }
    setError(null);
    setCampaign(result.data.campaign);
    setDrafts(result.data.drafts);
  }, [params.id]);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    if (!drafts.some((draft) => ACTIVE.has(draft.status))) return;
    const timer = window.setInterval(() => void load(), 5000);
    return () => window.clearInterval(timer);
  }, [drafts, load]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={campaign?.name || 'SEO campaign'}
        description={
          campaign
            ? `${campaign.draftCount} calculators, one at a time. DataForSEO location ${campaign.locationCode} (${campaign.languageCode}). Volumes are country-specific.`
            : 'Loading campaign'
        }
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Calculator</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Primary keyword</th>
              <th className="px-4 py-3 font-medium">Calls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {drafts.map((draft) => (
              <tr key={draft.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/seo-campaigns/${params.id}/drafts/${draft.id}`} className="font-medium text-accent hover:underline">
                    {draft.name || draft.slug || 'Draft'}
                  </Link>
                  {draft.error ? <p className="mt-1 text-xs text-red-600">{draft.error}</p> : null}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={draft.status} />
                </td>
                <td className="px-4 py-3 text-foreground/80">{draft.primaryKeyword || '—'}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  keywords {draft.callCounts?.keyword ?? 0} · SERP {draft.callCounts?.serp ?? 0} · OpenAI{' '}
                  {draft.callCounts?.openai ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
