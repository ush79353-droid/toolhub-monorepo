'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createSeoCampaignAction,
  listEligibleSeoToolsAction,
  type SeoEligibleTool,
} from '@/server/seo/campaign-actions';

const MAX_TOOLS = 50;

const selectClass =
  'h-10 w-full rounded-md border border-border bg-white px-3 text-sm text-foreground';

function options(tools: SeoEligibleTool[], idKey: 'categoryId' | 'pillarId' | 'subPillarId', nameKey: 'categoryName' | 'pillarName' | 'subPillarName') {
  const map = new Map<string, string>();
  for (const tool of tools) {
    const id = tool[idKey];
    if (!id || map.has(id)) continue;
    map.set(id, tool[nameKey] || 'Untitled');
  }
  return [...map.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function statusLabel(status: string): string {
  if (!status) return 'Not published';
  return status.replace(/_/g, ' ');
}

function statusClass(status: string): string {
  if (status === 'published') return 'bg-emerald-50 text-emerald-700';
  if (status === 'approved') return 'bg-sky-50 text-sky-700';
  if (status === 'failed' || status === 'rejected') return 'bg-red-50 text-red-700';
  if (!status) return 'bg-muted text-muted-foreground';
  return 'bg-amber-50 text-amber-800';
}

export default function NewSeoCampaignPage() {
  const router = useRouter();
  const [tools, setTools] = React.useState<SeoEligibleTool[]>([]);
  const [name, setName] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [pillar, setPillar] = React.useState('');
  const [subPillar, setSubPillar] = React.useState('');
  const [publish, setPublish] = React.useState('');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    listEligibleSeoToolsAction().then((result) => {
      if (!result.success) setError(result.error || 'Failed to load tools.');
      else setTools(result.data ?? []);
      setLoading(false);
    });
  }, []);

  const inCategory = category ? tools.filter((tool) => tool.categoryId === category) : tools;
  const pillarChoices = options(inCategory, 'pillarId', 'pillarName');
  const inPillar = pillar ? inCategory.filter((tool) => tool.pillarId === pillar) : inCategory;
  const subPillarChoices = options(inPillar, 'subPillarId', 'subPillarName');

  React.useEffect(() => {
    if (pillar && !pillarChoices.some((item) => item.id === pillar)) setPillar('');
  }, [pillar, pillarChoices]);

  React.useEffect(() => {
    if (subPillar && !subPillarChoices.some((item) => item.id === subPillar)) setSubPillar('');
  }, [subPillar, subPillarChoices]);

  const needle = query.trim().toLowerCase();
  const visible = inPillar.filter((tool) => {
    if (subPillar && tool.subPillarId !== subPillar) return false;
    if (publish === 'published' && tool.contentStatus !== 'published') return false;
    if (publish === 'not_published' && tool.contentStatus === 'published') return false;
    if (!needle) return true;
    return `${tool.name} ${tool.slug} ${tool.categoryName} ${tool.pillarName} ${tool.subPillarName}`
      .toLowerCase()
      .includes(needle);
  });
  const visibleIds = visible.map((tool) => tool.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= MAX_TOOLS) return current;
      return [...current, id];
    });
  }

  function toggleVisible() {
    setSelected((current) => {
      if (allVisibleSelected) return current.filter((id) => !visibleIds.includes(id));
      const next = [...current];
      for (const id of visibleIds) {
        if (next.includes(id)) continue;
        if (next.length >= MAX_TOOLS) break;
        next.push(id);
      }
      return next;
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
    <div className="space-y-6">
      <AdminPageHeader
        title="New SEO campaign"
        description="Pick up to 50 active tools. Filters narrow the list. Select all applies only to the tools still showing."
      >
        <Link href="/admin/seo-campaigns" className={buttonVariants({ variant: 'outline' })}>
          Back
        </Link>
      </AdminPageHeader>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="space-y-4 rounded-2xl border border-border bg-white p-5">
        <label className="block text-xs font-medium text-accent">
          Campaign name
          <Input className="mt-1" value={name} onChange={(event) => setName(event.target.value)} placeholder="March finance guides" />
        </label>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block text-xs font-medium text-accent">
            Category
            <select className={`${selectClass} mt-1`} value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {options(tools, 'categoryId', 'categoryName').map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-accent">
            Pillar
            <select className={`${selectClass} mt-1`} value={pillar} onChange={(event) => setPillar(event.target.value)}>
              <option value="">All pillars</option>
              {pillarChoices.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-accent">
            Sub-pillar
            <select className={`${selectClass} mt-1`} value={subPillar} onChange={(event) => setSubPillar(event.target.value)}>
              <option value="">All sub-pillars</option>
              {subPillarChoices.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-accent">
            Published
            <select className={`${selectClass} mt-1`} value={publish} onChange={(event) => setPublish(event.target.value)}>
              <option value="">Published and not published</option>
              <option value="published">Published</option>
              <option value="not_published">Not published</option>
            </select>
          </label>
        </div>

        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or slug" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {loading ? 'Loading active tools…' : `${visible.length} showing · ${tools.length} active`}
            {' · '}
            {selected.length} / {MAX_TOOLS} selected
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" disabled={visible.length === 0} onClick={toggleVisible}>
              {allVisibleSelected ? 'Clear shown' : 'Select all shown'}
            </Button>
            <Button type="button" variant="outline" disabled={selected.length === 0} onClick={() => setSelected([])}>
              Clear selection
            </Button>
          </div>
        </div>

        <div className="max-h-[32rem] overflow-y-auto rounded-xl border border-border">
          {visible.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">No active tools match these filters.</p>
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((tool) => {
                const checked = selected.includes(tool.id);
                const disabled = !checked && selected.length >= MAX_TOOLS;
                return (
                  <li key={tool.id}>
                    <label className={`flex cursor-pointer items-start gap-3 px-3 py-2.5 ${disabled ? 'opacity-50' : 'hover:bg-muted/50'}`}>
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggle(tool.id)}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-accent">{tool.name}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusClass(tool.contentStatus)}`}>
                            {statusLabel(tool.contentStatus)}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {[tool.categoryName, tool.pillarName, tool.subPillarName].filter(Boolean).join(' · ') || 'No category'}
                          {' · '}
                          {tool.slug}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="button" disabled={saving || selected.length === 0 || name.trim().length === 0} onClick={createCampaign}>
            {saving ? 'Starting…' : `Create campaign (${selected.length})`}
          </Button>
        </div>
      </section>
    </div>
  );
}
