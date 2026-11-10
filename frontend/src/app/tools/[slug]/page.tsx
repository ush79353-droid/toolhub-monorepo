import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ToolWorkspace } from '@/components/shared/ToolWorkspace';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
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
import { getToolBySlug, getAllTools, getRelatedTools, getCategoryBySlug } from '@/lib/sample-data';

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

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const category = getCategoryBySlug(tool.category);
  const relatedTools = getRelatedTools(tool.slug, tool.category, 4);

  // Default fallback instructions and features if not specifically set on sample
  const howToUse = tool.howToUse || [
    'Enter your input values into the designated input fields above.',
    'Select relevant unit options, modes, or calculation targets.',
    'Click the primary action button to compute, convert, or format.',
    'Inspect your detailed output and copy or download the results.',
  ];

  const features = tool.features || [
    'Fast in-browser execution with zero network latency',
    'Responsive interface optimized for mobile and desktop screens',
    'Client-side computation ensures your input data remains private',
    'Instant validation feedback with helpful guidance',
  ];

  const defaultFaqs = [
    {
      question: `Is ${tool.title} completely free to use?`,
      answer: `Yes, ${tool.title} is 100% free with unlimited usages and zero registration requirements.`,
    },
    {
      question: `Does ${tool.title} upload my data to a server?`,
      answer:
        'No. Client-side tools execute directly in your browser memory. Your entries, numbers, or documents are never transmitted to or logged on remote servers.',
    },
    {
      question: 'Can I bookmark or share my calculation results?',
      answer:
        'You can copy the generated result to your clipboard with a single click, or save this tool page to your browser bookmarks for immediate future access.',
    },
  ];

  const faqs = tool.faqs && tool.faqs.length > 0 ? tool.faqs : defaultFaqs;

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'All Tools', href: '/tools' },
            {
              label: category ? category.name : tool.category,
              href: category ? `/categories/${category.slug}` : '/categories',
            },
            { label: tool.title },
          ]}
          className="mb-6"
        />

        {/* Tool Header Section */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary shadow-xs">
                <CategoryIcon name={tool.icon} className="h-7 w-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize text-xs font-semibold">
                    {category ? category.name : tool.category}
                  </Badge>
                  <Badge variant="muted" className="text-xs">
                    Client-Side Utility
                  </Badge>
                </div>
                <h1 className="mt-2 text-2xl font-black text-accent sm:text-3xl lg:text-4xl">
                  {tool.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {tool.description}
                </p>
              </div>
            </div>

            {/* Quick Share / Info Action */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Browser Sandbox
              </span>
            </div>
          </div>
        </div>

        {/* Main Workspace Layout (Desktop Two-Column: Main Workspace + Sidebar) */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Workspace & Detailed Info Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Tool Workspace Component Container */}
            <ToolWorkspace tool={tool} />

            {/* How to Use Section */}
            <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Info className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-accent">How to Use {tool.title}</h2>
              </div>
              <ol className="space-y-3.5">
                {howToUse.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* About This Tool Section */}
            <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Layers className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-accent">About This Tool</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tool.aboutContent ||
                  `${tool.title} is an intuitive online utility designed for accuracy, speed, and privacy. Built using client-side execution, you can resolve complex calculations and formatting without waiting for network transfers or compromising sensitive figures.`}
              </p>

              {/* Key Features Bullet List */}
              <div className="mt-6 border-t border-border pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-4">
                  Key Features & Capabilities
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-muted-foreground"
                    >
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-accent">Frequently Asked Questions</h2>
              </div>
              <FAQAccordion items={faqs} />
            </div>
          </div>

          {/* Desktop Right Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Facts Card */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-4">
                Tool Specifications
              </h3>
              <dl className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-semibold text-foreground capitalize">
                    {category?.name || tool.category}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Execution</dt>
                  <dd className="font-semibold text-foreground">In-Browser (Client)</dd>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">License</dt>
                  <dd className="font-semibold text-emerald-600">Free / Unlimited</dd>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Platform Version</dt>
                  <dd className="font-mono text-muted-foreground">v{tool.version}</dd>
                </div>
                <div className="flex justify-between pt-1">
                  <dt className="text-muted-foreground">Privacy Protection</dt>
                  <dd className="font-semibold text-primary">Local Sandbox</dd>
                </div>
              </dl>
            </div>

            {/* Related Tools Card */}
            {relatedTools.length > 0 && (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                    Related Utilities
                  </h3>
                  {category && (
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      More in {category.name}
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
                        <p className="truncate text-[11px] text-muted-foreground mt-0.5">
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
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
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
