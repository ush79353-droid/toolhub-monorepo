import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ToolWorkspace } from '@/components/shared/ToolWorkspace';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { FAQAccordion, type FAQItem } from '@/components/shared/FAQAccordion';
import { RelatedCatalogTools } from '@/components/shared/RelatedCatalogTools';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Zap,
  CheckCircle,
  HelpCircle,
  Info,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  getToolBySlug,
  getAllTools,
  getRelatedTools,
  getCategoryBySlug,
} from '@/lib/sample-data';
import { getPublicToolBySlug } from '@/server/catalog/tools';
import { AutoLoanGuideArticle } from '@/tools/calculators/auto-loan/AutoLoanGuideArticle';
import { StickyCalculatorAside } from '@/tools/calculators/auto-loan/StickyCalculatorAside';
import { TableOfContents } from '@/tools/calculators/auto-loan/TableOfContents';
import { AUTO_LOAN_TOC_ITEMS } from '@/tools/calculators/auto-loan/content';
import type { ToolMetadata } from '@/types/tool';

interface ToolDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbTool = await getPublicToolBySlug(slug);

  if (dbTool) {
    const title = dbTool.metaTitle
      ? { absolute: dbTool.metaTitle }
      : `${dbTool.name} — Free Online Tool`;
    const description = dbTool.metaDescription || dbTool.shortDescription;

    return {
      title,
      description,
      keywords: dbTool.keywords || undefined,
      alternates: dbTool.canonicalUrl ? { canonical: dbTool.canonicalUrl } : undefined,
      openGraph: {
        title: dbTool.ogTitle || dbTool.metaTitle || dbTool.name,
        description: dbTool.ogDescription || description,
      },
      robots: dbTool.indexable ? undefined : { index: false, follow: false },
    };
  }

  const tool = getToolBySlug(slug);
  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: tool.metaTitle || `${tool.title} — Free Online Tool`,
    description: tool.metaDescription || tool.description,
  };
}

function executionLabel(type: ToolMetadata['executionType']): string {
  if (type === 'server') return 'Server Pipeline';
  if (type === 'third-party') return 'Third-Party API';
  return 'In-Browser (Client)';
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const dbTool = await getPublicToolBySlug(slug);
  const sampleTool = dbTool ? null : getToolBySlug(slug);

  if (!dbTool && !sampleTool) {
    notFound();
  }

  const toolMetadata: ToolMetadata = dbTool
    ? {
        id: dbTool.id,
        slug: dbTool.slug,
        title: dbTool.name,
        description: dbTool.shortDescription,
        category: dbTool.category?.slug ?? 'finance-business',
        executionType: dbTool.executionType,
        componentKey: dbTool.componentKey,
        version: '1.0.0',
        isActive: true,
        icon: dbTool.iconUrl ? undefined : 'Calculator',
        metaTitle: dbTool.metaTitle,
        metaDescription: dbTool.metaDescription,
      }
    : sampleTool!;

  const categoryName = dbTool
    ? dbTool.category?.name ?? 'Tools'
    : getCategoryBySlug(sampleTool!.category)?.name ?? sampleTool!.category;
  const categorySlug = dbTool
    ? dbTool.category?.slug ?? ''
    : getCategoryBySlug(sampleTool!.category)?.slug ?? '';
  const hasCategoryRoute = Boolean(categorySlug && getCategoryBySlug(categorySlug));
  const safeCategoryHref = hasCategoryRoute ? `/categories/${categorySlug}` : '/categories';
  const pillarName = dbTool?.pillar?.name ?? null;
  const iconUrl = dbTool?.iconUrl ?? '';
  const isAutoLoan = toolMetadata.componentKey === 'AutoLoanCalculator';

  if (isAutoLoan) {
    return (
      <div className="py-6 sm:py-9">
        <Container>
          {/* Responsive 2-Column Workspace: Left (~62%) Editorial/TOC/Related, Right (~38%) Height-Aware Sticky Calculator */}
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.62fr)_minmax(360px,1fr)] lg:items-start lg:gap-8">
            {/* Slot 1: Breadcrumbs + Title + Intro Header */}
            <header className="order-1 min-w-0 space-y-4 lg:col-start-1 lg:row-start-1">
              <Breadcrumbs
                items={[
                  { label: 'All Tools', href: '/tools' },
                  { label: categoryName, href: safeCategoryHref },
                  { label: toolMetadata.title },
                ]}
              />

              <div className="rounded-2xl border border-border bg-white p-5 shadow-xs sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {categoryName}
                  </Badge>
                  {pillarName && (
                    <Badge variant="muted" className="text-xs font-normal">
                      {pillarName}
                    </Badge>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-normal text-muted-foreground">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                    {executionLabel(toolMetadata.executionType)}
                  </span>
                </div>

                <div className="mt-3.5 flex items-start gap-3.5">
                  {iconUrl ? (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={iconUrl} alt="" className="h-full w-full object-contain" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                      <CategoryIcon name={toolMetadata.icon} className="h-6 w-6" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h1 className="text-[26px] font-semibold leading-[1.2] tracking-tight text-accent sm:text-[30px] lg:text-[32px]">
                      {toolMetadata.title}
                    </h1>
                    <p className="mt-2 text-[15px] font-normal leading-[1.7] text-muted-foreground sm:text-base sm:leading-[1.72]">
                      {toolMetadata.description} Estimate monthly car payments, net trade-in equity,
                      sales tax, fees, total interest, and payoff date directly in your browser.
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* Slot 2: Height-Aware Sticky Calculator Panel (Near top on Mobile/Tablet; Right ~38% on Desktop) */}
            <StickyCalculatorAside
              ariaLabel="Interactive auto loan calculator"
              className="order-2 min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2"
            >
              <ToolWorkspace tool={toolMetadata} />
            </StickyCalculatorAside>

            {/* Slot 3: Table of Contents, Related Calculators & 11-Section Editorial Guide */}
            <div className="order-3 min-w-0 space-y-6 lg:col-start-1 lg:row-start-2">
              <TableOfContents items={AUTO_LOAN_TOC_ITEMS} />

              {dbTool && dbTool.relatedTools.length > 0 && (
                <RelatedCatalogTools
                  tools={dbTool.relatedTools}
                  groupLabel={pillarName || categoryName}
                  browseHref="/tools"
                />
              )}

              <AutoLoanGuideArticle />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const relatedTools = sampleTool
    ? getRelatedTools(sampleTool.slug, sampleTool.category, 4)
    : [];

  const howToUse = sampleTool?.howToUse ?? [
    'Enter your input values into the designated input fields above.',
    'Select relevant unit options, modes, or calculation targets.',
    'Click the primary action button to compute, convert, or format.',
    'Inspect your detailed output and copy or download the results.',
  ];

  const features = sampleTool?.features ?? [
    'Fast in-browser execution with zero network latency',
    'Responsive interface optimized for mobile and desktop screens',
    'Client-side computation ensures your input data remains private',
    'Instant validation feedback with helpful guidance',
  ];

  const defaultFaqs: FAQItem[] = [
    {
      question: `Is ${toolMetadata.title} completely free to use?`,
      answer: `Yes, ${toolMetadata.title} is 100% free with unlimited usages and zero registration requirements.`,
    },
    {
      question: `Does ${toolMetadata.title} upload my data to a server?`,
      answer:
        'No. Client-side tools execute directly in your browser memory. Your entries, numbers, or documents are never transmitted to or logged on remote servers.',
    },
    {
      question: 'Can I bookmark or share my calculation results?',
      answer:
        'You can copy the generated result to your clipboard with a single click, or save this tool page to your browser bookmarks for immediate future access.',
    },
  ];

  const faqs: FAQItem[] =
    sampleTool?.faqs && sampleTool.faqs.length > 0 ? sampleTool.faqs : defaultFaqs;

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'All Tools', href: '/tools' },
            { label: categoryName, href: safeCategoryHref },
            { label: toolMetadata.title },
          ]}
          className="mb-6"
        />

        {/* Tool Header Section */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary text-primary shadow-xs">
                {iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={iconUrl} alt="" className="h-full w-full object-contain" />
                ) : (
                  <CategoryIcon name={toolMetadata.icon} className="h-7 w-7" />
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {categoryName}
                  </Badge>
                  <Badge variant="muted" className="text-xs">
                    {executionLabel(toolMetadata.executionType)}
                  </Badge>
                </div>
                <h1 className="mt-2 text-2xl font-black text-accent sm:text-3xl lg:text-4xl">
                  {toolMetadata.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {toolMetadata.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Browser Sandbox
              </span>
            </div>
          </div>
        </div>

        {/* Standard Workspace Layout for Preview / Sample Tools */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <ToolWorkspace tool={toolMetadata} />

            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-8">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Info className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-accent">How to Use {toolMetadata.title}</h2>
              </div>
              <ol className="space-y-3.5">
                {howToUse.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-8">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Layers className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-accent">About This Tool</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {sampleTool?.aboutContent ||
                  `${toolMetadata.title} is an intuitive online utility designed for accuracy, speed, and privacy. Built using client-side execution, you can resolve complex calculations and formatting without waiting for network transfers or compromising sensitive figures.`}
              </p>

              <div className="mt-6 border-t border-border pt-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">
                  Key Features &amp; Capabilities
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-muted-foreground"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-8">
              <div className="mb-6 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-accent">Frequently Asked Questions</h2>
              </div>
              <FAQAccordion items={faqs} />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">
                Tool Specifications
              </h3>
              <dl className="space-y-3 text-xs">
                <div className="flex justify-between gap-2 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="text-right font-semibold text-foreground">{categoryName}</dd>
                </div>
                {pillarName && (
                  <div className="flex justify-between gap-2 border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">Group</dt>
                    <dd className="text-right font-semibold text-foreground">{pillarName}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-2 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Execution</dt>
                  <dd className="text-right font-semibold text-foreground">
                    {executionLabel(toolMetadata.executionType)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">License</dt>
                  <dd className="font-semibold text-emerald-600">Free / Unlimited</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Platform Version</dt>
                  <dd className="font-mono text-muted-foreground">v{toolMetadata.version}</dd>
                </div>
                <div className="flex justify-between gap-2 pt-1">
                  <dt className="text-muted-foreground">Privacy Protection</dt>
                  <dd className="font-semibold text-primary">Local Sandbox</dd>
                </div>
              </dl>
            </div>

            {dbTool && dbTool.relatedTools.length > 0 && (
              <RelatedCatalogTools
                tools={dbTool.relatedTools}
                groupLabel={pillarName || categoryName}
                browseHref="/tools"
              />
            )}

            {relatedTools.length > 0 && (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                    Related Utilities
                  </h3>
                  <Link
                    href={safeCategoryHref}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    More in {categoryName}
                  </Link>
                </div>

                <div className="space-y-3">
                  {relatedTools.map((relTool) => (
                    <Link
                      key={relTool.id}
                      href={`/tools/${relTool.slug}`}
                      className="group flex items-start gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/50 hover:bg-muted/40"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <CategoryIcon name={relTool.icon} className="h-4 w-4" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="truncate text-xs font-bold text-foreground group-hover:text-primary">
                          {relTool.title}
                        </h4>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                          {relTool.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-border transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/50 via-white to-brand-softTeal p-6 shadow-xs">
              <Zap className="h-6 w-6 text-primary" />
              <h4 className="mt-3 text-sm font-bold text-accent">Need an Additional Tool?</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Have a specialized calculation formula or converter request? Let our team know via
                our feedback portal.
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-4 w-full bg-white hover:bg-muted"
              >
                <Link href="/contact">Suggest a Tool</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
