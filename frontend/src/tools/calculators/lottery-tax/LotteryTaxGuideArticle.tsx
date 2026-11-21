import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LOTTERY_TAX_FAQS } from './content';

export function LotteryTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-lottery-tax-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Lottery Tax Calculator compares an advertised annuity jackpot with a cash lump-sum
        option, estimates Tax I / Tax II under customized rates or US federal withholding, and
        builds a year-by-year annuity schedule. Independent currencies use Phase 2 FX. For
        present-value style lottery annuity math, see the{' '}
        <Link
          href="/tools/lottery-annuity-calculator"
          className="font-medium text-primary hover:underline"
        >
          Lottery Annuity Calculator
        </Link>
        .
      </p>

      <h2
        id="lottery-tax-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Lump Sum = Annuity × Lump-sum % ÷ 100</p>
        <p>Tax I = Gross × Rate I ÷ 100 · Tax II = Gross × Rate II ÷ 100</p>
        <p>Net = Gross − Tax I − Tax II</p>
        <p>Growing annuity: First = A × g / ((1+g)^n − 1); Payment(y) = First × (1+g)^(y−1)</p>
      </div>

      <h2
        id="lottery-tax-us"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        US Tax Mode
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        US mode applies IRC §3402(q) <strong>24% federal withholding</strong> as Tax I. Withholding
        is not final federal tax liability, which depends on filing status, other income, and the
 tax year. State lottery tax is not invented; use Customized tax rates for Tax II.
      </p>

      <h2
        id="lottery-tax-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annuity 1,200,000,000 · lump-sum 52% → lump 624,000,000</p>
        <p>Custom Tax I/II at 0% → net equals gross for both options</p>
        <p>Default annuity setup: 30 years · 5% annual growth</p>
      </div>

      <h2
        id="lottery-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LOTTERY_TAX_FAQS]} />
      </div>
    </article>
  );
}
