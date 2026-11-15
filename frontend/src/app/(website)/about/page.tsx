import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { buttonVariants } from '@/components/ui/button';
import { getPublicCategories } from '@/server/catalog/categories';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Omega Calculators',
  description:
    'What Omega Calculators is for: a directory of calculators, converters, file tools, and small utilities, with plain pages and no account required to browse.',
};

const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3'] as const;

const principles = [
  {
    title: 'Privacy, said plainly',
    text: 'When a tool runs in the browser, the numbers you type stay on your device. If a tool needs a server, the page should say so.',
  },
  {
    title: 'Fast enough for the question',
    text: 'You should still be looking at the problem when the result appears. We do not promise a stopwatch time.',
  },
  {
    title: 'Readable on the first visit',
    text: 'The label, the input, and the result should be obvious. A tool should not need a manual.',
  },
  {
    title: 'Usable on a phone',
    text: 'The same page has to work on a narrow screen and on a desk. Layout follows the width you have.',
  },
  {
    title: 'Only what the tool does',
    text: 'A description matches the function. A simple calculator is not dressed up as something else.',
  },
] as const;

async function loadDirectorySize() {
  const categories = await getPublicCategories();
  if (categories.length === 0) return null;
  return {
    categoryCount: categories.length,
    toolTotal: categories.reduce((sum, category) => sum + category.toolCount, 0),
  };
}

function ProductBoard() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-border bg-white shadow-sm" aria-hidden>
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-3">
        <p className="text-xs font-medium text-accent">invoice.pdf</p>
        <p className="text-xs text-muted-foreground">2 pages</p>
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Loan</p>
        <p className="mt-2 font-mono text-4xl tracking-tight text-accent">248,000</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {keys.map((key) => (
            <span key={key} className="flex h-11 items-center justify-center rounded-lg bg-muted text-sm font-medium text-accent">
              {key}
            </span>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>6.5% rate</span>
          <span>30 years</span>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-border bg-secondary px-4 py-3 text-sm text-accent">
        <span className="font-mono">12 km</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">to</span>
        <span className="text-right font-mono">7.46 mi</span>
      </div>
    </div>
  );
}

export default async function AboutPage() {
  const directory = await loadDirectorySize();

  return (
    <div>
      <section className="border-b border-border">
        <Container className="py-8 sm:py-12 lg:py-16">
          <Breadcrumbs items={[{ label: 'About' }]} />
          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.85fr)] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">About Omega Calculators</p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-accent sm:text-6xl">
                One directory for the small jobs.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                Calculators, conversions, files, and text tools live here. Open one, enter what you have, and take the result with you.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/tools" className={buttonVariants({ size: 'lg', className: 'bg-primary text-white hover:bg-primary-hover' })}>
                  Explore all tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex h-11 items-center px-2 text-sm font-medium text-accent underline-offset-4 hover:underline">
                  Contact us
                </Link>
              </div>
              {directory ? (
                <p className="mt-8 text-sm tabular-nums text-muted-foreground">
                  {directory.categoryCount} categories
                  <span className="mx-2 text-border">/</span>
                  {directory.toolTotal.toLocaleString()} tools in the catalog
                </p>
              ) : null}
            </div>
            <ProductBoard />
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <p className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-accent sm:text-5xl">
            A simple question should not require a crowded page.
          </p>
          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <ol className="lg:col-span-5">
              {[
                ['01', 'Finance', 'Loans, tax, pay'],
                ['02', 'Health', 'Body, age, fitness'],
                ['03', 'Files', 'PDF, image, audio'],
                ['04', 'Text', 'Counts, cleanup, code'],
              ].map(([index, name, detail]) => (
                <li key={name} className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-accent/15 py-4">
                  <span className="font-mono text-xs text-primary">{index}</span>
                  <span>
                    <span className="block text-2xl font-semibold text-accent">{name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{detail}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="max-w-xl space-y-5 text-base leading-relaxed text-foreground lg:col-span-6 lg:col-start-7 lg:pt-4">
              <p>
                Calculator sites often bury the form. The page is loud, the labels are unclear, or the result sits under things that have nothing to do with the question.
              </p>
              <p>
                Omega Calculators keeps the directory in subject order. Finance, health, math, files, text, and developer utilities each have a category. A tool can also sit under a pillar when it belongs to a family, such as loans.
              </p>
              <p className="text-muted-foreground">
                The directory is what you can browse today. A calculator page is added when that tool is actually ready. Until then it stays a catalog entry, not a promise.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border py-16 sm:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-accent sm:text-4xl">The platform</h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Eight kinds of work. Not every catalog entry has a finished page yet.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            <article className="overflow-hidden rounded-[28px] bg-accent text-white lg:col-span-7">
              <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Calculators</p>
                  <h3 className="mt-3 text-3xl font-semibold leading-tight">The number you came for.</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                    Loans, health, math, and the smaller sums that show up in a normal day.
                  </p>
                </div>
                <p className="font-mono text-4xl tracking-tight text-secondary sm:text-5xl">6.5%</p>
              </div>
              <p className="border-t border-white/10 px-6 py-4 font-mono text-xs text-white/70 sm:px-8">
                Age · BMI · Percentage · Mortgage · Salary
              </p>
            </article>

            <div className="grid gap-4 lg:col-span-5">
              <article className="rounded-[28px] bg-secondary p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Unit converters</p>
                <p className="mt-4 flex items-baseline justify-between gap-4 font-mono text-2xl text-accent">
                  <span>12 km</span>
                  <span className="text-sm font-sans font-semibold uppercase tracking-wider text-primary">to</span>
                  <span>7.46 mi</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-accent/80">Length, weight, temperature, and the rest of the measurement swaps.</p>
              </article>
              <article className="rounded-[28px] border border-border bg-white p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Writing, text, and AI</p>
                <p className="mt-3 text-lg font-medium leading-snug text-accent">Counts, cleanup, and text that needs another shape.</p>
              </article>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[28px] border border-border bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 sm:px-8">
              <h3 className="text-lg font-semibold text-accent">Developer utilities</h3>
              <p className="hidden text-sm text-muted-foreground sm:block">Formatters and small checks for code and data.</p>
            </div>
            <pre className="overflow-x-auto px-6 py-5 font-mono text-sm leading-relaxed text-accent sm:px-8">
              {`{\n  "ok": true,\n  "tool": "json-formatter"\n}`}
            </pre>
          </div>

          <dl className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Image tools', 'Resize and convert a picture without a design app.'],
              ['PDF and documents', 'Combine, split, and read file details.'],
              ['Video and audio', 'Light media changes, not a full editor.'],
              ['SEO and websites', 'Titles, links, and the small pieces of a public page.'],
            ].map(([title, text]) => (
              <div key={title} className="border-t-2 border-primary pt-4">
                <dt className="text-base font-semibold text-accent">{title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-accent sm:text-4xl">How a tool on this site should behave.</h2>
          <ol className="mt-12">
            {principles.map((item, index) => (
              <li key={item.title} className="grid gap-3 border-t border-border py-7 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                <span className="font-mono text-sm text-primary sm:col-span-2">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-xl font-semibold text-accent sm:col-span-4">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:col-span-6 sm:text-base">{item.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-muted py-16 sm:py-24">
        <Container>
          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-accent sm:text-6xl">
            You should not need a new website for every small job.
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-0">
            {[
              ['Look once', 'Search this directory instead of opening another tab for the next task.'],
              ['Start immediately', 'Browsing does not ask you to create an account.'],
              ['Stay on one site', 'Calculators, files, and text tools share the same place.'],
            ].map(([title, text], index) => (
              <div key={title} className={index === 0 ? 'sm:pr-8' : 'sm:border-l sm:border-accent/15 sm:px-8'}>
                <h3 className="text-lg font-semibold text-accent">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-accent text-white">
        <Container className="flex flex-col gap-8 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Open the directory.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
              Find a tool, or write to us if a page is unclear.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/tools" className={buttonVariants({ size: 'lg', className: 'bg-primary text-white hover:bg-primary-hover' })}>
              Explore all tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-md border border-white/30 px-4 text-sm font-medium text-white hover:bg-white/10"
            >
              Contact us
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
