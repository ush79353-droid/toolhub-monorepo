import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RCRI_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function RcriGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        RCRI Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Score the six Revised Cardiac Risk Index factors and view educational
        class-based estimates of 30-day death, myocardial infarction, or cardiac
        arrest after noncardiac surgery.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the RCRI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lee and colleagues described six equally weighted clinical factors that
        stratify perioperative cardiac risk. Classes I–IV correspond to 0, 1, 2,
        and ≥3 points.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scoring and Risk Rates
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Each Yes factor = 1 point (maximum 6).</li>
        <li>Class I = 0 · II = 1 · III = 2 · IV = 3–6.</li>
        <li>
          CCS 2017 pooled rates: 3.9% / 6.0% / 10.1% / 15.0% for death, MI, or
          cardiac arrest.
        </li>
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary sources: {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Answer each of the six Yes/No questions (default No).</li>
        <li>Read total points, class, and estimated 30-day risk.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        All factors No → <strong>0</strong> points · class <strong>I</strong> ·{' '}
        <strong>3.9%</strong> estimated 30-day death/MI/arrest risk.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Does not incorporate emergency status, aortic stenosis severity, or
        troponin-only myocardial injury definitions beyond the cited composite.
        Not a substitute for clinical judgment or society guidelines in full.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/ejection-fraction-calculator">
            Ejection Fraction Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/cardiac-output-calculator">
            Cardiac Output Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/cha2ds2-vasc-calculator">
            CHA₂DS₂-VASc Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="rcri-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...RCRI_FAQS]} />
      </div>
    </article>
  );
}
