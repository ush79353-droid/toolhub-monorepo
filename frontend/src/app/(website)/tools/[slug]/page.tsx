import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ToolWorkspace } from '@/components/shared/ToolWorkspace';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { FAQAccordion, type FAQItem } from '@/components/shared/FAQAccordion';
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
  BookOpen,
} from 'lucide-react';
import {
  getToolBySlug,
  getAllTools,
  getRelatedTools,
  getCategoryBySlug,
} from '@/lib/sample-data';
import { getPublicToolBySlug } from '@/server/catalog/tools';
import { isApprovedComponentKey } from '@/tools/registry/keys';
import {
  AUTO_LOAN_FAQS,
  AUTO_LOAN_GUIDE_SECTIONS,
  AUTO_LOAN_HOW_TO_USE,
} from '@/tools/calculators/auto-loan/content';
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
  const pillarName = dbTool?.pillar?.name ?? null;
  const iconUrl = dbTool?.iconUrl ?? '';

  const relatedTools = sampleTool
    ? getRelatedTools(sampleTool.slug, sampleTool.category, 4)
    : [];

  const isLiveComponent = isApprovedComponentKey(toolMetadata.componentKey);
  const isAutoLoan = toolMetadata.componentKey === 'AutoLoanCalculator';

  const howToUse: readonly string[] = isAutoLoan
    ? AUTO_LOAN_HOW_TO_USE
    : sampleTool?.howToUse ?? [
        'Enter your input values into the designated input fields above.',
        'Select relevant unit options, modes, or calculation targets.',
        'Click the primary action button to compute, convert, or format.',
        'Inspect your detailed output and copy or download the results.',
      ];

  const features: readonly string[] = sampleTool?.features ?? [
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

  const faqs: FAQItem[] = isAutoLoan
    ? [...AUTO_LOAN_FAQS]
    : sampleTool?.faqs && sampleTool.faqs.length > 0
      ? sampleTool.faqs
      : defaultFaqs;

  const infoSections = (
    <>
      {isAutoLoan ? (
        <>
          {/* How to Use Section */}
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

          {/* Comprehensive Auto Loan Guide Sections */}
          {AUTO_LOAN_GUIDE_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-8"
            >
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-accent">{section.title}</h2>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>

              {section.formula && (
                <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-brand-softTeal px-4 py-3 font-mono text-xs font-semibold text-accent">
                  {section.formula}
                </div>
              )}

              {section.bullets && (
                <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground sm:text-sm">
                  {section.bullets.map((bullet, bIndex) => (
                    <li key={bIndex} className="flex items-start gap-2.5">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      ) : (
        <>
          {/* How to Use Section */}
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

          {/* About This Tool Section */}
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

            {/* Key Features Bullet List */}
            <div className="mt-6 border-t border-border pt-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">
                Key Features & Capabilities
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
        </>
      )}

      {/* Frequently Asked Questions */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold text-accent">Frequently Asked Questions</h2>
        </div>
        <FAQAccordion items={faqs} />
      </div>
    </>
  );

  const sidebarSections = (
    <>
      {/* Quick Facts Card */}
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

      {/* Related Tools Card */}
      {relatedTools.length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
              Related Utilities
            </h3>
            {categorySlug && (
              <Link
                href={`/categories/${categorySlug}`}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                More in {categoryName}
              </Link>
            )}
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

      {/* Helpful Banner Card */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/50 via-white to-brand-softTeal p-6 shadow-xs">
        <Zap className="h-6 w-6 text-primary" />
        <h4 className="mt-3 text-sm font-bold text-accent">Need an Additional Tool?</h4>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Have a specialized calculation formula or converter request? Let our team know via our
          feedback portal.
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
    </>
  );

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'All Tools', href: '/tools' },
            {
              label: categoryName,
              href: categorySlug ? `/categories/${categorySlug}` : '/categories',
            },
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

        {/* Workspace Layout */}
        {isLiveComponent ? (
          <>
            <div className="mt-8">
              <ToolWorkspace tool={toolMetadata} />
            </div>
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-10 lg:col-span-8">{infoSections}</div>
              <div className="space-y-6 lg:col-span-4">{sidebarSections}</div>
            </div>
          </>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-10 lg:col-span-8">
              <ToolWorkspace tool={toolMetadata} />
              {infoSections}
            </div>
            <div className="space-y-6 lg:col-span-4">{sidebarSections}</div>
          </div>
        )}
      </Container>
    </div>
  );
}
