import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BALANCE_TRANSFER_FAQS } from './content';

export function BalanceTransferGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-bt"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Balance Transfer?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A balance transfer moves revolving credit card debt from one card to
        another. Issuers often advertise a promotional APR—sometimes 0%—for a
        limited number of months. The goal is usually to reduce interest while
        you repay the balance, not to create free money. Offers vary, and a
        transfer fee is common even when the intro rate is zero.
      </p>

      <h2
        id="bt-fee"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Balance Transfer Fee?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The fee is the price of moving the debt. It is often a percentage of the
        transferred amount (for example 3%) or a fixed dollar charge. Financing
        the fee increases the starting balance; paying it upfront keeps the
        interest-bearing balance lower but requires cash at transfer.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does a Balance Transfer Work?
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>You apply for (or already hold) a card with a transfer offer.</li>
        <li>You request a transfer amount within the approved limit.</li>
        <li>The issuer posts the transfer and any fee to the new account.</li>
        <li>You repay under the promotional APR, then the regular APR.</li>
      </ol>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Balance Transfer Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter your current balance and old APR, choose a monthly payment or the
        “pay off during promotion” target, set the transfer amount and fee, then
        enter promotional rate, intro months, and post-promo APR. Compare old
        versus new total costs and review the balance left after the promo
        window.
      </p>

      <h2
        id="promo-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Promotional Period Balance Transfer Calculation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        During the intro months the model applies the promotional monthly rate
        (promo APR ÷ 12). At 0%, each payment reduces principal dollar for
        dollar. Any leftover after the last promo month becomes the starting
        point for the regular APR.
      </p>

      <h2
        id="long-term-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Long-Term Balance Transfer Calculation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Long-term mode uses the same engine but emphasizes full payoff: months
        to clear, total interest on both paths, fees, and overall savings after
        the promotional rate expires.
      </p>

      <h2
        id="fee-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Balance Transfer Fees
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Percentage fee = TransferAmount × (FeeRate / 100)</p>
        <p>Example: $10,000 × 3% = $300</p>
        <p>Financed start = TransferAmount + Fee</p>
        <p>Upfront start = TransferAmount (fee paid separately)</p>
      </div>

      <h2
        id="monthly-interest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Monthly Credit Card Interest
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This estimate uses monthlyRate = APR / 1200, then Interest = Balance ×
        monthlyRate, then Balance = Balance + Interest − Payment. Real issuers
        often use daily balances; treat results as planning estimates.
      </p>

      <h2
        id="savings-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Balance Transfer Savings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Savings ≈ OldTotalCost − NewTotalCost, where costs include interest and
        the transfer fee once for the same principal assumptions. A negative
        result means the transfer costs more under the model—not “savings.”
      </p>

      <h2
        id="break-even"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate the Balance Transfer Break-Even Point
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Track cumulative interest on the old-card path versus the transfer path
        month by month. The break-even month is the first month where interest
        saved reaches the transfer fee. If that never happens, the fee is not
        recovered in the comparison period.
      </p>

      <h2
        id="worth-it"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is a Balance Transfer Worth It?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It can be when you have a clear payment plan, avoid new revolving debt,
        and the intro window is long enough relative to the fee. It may not be
        when payments barely cover interest, the promo is short, or the regular
        APR is high with a large leftover.
      </p>

      <h2
        id="pros"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pros of Balance Transfers
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Lower introductory interest</li>
        <li>Potential total-cost savings</li>
        <li>Faster principal reduction when payments stay high</li>
        <li>Consolidation of multiple card balances onto one payment</li>
      </ul>

      <h2
        id="cons"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cons of Balance Transfers
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Transfer fees</li>
        <li>Promo expiration and high regular APRs</li>
        <li>Credit-limit and eligibility limits</li>
        <li>Risk from new purchases or missed payments</li>
      </ul>

      <h2
        id="vs-personal-loan"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Balance Transfer vs. Personal Loan
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Transfers keep debt revolving with promo then variable-like card rates.
        Personal loans are usually fixed installment debt. Compare APR/fees,
        payment discipline, and whether you need a fixed payoff date.
      </p>

      <h2
        id="vs-consolidation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Balance Transfer vs. Debt Consolidation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A balance transfer is one consolidation tactic using a credit card
        product. Broader consolidation may use loans or counseling. The right
        tool depends on rates, fees, and behavior.
      </p>

      <h2
        id="after-promo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens When the Promotional APR Expires?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Remaining transferred balances typically start accruing the regular APR.
        Plan payments so leftovers are small—or zero—before that date.
      </p>

      <h2
        id="pay-before-end"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Pay Off a Balance Before the Promotional Period Ends
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        At 0%: RequiredPayment ≈ NewStartingBalance ÷ PromoMonths. With a
        positive promo APR, use the amortizing payment for that rate and term.
        This is a planning target, not a lender minimum.
      </p>

      <h2
        id="payments-interest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Credit Card Payments Affect Interest
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Larger payments cut principal faster and shrink future interest. If the
        payment does not cover monthly interest, the balance grows and payoff
        never arrives under the model.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Balance Transfer Calculation Examples
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          $10k · 3% fee financed · 0% for 18 mo · $500/mo → start $10,300 ·
          after promo ≈ $1,300
        </p>
        <p>
          Shorter promo (6 mo @ 0%, then 24%): leftover larger; post-promo
          interest rises quickly
        </p>
        <p>
          High regular APR with small payments: fee may not be recovered —
          transfer can cost more
        </p>
      </div>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Balance Transfer Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Ignoring the transfer fee on a 0% offer</li>
        <li>Assuming the promo rate lasts forever</li>
        <li>Paying only the minimum</li>
        <li>Running up new purchases on either card</li>
        <li>Comparing unequal payment budgets or principals</li>
      </ul>

      <h2
        id="bt-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={BALANCE_TRANSFER_FAQS} />
      </div>
    </article>
  );
}
