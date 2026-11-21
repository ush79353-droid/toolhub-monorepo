import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MARRIAGE_TAX_FAQS } from './content';

export function MarriageTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-marriage-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Marriage Tax Penalty or Bonus?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Filing jointly can raise or lower total tax compared with two unmarried returns because
        brackets, standard deductions, and credits are not always double the single amounts. This
        calculator estimates that difference for tax year 2026.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter income, savings, filing status, dependents, and tax options for each spouse.</li>
        <li>Click Calculate to compare combined before-marriage filings versus married filing jointly.</li>
        <li>Read the estimated total tax difference (penalty, bonus, or neutral).</li>
      </ol>

      <h2
        id="ty-2026-rules"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tax Year 2026 Rules
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ordinary brackets and standard deductions reuse the project&apos;s verified Income Tax
        Calculator TY 2026 parameters (Rev. Proc. 2025-32 / IR-2025-103). Preferential long-term
        capital gains and qualified dividends use the shared stacking helper.
      </p>

      <h2
        id="assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Assumptions and Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Educational estimate only. State/city tax is a flat percent of ordinary income inputs.
        Self-employment tax uses a simplified SE base and does not deduct the employer-equivalent
        half of SE tax (SE½) from AGI. Itemized deduction dollars are not collected (declining the
        standard deduction uses $0 itemized). Dependents use a simplified CTC only. Not a complete
        Form 1040 and not tax advice.
      </p>

      <h2
        id="marriage-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...MARRIAGE_TAX_FAQS]} />
      </div>
    </article>
  );
}
