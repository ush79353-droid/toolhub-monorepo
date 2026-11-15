import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { CategoryCard } from '@/components/shared/CategoryCard';
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
    title: `${category.name} — Free Online Tools`,
    description: category.description || `Tools in ${category.name}.`,
  };
}

function ToolRows({ tools }: { tools: PublicCategoryTool[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {tools.map((tool) => (
        <li key={tool.id}>
          <Link href={`/tools/${tool.slug}`} className="flex items-baseline justify-between gap-4 px-1 py-3 hover:bg-muted/40 sm:px-3">
            <span className="min-w-0">
              <span className="block text-sm font-medium text-accent">{tool.name}</span>
              {tool.shortDescription ? (
                <span className="mt-0.5 block line-clamp-1 text-xs text-muted-foreground">{tool.shortDescription}</span>
              ) : null}
            </span>
            <span className="shrink-0 text-xs font-medium text-primary">Open</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function PillarSection({ pillar }: { pillar: PublicPillarGroup }) {
  const count = pillar.tools.length + pillar.subPillars.reduce((sum, subPillar) => sum + subPillar.tools.length, 0);
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold text-accent">{pillar.name}</h2>
        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{count}</span>
      </div>
      {pillar.description ? <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">{pillar.description}</p> : null}
      {pillar.tools.length > 0 ? <ToolRows tools={pillar.tools} /> : null}
      {pillar.subPillars.map((subPillar) => (
        <div key={subPillar.id} className="mt-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary">{subPillar.name}</h3>
          {subPillar.description ? <p className="mb-3 text-sm text-muted-foreground">{subPillar.description}</p> : null}
          <ToolRows tools={subPillar.tools} />
        </div>
      ))}
    </section>
  );
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, categories] = await Promise.all([getPublicCategoryDetail(slug), getPublicCategories()]);
  if (!category) notFound();

  const others = categories.filter((item) => item.slug !== category.slug).slice(0, 4);

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={[{ label: 'Categories', href: '/categories' }, { label: category.name }]} className="mb-6" />

        <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            {category.iconUrl ? (
              <img src={category.iconUrl} alt="" className="mt-1 h-8 w-8 shrink-0" />
            ) : null}
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-accent sm:text-4xl">{category.name}</h1>
              {category.description ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{category.description}</p>
              ) : null}
            </div>
          </div>
          <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
            {category.toolCount} {category.toolCount === 1 ? 'tool' : 'tools'}
          </p>
        </div>

        {category.pillars.map((pillar) => (
          <PillarSection key={pillar.id} pillar={pillar} />
        ))}

        {category.ungrouped.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-accent">Other tools</h2>
            <ToolRows tools={category.ungrouped} />
          </section>
        ) : null}

        {category.toolCount === 0 ? (
          <p className="mt-12 text-sm text-muted-foreground">No active tools are in this category yet.</p>
        ) : null}

        {others.length > 0 ? (
          <div className="mt-16 border-t border-border pt-12">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-accent">Other categories</h2>
              <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
                All categories
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((item) => (
                <CategoryCard key={item.id} category={item} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
