import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MEGA_MILLIONS_PAYOUT_FAQS } from './content';

export function MegaMillionsPayoutGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mega Millions is a multi-state lottery jackpot game. When you win the
        jackpot, you typically choose between a one-time cash (lump-sum) option
        and an annuity paid in graduated annual installments. The advertised
        jackpot is usually the annuity total, so the immediate cash amount is
        lower. Federal and state income taxes further reduce what you keep.
        Filing status and state of residence change the estimate. This
 calculator helps compare estimated payout scenarios; it is not an
        official Mega Millions tool.
      </p>

      <h2
        id="mm-purpose"
        className="mt-8 text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Mega Millions calculator purpose
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A Mega Millions payout calculator converts the advertised jackpot into
        estimated cash and annuity figures, then layers progressive federal and
        state tax estimates so you can compare net outcomes. Cash options are
        usually a percentage of the advertised annuity jackpot. Comparing net
        payouts is more useful than comparing gross amounts alone. Results are
        estimates, not guaranteed lottery proceeds.
      </p>

      <h2
        id="mm-what-is-payout"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is the Mega Millions payout?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The advertised jackpot is the headline annuity value. Winners generally
        choose one of two structures:
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Lump-sum payment
      </h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>A one-time cash payment.</li>
        <li>Generally lower than the advertised annuity jackpot.</li>
        <li>Provides immediate access to the cash option.</li>
        <li>Depends on the applicable cash value or payout percentage.</li>
      </ul>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Annuity payment
      </h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Paid through graduated annual installments.</li>
        <li>
          Mega Millions jackpot annuities generally consist of 30 payments over
          29 years.
        </li>
        <li>
          Payments increase by about 5% annually under the standard structure.
        </li>
        <li>
          The nominal sum of payments equals the advertised jackpot before
          taxes.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Each payment is subject to applicable income taxes in the year received.
      </p>

      <h2
        id="mm-cash-value"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Mega Millions cash value calculator: how much will I get?
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the advertised jackpot.</li>
        <li>Enter the applicable lump-sum payout percentage.</li>
        <li>Select your filing status.</li>
        <li>Select your state of residence.</li>
        <li>Review estimated federal and state taxes.</li>
        <li>Compare estimated net payouts.</li>
      </ol>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>CashValue = Jackpot × PayoutPercentage</p>
        <p className="mt-2">
          Example: $201,000,000 × 52% = $104,520,000 gross cash option
        </p>
        <p className="mt-2">
          A₁ = J × g / ((1+g)³⁰ − 1) · Aₙ = A₁(1+g)ⁿ⁻¹ · If g = 0: A₁ = J / 30
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gross cash value is before taxes. After-tax proceeds subtract estimated
        federal and state liability. Annuity taxes are estimated payment by
        payment, not as if the entire jackpot were received in one year.
      </p>

      <h2
        id="mm-how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use the Mega Millions payout calculator? Mega Millions payout
        chart
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Enter how much you won</strong>: the advertised jackpot
          amount.
        </li>
        <li>
 <strong>Enter the annuity rate</strong>: the graduated-payment growth
          rate (often 5%).
        </li>
        <li>
 <strong>Select your filing status</strong>: used for federal tax
          brackets and standard deduction.
        </li>
        <li>
 <strong>Select your state</strong>: used for state income tax
          estimates, including no-income-tax jurisdictions.
        </li>
        <li>
 <strong>Enter lump-sum payout percentage</strong>: the cash option as
          a percent of the advertised jackpot.
        </li>
        <li>
 <strong>Review the results</strong>: payout comparison and yearly
          annuity schedule.
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The cash option and annuity option differ in payment timing, investment
        flexibility, and tax treatment. Consider your personal circumstances
        before choosing either option.
      </p>

      <h2
        id="mm-disclaimer"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Mega Millions winnings calculator disclaimer
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Results are estimates only.</li>
        <li>
          Actual jackpot cash values are determined by the official lottery.
        </li>
        <li>Tax rates and brackets can change.</li>
        <li>Federal and state rules may differ from these simplifying assumptions.</li>
        <li>
          Personal deductions and other income affect actual tax liability.
        </li>
        <li>
          Annuity schedules follow official lottery rules, which can change.
        </li>
        <li>
          Consult qualified financial and tax professionals before major
          decisions.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This page is not an official Mega Millions product and does not provide
        tax, legal, or investment advice.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore related finance tools on Omega Calculators when available in the
        catalog, such as{' '}
        <Link href="/tools/lottery-annuity-calculator" className="text-primary underline-offset-2 hover:underline">
          Lottery Annuity Calculator
        </Link>
        ,{' '}
        <Link href="/tools/annuity-calculator" className="text-primary underline-offset-2 hover:underline">
          Annuity Calculator
        </Link>
        , and other tax or investment calculators shown in the related tools
        section for this page.
      </p>

      <h2
        id="mm-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...MEGA_MILLIONS_PAYOUT_FAQS]} />
      </div>
    </article>
  );
}
