import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { REVERSE_DUE_DATE_FAQS } from './content';

export function ReverseDueDateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Reverse Due Date Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Work backward from an estimated due date (or forward from conception /
        earliest intercourse) to see educational conception timing. Dating
        follows ACOG-style calendar conventions with a 14-day LMP-to-fertilization
        offset.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How It Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter any one of due date, conception date, or earliest intercourse
        date, plus pregnancy length (default 40 weeks). The calculator fills
        the other dates. The field you last edit is authoritative.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Dating Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For gestation length L in days: conception ≈ EDD − (L − 14), and EDD ≈
        conception + (L − 14). For the common 280-day (40-week) length, that is
        a 266-day conception-to-due interval.
      </p>

      <h2
        id="intercourse"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Intercourse Window
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sperm can survive several days. This tool shows intercourse as the start
        of an approximate window (conception minus 7 days), not as fertilization
        itself.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Due date 1 August 2023 with a 40-week length → estimated conception 8
        November 2022 → earliest intercourse window from 1 November 2022.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Educational only. Clinical dating often relies on ultrasound. Share
        copies the public page URL only—dates are not included in share text.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm sm:text-base">
        <li>
          <Link
            href="/tools/due-date-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Due Date Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Browse all calculators
          </Link>
        </li>
      </ul>

      <div id="reverse-due-date-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...REVERSE_DUE_DATE_FAQS]} />
        </div>
      </div>
    </article>
  );
}
