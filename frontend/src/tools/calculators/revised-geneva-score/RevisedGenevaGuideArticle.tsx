import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { REVISED_GENEVA_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function RevisedGenevaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Revised Geneva Score Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate an educational revised Geneva score for pulmonary embolism
        pretest probability. Select risk factors and clinical findings to see
        the live score plus two-level and three-level probability bands with
        cohort incidence context.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It applies the original weighted revised Geneva rule (Le Gal 2006). It
        does not diagnose or exclude PE, and it does not order D-dimer or
        imaging.
      </p>

      <h2
        id="weights"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scoring Weights
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Age &gt;65 → 1</li>
        <li>Surgery or fracture within 1 month → 2</li>
        <li>Active malignancy → 2</li>
        <li>Previous DVT/PE → 3</li>
        <li>Heart rate 75–94 → 3; ≥95 → 5</li>
        <li>Unilateral lower-limb pain → 3</li>
        <li>Deep venous palpation pain AND unilateral edema → 4</li>
        <li>Hemoptysis → 2</li>
      </ul>

      <h2
        id="bands"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Two- and Three-Level Bands
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Two-level: ≤5 unlikely, ≥6 likely. Three-level: 0–3 low, 4–10
        intermediate, ≥11 high. Incidence phrases summarize published cohort
        ranges for teaching — not individual absolute risk.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age &gt;65 (1) + surgery within a month (2) + heart rate ≥95 (5) → score{' '}
        <strong>8</strong> (likely / intermediate).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use only as educational pretest context. Local pathways, Wells score,
        PERC, D-dimer strategy, and imaging decisions belong with clinicians.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/perc-calculator-pulmonary-embolism-rule-out-criteria"
            className="text-primary underline-offset-2 hover:underline"
          >
            PERC Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/has-bled-calculator"
            className="text-primary underline-offset-2 hover:underline"
          >
            HAS-BLED Calculator
          </Link>
        </li>
      </ul>

      <div id="rgs-faq" className="mt-8">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-3">
          <FAQAccordion items={[...REVISED_GENEVA_FAQS]} />
        </div>
      </div>
    </article>
  );
}
