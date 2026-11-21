import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ESTATE_TAX_FAQS } from './content';

export function EstateTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-estate-tax-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Estate Tax Calculator estimates federal estate tax for U.S. decedents dying in
        calendar year 2026. Enter estate assets and allowable deductions, then Calculate.
        Many states impose separate estate or inheritance taxes; those are not computed here
        beyond an optional state death-tax deduction from the federal taxable estate.
      </p>

      <h2
        id="estate-tax-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas &amp; Sources
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross Estate = Sum of included assets</p>
        <p>Taxable Estate = max(0, Gross − Allowable deductions)</p>
        <p>Tentative Tax = IRC §2001(c) rate schedule</p>
        <p>Federal Estate Tax ≈ max(0, Tentative Tax − Applicable Credit on BEA)</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        2026 basic exclusion amount <strong>$15,000,000</strong> and applicable credit{' '}
        <strong>$5,945,800</strong> come from the Instructions for Form 706 (Rev. July 2026)
        and the IRS estate-and-gift “What&apos;s new” table (OBBBA / Rev. Proc. 2025-32).
      </p>

      <h2
        id="estate-tax-assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Assumptions
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Entered assets are treated as includible in the gross estate.</li>
        <li>
          Life insurance is assumed includible (for example IRC §2042); reduce the input if
          proceeds are excluded.
        </li>
        <li>
          Tax-free lifetime gifts are informational only — not adjusted taxable gifts and not
          subtracted from the taxable estate.
        </li>
        <li>
          No marital deduction, DSUE/portability, special-use valuation, or prior gift-tax
          credit is modeled.
        </li>
      </ul>

      <h2
        id="estate-tax-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross estate $21,000,000 · no deductions → taxable $21,000,000</p>
        <p>
          Tentative tax $8,345,800 − credit $5,945,800 → estimated federal estate tax{' '}
          <strong>$2,400,000</strong>
        </p>
      </div>

      <h2
        id="estate-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ESTATE_TAX_FAQS]} />
      </div>
    </article>
  );
}
