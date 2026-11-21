import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { calculatePowerballPayout, formatPowerballMoney } from './calculation';
import { POWERBALL_FAQS } from './content';

export function PowerballGuideArticle() {
  const sample = calculatePowerballPayout({
    jackpot: 281_000_000,
    lumpSumPercent: 52,
    filingStatus: 'single',
    state: 'FL',
  });
  const money = (v: number) => formatPowerballMoney(v);

  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Powerball is a multi-state lottery jackpot game. The advertised jackpot
        is usually the annuity total; the cash option is a lower one-time
        payment. Federal and state taxes further reduce take-home amounts.
 This calculator estimates lump-sum and graduated annuity scenarios; it
        is not an official Powerball tool.
      </p>

      <h2
        id="pb-lump-vs-annuity"
        className="mt-8 text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Powerball lump sum vs. annuity
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">Lump-sum option</h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>One-time cash payment, generally lower than the advertised jackpot.</li>
        <li>Immediate access to the cash value (after claim processing).</li>
        <li>Taxes estimated under the applicable tax-year rules.</li>
      </ul>
      <h3 className="mt-4 text-base font-semibold text-accent">Annuity option</h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>30 graduated annual payments, typically rising about 5% per year.</li>
        <li>Nominal sum equals the advertised jackpot before taxes.</li>
        <li>Taxes estimated on each year&apos;s payment, not the full jackpot at once.</li>
      </ul>

      <h2
        id="pb-lump-sum"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How does the Powerball lump sum work?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>CashValue = Jackpot × LumpSumPercentage / 100</p>
        <p className="mt-2">
          Example: $281,000,000 × 52% = $146,120,000 gross cash option
        </p>
      </div>
      {sample ? (
        <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
          With Florida (no state income tax) and single filing, estimated federal
          tax liability on the cash option is about {money(sample.lumpSum.federalTax)}{' '}
          (24% withholding ≈ {money(sample.lumpSum.federalWithholding)}), for an
          estimated net near {money(sample.lumpSum.netPayout)}.
        </p>
      ) : null}

      <h2
        id="pb-annuity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How does the Powerball annuity payout work?
      </h2>
      <div className="my-4 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>P₁ = J / Σₖ₌₀²⁹ (1.05)ᵏ · Pₙ = P₁(1.05)ⁿ⁻¹</p>
      </div>
      {sample ? (
        <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
          Sample first / last gross payments: {money(sample.annuityFirstPayment)}{' '}
          / {money(sample.annuityLastPayment)}. Estimated annuity net total ≈{' '}
          {money(sample.annuity.netPayout)}.
        </p>
      ) : null}

      <h2
        id="pb-after-taxes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Powerball after taxes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Federal lottery withholding is often 24% on reportable prizes, but your
        final federal liability uses progressive brackets after deductions and
 depends on filing status and other income. State treatment varies; 
        including no-income-tax states and California&apos;s general lottery
        exemption. Do not treat withholding as the final tax bill.
      </p>

      <h2
        id="pb-how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use the Powerball payout calculator?
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the advertised Powerball jackpot.</li>
        <li>Enter the lump-sum payout percentage.</li>
        <li>Select your filing status.</li>
        <li>Select your state of residence.</li>
        <li>Review the estimated lump-sum payout.</li>
        <li>Review the annuity payout schedule.</li>
        <li>Compare federal and state tax estimates.</li>
        <li>Review your estimated take-home amounts.</li>
      </ol>

      <h2
        id="pb-disclaimer"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Powerball calculator disclaimer
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Results are estimates only.</li>
        <li>Actual cash values follow official lottery calculations.</li>
        <li>Federal and state tax rules can change.</li>
        <li>Individual circumstances affect final tax liability.</li>
        <li>Initial withholding may differ from final tax.</li>
        <li>Consult a qualified tax professional for advice.</li>
      </ul>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        See also{' '}
        <Link
          href="/tools/mega-millions-payout-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Mega Millions Payout Calculator
        </Link>
        ,{' '}
        <Link
          href="/tools/millionaire-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Millionaire Calculator
        </Link>
        , and{' '}
        <Link
          href="/tools/net-worth-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Net Worth Calculator
        </Link>
        .
      </p>

      <h2
        id="pb-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...POWERBALL_FAQS]} />
      </div>
    </article>
  );
}
