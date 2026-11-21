import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PREGNANCY_WEIGHT_GAIN_FAQS } from './content';

export function PregnancyWeightGainGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Pregnancy Weight Gain Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate recommended gestational weight-gain and total-weight ranges from
        pre-pregnancy height and weight using Institute of Medicine / National
        Academies 2009 bands (CDC overview). Results are educational—not a
        diagnosis or personalized care plan.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Calculator Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter pre-pregnancy height and weight to compute BMI (kg/m²). Choose
        gestational week (default 40) and optionally mark twins. The engine maps
        BMI to an IOM category, returns minimum and maximum recommended gain,
        then adds those gains to your starting weight for projected min/max
        weight. Height supports cm/in; weight and results support kg/lb.
      </p>

      <h2
        id="iom-bands"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        IOM Singleton Gain Bands
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          <strong>Underweight</strong> (BMI &lt; 18.5): 12.5–18 kg total ·
          ~0.44–0.58 kg/wk in 2nd/3rd trimester
        </p>
        <p>
          <strong>Normal</strong> (18.5–24.9): 11.5–16 kg · ~0.35–0.50 kg/wk
        </p>
        <p>
          <strong>Overweight</strong> (25–29.9): 7–11.5 kg · ~0.23–0.33 kg/wk
        </p>
        <p>
          <strong>Obese</strong> (≥ 30): 5–9 kg · ~0.17–0.27 kg/wk
        </p>
      </div>

      <h2
        id="weekly-model"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Week-by-Week Model
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        First trimester uses a cumulative 0.5–2.0 kg range by week 13, scaled
        linearly for earlier weeks. After week 13, gain = first-trimester bound +
        weekly rate × (week − 13). At week 40 the calculator switches to the
        official IOM total bands so term totals match published guidelines.
      </p>

      <h2
        id="twins"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Twin Pregnancies
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Provisional twin totals (normal 17–25 kg, overweight 14–23 kg, obese
        11–19 kg) are shown only from week 37 onward. Underweight twin totals are
        not published by IOM and stay unavailable. Mid-pregnancy twin weeks are
        not linearly extrapolated.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter pre-pregnancy height and weight (blank by default).</li>
        <li>Confirm BMI and category under Before pregnancy.</li>
        <li>Set gestational week (default 40) and twins if applicable.</li>
        <li>
          Read minimum/maximum weight and weight gain; switch kg/lb as needed.
        </li>
      </ol>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Population guidelines cannot capture every pregnancy. Height/weight
        errors, multiple gestation beyond twins, edema, and clinical conditions
        can change targets. Share copies only the public page URL—measurements
        never leave your browser session via share payloads.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
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
            href="/tools/blood-pregnancy-test-what-do-hcg-results-mean"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Blood Pregnancy Test: What Do HCG Results Mean?
          </Link>
        </li>
      </ul>

      <h2
        id="pregnancy-weight-gain-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PREGNANCY_WEIGHT_GAIN_FAQS]} />
      </div>
    </article>
  );
}
