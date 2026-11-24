import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WW_POINTS_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function WeightWatchersPointsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Weight Watchers Points Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate educational SmartPoints for a food, meal, or day from the four
        nutrients on the worksheet: calories, sugar, protein, and saturated fat.
        This tool is not affiliated with WW International and does not replace
        the official WW app.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        SmartPoints formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} The published SmartPoints (2015–2021) food value is
        approximately (calories × 0.0305) + (saturated fat g × 0.275) + (sugar g
        × 0.12) − (protein g × 0.098), then rounded to the nearest whole number
        and floored at zero.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits &amp; editions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Zero-point food lists, personal daily budgets, and post-2021 WW point
        algorithms are proprietary or unpublished and are not computed here.
        Use label amounts for the serving you are scoring; switch sugar /
        protein / saturated fat between grams and milligrams without changing
        the underlying mass.
      </p>

      <div id="ww-points-faq" className="not-prose mt-8">
        <FAQAccordion items={WW_POINTS_FAQS} />
      </div>
    </article>
  );
}
