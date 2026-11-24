'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { buttonVariants } from '@/components/ui/button';
import { listSeoCampaignsAction, type SeoCampaign } from '@/server/seo/campaign-actions';

export default function SeoCampaignsPage() {
  const [campaigns, setCampaigns] = React.useState<SeoCampaign[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    listSeoCampaignsAction().then((result) => {
      if (!result.success) setError(result.error || 'Failed to load campaigns.');
      else setCampaigns(result.data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="SEO campaigns"
        description="Research keywords, draft a guide, then approve it before it replaces the tool page. Publishing does not change active or indexable."
      >
        <Link href="/admin/seo-campaigns/new" className={buttonVariants()}>
          New campaign
        </Link>
      </AdminPageHeader>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading campaigns…</p> : null}
      {!loading && campaigns.length === 0 ? (
        <p className="text-sm text-muted-foreground">No campaigns yet.</p>
      ) : null}
      {campaigns.length > 0 ? (
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
      ) : null}
    </div>
  );
}
