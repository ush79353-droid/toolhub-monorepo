import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BMI_KIDS_FAQS } from './content';

export function BmiKidsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        BMI Calculator for Kids
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculate a child&apos;s body mass index (BMI) and BMI Prime from height
        and weight. Open &quot;How healthy is this BMI?&quot; to enter exact age
        and sex for a CDC BMI-for-age percentile. This tool is educational
        screening context—not a medical diagnosis.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is BMI for Children?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BMI is still weight in kilograms divided by height in meters squared.
        For ages 2 to under 20, clinicians interpret BMI using sex-specific
        BMI-for-age growth charts rather than adult WHO cut-offs, because
        healthy BMI changes with growth.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BMI and BMI Prime
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>BMI = weight (kg) ÷ height (m)²</p>
        <p>BMI Prime = BMI ÷ 25</p>
        <p>
          Child category = CDC BMI-for-age percentile (LMS) — never from BMI
          Prime
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BMI Prime compares BMI to 25 (the upper adult WHO &quot;normal&quot;
        edge). In this kids calculator it is informational only and does not
        assign underweight, healthy weight, overweight, or obesity.
      </p>

      <h2
        id="cdc-categories"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CDC BMI-for-Age Categories
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Using CDC Growth Charts 2000 LMS parameters (ages 2–20 years):
        underweight below the 5th percentile, healthy weight from the 5th to
        below the 85th, overweight from the 85th to below the 95th, and obesity
        at or above the 95th percentile. Ages under 2 or 20+ are outside this
        chart path.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter height and weight (cm/kg by default).</li>
        <li>Read BMI and BMI Prime as they update.</li>
        <li>
          Expand &quot;How healthy is this BMI?&quot;, enter exact age in years,
          and select sex for the CDC percentile.
        </li>
        <li>Reload or clear to restore blank defaults. Share copies the page URL only.</li>
      </ol>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BMI does not measure body fat, muscle, or fitness. Percentiles are
        population screening tools. Always involve a clinician for growth or
        nutrition concerns.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed sm:text-base">
        <li>
          <Link
            href="/tools/bmi-calculator-body-mass-index"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            BMI Calculator – Body Mass Index
          </Link>
        </li>
        <li>
          <Link
            href="/tools/bmi-percentile-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            BMI Percentile Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="bmi-kids-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...BMI_KIDS_FAQS]} />
      </div>
    </article>
  );
}
