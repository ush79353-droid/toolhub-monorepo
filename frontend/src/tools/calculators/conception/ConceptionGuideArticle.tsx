import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CONCEPTION_FAQS } from './content';
import {
  CONCEPTION_TO_DUE_DAYS,
  LMP_BASE_GESTATION_DAYS,
  SOURCE_LABEL,
} from './calculation';

export function ConceptionGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Conception Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter a due date or the first day of your last period to see an
        educational estimated conception date and how many weeks pregnant that
        dating implies today.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How It Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool reuses Omega&apos;s shared pregnancy dating helpers (same
        offsets as the Due Date and Pregnancy Conception calculators). The last
        date field you edit is the source of truth so the form does not chase
        itself in a loop.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Dating Formula
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          From LMP: EDD = LMP + {LMP_BASE_GESTATION_DAYS} + (cycle − 28) days.
        </li>
        <li>
          Estimated conception = EDD − {CONCEPTION_TO_DUE_DAYS} days.
        </li>
        <li>
          Gestational age today ≈ {LMP_BASE_GESTATION_DAYS} − (EDD − today)
          days.
        </li>
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter either due date or LMP (and adjust cycle length for LMP).</li>
        <li>Read gestational age and estimated conception date.</li>
        <li>If both dates conflict, clear one or re-edit the preferred field.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        LMP <strong>2026-01-01</strong> with a <strong>28</strong>-day cycle →
        EDD <strong>2026-10-08</strong> → estimated conception{' '}
        <strong>2026-01-15</strong>.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Irregular cycles, assisted reproduction, and ultrasound dating can
        change clinical dates. This calculator does not decide paternity or
        replace obstetric care.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/pregnancy-conception-calculator"
            className="text-primary hover:underline"
          >
            Pregnancy Conception Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/due-date-calculator"
            className="text-primary hover:underline"
          >
            Due Date Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/reverse-due-date-calculator"
            className="text-primary hover:underline"
          >
            Reverse Due Date Calculator
          </Link>
        </li>
      </ul>

      <div id="conception-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...CONCEPTION_FAQS]} />
        </div>
      </div>
    </article>
  );
}
