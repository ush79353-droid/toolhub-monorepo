import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SearchBar } from '@/components/shared/SearchBar';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ToolCard } from '@/components/shared/ToolCard';
import { CategoryCard } from '@/components/shared/CategoryCard';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  Zap,
  MousePointerClick,
  Smartphone,
  Layers,
  Search,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { getPopularTools, getAllCategories } from '@/lib/sample-data';

export default function HomePage() {
  const popularTools = getPopularTools();
  const categories = getAllCategories();

  const homeFaqs = [
    {
      question: 'Are all tools on Mega Tools completely free to use?',
      answer:
        'Yes. All utilities on Mega Tools are free to access without subscriptions, hidden paywalls, or feature gates.',
    },
    {
      question: 'Is my data secure when using your calculators and file tools?',
      answer:
        'Client-side tools execute directly inside your browser sandbox. For client utilities such as calculations, image resizing, and text formatting, your data never leaves your device.',
    },
    {
      question: 'Do I need to install software or create an account?',
      answer:
        'No installation or account registration is required. Every tool is immediately ready to run upon visiting the page.',
    },
    {
      question: 'Can I use Mega Tools on mobile devices?',
      answer:
        'Yes. Every tool interface is fully responsive, touch-friendly, and optimized across smartphones, tablets, and desktop workstations.',
    },
    {
      question: 'How accurate are the financial and mathematical calculations?',
      answer:
        'Formulas are modeled strictly after international standards and verified computational algorithms. Results are designed for high precision and immediate utility.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-white via-muted/30 to-background py-16 sm:py-24 lg:py-28">
        {/* Subtle Decorative Accents */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-secondary/60 blur-3xl opacity-50"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/2 -right-40 -z-10 h-72 w-72 rounded-full bg-brand-softTeal blur-2xl opacity-60"
          aria-hidden="true"
        />

        <Container className="text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1 text-xs font-bold text-accent shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span>Fast, Free & Browser-Powered Utilities</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 text-4xl font-black tracking-tight text-accent sm:text-5xl lg:text-6xl">
            Every Tool You Need, <br className="hidden sm:inline" />
            <span className="text-primary">All in One Place</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg sm:leading-relaxed">
            Discover powerful, easy-to-use online tools for everyday tasks, productivity,
            calculations, conversions, and more.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
            <SearchBar
              size="large"
              autoNavigate
              placeholder="Search among 50+ tools (e.g., BMI, Percentage, JSON)..."
            />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-accent">Popular:</span>
              <Link href="/tools/age-calculator" className="hover:text-primary hover:underline">
                Age Calculator
              </Link>
              <span>•</span>
              <Link href="/tools/bmi-calculator" className="hover:text-primary hover:underline">
                BMI Calculator
              </Link>
              <span>•</span>
              <Link href="/tools/json-formatter" className="hover:text-primary hover:underline">
                JSON Formatter
              </Link>
              <span>•</span>
              <Link href="/tools/password-generator" className="hover:text-primary hover:underline">
                Password Generator
              </Link>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] shadow-sm"
            >
              <Link href="/tools" className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Explore All Tools</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border bg-white hover:bg-muted"
            >
              <Link href="/categories" className="inline-flex items-center gap-2">
                <span>Browse Categories</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Popular Tools Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Top Rated Utilities"
            title="Popular Online Tools"
            description="Our most frequently used calculators, converters, and developer utilities for quick daily problem solving."
            action={
              <Button asChild variant="outline" size="sm">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1.5 font-semibold text-primary"
                >
                  <span>View All Tools</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            }
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </Container>
      </section>

      {/* Browse by Category Section */}
      <section className="border-y border-border bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Organized for Efficiency"
            title="Browse by Category"
            description="Explore our specialized tool collections engineered to help you calculate, convert, inspect, and optimize effortlessly."
            action={
              <Button asChild variant="outline" size="sm">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1.5 font-semibold text-primary"
                >
                  <span>All Categories</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            }
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Effortless Flow"
            title="How It Works"
            description="Three simple steps to resolve any calculation, conversion, or formatting task."
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-border bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-primary">
                <Search className="h-6 w-6" />
              </div>
              <span className="mt-4 inline-block text-xs font-black uppercase tracking-widest text-primary">
                Step 01
              </span>
              <h3 className="mt-1 text-lg font-bold text-accent">Find Your Tool</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Search via keyword or browse our organized categories to discover the exact utility
                you need.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-border bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-primary">
                <Sliders className="h-6 w-6" />
              </div>
              <span className="mt-4 inline-block text-xs font-black uppercase tracking-widest text-primary">
                Step 02
              </span>
              <h3 className="mt-1 text-lg font-bold text-accent">Enter Your Information</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Provide your input parameters, paste code, or select measurement units in the clean
                workspace.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-border bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-primary">
                <CheckCircle className="h-6 w-6" />
              </div>
              <span className="mt-4 inline-block text-xs font-black uppercase tracking-widest text-primary">
                Step 03
              </span>
              <h3 className="mt-1 text-lg font-bold text-accent">Get Your Result</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Receive instant, accurate results. Copy them with one click or download processed
                files immediately.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Why Choose Mega Tools Section */}
      <section className="border-t border-border bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Platform Highlights"
            title="Why Choose Mega Tools?"
            description="Engineered for professionals, students, and everyday users who value clarity, speed, and simplicity."
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-xl border border-border bg-background/50 p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                <MousePointerClick className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-accent">Simple and Easy to Use</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Intuitive interfaces with clean labels, clear directions, and zero unnecessary
                visual clutter.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-border bg-background/50 p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-accent">Fast and Efficient</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                In-browser processing means instant calculations with no wait times or network
                roundtrips.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-border bg-background/50 p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-accent">Accessible Across Devices</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Fully responsive layout adapts seamlessly to smartphones, tablets, laptops, and
                ultra-wide screens.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-border bg-background/50 p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-accent">Wide Range of Utilities</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Comprehensive toolsets spanning finance, health, developer utilities, text tools,
                and image assets.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-4xl">
          <SectionHeading
            eyebrow="Frequently Asked Questions"
            title="Common Questions"
            description="Everything you need to know about using the Mega Tools online platform."
          />

          <FAQAccordion items={homeFaqs} />
        </Container>
      </section>

      {/* Call to Action Banner */}
      <section className="border-t border-border bg-accent py-16 text-white sm:py-20">
        <Container className="text-center">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            Ready to Streamline Your Daily Tasks?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-secondary/90 sm:text-base leading-relaxed">
            Explore our complete catalog of calculators, converters, and developer tools. Fast,
            free, and accessible on any device.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] shadow-md"
            >
              <Link href="/tools" className="inline-flex items-center gap-2">
                <span>Browse Directory</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-secondary/30 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
