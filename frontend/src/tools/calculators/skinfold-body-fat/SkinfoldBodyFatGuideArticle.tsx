import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SKINFOLD_FAQS } from './content';

export function SkinfoldBodyFatGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Skinfold Body Fat Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate percent body fat from four skinfold thicknesses using the
        Durnin–Womersley density equations and the Siri conversion. Enter sex,
        an adult age band, and biceps, subscapular, suprailiac, and triceps
        measurements. This is an educational tool, not a clinical assessment.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Σ = biceps + triceps + subscapular + suprailiac (mm)</p>
        <p>D = c − m × log₁₀(Σ)</p>
        <p>%BF (Siri) = 495 / D − 450</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Constants <em>c</em> and <em>m</em> depend on sex and age band from
        Durnin &amp; Womersley (1974), Table 5 (all four skinfolds).
      </p>

      <h2
        id="sites"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Skinfold measurement sites for determining body fat percentage
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Biceps:</strong> anterior upper-arm midline, midway between
          acromion and olecranon.
        </li>
        <li>
          <strong>Triceps:</strong> posterior upper-arm midline at the same
          level as the biceps site.
        </li>
        <li>
          <strong>Subscapular:</strong> just below the inferior angle of the
          scapula (usually a diagonal fold).
        </li>
        <li>
          <strong>Suprailiac:</strong> immediately above the iliac crest in the
          midaxillary line (diagonal fold).
        </li>
      </ul>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select Male or Female and an age band of 17–19 or older.</li>
        <li>Enter the four skinfolds in mm (or inches).</li>
        <li>Read the estimated body fat % and optional formula note.</li>
        <li>Use the male/female examples, Reload, or Clear as needed.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Male, 20–29, skinfolds 6 + 12 + 10 + 10 mm (Σ = 38 mm): density ≈ 1.1631 −
        0.0632 × log₁₀(38) ≈ 1.063 g/ml; Siri body fat ≈ 15.5%. Exact displayed
        value uses full precision then rounds to one decimal for presentation.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits &amp; Age Bands
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ages under 17 are gated. Female “17–19” in the UI uses the published
        16–19 female coefficients. Share Result copies only the public page URL
        so measurements are not placed in share payloads.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/navy-body-fat-calculator" className="text-primary">
            Navy Body Fat Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/body-fat-calculator" className="text-primary">
            Body Fat Calculator
          </Link>
        </li>
      </ul>

      <div id="skinfold-body-fat-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...SKINFOLD_FAQS]} />
        </div>
      </div>
    </article>
  );
}
