import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ContactFormClient } from '@/components/contact/ContactFormClient';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Omega Calculators',
  description:
    'Write to Omega Calculators about a missing tool, a result that looks wrong, or a question about the site. The form is checked in the browser and is not delivered yet.',
};

const steps = [
  { title: 'You write it here', text: 'Name the tool, the numbers, or the question.' },
  { title: 'Someone reads it', text: 'That starts only after messages can leave this page.' },
  { title: 'We decide what changes', text: 'A note can shape a tool. It does not guarantee one.' },
] as const;

function NoteSheet() {
  return (
    <div className="border border-border bg-white" aria-hidden>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Note</p>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Not sent</p>
      </div>
      <div className="px-4 py-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">To</p>
        <p className="mt-1 text-sm font-medium text-accent">Omega Calculators</p>
        <div className="my-3 h-px bg-border" />
        <p className="text-sm leading-relaxed text-accent">
          A unit the converter does not list, and the value I needed.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-accent">
          <span className="border border-border px-2 py-1">Feature</span>
          <span className="border border-border px-2 py-1">Bug</span>
          <span className="border border-border px-2 py-1">Question</span>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div>
      <section className="border-b border-border">
        <Container className="py-8 sm:py-10">
          <Breadcrumbs items={[{ label: 'Contact' }]} />
          <div className="mt-6 grid items-end gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.7fr)] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Get in touch</p>
              <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-accent sm:text-5xl">
                Tell us what the next tool should do.
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                A calculator you cannot find, a result that looks wrong, or a question about the site. The form is just below.
              </p>
            </div>
            <NoteSheet />
          </div>
        </Container>
      </section>

      <section className="bg-muted/50">
        <Container className="py-10 sm:py-14">
          <ContactFormClient />
        </Container>
      </section>

      <section className="border-b border-border">
        <Container className="grid gap-10 py-12 sm:py-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Feature requests</p>
            <p className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-accent sm:text-3xl">
              Name the job the directory does not cover yet.
            </p>
          </div>
          <div className="border-t border-border pt-6 md:col-span-3 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Bug reports</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Include the numbers you typed and the result you saw, so the same case can be tried again.
            </p>
          </div>
          <div className="border-t border-border pt-6 md:col-span-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">General inquiries</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Questions about the site, a partnership note, or anything that is not a tool request belong here too.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 sm:py-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">When a message can be delivered</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title}>
                <p className="font-mono text-sm text-primary">{String(index + 1).padStart(2, '0')}</p>
                <p className="mt-2 text-lg font-semibold text-accent">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-border bg-muted/50">
        <Container className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-lg font-medium text-accent">
            If you need an answer right now, the directory is already open.
          </p>
          <Link
            href="/tools"
            className={buttonVariants({ size: 'lg', className: 'bg-primary text-white hover:bg-primary-hover' })}
          >
            Explore all tools
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Container>
      </section>
    </div>
  );
}
