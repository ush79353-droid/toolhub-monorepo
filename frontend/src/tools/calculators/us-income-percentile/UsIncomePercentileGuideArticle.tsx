import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { US_INCOME_PERCENTILE_FAQS } from './content';

export function UsIncomePercentileGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="individual-and-household-percentiles"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What are individual and household income percentiles?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An income percentile says what share of a comparison group has income at or
        below a given amount. The 50th percentile is the median. A household figure
        adds up money income for people who live together. An individual figure is
        one person’s money income. Ranking a person’s paycheck against household
        totals mixes two different populations and will mislead.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This page uses pretax CPS ASEC money income for 2024. Household thresholds
        are the selected percentiles in Census report P60-286, Table A-4a, with the
        mean from Table A-2. Person income uses PINC-01 for people age 15 and older
        who had income. The mean is not a percentile.
      </p>

      <h2
        id="what-percentile-is-my-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What percentile is my income? The US income percentile calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose individual or household, enter annual money income in dollars, and
        the tool looks up that dataset. Between published points it draws a straight
        line. It does not invent a rank below the lowest published household
        threshold, above the 95th household percentile, or inside the open
        $100,000-and-over person-income interval.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example, labeled as a method check rather than a personal result: Candy, a
        U.S. resident, selects individual income and enters $100,000. That amount is
        the start of PINC-01’s open top bin, so the calculator reports the share of
        people with income at or below $99,999 and stops. The same $100,000 entered
        as household income is interpolated between the 50th percentile ($83,730)
        and the 60th ($105,500) in Table A-4a. Same dollars, different rank.
      </p>

      <h2
        id="how-to-interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to interpret my individual and household income percentile?
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Around the 25th percentile: higher than about one quarter of the selected group, when that part of the table is published.</li>
        <li>50th percentile: about the median.</li>
        <li>75th percentile: higher than about three quarters of the group.</li>
        <li>90th and 95th: the top published household rungs in Table A-4a. A 99th percentile is not in that table.</li>
      </ul>
      <div className="mt-4 rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-sm leading-relaxed text-sky-950/90">
        Income percentiles are based on data with a specific reference year and
        population definition. Always check the dataset and its coverage when
        interpreting the results. Household ranks here stop at the 10th and 95th
        published thresholds. Person ranks use $2,500 bins and are approximate
        inside each bin.
      </div>

      <h2
        id="us-income-percentile-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...US_INCOME_PERCENTILE_FAQS]} />
      </div>
    </article>
  );
}
