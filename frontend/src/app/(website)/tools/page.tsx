import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { getPublicTools } from '@/server/catalog/tools';

export const metadata: Metadata = {
  title: 'All Online Tools — Complete Utilities Directory',
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
  const activeTotal = directory?.categories.reduce((sum, item) => sum + item.toolCount, 0) ?? 0;
  const start = directory && directory.total > 0 ? (directory.page - 1) * directory.limit + 1 : 0;
  const end = directory ? Math.min(directory.page * directory.limit, directory.total) : 0;

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={[{ label: 'All Tools' }]} className="mb-6" />
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-accent sm:text-4xl">All tools</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Search the active directory by name, or narrow it to one category.
          </p>
        </div>

        <form action="/tools" method="get" className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="tool-search">
            Search tools
          </label>
          <input
            id="tool-search"
            name="q"
            defaultValue={q}
            placeholder="Search by name"
            className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          <button type="submit" className="h-11 shrink-0 rounded-xl bg-primary px-5 text-sm font-medium text-white hover:bg-[hsl(var(--primary-hover))]">
            Search
          </button>
        </form>

        {directory ? (
          <div className="mt-5 flex flex-wrap gap-1.5">
            <Link
              href={toolsHref({ q })}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                selected ? 'border border-border bg-white text-foreground hover:bg-muted' : 'bg-primary text-white'
              }`}
            >
              All tools ({activeTotal})
            </Link>
            {directory.categories.map((item) => (
              <Link
                key={item.id}
                href={toolsHref({ q, category: item.slug })}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  item.slug === category
                    ? 'bg-primary text-white'
                    : 'border border-border bg-white text-foreground hover:bg-muted'
                }`}
              >
                {item.name} ({item.toolCount})
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">Tools are not available right now.</p>
        )}

        {directory && directory.total === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">
            No active tools match this search.{' '}
            <Link href="/tools" className="font-medium text-primary hover:underline">
              Clear filters
            </Link>
          </p>
        ) : null}

        {directory && directory.items.length > 0 ? (
          <>
            <p className="mt-8 text-sm text-muted-foreground">
              Showing {start}-{end} of {directory.total}
              {q ? ` for "${q}"` : ''}
              {selected ? ` in ${selected.name}` : ''}
            </p>
            <ul className="mt-3 divide-y divide-border border-y border-border">
              {directory.items.map((tool) => (
                <li key={tool.id}>
                  <Link href={`/tools/${tool.slug}`} className="flex items-baseline justify-between gap-4 px-1 py-3 hover:bg-muted/40 sm:px-3">
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-accent">{tool.name}</span>
                      {tool.shortDescription ? (
                        <span className="mt-0.5 block line-clamp-1 text-xs text-muted-foreground">{tool.shortDescription}</span>
                      ) : null}
                    </span>
                    {tool.categorySlug ? (
                      <span className="shrink-0 text-xs text-muted-foreground">{tool.categoryName}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>

            {directory.totalPages > 1 ? (
              <nav className="mt-6 flex flex-wrap items-center gap-1.5" aria-label="Tool pages">
                {directory.page > 1 ? (
                  <Link
                    href={toolsHref({ q, category, page: directory.page - 1 })}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Previous
                  </Link>
                ) : null}
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
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        item === directory.page ? 'bg-primary text-white' : 'border border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {item}
                    </Link>
                  )
                )}
                {directory.page < directory.totalPages ? (
                  <Link
                    href={toolsHref({ q, category, page: directory.page + 1 })}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Next
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </>
        ) : null}
      </Container>
    </div>
  );
}
