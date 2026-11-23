import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HCG_LEVELS_FAQS } from './content';

export function HcgLevelsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        hCG Levels Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter two β-hCG results and the time between them to see how the value
        changed. Results are descriptive arithmetic for education — not a
        clinical decision tool.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It reports absolute difference, percent change, doubling time when the
        second value is higher, and standardized one- and two-day percent
        increases from the observed growth ratio.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Difference = B − A</li>
        <li>Percentage change = 100 × (B/A − 1)</li>
        <li>Doubling time (rising) = t × ln(2) / ln(B/A)</li>
        <li>
          d-day increase = 100 × ((B/A)^(d/t) − 1) for d = 1 or 2
        </li>
      </ul>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A = 100 mIU/ml, B = 200 mIU/ml, t = 2 days → difference +100, change
        +100%, doubling time 2 days, one-day increase ≈ +41.42%, two-day
        increase +100%.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Assays and units vary by laboratory. Falling or plateauing values need
        clinical follow-up. This tool never diagnoses ectopic pregnancy or
        miscarriage.
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
            href="/tools/blood-pregnancy-test-what-do-hcg-results-mean"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Blood Pregnancy Test: What Do HCG Results Mean?
          </Link>
        </li>
      </ul>

      <h2
        id="hcg-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...HCG_LEVELS_FAQS]} />
      </div>
    </article>
  );
}
