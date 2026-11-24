import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GRACE_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function GraceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        GRACE Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculate an educational <strong>GRACE 1.0</strong> point total for
        patients with acute coronary syndromes using the discrete variables
        published in the Global Registry of Acute Coronary Events (GRACE). The
        tool reports in-hospital mortality <em>risk categories</em> from the
        point total — not individualized mortality percentages from GRACE 2.0.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is GRACE 1.0?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Granger and colleagues derived admission predictors of hospital
        mortality across the GRACE registry and published a point-based bedside
        score (<cite>{SOURCE_LABEL}</cite>). GRACE 1.0 uses bounded numeric
        bands for age, heart rate, systolic blood pressure, and creatinine,
        Killip class, and three binary admission findings.
      </p>

      <h2
        id="variables"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Score Variables
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Age (years) — 10-year bands up to ≥90 years (100 points).</li>
        <li>Heart rate (bpm) — bands up to ≥200 (46 points).</li>
        <li>
          Systolic BP (mmHg) — lower pressures carry more points; ≥200 mmHg → 0.
        </li>
        <li>
          Creatinine — scored in mg/dL tiers; µmol/L ÷ 88.4 when needed.
        </li>
        <li>Killip class I–IV — 0, 20, 39, 59 points.</li>
        <li>Cardiac arrest at admission — 39 points if yes.</li>
        <li>ST-segment deviation — 28 points if yes.</li>
        <li>Elevated cardiac enzymes/biomarkers — 14 points if yes.</li>
      </ul>

      <h2
        id="categories"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Risk Categories
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Educational in-hospital mortality groupings from the published GRACE 1.0
        framework: <strong>low</strong> (total ≤108, &lt;1% category),
        <strong> intermediate</strong> (109–140, 1–3%), and{' '}
        <strong>high</strong> (&gt;140, &gt;3%). These are registry-derived
        categories for teaching — not directives for therapy or disposition.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter admission vitals and creatinine, choose Killip class, and answer
        each yes/no item. The total appears only when every field is complete.
        Unanswered clinical items are not assumed negative.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age 68 (58) + HR 95 (15) + SBP 110 (43) + creatinine 1.3 mg/dL (10) +
        Killip II (20) + no arrest (0) + ST deviation yes (28) + elevated
        enzymes yes (14) = <strong>188 points</strong> →{' '}
        <strong>high risk</strong> category.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This page teaches arithmetic from a 2003 registry publication. It does
        not replace cardiology judgement, institutional pathways, or
        contemporaneous GRACE web calculators that implement later mortality
        models. Always interpret ACS risk in full clinical context.
      </p>

      <h2
        id="grace-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={GRACE_FAQS} />
      </div>
    </article>
  );
}