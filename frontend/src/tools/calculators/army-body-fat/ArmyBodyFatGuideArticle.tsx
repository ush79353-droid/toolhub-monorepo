import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ARMY_BODY_FAT_FAQS } from './content';

export function ArmyBodyFatGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Army Body Fat Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool estimates percent body fat using U.S. Army Body Composition
        Program circumference methods. The default model follows the authorized
        one-site abdomen tape adopted effective 9 June 2023. An optional legacy
        multi-site mode reproduces the older DoDI 1308.3 / AR 600-9 equations
        for educational comparison. Results are informational only—not a
        medical diagnosis, DA Form 5500/5501 worksheet, or command eligibility
        decision.
      </p>

      <h2
        id="one-site"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Current One-Site Method
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Per Army Directive 2023-11 and ALARACT 032/2025 implementing guidance,
        the authorized circumference method uses body weight (pounds) and a
        single abdomen circumference at the navel (inches):
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Male: %BF = −26.97 − (0.12 × weight_lb) + (1.99 × abdomen_in)</p>
        <p>Female: %BF = −9.15 − (0.015 × weight_lb) + (1.27 × abdomen_in)</p>
        <p>Round to the nearest whole percent.</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Official worksheets average three abdomen measurements to the nearest
        half inch. This calculator accepts a single entered circumference for
        planning estimates.
      </p>

      <h2
        id="legacy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Legacy Multi-Site Estimate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Unchecking active duty restores the historical multi-site log<sub>10</sub>{' '}
        equations (height, neck, waist/abdomen, and hip for females). Those
        equations are no longer the Army’s authorized tape method; they remain
        available here only as a labeled legacy estimate.
      </p>

      <h2
        id="standards"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Maximum Allowable Standards
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Optional age compares your rounded estimate with Table B–2 maxima (for
        example, females ages 21–27: 32%; males 40+: 26%). Screening weight-for-
        height tables, ACFT exemptions, confirmation tapes, and supplemental
        assessments are outside this tool’s scope.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm or clear the active-duty checkbox for the correct model.</li>
        <li>Select sex and optionally enter age for standard comparison.</li>
        <li>
          Enter the measurements shown for that model (weight + abdomen, or
          legacy height/neck/waist/hip). Switch cm/in or lb/kg as needed.
        </li>
        <li>
          Read the estimated body-fat percent and the educational within-
          standard note when age is provided.
        </li>
      </ol>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Circumference equations are population estimates with known error.
        Measurement technique, clothing, hydration, and timing affect results.
        Do not use this page for clinical dosing, recruiting decisions, or
        official ABCP actions. Prefer trained unit fitness personnel and
        published Army forms.
      </p>

      <div id="army-bf-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...ARMY_BODY_FAT_FAQS]} />
        </div>
      </div>
    </article>
  );
}
