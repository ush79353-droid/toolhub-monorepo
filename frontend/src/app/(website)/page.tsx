import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { HeaderSearch } from '@/components/layout/HeaderSearch';
import { serverApi } from '@/server/api/client';
import { getPublicCategories } from '@/server/catalog/categories';

interface FeaturedTool {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  iconUrl: string;
  categoryName: string;
  categorySlug: string;
}

async function loadHome() {
  try {
    const [categories, featured] = await Promise.all([
      getPublicCategories(),
      serverApi.get<FeaturedTool[]>('/catalog/featured', { cache: 'no-store' }),
    ]);
    return {
      categories,
      featured: featured.data ?? [],
    };
  } catch {
    return { categories: [], featured: [] as FeaturedTool[] };
  }
}

export default async function HomePage() {
  const { categories, featured } = await loadHome();
  const toolTotal = categories.reduce((sum, category) => sum + category.toolCount, 0);

  return (
    <div>
      <section className="relative border-b border-border bg-gradient-to-br from-[#cfeeed] via-[#e7f6f4] to-[#f4f7f2]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_32%_32%,#ffffff,hsl(177,42%,78%))]" />
          <div className="absolute -right-20 top-6 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,hsl(175,35%,84%))]" />
          <div className="absolute bottom-16 right-[18%] h-40 w-40 rounded-full bg-[radial-gradient(circle_at_40%_40%,#ffffff,hsl(186,35%,86%))]" />
        </div>
        <Container className="relative z-10 flex flex-col items-center py-16 text-center sm:py-20 lg:py-24">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
            Calculators, grouped the way the work is actually done.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {toolTotal > 0
              ? `${toolTotal.toLocaleString()} tools across ${categories.length} categories. Search for the one you need.`
              : 'Search the directory, or start from a category.'}
          </p>
          <div className="mt-8 w-full max-w-2xl text-left">
            <HeaderSearch size="large" inputId="home-tool-search" />
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Each calculator stays in the browser. No account, and nothing is uploaded to run a calculation.
          </p>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-semibold text-accent">Featured</h2>
            <Link href="/tools" className="text-sm font-medium text-primary hover:underline">
              All tools
            </Link>
          </div>
          {featured.length === 0 ? (
            <p className="mt-6 border-t border-border pt-6 text-sm text-muted-foreground">
              No tools are marked featured yet.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {featured.map((tool) => (
                <li key={tool.id}>
                  <Link href={`/tools/${tool.slug}`} className="flex items-start gap-4 py-4 hover:bg-muted/40">
                    {tool.iconUrl ? (
                      <img src={tool.iconUrl} alt="" className="mt-0.5 h-10 w-10 rounded-md border border-border object-contain" />
                    ) : null}
                    <span className="min-w-0">
                      <span className="block font-medium text-accent">{tool.name}</span>
                      {tool.categoryName ? (
                        <span className="mt-0.5 block text-xs text-primary">{tool.categoryName}</span>
                      ) : null}
                      {tool.shortDescription ? (
                        <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {tool.shortDescription}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <section className="border-t border-border bg-white py-12 sm:py-16">
        <Container>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-semibold text-accent">Categories</h2>
            <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
              Category index
            </Link>
          </div>
          {categories.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">Categories are not available right now.</p>
          ) : (
            <ul className="mt-6 grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <li key={category.id} className="border-b border-border sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0">
                  <Link href={`/categories/${category.slug}`} className="block h-full px-1 py-5 pr-4 hover:bg-muted/30 sm:px-4">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="flex items-center gap-2.5">
                        {category.iconUrl ? <img src={category.iconUrl} alt="" className="h-4 w-4 shrink-0" /> : null}
                        <span className="font-medium text-accent">{category.name}</span>
                      </span>
                      <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{category.toolCount}</span>
                    </span>
                    {category.description ? (
                      <span className="mt-1.5 block line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {category.description}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </div>
  );
}
