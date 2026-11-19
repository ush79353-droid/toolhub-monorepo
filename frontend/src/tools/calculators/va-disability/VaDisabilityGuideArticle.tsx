import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { VA_DISABILITY_FAQS, VA_RATES_HREF } from './content';
import {
  VA_COMPENSATION_EFFECTIVE,
  VA_COMPENSATION_YEAR,
  compensationChart,
} from './rates';

export function VaDisabilityGuideArticle() {
  const rows = compensationChart();
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="how-to-use-va-disability"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        How to use the VA disability pay calculator
      </h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter each service-connected disability percentage. Add a row if you have more than three. Mark a limb only when that rating is for a paired extremity you believe qualifies.</li>
        <li>Choose single or married.</li>
        <li>Enter children under 18 and children over 18 in a qualifying school program.</li>
        <li>Choose none, one, or two dependent parents.</li>
        <li>Read the exact combined value, the rating rounded to the nearest 10 percent, and the estimated monthly amount.</li>
      </ol>
      <div className="mt-4 rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-sm leading-relaxed text-sky-950/90">
        The rating math and the pay table are separate. VA decides eligibility and the payment. This page does not file a claim.
      </div>

      <h2
        id="about-va-disability"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        About the Veterans disability calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The combined rating is a percentage. Monthly compensation is a dollar amount from VA’s rate table for that percentage, marital status, and dependents. A spouse, child, or parent does not change the combined percentage. At 10 percent and 20 percent, dependents do not change the payment either. Rates shown here are the {VA_COMPENSATION_YEAR} rates effective {VA_COMPENSATION_EFFECTIVE}.{' '}
        <a className="font-medium text-primary underline-offset-2 hover:underline" href={VA_RATES_HREF}>
          VA compensation rates
        </a>
        .
      </p>

      <h2
        id="how-va-disability-is-calculated"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How is VA disability calculated?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start with the highest rating. Each later rating applies only to the efficiency that remains. For 50 percent, 30 percent, and 20 percent: 50 + (50 × 0.30) = 65, then 65 + (35 × 0.20) = 72. VA rounds 72 to 70. When both arms, both legs, or an arm and a leg are marked, those ratings are combined first, 10 percent of that value is added (38 CFR 4.26), and that result is combined with the other ratings before the final rounding.
      </p>

      <h2
        id="va-disability-rating-chart"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        VA disability rating chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Basic monthly rates for {VA_COMPENSATION_YEAR}, effective {VA_COMPENSATION_EFFECTIVE}. The “one child” columns include one child under 18 and no parents. Extra children and school children are not in this grid.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-3 py-2 font-semibold text-accent">Rating</th>
              <th className="px-3 py-2 font-semibold text-accent">Veteran alone</th>
              <th className="px-3 py-2 font-semibold text-accent">With spouse</th>
              <th className="px-3 py-2 font-semibold text-accent">With one child</th>
              <th className="px-3 py-2 font-semibold text-accent">Spouse and one child</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rating} className="border-b border-border">
                <td className="px-3 py-2 font-medium">{row.rating}%</td>
                <td className="px-3 py-2 tabular-nums">{formatCurrencyValue(row.alone, 'USD')}</td>
                <td className="px-3 py-2 tabular-nums">{formatCurrencyValue(row.withSpouse, 'USD')}</td>
                <td className="px-3 py-2 tabular-nums">{formatCurrencyValue(row.withOneChild, 'USD')}</td>
                <td className="px-3 py-2 tabular-nums">{formatCurrencyValue(row.withSpouseAndChild, 'USD')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2
        id="va-disability-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...VA_DISABILITY_FAQS]} />
      </div>
    </article>
  );
}
