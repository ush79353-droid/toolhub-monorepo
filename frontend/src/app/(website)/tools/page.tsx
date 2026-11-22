import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Search, SearchX } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { DirectoryCategoryMenu } from '@/components/tools/DirectoryCategoryMenu';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { getPublicTools } from '@/server/catalog/tools';

export const metadata: Metadata = {
  title: 'All Online Tools | Complete Utilities Directory',
  description: 'Search and filter the active tools on Omega Calculators.',
};

interface ToolsPageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

function toolsHref(query: { q?: string; category?: string; page?: number }): string {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.category) params.set('category', query.category);
  if (query.page && query.page > 1) params.set('page', String(query.page));
  const search = params.toString();
  return search ? `/tools?${search}` : '/tools';
}

function pageItems(current: number, total: number): Array<number | 'gap'> {
  const pages = new Set([1, total]);
  for (let page = current - 1; page <= current + 1; page += 1) {
    if (page >= 1 && page <= total) pages.add(page);
  }
  const sorted = [...pages].sort((left, right) => left - right);
  const items: Array<number | 'gap'> = [];
  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous > 1) items.push(page - previous === 2 ? previous + 1 : 'gap');
    items.push(page);
  });
  return items;
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams;
  const q = (params.q ?? '').trim().slice(0, 120);
  const category = (params.category ?? '').trim().toLowerCase();
  const page = Math.max(1, Math.trunc(Number(params.page)) || 1);
  const directory = await getPublicTools({ q, category, page });
  const selected = directory?.categories.find((item) => item.slug === category) ?? null;
  const start = directory && directory.total > 0 ? (directory.page - 1) * directory.limit + 1 : 0;
  const end = directory ? Math.min(directory.page * directory.limit, directory.total) : 0;

  return (
    <div>
      <section className="relative border-b border-border bg-gradient-to-br from-[#cfeeed] via-[#e7f6f4] to-[#f4f7f2]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_32%_32%,#ffffff,hsl(177,42%,78%))]" />
          <div className="absolute -right-20 top-6 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,hsl(175,35%,84%))]" />
          <div className="absolute bottom-10 right-[18%] h-40 w-40 rounded-full bg-[radial-gradient(circle_at_40%_40%,#ffffff,hsl(186,35%,86%))]" />
        </div>
        <Container className="relative z-10 py-10 sm:py-14">
          <Breadcrumbs items={[{ label: 'All Tools' }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">All tools</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Search the directory by name, or narrow it to one category.
            </p>
          </div>

          <form action="/tools" method="get" className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
            <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-border bg-white shadow-[0_18px_40px_-24px_rgba(22,60,67,0.55)] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="tool-search">
                Search tools
              </label>
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" aria-hidden="true" />
                <input
                  id="tool-search"
                  name="q"
                  defaultValue={q}
                  placeholder="Search calculators, converters, and tools"
                  className="h-14 w-full bg-transparent pl-14 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <DirectoryCategoryMenu
                categories={directory?.categories.map((item) => ({ id: item.id, name: item.name, slug: item.slug })) ?? []}
                value={selected ? category : ''}
              />
            </div>
            <button
              type="submit"
              className="h-14 shrink-0 rounded-2xl bg-primary px-6 text-sm font-medium text-white hover:bg-[hsl(var(--primary-hover))]"
            >
              Search
            </button>
          </form>

        </Container>
      </section>

      <section className="bg-muted/30 py-10 sm:py-14">
        <Container>
        {!directory ? (
          <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
            <SearchX className="h-10 w-10 text-primary" aria-hidden="true" />
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-accent sm:text-4xl">
              Directory unavailable
            </h2>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
              The tool list could not be loaded. Refresh the page in a moment.
            </p>
          </div>
        ) : null}

        {directory && directory.total === 0 ? (
          <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
            <SearchX className="h-10 w-10 text-primary" aria-hidden="true" />
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-accent sm:text-4xl">
              No tools found
            </h2>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
              {q && selected
                ? `Nothing in ${selected.name} matches "${q}". Try another name, or look across every category.`
                : q
                  ? `Nothing matches "${q}". Check the spelling, or browse the full directory.`
                  : selected
                    ? `${selected.name} does not have any active tools yet.`
                    : 'The directory does not have any active tools yet.'}
            </p>
            {q || selected ? (
              <Link
                href="/tools"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary"
              >
                Clear filters
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        ) : null}

        {directory && directory.items.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground">
              Showing {start}-{end} of {directory.total}
              {q ? ` for "${q}"` : ''}
              {selected ? ` in ${selected.name}` : ''}
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {directory.items.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="flex h-full flex-col rounded-2xl border border-border bg-white p-4 shadow-xs transition-colors hover:border-primary/40"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-semibold leading-snug text-accent">{tool.name}</span>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </span>
                    {tool.shortDescription ? (
                      <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {tool.shortDescription}
                      </span>
                    ) : null}
                    {tool.categoryName ? (
                      <span className="mt-auto pt-4 text-xs text-muted-foreground">{tool.categoryName}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>

            {directory.totalPages > 1 ? (
              <nav className="mt-8 flex justify-end" aria-label="Tool pages">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {directory.page > 1 ? (
                    <Link
                      href={toolsHref({ q, category, page: directory.page - 1 })}
                      className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-white px-3.5 text-sm font-medium text-accent shadow-xs transition-colors hover:border-primary/40"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Previous
                    </Link>
                  ) : (
                    <span className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-white px-3.5 text-sm font-medium text-muted-foreground opacity-50">
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Previous
                    </span>
                  )}
                  {pageItems(directory.page, directory.totalPages).map((item, index) =>
                    item === 'gap' ? (
                      <span key={`gap-${index}`} className="px-1 text-sm text-muted-foreground">
                        …
                      </span>
                    ) : (
                      <Link
                        key={item}
                        href={toolsHref({ q, category, page: item })}
                        aria-current={item === directory.page ? 'page' : undefined}
                        className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium ${
                          item === directory.page
                            ? 'bg-primary text-white shadow-xs'
                            : 'border border-border bg-white text-accent shadow-xs hover:border-primary/40'
                        }`}
                      >
                        {item}
                      </Link>
                    )
                  )}
                  {directory.page < directory.totalPages ? (
                    <Link
                      href={toolsHref({ q, category, page: directory.page + 1 })}
                      className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-white px-3.5 text-sm font-medium text-accent shadow-xs transition-colors hover:border-primary/40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-white px-3.5 text-sm font-medium text-muted-foreground opacity-50">
                      Next
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </div>
              </nav>
            ) : null}
          </>
        ) : null}
        </Container>
      </section>
    </div>
  );
}
