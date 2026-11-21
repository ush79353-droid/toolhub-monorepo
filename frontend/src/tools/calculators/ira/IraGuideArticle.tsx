import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { IRA_FAQS } from './content';
import {
  IRA_BASE_LIMIT_USD,
  IRA_CATCH_UP_AGE,
  IRA_CATCH_UP_USD,
  IRA_RULE_YEAR,
} from './ira-limits';

export function IraGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        IRA Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare a Traditional/SEP/SIMPLE-style deductible contribution path with
        a Roth after-tax path using the same contribution years, assumed annual
        return, and withdrawal horizon. Results are educational estimates for{' '}
        {IRA_RULE_YEAR} IRS dollar limits — not tax, legal, or investment advice.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Traditional vs Roth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Traditional IRA contributions may be deductible and withdrawals are
        generally taxable. Roth contributions are after-tax; qualified
        withdrawals are modeled here as tax-free. This tool applies one entered
        contribution to the Traditional/SEP/SIMPLE result group for comparison;
        it does not separately compute employer SEP or SIMPLE formulas.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Growth and Withdrawal Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>FV = C × ((1+r)^n − 1) / r (end-of-year contributions)</p>
        <p>PMT = FV × r / (1 − (1+r)^(−W))</p>
      </div>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        IRS {IRA_RULE_YEAR} Contribution Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Combined Traditional and Roth elective contributions generally cannot
        exceed ${IRA_BASE_LIMIT_USD.toLocaleString('en-US')} ($
        {(IRA_BASE_LIMIT_USD + IRA_CATCH_UP_USD).toLocaleString('en-US')} at age{' '}
        {IRA_CATCH_UP_AGE}+), or taxable compensation if lower. Limits are
        checked in USD after FX conversion. Sources: IRS Notice 2025-67 and IRS
        retirement topics.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter ages, contribution and withdrawal years, tax brackets, annual
        contributions, and expected return. Money fields support independent
        currencies. Reload restores the example; Clear empties the form.
      </p>

      <h2
        id="assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Assumptions
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Constant annual contributions and returns</li>
        <li>End-of-year contribution timing</li>
        <li>No RMDs, penalties, NIIT, state tax, or fees</li>
        <li>Roth withdrawals assumed qualified / tax-free</li>
      </ul>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Age 30→65, 35 contribution years, 20 withdrawal years, 7% return, $7,500
        Traditional contribution and $5,700 Roth contribution (24% contribution
        bracket) produce parallel balances and amortized withdrawals under the
        formulas above.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <Link
          href="/tools/401k-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          401(k)
        </Link>
        {' · '}
        <Link
          href="/tools/rmd-calculator-required-minimum-distributions-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          RMD
        </Link>
      </p>

      <h2
        id="ira-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...IRA_FAQS]} />
      </div>
    </article>
  );
}
