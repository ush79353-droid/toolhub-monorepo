import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ToolCard } from '@/components/shared/ToolCard';
import { CategoryCard } from '@/components/shared/CategoryCard';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { getCategoryBySlug, getAllCategories, getToolsByCategory } from '@/lib/sample-data';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} — Free Online Tools & Utilities`,
    description: category.description,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(slug);
  const allCategories = getAllCategories();
  const otherCategories = allCategories.filter((c) => c.slug !== slug).slice(0, 4);

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[{ label: 'Categories', href: '/categories' }, { label: category.name }]}
          className="mb-6"
        />

        {/* Category Header Card */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary shadow-xs">
                <CategoryIcon name={category.icon} className="h-8 w-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Category Overview</span>
                </div>
                <h1 className="mt-2 text-2xl font-black text-accent sm:text-3xl lg:text-4xl">
                  {category.name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {category.longDescription || category.description}
                </p>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-3">
              <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
                <span className="block text-xl font-black text-primary">{tools.length}</span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Available Tools
                </span>
              </div>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 font-medium text-accent">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              100% In-Browser Private
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 font-medium text-accent">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Instant Zero Latency
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 font-medium text-accent">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              No Registration Needed
            </span>
          </div>
        </div>

        {/* Tools in this Category */}
        <div className="mt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-accent sm:text-2xl">
                {category.name} Collection
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Select any tool below to launch its workspace immediately.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Directories</span>
              </Link>
            </Button>
          </div>

          {tools.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
              <h3 className="text-base font-bold text-foreground">Tools in Development</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                New utilities for this category are currently being built. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* SEO / Explanatory Section */}
        <div className="mt-16 rounded-2xl border border-border bg-white p-6 sm:p-10 shadow-xs">
          <h2 className="text-xl font-bold text-accent">About Our {category.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Our {category.name.toLowerCase()} suite was designed to replace bulky, ad-filled legacy
            websites with fast, modern, accessible utilities. Every tool runs directly in your
            browser, ensuring maximum computational speed and preventing your data from being stored
            or inspected.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                Clean Execution
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                No third-party trackers or heavy background scripts.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                Device Agnostic
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Optimized for touchscreens, mobile phones, and ultra-wide screens.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                Always Free
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Unlimited usage without signups or premium lockouts.
              </p>
            </div>
          </div>
        </div>

        {/* Category FAQs */}
        {category.faqs && category.faqs.length > 0 && (
          <div className="mt-16">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-accent">Frequently Asked Questions</h2>
              <p className="text-xs text-muted-foreground">
                Common queries regarding our {category.name}.
              </p>
            </div>
            <FAQAccordion items={category.faqs} />
          </div>
        )}

        {/* Other Categories to Explore */}
        <div className="mt-16 border-t border-border pt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-accent">Explore Other Categories</h2>
            <Link href="/categories" className="text-xs font-bold text-primary hover:underline">
              View all 12 categories →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {otherCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
