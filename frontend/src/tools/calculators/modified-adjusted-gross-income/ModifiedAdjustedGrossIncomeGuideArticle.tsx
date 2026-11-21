import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MAGI_FAQS } from './content';

export function ModifiedAdjustedGrossIncomeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-magi"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is MAGI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Modified Adjusted Gross Income (MAGI) is derived from AGI by adding
        back certain exclusions, deductions, and adjustments. The exact list
        depends on the tax or benefit program (traditional IRA, Roth IRA,
        Premium Tax Credit, education benefits, and others each use different
        rules). This calculator produces a general illustrative MAGI estimate
 only; not program-specific IRA, Roth, ACA, or education MAGI.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter your adjusted gross income (AGI) and its currency.</li>
        <li>
          In <strong>Income and expenses</strong>, enter qualifying add-backs
          or adjustments (defaults are zero). Use signed values only where your
          situation allows losses or offsets.
        </li>
        <li>
          In <strong>Other income and expenses</strong>, enter any additional
          listed items that apply.
        </li>
        <li>
          Read the illustrative MAGI result. Change the result currency to
          re-express the same total without changing the math.
        </li>
      </ol>

      <h2
        id="magi-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Estimated MAGI = AGI + Foreign-earned income + Foreign housing cost +
          Non-taxable social benefits + Self-employment taxes + IRA contributions
          + Passive income or losses + Others + Employer-paid adoption benefits +
          Savings bond interest + Student loan interest + Qualified tuition
          expenses and fees
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        All adjustment amounts are converted into the AGI currency before summing.
        Calculations keep full precision and round only for display.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is a <strong>simplified illustrative estimate</strong>, not
        program-specific IRS eligibility. It does not apply income limits,
        phaseouts, or tax-year law changes. Amounts already in AGI should not be
        entered again. Self-employment taxes, IRA amounts, and other fields are
 user-supplied add-backs, the tool does not compute statutory add-back
        formulas for you. For filing or benefit decisions, use official IRS
        guidance or professional advice.
      </p>

      <h2
        id="magi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MAGI_FAQS]} />
      </div>
    </article>
  );
}