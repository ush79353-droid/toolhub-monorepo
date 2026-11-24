'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { RichCopy, inlineNodes } from '@/components/tools/inline-text';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  approveSeoDraftAction,
  getSeoDraftAction,
  publishSeoDraftAction,
  regenerateSeoDraftAction,
  retrySeoDraftAction,
  saveSeoDraftAction,
  unpublishSeoDraftAction,
  type SeoContent,
  type SeoDraftDetail,
} from '@/server/seo/campaign-actions';

const ACTIVE = new Set(['queued', 'researching', 'serp', 'generating', 'validating']);

export default function SeoDraftReviewPage() {
  const params = useParams<{ id: string; draftId: string }>();
  const [draft, setDraft] = React.useState<SeoDraftDetail | null>(null);
  const [form, setForm] = React.useState<SeoContent | null>(null);
  const [dirty, setDirty] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const dirtyRef = React.useRef(false);

  const load = React.useCallback(async () => {
    const result = await getSeoDraftAction(params.draftId);
    if (!result.success || !result.data) {
      setError(result.error || 'Draft was not found.');
      return;
    }
    setDraft(result.data);
    if (!dirtyRef.current) setForm(result.data.content);
  }, [params.draftId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    if (!draft || !ACTIVE.has(draft.status)) return;
    const timer = window.setInterval(() => void load(), 5000);
    return () => window.clearInterval(timer);
  }, [draft, load]);

  function edit(next: SeoContent) {
    dirtyRef.current = true;
    setDirty(true);
    setForm(next);
  }

  async function run(action: () => Promise<{ success: boolean; data?: SeoDraftDetail; error?: string }>) {
    setBusy(true);
    setError(null);
    const result = await action();
    setBusy(false);
    if (!result.success || !result.data) {
      setError(result.error || 'Request failed.');
      await load();
      return;
    }
    dirtyRef.current = false;
    setDirty(false);
    setDraft(result.data);
    setForm(result.data.content);
  }

  const content = form;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={draft?.snapshot.name || 'SEO draft'}
        description={
          draft
            ? `Location ${draft.locationCode} · ${draft.languageCode}. Keyword numbers come from DataForSEO. Publishing does not change active or indexable.`
            : 'Loading draft'
        }
      >
        <Link href={`/admin/seo-campaigns/${params.id}`} className={buttonVariants({ variant: 'outline' })}>
          Back
        </Link>
      </AdminPageHeader>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {draft ? (
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={draft.status} />
          {draft.validation?.ok ? (
            <span className="text-xs text-emerald-700">No blocking checks</span>
          ) : (
            <span className="text-xs text-amber-700">Blocking checks open</span>
          )}
          {dirty ? <span className="text-xs text-muted-foreground">Unsaved edits</span> : null}
        </div>
      ) : null}

      {draft && draft.keywordFacts.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-accent">Keyword research</h2>
          <p className="text-xs text-muted-foreground">
            Locked primary: {draft.primaryKeyword || '—'}
            {draft.secondaryKeywords.length > 0 ? ` · secondary: ${draft.secondaryKeywords.join(', ')}` : ''}
          </p>
          <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Keyword</th>
                  <th className="px-3 py-2 font-medium">Volume</th>
                  <th className="px-3 py-2 font-medium">Difficulty</th>
                  <th className="px-3 py-2 font-medium">CPC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {draft.keywordFacts.map((fact) => (
                  <tr key={fact.keyword}>
                    <td className="px-3 py-2">{fact.keyword}</td>
                    <td className="px-3 py-2">{fact.searchVolume ?? '—'}</td>
                    <td className="px-3 py-2">{fact.difficulty ?? '—'}</td>
                    <td className="px-3 py-2">{fact.cpc ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {draft && draft.serpItems.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-accent">SERP titles</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-foreground/80">
            {draft.serpItems.map((item) => (
              <li key={`${item.position}-${item.url}`}>
                {item.title}{' '}
                <a href={item.url} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                  {item.url}
                </a>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {draft && draft.validation?.issues?.length > 0 ? (
        <ul className="space-y-1 rounded-xl border border-border bg-white p-4 text-sm">
          {draft.validation.issues.map((issue, index) => (
            <li key={`${issue.code}-${index}`} className={issue.severity === 'block' ? 'text-red-700' : 'text-amber-700'}>
              {issue.severity === 'block' ? 'Block' : 'Flag'}: {issue.message}
            </li>
          ))}
        </ul>
      ) : null}

      {content ? (
        <section className="space-y-4 rounded-2xl border border-border bg-white p-5">
          <label className="block text-xs font-medium text-accent">
            Meta title
            <Input className="mt-1" value={content.metaTitle} onChange={(event) => edit({ ...content, metaTitle: event.target.value })} />
          </label>
          <label className="block text-xs font-medium text-accent">
            Meta description
            <Textarea className="mt-1" value={content.metaDescription} onChange={(event) => edit({ ...content, metaDescription: event.target.value })} />
          </label>
          <label className="block text-xs font-medium text-accent">
            Keywords
            <Input className="mt-1" value={content.keywords} onChange={(event) => edit({ ...content, keywords: event.target.value })} />
          </label>
          <label className="block text-xs font-medium text-accent">
            Primary keyword
            <Input className="mt-1" value={content.primaryKeyword} onChange={(event) => edit({ ...content, primaryKeyword: event.target.value })} />
          </label>
          {content.sections.map((section, index) => (
            <fieldset key={section.id} className="space-y-2 rounded-xl border border-border p-3">
              <legend className="px-1 text-xs font-semibold text-accent">{section.title || `Section ${index + 1}`}</legend>
              <Input
                value={section.title}
                onChange={(event) => {
                  const sections = content.sections.slice();
                  sections[index] = { ...section, title: event.target.value };
                  edit({ ...content, sections });
                }}
              />
              <Textarea
                value={section.paragraphs.join('\n\n')}
                onChange={(event) => {
                  const paragraphs = event.target.value.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
                  const sections = content.sections.slice();
                  sections[index] = { ...section, paragraphs: paragraphs.length > 0 ? paragraphs : [''] };
                  edit({ ...content, sections });
                }}
              />
              <div className="space-y-3 rounded-lg bg-muted/40 px-3 py-2 text-sm leading-relaxed text-foreground/85">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <RichCopy key={paragraphIndex} text={paragraph} />
                ))}
                {section.bullets.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <li key={`bullet-${bulletIndex}`}>
                        {inlineNodes(bullet.replace(/^\s*[-*]\s+/, ''), `${section.id}-b-${bulletIndex}`)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <Input
                placeholder="Formula (leave empty unless a person verified it)"
                value={section.formula}
                onChange={(event) => {
                  const sections = content.sections.slice();
                  sections[index] = { ...section, formula: event.target.value };
                  edit({ ...content, sections });
                }}
              />
            </fieldset>
          ))}
          {content.faqs.map((faq, index) => (
            <fieldset key={`faq-${index}`} className="space-y-2 rounded-xl border border-border p-3">
              <legend className="px-1 text-xs font-semibold text-accent">FAQ {index + 1}</legend>
              <Input
                value={faq.question}
                onChange={(event) => {
                  const faqs = content.faqs.slice();
                  faqs[index] = { ...faq, question: event.target.value };
                  edit({ ...content, faqs });
                }}
              />
              <Textarea
                value={faq.answer}
                onChange={(event) => {
                  const faqs = content.faqs.slice();
                  faqs[index] = { ...faq, answer: event.target.value };
                  edit({ ...content, faqs });
                }}
              />
            </fieldset>
          ))}
          <label className="block text-xs font-medium text-accent">
            Disclaimer
            <Textarea className="mt-1" value={content.disclaimer} onChange={(event) => edit({ ...content, disclaimer: event.target.value })} />
          </label>
          <div className="space-y-2">
            {content.links.map((link, index) => (
              <div key={`link-${index}`} className="grid gap-2 sm:grid-cols-2">
                <Input
                  value={link.anchor}
                  onChange={(event) => {
                    const links = content.links.slice();
                    links[index] = { ...link, anchor: event.target.value };
                    edit({ ...content, links });
                  }}
                />
                <Input
                  value={link.slug}
                  onChange={(event) => {
                    const links = content.links.slice();
                    links[index] = { ...link, slug: event.target.value };
                    edit({ ...content, links });
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-sm text-muted-foreground">Copy appears here after research and generation finish.</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={busy || !content || draft?.status === 'published'}
          onClick={() => content && void run(() => saveSeoDraftAction(params.draftId, content))}
        >
          Save edits
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy || draft?.status === 'published'}
          onClick={() => void run(() => regenerateSeoDraftAction(params.draftId, false))}
        >
          Regenerate copy
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy || draft?.status === 'published'}
          onClick={() => void run(() => regenerateSeoDraftAction(params.draftId, true))}
        >
          Research again
        </Button>
        <Button
          type="button"
          disabled={busy || dirty || draft?.status !== 'needs_review' || !draft.validation?.ok}
          onClick={() => void run(() => approveSeoDraftAction(params.draftId))}
        >
          Approve
        </Button>
        <Button
          type="button"
          disabled={busy || draft?.status !== 'approved'}
          onClick={() => void run(() => publishSeoDraftAction(params.draftId))}
        >
          Publish
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy || draft?.status !== 'published'}
          onClick={() => void run(() => unpublishSeoDraftAction(params.draftId))}
        >
          Unpublish
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy || draft?.status !== 'failed'}
          onClick={() => void run(() => retrySeoDraftAction(params.draftId))}
        >
          Retry
        </Button>
      </div>
    </div>
  );
}
