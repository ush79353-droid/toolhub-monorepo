import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { HeaderSearch } from '@/components/layout/HeaderSearch';
import { LastUsedTools } from '@/components/home/LastUsedTools';
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

      <section className="bg-muted/30 py-10 sm:py-14">
        <Container>
          <LastUsedTools />
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Categories are not available right now.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex h-full flex-col items-center rounded-2xl border border-border bg-white px-3 py-7 text-center shadow-xs transition-colors hover:border-primary/40 hover:bg-muted/50"
                  >
                    {category.iconUrl ? (
                      <img src={category.iconUrl} alt="" className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="h-8 w-8 rounded-lg bg-muted" aria-hidden="true" />
                    )}
                    <span className="mt-4 line-clamp-2 text-sm font-semibold text-accent">{category.name}</span>
                    <span className="mt-1 text-xs tabular-nums text-muted-foreground">
                      {category.toolCount.toLocaleString()} {category.toolCount === 1 ? 'calculator' : 'calculators'}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="col-span-2">
                <Link
                  href="/tools"
                  className="flex h-full flex-col justify-center rounded-2xl border border-primary/25 bg-white px-6 py-7 shadow-xs transition-colors hover:border-primary hover:bg-secondary"
                >
                  <span className="text-sm font-semibold text-accent">Browse all tools</span>
                  <span className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
                    {toolTotal > 0
                      ? `${toolTotal.toLocaleString()} calculators in one directory. Search by name, or open the full list.`
                      : 'Search by name, or open the full list of calculators.'}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Open the directory
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            </ul>
          )}
        </Container>
      </section>

      <section className="border-t border-border bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-base font-semibold text-accent">About us</h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Omega Calculators is a free collection of online calculators and converters. We built it for
              people who want a clear answer without hunting through ads, sign-ups, or confusing pages.
            </p>
            <p className="mt-8 font-display text-2xl font-semibold leading-snug tracking-tight text-accent sm:text-4xl">
              A clear answer, with the formula and a worked example on the same page.
            </p>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary"
            >
              Read more about us
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-muted/30 py-14 sm:py-16">
        <Container>
          <div className="text-center">
            <Heart className="mx-auto h-6 w-6 fill-primary text-primary" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-accent sm:text-3xl">Most Popular Tools</h2>
          </div>
          {featured.length === 0 ? (
            <p className="mt-8 text-center text-sm text-muted-foreground">No tools are marked popular yet.</p>
          ) : (
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((tool) => (
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
          )}
        </Container>
      </section>
    </div>
  );
}
