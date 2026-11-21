import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CD_FAQS } from './content';

export function CdGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-cd" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What is a Certificate of Deposit?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A Certificate of Deposit (CD) is a deposit account that typically pays a fixed interest rate
        for a stated term. You place an initial deposit, leave it invested until maturity, and earn
        interest according to the product’s compounding rules. Unlike many ordinary savings
        accounts, traditional CDs often limit early access and may charge an early withdrawal
        penalty. Terms, rates, and restrictions vary by institution and product.
      </p>

      <h2
        id="fdic-backed-cds"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FDIC-backed CDs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In the United States, CDs held at FDIC-insured banks are generally covered by deposit
 insurance up to applicable limits; commonly described as $250,000 per depositor, per
 insured bank, per ownership category, including principal and accrued interest, subject to
        current FDIC rules. Credit union share certificates may instead be covered by the NCUA.
        Brokered or structured products can differ. Deposit insurance does not protect against
        inflation or opportunity cost, and not every investment marketed alongside CDs is
        deposit-insured.
      </p>

      <h2
        id="where-to-purchase"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Where and how to purchase CDs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CDs are commonly offered by traditional banks, online banks, credit unions, and brokerage
        platforms (brokered CDs). When comparing options, review APY versus nominal rate, minimum
        deposit, term length, early withdrawal penalties, insurance coverage, maturity options, and
        automatic renewal policies. Always read the CD agreement before investing.
      </p>

      <h2 id="history-of-cds" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        History of CDs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Certificates of deposit developed as timed bank deposit instruments and became a mainstream
        retail savings product as banking expanded. Deposit insurance, shifting interest-rate
        environments, online banking, and brokered distribution broadened access. Modern offerings
        also include more flexible designs (bump-up, liquid, callable) alongside traditional fixed
        terms. Exact historical milestones vary by market and regulator.
      </p>

      <h2 id="how-to-use-cds" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to use CDs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Investors often use CDs for predictable interest, short-term goals, capital preservation,
        diversification, and known maturity dates. Limitations include limited liquidity, early
        withdrawal penalties, inflation risk, reinvestment risk when rates fall, and opportunity
        cost if market rates rise after you lock in.
      </p>

      <h2
        id="withdrawing-from-cd"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Withdrawing from a CD
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        At maturity you can usually withdraw or renew. Early withdrawals from traditional CDs often
        trigger penalties. Some products offer grace periods after maturity or allow limited partial
 withdrawals. Automatic renewal can roll the balance into a new term if you take no action; 
        check your institution’s policy.
      </p>

      <h2 id="cd-ladder" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        CD ladder
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 A CD ladder splits money across several CDs with different maturities, for example 1-, 2-,
        3-, 4-, and 5-year terms. As each rung matures, you can spend, hold cash, or reinvest at
        current rates. Ladders can improve liquidity and stagger reinvestment, but they do not
        eliminate interest-rate or liquidity risk.
      </p>

      <h2 id="apy-vs-apr" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        APY vs. APR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        APR generally means the nominal annual rate before compounding. APY reflects the annualized
        yield after compounding:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>APY = (1 + APR / n)^n − 1</p>
        <p className="mt-2">A = P × (1 + r / n)^(n × t)</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        U.S. consumer CD advertisements often quote APY. Confirm whether the rate you enter is APR
        or APY so compounding is not applied twice.
      </p>

      <h2
        id="compounding-frequency"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Compounding frequency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interest may compound daily, weekly, monthly, quarterly, semiannually, or annually. Each
        compounding adds earned interest to principal so later periods can earn interest on
        interest. Holding the nominal APR fixed, more frequent compounding generally raises
        effective APY. This calculator also supports fractional terms (years + months) using the
        standard mathematical model; bank day-count conventions may differ.
      </p>

      <h2 id="types-of-cds" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Types of CDs
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Traditional CD:</strong> Fixed rate and maturity; early withdrawals often
          penalized.
        </li>
        <li>
          <strong>Bump-up CD:</strong> May allow a rate increase if the issuer offers an eligible
          bump, subject to product limits.
        </li>
        <li>
          <strong>Liquid / no-penalty CD:</strong> More flexible access with restrictions that still
          apply.
        </li>
        <li>
          <strong>Jumbo CD:</strong> Higher minimum deposit than standard CDs.
        </li>
        <li>
          <strong>Zero-coupon CD:</strong> Often purchased at a discount and redeemed at face value;
          interest is reflected in the difference.
        </li>
        <li>
          <strong>Callable CD:</strong> Issuer may redeem early under specified conditions.
        </li>
        <li>
          <strong>Brokered CD:</strong> Purchased through a brokerage rather than directly from the
          issuing bank; liquidity and secondary-market rules can differ.
        </li>
      </ul>

      <h2
        id="alternatives-to-cds"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Alternatives to CDs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Depending on goals, alternatives include paying down high-interest debt, money market
        accounts, bonds, peer-to-peer lending, mutual funds and ETFs, and ordinary savings accounts.
 Each option has different risk, liquidity, return potential, and insurance characteristics; 
        none is automatically “better” than a CD for every investor.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/compound-interest-calculator" className="text-primary hover:underline">
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/interest-calculator" className="text-primary hover:underline">
            Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/investment-calculator" className="text-primary hover:underline">
            Investment Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/average-return-calculator" className="text-primary hover:underline">
            Average Return Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/bond-calculator" className="text-primary hover:underline">
            Bond Calculator
          </Link>
        </li>
      </ul>

      <h2 id="cd-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CD_FAQS]} />
      </div>
    </article>
  );
}
