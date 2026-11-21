import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RULE_OF_72_FAQS } from './content';

export function RuleOf72GuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Rule of 72 Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use our Rule of 72 Calculator to estimate doubling time from a percent
        increase per period, or the approximate rate needed to double in a
        chosen number of periods. The classic Rule of 72 is a mental-math
        shortcut—not a substitute for exact compound-growth math.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>T ≈ 72 ÷ r% (approximate doubling periods)</p>
        <p>r% ≈ 72 ÷ T (approximate percent per period)</p>
        <p>T_exact = ln(2) / ln(1 + r) (exact discrete compound)</p>
      </div>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter Increase as a percent per period, or enter Doubling time in periods.</li>
        <li>Read the linked field and the summary estimate (plus exact compound comparison when available).</li>
        <li>Use Reload for empty defaults or Clear to wipe the current values.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        At 8% growth per period, 72 ÷ 8 = 9 periods under the Rule of 72. Exact
        discrete compounding at 8% per period is ln(2) / ln(1.08) ≈ 9.0065
        periods—close to the rule-of-thumb estimate.
      </p>

      <h2
        id="notes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Approximation vs Exact
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The constant 72 is chosen for convenient mental division across common
        rates. Accuracy varies with the rate and compounding assumptions. For
        precise planning, prefer the exact logarithmic formula (or a full
        compound-interest schedule) rather than the rule alone.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/2836-rule-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Rule 28/36 Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Compound Interest Calculator
          </Link>
        </li>
      </ul>

      <div id="rule-of-72-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...RULE_OF_72_FAQS]} />
        </div>
      </div>
    </article>
  );
}
