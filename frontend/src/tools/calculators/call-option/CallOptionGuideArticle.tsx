import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CALL_OPTION_FAQS } from './content';
import { EQUITY_OPTION_CONTRACT_MULTIPLIER } from './types';

export function CallOptionGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Call or Put Option?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An option is a contract that gives the holder the right, but not the
        obligation, to buy (call) or sell (put) an underlying asset at a fixed
        strike price before or at expiration, depending on the contract style.
        Buyers pay a premium for that right. This calculator focuses on the
        cash outlay for purchased contracts and simple break-even context—not
        on pricing models such as Black-Scholes.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Total Premium Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Total premium = Option price × {EQUITY_OPTION_CONTRACT_MULTIPLIER} ×
          Contracts
        </p>
        <p>Call break-even ≈ Strike + Option price</p>
        <p>Put break-even ≈ Strike − Option price</p>
        <p>
          Intrinsic (call) = max(0, Asset − Strike); (put) = max(0, Strike −
          Asset)
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example: call option quoted at 5, one contract → total premium =
        5 × {EQUITY_OPTION_CONTRACT_MULTIPLIER} × 1 = 500 (in the selected
        currency denomination).
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose call or put mode.</li>
        <li>Enter the current underlying price or a target price for P/L context.</li>
        <li>Enter the strike and the quoted premium per share.</li>
        <li>Enter a whole number of contracts.</li>
        <li>Read total premium, break-even, intrinsic, and P/L at the asset/target.</li>
      </ol>

      <h2
        id="break-even"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Break-Even and Intrinsic Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Intrinsic value is the immediate exercise value if the option could be
        exercised at the stated asset price. Time value is the premium minus
        intrinsic value. Break-even estimates where the long option position
        recovers the premium paid (per share), ignoring commissions, taxes, and
        financing.
      </p>

      <h2
        id="multiplier"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Multiply by {EQUITY_OPTION_CONTRACT_MULTIPLIER}?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Most U.S.-style equity option contracts deliver exposure to{' '}
        {EQUITY_OPTION_CONTRACT_MULTIPLIER} shares. Premiums are quoted per
        share, so cash premium for one contract is roughly quote ×{' '}
        {EQUITY_OPTION_CONTRACT_MULTIPLIER}. Index, futures, and mini contracts
        can use different multipliers—confirm the product specifications before
        trading.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool does not price options from volatility or interest rates, does
        not model assignment/exercise nuances, dividends, or margin, and does
        not convert currencies. It is an educational premium-cost helper, not
        trading advice.
      </p>

      <h2
        id="call-option-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...CALL_OPTION_FAQS]} />
      </div>
    </article>
  );
}
