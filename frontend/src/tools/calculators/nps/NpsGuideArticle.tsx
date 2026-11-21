import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NPS_FAQS } from './content';

const classificationRows = [
  { score: '10', group: 'Promoter' },
  { score: '9', group: 'Promoter' },
  { score: '8', group: 'Passive' },
  { score: '7', group: 'Passive' },
  { score: '6', group: 'Detractor' },
  { score: '5', group: 'Detractor' },
  { score: '4', group: 'Detractor' },
  { score: '3', group: 'Detractor' },
  { score: '2', group: 'Detractor' },
  { score: '1', group: 'Detractor' },
  { score: '0', group: 'Detractor' },
] as const;

const interpretRows = [
  { nps: '+100', meaning: 'All respondents are promoters' },
  { nps: '+50', meaning: 'More promoters than detractors' },
  { nps: '+25', meaning: 'Positive net promoter score' },
  { nps: '0', meaning: 'Promoters and detractors are equal' },
  { nps: '−25', meaning: 'More detractors than promoters' },
  { nps: '−100', meaning: 'All respondents are detractors' },
] as const;

export function NpsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-nps"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is Net Promoter Score (NPS)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net Promoter Score is a customer experience and loyalty metric based on how likely
        respondents say they are to recommend a company, product, or service. Survey answers on a
        0–10 scale are grouped into promoters, passives, and detractors, then summarized as a single
        score from −100 to +100.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Organizations use NPS to track recommendation sentiment over time, spot dissatisfaction
        pressure, and compare cohorts when survey wording and methods stay consistent. Willingness
        to recommend is related to loyalty for many products, but NPS alone does not explain
        <em> why</em> customers answered as they did.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>NPS = % Promoters − % Detractors</p>
        <p>NPS = ((Promoters − Detractors) / Total Responses) × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Passives count in the total response denominator so percentages reflect the full sample, but
        they do not add or subtract in the numerator. Only promoters push NPS up and detractors push
        it down.
      </p>

      <h2 id="nps-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What is the Net Promoter Score formula?
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Promoters</strong> = Score 9 responses + Score 10 responses
        </li>
        <li>
          <strong>Passives</strong> = Score 7 responses + Score 8 responses
        </li>
        <li>
          <strong>Detractors</strong> = responses with scores 0 through 6
        </li>
        <li>
          <strong>Total responses</strong> = Promoters + Passives + Detractors
        </li>
        <li>
          <strong>NPS</strong> = ((Promoters − Detractors) / Total Responses) × 100
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked totals: promoters 50, passives 25, detractors 25, total 100 → NPS = ((50 − 25) / 100)
        × 100 = <strong>+25</strong>.
      </p>

      <h2
        id="promoters-passives-detractors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Who are promoters, passives, and detractors?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>Promoters (9–10)</strong> give the highest recommendation scores and are generally
        treated as enthusiastic customers. <strong>Passives (7–8)</strong> are relatively satisfied
        but less loyal and may switch more readily.{' '}
        <strong>Detractors (0–6)</strong> report lower recommendation scores and may signal
        dissatisfaction or negative experiences.
      </p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Survey score</th>
              <th className="px-3 py-2 font-semibold">Classification</th>
            </tr>
          </thead>
          <tbody>
            {classificationRows.map((row) => (
              <tr key={row.score} className="border-t border-border">
                <td className="px-3 py-2 tabular-nums">{row.score}</td>
                <td className="px-3 py-2">{row.group}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="interpret-nps" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to interpret NPS results
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive NPS means more promoters than detractors. Zero means those groups are equal as
        percentages. Negative NPS means more detractors than promoters. The mathematical range is
        −100 to +100. Industry-specific benchmarks and your own history are more meaningful than
        universal cutoffs.
      </p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">NPS</th>
              <th className="px-3 py-2 font-semibold">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {interpretRows.map((row) => (
              <tr key={row.nps} className="border-t border-border">
                <td className="px-3 py-2 tabular-nums">{row.nps}</td>
                <td className="px-3 py-2">{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="worked-example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to calculate NPS with an example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Score 10: 30 · Score 9: 20 · Score 8: 15 · Score 7: 10 · Score 6: 10 · Score 5: 5 · Score 4:
        3 · Score 3: 2 · Score 2: 2 · Score 1: 1 · Score 0: 2.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Promoters = 30 + 20 = 50</li>
        <li>Passives = 15 + 10 = 25</li>
        <li>Detractors = 10 + 5 + 3 + 2 + 2 + 1 + 2 = 25</li>
        <li>Total responses = 50 + 25 + 25 = 100</li>
        <li>NPS = ((50 − 25) / 100) × 100 = 25 → <strong>+25</strong></li>
      </ol>

      <h2 id="nps-vs-csat" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        NPS vs. Customer Satisfaction Score (CSAT)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NPS focuses on willingness to recommend. CSAT typically measures satisfaction with a
        specific experience, product, or interaction. NPS is often used for loyalty and
        recommendation sentiment; CSAT is often used for immediate satisfaction. The two metrics
        answer different questions and work best together rather than as substitutes.
      </p>

      <h2 id="nps-vs-ces" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        NPS vs. Customer Effort Score (CES)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CES measures how much effort customers feel they need to complete an interaction. NPS
        measures recommendation likelihood. High effort can harm loyalty over time, but CES and NPS
        are not interchangeable. Use{' '}
        <Link href="/tools/customer-effort-score-calculator" className="text-primary hover:underline">
          Customer Effort Score Calculator
        </Link>{' '}
        when friction is the question you need to answer.
      </p>

      <h2
        id="benefits-limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Benefits and limitations of NPS
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Benefits include a simple formula, an easy-to-communicate score, trend tracking, and a clear
        view of promoter vs. detractor balance. Limitations include lack of “why” without open-ended
        follow-ups, response bias, industry-specific baselines, sensitivity to survey wording, and
        unstable results from small samples. A single NPS number never captures every dimension of
        customer experience.
      </p>

      <h2 id="improve-nps" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How businesses can improve their NPS
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Collect feedback regularly with consistent wording</li>
        <li>Identify recurring complaints from detractors</li>
        <li>Improve support quality and first-contact resolution</li>
        <li>Reduce friction in product and service journeys</li>
        <li>Raise product quality and reliability where issues cluster</li>
        <li>Close the loop with detractors and learn from promoters</li>
        <li>Pair NPS with qualitative comments and related CX metrics</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No single tactic guarantees a higher NPS in every market.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/customer-effort-score-calculator"
            className="text-primary hover:underline"
          >
            Customer Effort Score Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/customer-acquisition-cost-calculator"
            className="text-primary hover:underline"
          >
            Customer Acquisition Cost Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/saas-lifetime-value-calculator"
            className="text-primary hover:underline"
          >
            SaaS Lifetime Value Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/roi-calculator" className="text-primary hover:underline">
            ROI Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/operating-margin-calculator"
            className="text-primary hover:underline"
          >
            Operating Margin Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/business-valuation-calculator"
            className="text-primary hover:underline"
          >
            Business Valuation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/year-over-year-growth-calculator"
            className="text-primary hover:underline"
          >
            Year-over-Year Growth Calculator
          </Link>
        </li>
      </ul>

      <h2 id="nps-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...NPS_FAQS]} />
      </div>
    </article>
  );
}
