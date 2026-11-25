import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, SearchX } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import {
  getPublicCategories,
  getPublicCategoryDetail,
  type PublicCategoryTool,
  type PublicPillarGroup,
} from '@/server/catalog/categories';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPublicCategoryDetail(slug);
  if (!category) return { title: 'Category Not Found' };
  return {
    title: `${category.name} | Free Online Tools`,
    description: category.description || `Tools in ${category.name}.`,
  };
}

function ToolCards({ tools, label }: { tools: PublicCategoryTool[]; label?: string }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tools.map((tool) => (
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
              <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{tool.shortDescription}</span>
            ) : null}
            {label ? <span className="mt-auto pt-4 text-xs text-muted-foreground">{label}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function PillarSection({ pillar }: { pillar: PublicPillarGroup }) {
  const count = pillar.tools.length + pillar.subPillars.reduce((sum, subPillar) => sum + subPillar.tools.length, 0);
  return (
    <section id={pillar.slug} className="mt-12 scroll-mt-24 first:mt-0">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-accent">{pillar.name}</h2>
        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
          {count} {count === 1 ? 'calculator' : 'calculators'}
        </span>
      </div>
      {pillar.description ? <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">{pillar.description}</p> : null}
      {pillar.tools.length > 0 ? <ToolCards tools={pillar.tools} label={pillar.name} /> : null}
      {pillar.subPillars.map((subPillar) => (
        <div key={subPillar.id} className={pillar.tools.length > 0 ? 'mt-8' : 'mt-6 first:mt-0'}>
          <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-accent">{subPillar.name}</h3>
          {subPillar.description ? <p className="mb-4 text-sm text-muted-foreground">{subPillar.description}</p> : null}
          <ToolCards tools={subPillar.tools} label={subPillar.name} />
        </div>
      ))}
    </section>
  );
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, categories] = await Promise.all([getPublicCategoryDetail(slug), getPublicCategories()]);
  if (!category) notFound();

  const others = categories.filter((item) => item.slug !== category.slug);

  return (
    <div>
      <section className="relative border-b border-border bg-gradient-to-br from-[#cfeeed] via-[#e7f6f4] to-[#f4f7f2]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_32%_32%,#ffffff,hsl(177,42%,78%))]" />
          <div className="absolute -right-20 top-6 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,hsl(175,35%,84%))]" />
          <div className="absolute bottom-10 right-[18%] h-40 w-40 rounded-full bg-[radial-gradient(circle_at_40%_40%,#ffffff,hsl(186,35%,86%))]" />
        </div>
        <Container className="relative z-10 py-10 sm:py-14">
          <Breadcrumbs items={[{ label: 'All Categories', href: '/categories' }, { label: category.name }]} />
          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-center">
            {category.iconUrl ? <img src={category.iconUrl} alt="" className="mb-5 h-10 w-10 object-contain" /> : null}
            <h1 className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">{category.name}</h1>
            {category.description ? (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{category.description}</p>
            ) : null}
            <p className="mt-4 text-sm tabular-nums text-muted-foreground">
              {category.toolCount.toLocaleString()} {category.toolCount === 1 ? 'calculator' : 'calculators'}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-muted/30 py-10 sm:py-14">
        <Container>
          {category.toolCount === 0 ? (
            <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
              <SearchX className="h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-accent sm:text-4xl">No tools found</h2>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
                {category.name} does not have any active tools yet.
              </p>
              <Link
                href="/categories"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary"
              >
                All categories
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              {category.pillars.map((pillar) => (
                <PillarSection key={pillar.id} pillar={pillar} />
              ))}
              {category.ungrouped.length > 0 ? (
                <section className={category.pillars.length > 0 ? 'mt-12' : ''}>
                  <h2 className="mb-5 text-2xl font-semibold tracking-tight text-accent">Other tools</h2>
                  <ToolCards tools={category.ungrouped} label={category.name} />
                </section>
              ) : null}
            </>
          )}
        </Container>
      </section>

      {others.length > 0 ? (
        <section className="border-t border-border bg-white py-10 sm:py-14">
          <Container>
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Other categories</h2>
              <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
                All categories
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {others.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/categories/${item.slug}`}
                    className="flex h-full flex-col items-center rounded-2xl border border-border bg-white px-3 py-7 text-center shadow-xs transition-colors hover:border-primary/40 hover:bg-muted/50"
                  >
                    {item.iconUrl ? (
                      <img src={item.iconUrl} alt="" className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="h-8 w-8 rounded-lg bg-muted" aria-hidden="true" />
                    )}
                    <span className="mt-4 line-clamp-2 text-sm font-semibold text-accent">{item.name}</span>
                    <span className="mt-1 text-xs tabular-nums text-muted-foreground">
                      {item.toolCount.toLocaleString()} {item.toolCount === 1 ? 'calculator' : 'calculators'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </div>
  );
}
