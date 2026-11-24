import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  AGE_SOURCE_LABEL,
  OVERALL_US_TWIN_RATE_2024,
  RACE_RATES,
  RACE_SOURCE_LABEL,
} from './calculation';
import { TWINS_AGE_TABLE_ROWS, TWINS_FAQS } from './content';
import { RACE_ETHNICITY_OPTIONS } from './types';

export function ChancesOfHavingTwinsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Chances of Having Twins Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Look up how often twin births occur in US vital statistics for one
        demographic group. The calculator reports twin deliveries per 1,000 total
        births — educational context, not individualized medical prediction.
      </p>

      <h2
        id="endpoint"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Twin Births vs Twin Pregnancies
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        National Vital Statistics System (NVSS) twin rates count twin{' '}
        <em>deliveries</em> among all live births in the same year and population.
        That differs from twin pregnancy incidence or ultrasound detection rates.
        Percent shown here equals the birth rate divided by 10 (for example, 33.2 per
        1,000 → 3.32% of births are twins). “About 1 in N” uses round(1,000 ÷ rate).
      </p>

      <h2
        id="sources"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CDC and NVSS Sources
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Age mode: {AGE_SOURCE_LABEL}</li>
        <li>Race/Hispanic mode: {RACE_SOURCE_LABEL}</li>
        <li>Overall US reference ({OVERALL_US_TWIN_RATE_2024} per 1,000) for context only.</li>
      </ul>

      <h2
        id="age-rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Rates by Maternal Age (2024)
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold text-accent">Age group</th>
              <th className="py-2 font-semibold text-accent">Twin births per 1,000</th>
            </tr>
          </thead>
          <tbody>
            {TWINS_AGE_TABLE_ROWS.map((row) => (
              <tr key={row.label} className="border-b border-border/60">
                <td className="py-2 pr-4">{row.label}</td>
                <td className="py-2 tabular-nums">{row.rate.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2
        id="race-rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Rates by Race and Hispanic Origin (2024)
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold text-accent">Group</th>
              <th className="py-2 font-semibold text-accent">Twin births per 1,000</th>
            </tr>
          </thead>
          <tbody>
            {RACE_ETHNICITY_OPTIONS.map((o) => (
              <tr key={o.value} className="border-b border-border/60">
                <td className="py-2 pr-4">{o.label}</td>
                <td className="py-2 tabular-nums">{RACE_RATES[o.value].toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose <strong>by maternal age</strong> or <strong>by race and Hispanic origin</strong>.</li>
        <li>Enter age (12–55 whole years) or select one NVSS population group.</li>
        <li>Read the published rate, percent, and approximate 1-in-N frequency.</li>
        <li>Compare optionally to the national reference — not combined with your stratum.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Maternal age <strong>32</strong> maps to the <strong>30–34</strong> bracket →{' '}
        <strong>33.2</strong> twin births per 1,000 → <strong>3.32%</strong> → about{' '}
        <strong>1 in 30</strong> births in that age group are twins.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Disclaimer
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No risk multipliers, family history weights, or fertility treatment inputs are
        applied. Rates include ART-related twin births at the population level.
        Discuss personal reproductive planning with a qualified clinician.
      </p>

      <h2
        id="twins-faq"
        className="mt-10 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={TWINS_FAQS} />
      </div>
    </article>
  );
}

/** Short alias for guide registration. */
export const TwinsGuideArticle = ChancesOfHavingTwinsGuideArticle;