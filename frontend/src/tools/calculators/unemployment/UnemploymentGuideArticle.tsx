import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { UNEMPLOYMENT_FAQS } from './content';

export function UnemploymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-unemployment-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Unemployment Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The unemployment rate measures how large a share of the labor force is unemployed. The labor
        force is the sum of employed people and unemployed people. This calculator follows that
        standard statistical relationship and does not automatically treat everyone without a job as
        unemployed.
      </p>

      <h2 id="unemployment-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Labor Force = Employed People + Unemployed People</p>
        <p>Unemployment Rate (%) = Unemployed People ÷ Labor Force × 100</p>
        <p>Labor Force Participation Rate (%) = Labor Force ÷ Working-Age Population × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Population inputs are normalized to people (from people, thousands, or millions) before the
        formulas run. Percent outputs are never unit-converted.
      </p>

      <h2
        id="who-counts-as-unemployed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Who Counts as Unemployed?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Under relevant statistical definitions (for example, concepts used by labor agencies such as
        the U.S. BLS or ILO frameworks), unemployed people are those without employment who are
        actively seeking work and available to take a job. People who are not working and not looking
        for work are typically outside the labor force, so they are neither employed nor unemployed
        for unemployment-rate purposes.
      </p>

      <h2 id="population-units" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Population Units
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use <strong>people</strong>, <strong>thousand</strong>, or <strong>million</strong> on each
        population field. Switching a unit keeps the same underlying headcount and only changes how
        the number is displayed. Defaults follow the common “thousand” labor-market presentation.
      </p>

      <h2
        id="labor-force-participation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labor Force Participation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Expand Labor force participation to enter a working-age population and see the participation
        rate. Working-age population must be at least as large as the labor force. For a dedicated
        participation-rate page, see the{' '}
        <Link
          href="/tools/labor-force-participation-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Labor Force Participation Rate Calculator
        </Link>
        .
      </p>

      <h2 id="worked-example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Employed = 150 thousand, unemployed = 10 thousand → labor force = 160 thousand. Unemployment
        rate = 10,000 ÷ 160,000 × 100 = <strong>6.25%</strong>. With working-age population = 250
        thousand, participation rate = 160,000 ÷ 250,000 × 100 = <strong>64%</strong>.
      </p>

      <h2 id="unemployment-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...UNEMPLOYMENT_FAQS]} />
      </div>
    </article>
  );
}
