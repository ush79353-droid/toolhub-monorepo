import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CES_FAQS } from './content';

export function CustomerEffortScoreGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-ces" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What is Customer Effort Score?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Customer Effort Score (CES) measures how much effort a customer feels is required to complete
        a task or interaction with a business — for example contacting support, resolving a
        complaint, completing a purchase, returning an item, signing up, using an app, or finding
        information. Reducing unnecessary effort can improve the journey and lower abandonment, but
        CES alone does not diagnose the root cause of friction.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CES sits alongside other experience metrics: <strong>CSAT</strong> (satisfaction) and{' '}
        <strong>NPS</strong> (likelihood to recommend). Each answers a different question; none
        replaces the others.
      </p>

      <h2 id="ces-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        The customer effort score formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>CES = Σ(Rating × Number of Responses) / Total Responses</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example on a 1–5 scale (1 = very easy, 5 = very difficult):
      </p>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Score</th>
              <th className="px-3 py-2 font-semibold">Responses</th>
              <th className="px-3 py-2 font-semibold">Weighted</th>
            </tr>
          </thead>
          <tbody>
            {[
              [1, 10, 10],
              [2, 5, 10],
              [3, 3, 9],
              [4, 5, 20],
              [5, 5, 25],
            ].map(([score, responses, weighted]) => (
              <tr key={score} className="border-t border-border">
                <td className="px-3 py-2 tabular-nums">{score}</td>
                <td className="px-3 py-2 tabular-nums">{responses}</td>
                <td className="px-3 py-2 tabular-nums">{weighted}</td>
              </tr>
            ))}
            <tr className="border-t border-border font-semibold">
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2 tabular-nums">28</td>
              <td className="px-3 py-2 tabular-nums">74</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CES = 74 / 28 ≈ 2.642857 → displayed as <strong>2.64</strong>. This is the average reported
        effort, not a count of “satisfied” customers. Lower values mean less effort in this tool.
      </p>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to use this customer effort score calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select the survey scale (1–5 or 1–7).</li>
        <li>Confirm your questionnaire uses 1 = very easy and the top score = very difficult.</li>
        <li>Enter how many customers selected each score.</li>
        <li>Read the automatic CES and distribution percentages.</li>
        <li>Open detailed analysis for median, mode, and a simple distribution chart.</li>
        <li>Compare only with prior surveys that share the same scale and wording.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Switching scales resets response counts so scores are not silently reinterpreted across
        different ranges.
      </p>

      <h2 id="interpret-ces" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to interpret CES results
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In this calculator, low averages mean low effort; the midpoint is neutral; high averages
        mean more friction. The mean can hide polarized distributions — two surveys can share the
        same CES with very different low- vs high-effort mixes. Track CES over time with consistent
        methods, and treat descriptive bands as illustrations rather than industry standards.
      </p>

      <h2
        id="ces-vs-nps-csat"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Customer Effort Score vs. NPS and CSAT
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Metric</th>
              <th className="px-3 py-2 font-semibold">Measures</th>
              <th className="px-3 py-2 font-semibold">Typical purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-2">CES</td>
              <td className="px-3 py-2">Perceived effort</td>
              <td className="px-3 py-2">Identify friction in interactions</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">CSAT</td>
              <td className="px-3 py-2">Customer satisfaction</td>
              <td className="px-3 py-2">Assess satisfaction with products or experiences</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">NPS</td>
              <td className="px-3 py-2">Likelihood of recommendation</td>
              <td className="px-3 py-2">Track customer advocacy</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Teams often use all three depending on goals. CES does not replace CSAT or NPS.
      </p>

      <h2 id="improve-ces" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to improve Customer Effort Score
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Simplify complex customer journeys.</li>
        <li>Reduce unnecessary form fields.</li>
        <li>Improve website and application navigation.</li>
        <li>Stop asking customers to repeat information.</li>
        <li>Improve first-contact resolution.</li>
        <li>Provide clear self-service resources.</li>
        <li>Reduce transfers between support agents.</li>
        <li>Improve support response quality.</li>
        <li>Review complaints and open-text feedback.</li>
        <li>Re-measure CES after major product or process changes.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Judge improvements with comparable survey data rather than assuming a change succeeded.
      </p>

      <h2 className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/operating-margin-calculator"
          >
            Operating Margin Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/break-even-calculator"
          >
            Break-Even Calculator
          </Link>
        </li>
        <li>
          <Link className="text-primary underline-offset-2 hover:underline" href="/tools/roi-calculator">
            ROI Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/expense-ratio-calculator"
          >
            Expense Ratio Calculator
          </Link>
        </li>
      </ul>

      <h2 id="ces-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CES_FAQS]} />
      </div>
    </article>
  );
}
