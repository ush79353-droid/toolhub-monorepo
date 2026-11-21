import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TAX_BRACKET_FAQS } from './content';

export function TaxBracketGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-tax-bracket-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Tax Bracket Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A tax bracket calculator estimates US federal ordinary income tax using
        progressive IRS rate schedules for your filing status and tax year. It
        shows estimated tax, marginal rate, effective rate, and a
        bracket-by-bracket breakdown. It is not a complete Form 1040.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select tax year (default 2024) and filing status (default Single).</li>
        <li>Enter total taxable income in USD.</li>
        <li>
          Enter deductions (default $0). Leave at $0 if income is already IRS
          taxable income.
        </li>
        <li>Read estimated tax, marginal/effective rates, and the bracket table.</li>
      </ol>

      <h2
        id="verified-irs-brackets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Verified IRS Brackets
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ordinary rates 10% / 12% / 22% / 24% / 32% / 35% / 37% with year-specific
        thresholds from Rev. Proc. 2023-34 (2024), Rev. Proc. 2024-40 (2025), and
        Rev. Proc. 2025-32 / IR-2025-103 (2026). Qualifying Surviving Spouse uses
        Married Filing Jointly brackets.
      </p>

      <h2
        id="progressive-tax-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Progressive Tax Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>T = max(0, Income − Deductions)</p>
        <p>Tax in band = portion in band × band rate</p>
        <p>Total tax = sum of tax across applicable bands</p>
        <p>Effective % = Total tax ÷ T × 100 (0% when T = 0)</p>
      </div>

      <h2
        id="deductions-note"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Deductions Note
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The screenshot includes a Deductions field defaulting to $0. This
        calculator subtracts that amount from the income field before applying
        brackets. It does not invent a second standard deduction. If your income
        figure is already taxable income, keep deductions at $0.
      </p>

      <h2
        id="tax-bracket-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...TAX_BRACKET_FAQS]} />
      </div>
    </article>
  );
}
