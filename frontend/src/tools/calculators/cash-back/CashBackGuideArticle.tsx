import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CASH_BACK_FAQS } from './content';

export function CashBackGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Cash Back Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This Cash Back Calculator estimates how much you earn when a purchase
        returns a percentage or fixed reward. Enter the eligible purchase amount
        and cashback rate, optionally enable a cashback limit, and see the
        uncapped reward, the actual reward after any cap, the effective purchase
        cost, and the effective cashback rate. Currency selection changes how
        amounts are labeled and formatted—it does not convert between currencies.
        Use the tool to compare offers before you shop, understand how caps
        dilute advertised rates, and plan break-even spending to reach a reward
        ceiling. Results are educational estimates; issuer, retailer, and tax
        rules decide what ultimately posts to your account.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cashback appears on credit cards, debit programs, shopping portals,
        loyalty apps, and short-term promotions. Understanding the math helps
        you separate a strong offer from a headline percentage that looks
        generous until a low cap binds. Pair this calculator with disciplined
        spending: rewards never justify carrying revolving balances at high
        interest or buying things you would not otherwise need.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Cash Back?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash back is a financial reward tied to eligible spending. Instead of
        (or in addition to) a lower sticker price, the program returns a portion
        of what you spend—commonly as a statement credit, bank deposit, check,
        or store credit. The return may be a percentage of the purchase or a
        fixed dollar amount for meeting an offer condition.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        You may encounter cashback through credit cards that pay a flat rate on
        every purchase or boosted rates in select categories; debit cards with
        modest rewards; shopping platforms that track referrals; retailer loyalty
        programs; and promotional offers with limited windows. Eligibility,
        posting delays, redemption locks, and exclusion lists differ widely.
        Always treat program terms as the authority over any simplified example
        on this page.
      </p>

      <h2
        id="how-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Cash Back Work?
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Make an eligible purchase under the program’s rules.</li>
        <li>Apply the cashback percentage (or fixed reward) to the eligible base.</li>
        <li>Compute the potential uncapped reward.</li>
        <li>Apply any cashback cap for the period, category, or promotion.</li>
        <li>Determine the actual earned reward after the cap.</li>
        <li>Redeem according to posting timelines and redemption options.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Returns and cancellations often reverse rewards. Some programs calculate
        on the merchandise subtotal before tax; others include tax or shipping.
        Enter the same base your program uses so the estimate matches reality.
      </p>

      <h2
        id="how-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Cash Back
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>CashBack = PurchaseAmount × CashBackRate / 100</p>
        <p>EffectiveCost = PurchaseAmount − ActualCashBack</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example at $500 and 5%: cashback = 500 × 0.05 = $25; effective cost =
        500 − 25 = $475 if the full reward is received with no fees. Other
        common rates on a $1,000 purchase: 1% → $10; 2% → $20; 3% → $30; 5% →
        $50; 10% → $100. Fixed rewards skip the percentage step: if an offer
        pays $15 on a $200 purchase, cashback is $15 and effective cost is $185
        before considering caps.
      </p>

      <h2
        id="with-limit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash Back Calculator With a Limit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reward limits exist so issuers and merchants can control marketing costs
        while still advertising attractive percentages. When a cap is enabled:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ActualCashBack = min(CalculatedCashBack, CashBackLimit)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $1,500 at 5% with a $50 limit → uncapped cashback $75 → actual
        $50 → effective cost $1,450. The calculator only applies a limit when
        you check “I have a cash back limit.” Unchecking clears the cap from the
        math so a previously typed limit cannot silently reduce your result.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Break-even spending to hit a cap equals Limit ÷ (Rate/100). At 5% with a
        $50 cap, you need $1,000 of eligible spend to reach the ceiling; beyond
        that threshold the capped offer adds no further cashback.
      </p>

      <h2
        id="effective-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Your Effective Cashback Rate
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>EffectiveRate = ActualCashBack / PurchaseAmount × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Without a binding cap, the effective rate matches the advertised rate
        (for pure percentage rewards). With a binding cap, the effective rate
        falls. Example: $2,000 at 5% with a $50 cap → actual $50 → effective
        rate 2.5%. If the purchase amount is zero, the effective rate is not
        applicable—this tool shows N/A instead of dividing by zero.
      </p>

      <h2
        id="credit-card"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Cash Back Credit Card?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cashback credit cards return a portion of eligible charges. Structures
        include flat-rate cards (one percentage on most purchases), category
        cards (higher rates on groceries, fuel, dining, travel, or online
        shopping), rotating quarterly categories that require activation, and
        promotional elevated rates for a limited time. Redemption may be
        automatic statement credit, deposit to a linked account, or gift cards.
        Annual fees, foreign transaction fees, and APR matter as much as the
        reward rate when you evaluate whether a card improves your net finances.
      </p>

      <h2
        id="types"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Types of Cash Back Rewards
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Percentage-based:</strong> a stated share of eligible spend.
        </li>
        <li>
          <strong>Fixed cashback:</strong> a set dollar reward for meeting offer
          conditions.
        </li>
        <li>
          <strong>Tiered:</strong> rates that change after spending thresholds.
        </li>
        <li>
          <strong>Category-based:</strong> different rates by merchant type.
        </li>
        <li>
          <strong>Promotional:</strong> time-limited bonuses with extra rules.
        </li>
        <li>
          <strong>Capped:</strong> rewards limited by a maximum dollar amount.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator focuses on percentage and fixed rewards with an optional
        cap and a break-even spend solver. It does not invent bank-specific
        category rates—enter the rates from your own offer.
      </p>

      <h2
        id="maximize"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Maximize Cash Back Savings
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Compare reward rates on the spending you already do.</li>
        <li>Know which categories earn higher rates and which are excluded.</li>
        <li>Track cashback caps so you do not overestimate remaining rewards.</li>
        <li>Read fine print on returns, gift cards, and third-party processors.</li>
        <li>Avoid purchases you would not make without the reward.</li>
        <li>Subtract annual fees when comparing net yearly value.</li>
        <li>Confirm redemption rules, minimums, and expiration policies.</li>
      </ul>

      <h2
        id="vs-discount"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash Back vs. Discount
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A discount reduces the price immediately at checkout. Cashback generally
        leaves the checkout total unchanged and delivers a later reward. Example:
        a $100 item with 10% off costs $90 now; the same item with 10% cashback
        may cost $100 today with a $10 reward later. Net mathematics can converge
        if the reward is certain and timely, but cash flow, tax base, return
        handling, and eligibility differ. When both apply, follow stacking rules
        carefully—programs may calculate cashback on the discounted price.
      </p>

      <h2
        id="vs-points"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash Back vs. Reward Points
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cashback is usually quoted in currency. Points programs credit miles or
        points whose cash-equivalent value depends on how you redeem—statement
        credit, travel portals, transfers, or merchandise. A high “points per
        dollar” figure can be less valuable than a lower flat cashback rate if
        redemptions are restrictive. Convert expected points to a cents-per-point
        estimate for fair comparisons, then apply caps the same way you would
        for cash rewards.
      </p>

      <h2
        id="interest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash Back and Credit Card Interest
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interest, annual fees, late fees, and foreign transaction fees can erase
        cashback quickly. Carrying a revolving balance at a typical purchase APR
        often costs far more than a 1–5% reward returns. Pay statements in full
        when possible. Do not borrow deliberately to “earn” cashback—the
        calculator’s effective cost assumes you receive the reward without
        financing costs.
      </p>

      <h2
        id="limits-savings"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Cashback Limits Affect Your Savings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Caps flatten rewards after a spending threshold. On $2,000 at 5% with a
        $50 cap, you still spend $2,000 but only receive $50—an effective 2.5%
        rate. The first $1,000 of eligible spend (at 5%) would have earned the
        full $50; the next $1,000 under that capped offer earns nothing
        additional. Knowing the break-even spend helps you decide whether to
        shift remaining purchases to a different uncapped card or rate.
      </p>

      <h2
        id="online"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash Back for Online Shopping
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Online cashback may stack shopping-portal rates, retailer promotions,
        promo codes, and card rewards—or conflict when terms forbid combining.
        Tracking cookies, affiliate attribution, and delayed confirmation are
        common friction points. Rewards can take weeks to finalize and may be
        cancelled if you return items. Read portal and card exclusions (gift
        cards, marketplaces, payment processors) before assuming a rate applies
        to your cart.
      </p>

      <h2
        id="free-money"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is Cash Back Really Free Money?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No. Cashback is a conditional rebate attached to eligible spending—not
        money you receive without a purchase. Merchants and issuers fund rewards
        as part of marketing and interchange economics. Treat cashback as a
        partial refund of money you already chose to spend, subject to rules that
        can reduce or reverse the benefit.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Cashback Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Ignoring reward limits and overestimating remaining earnings.</li>
        <li>Assuming every merchant category qualifies.</li>
        <li>Forgetting annual fees in net-value comparisons.</li>
        <li>Carrying credit card debt to chase small rewards.</li>
        <li>Confusing points valuations with cashback percentages.</li>
        <li>Projecting annual rewards from peak promotional rates.</li>
        <li>Overlooking expiration, redemption minimums, and return clawbacks.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link
          href="/tools/black-friday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Black Friday
        </Link>
        ,{' '}
        <Link
          href="/tools/discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discount
        </Link>
        ,{' '}
        <Link
          href="/tools/percentage-discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Percentage Discount
        </Link>
        ,{' '}
        <Link
          href="/tools/credit-card-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Card
        </Link>
        ,{' '}
        <Link
          href="/tools/savings-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Savings
        </Link>
        ,{' '}
        <Link
          href="/tools/budget-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Budget
        </Link>
        , and{' '}
        <Link
          href="/tools/profit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Profit
        </Link>
        . For auto financing that trades a cash-back offer against a lower APR,
        see the separate{' '}
        <Link
          href="/tools/cash-back-or-low-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Back or Low Interest
        </Link>{' '}
        calculator.
      </p>

      <h2
        id="cb-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...CASH_BACK_FAQS]} />
      </div>
    </article>
  );
}
