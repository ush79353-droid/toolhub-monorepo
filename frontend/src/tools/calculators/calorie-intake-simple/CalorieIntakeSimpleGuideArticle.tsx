import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CALORIE_INTAKE_SIMPLE_FAQS } from './content';
import { ACTIVITY_OPTIONS } from './types';

export function CalorieIntakeSimpleGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Calorie Intake Calculator (Simple)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate how many kilocalories a healthy adult may need each day to
        maintain current weight. This simple tool multiplies Mifflin–St Jeor
        basal metabolic rate by a five-level activity factor.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How It Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter sex, age, height, weight, and activity. The calculator converts
        height and weight to centimetres and kilograms, computes BMR, then
        multiplies by PAL to produce maintenance kcal/day.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Mifflin–St Jeor and PAL
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Women: BMR = 10×kg + 6.25×cm − 5×age − 161. Men: same with +5 instead of
        −161. Maintenance = BMR × PAL.
      </p>

      <h2
        id="activity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Activity Levels
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        {ACTIVITY_OPTIONS.map((o) => (
          <li key={o.id}>
            {o.label} — PAL {o.pal}
          </li>
        ))}
      </ul>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Female · 50 years · 165 cm · 65 kg · light exercise 1–2 times/week (PAL
        1.4) → BMR ≈ 1,270 kcal/day → maintenance ≈ 1,778 kcal/day.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Educational only. Not for diagnosing under- or over-eating. Share copies
        the public page URL only—body metrics are not included in share text.
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
            href="/tools/calorie-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Calorie Calculator
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

      <div id="calorie-intake-simple-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...CALORIE_INTAKE_SIMPLE_FAQS]} />
        </div>
      </div>
    </article>
  );
}
