import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NSFR_FAQS } from './content';

export function NsfrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        NSFR Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Net Stable Funding Ratio (NSFR) compares Available Stable Funding
        (ASF) to Required Stable Funding (RSF) over a one-year structural
 horizon. Enter ASF and RSF directly, or use the optional weighted
 helpers, to compute NSFR, coverage multiple, and funding surplus or
        shortfall. This page is an educational estimate aligned with simplified
        Basel III–style factors, not a regulatory filing or compliance opinion.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
 What Is NSFR?; Net Stable Funding Ratio Meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Banks fund long-lived assets with a mix of deposits, wholesale
        liabilities, and capital. Maturity mismatches create structural funding
        risk if short-term funding rolls off while assets remain. NSFR asks
        whether weighted stable funding sources are sufficient relative to the
        weighted funding needs of assets and certain off-balance-sheet items
        over about one year, supporting resilience beyond short-term liquidity
        buffers.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
 NSFR Formula; How to Calculate Net Stable Funding Ratio
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs text-accent sm:text-sm">
        NSFR = (ASF / RSF) × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ASF and RSF are regulatory-weighted amounts, not raw balance-sheet
        totals. A large short-term liability may contribute little ASF; a liquid
        asset may require little RSF. Always distinguish nominal funding from
        weighted stable funding.
      </p>

      <h2
        id="asf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Available Stable Funding (ASF) Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ASF weights capital and liabilities by stability and maturity. Eligible
        regulatory capital and long-dated liabilities often receive 100% ASF;
        stable retail deposits may receive 95%; less-stable deposits 90%;
        certain wholesale funding 50%; and some short-term liabilities 0%. Longer,
        stickier funding generally earns higher recognition.
      </p>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Category</th>
              <th className="py-2 pr-3 font-semibold">Amount</th>
              <th className="py-2 pr-3 font-semibold">Factor</th>
              <th className="py-2 font-semibold">Weighted</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Regulatory capital</td>
              <td className="py-2 pr-3 tabular-nums">$10,000,000</td>
              <td className="py-2 pr-3">100%</td>
              <td className="py-2 tabular-nums">$10,000,000</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Stable deposits</td>
              <td className="py-2 pr-3 tabular-nums">$15,000,000</td>
              <td className="py-2 pr-3">95%</td>
              <td className="py-2 tabular-nums">$14,250,000</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Less-stable deposits</td>
              <td className="py-2 pr-3 tabular-nums">$20,000,000</td>
              <td className="py-2 pr-3">90%</td>
              <td className="py-2 tabular-nums">$18,000,000</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">50% funding</td>
              <td className="py-2 pr-3 tabular-nums">$17,000,000</td>
              <td className="py-2 pr-3">50%</td>
              <td className="py-2 tabular-nums">$8,500,000</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">0% funding</td>
              <td className="py-2 pr-3 tabular-nums">$5,000,000</td>
              <td className="py-2 pr-3">0%</td>
              <td className="py-2 tabular-nums">$0</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-foreground/90">
        Illustrative ASF total = <strong>$50,750,000</strong>.
      </p>

      <h2
        id="rsf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Required Stable Funding (RSF) Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        RSF reflects how much stable funding different assets and OBS items are
        assumed to need. Cash and some central-bank reserves may require little
        RSF; less liquid or longer assets require more. Encumbrance, maturity,
        counterparty, and collateral rules matter in full frameworks. This
        calculator’s optional RSF helper uses illustrative factors only.
      </p>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
 How to Calculate NSFR; Worked Example
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>ASF = $170,000,000.</li>
        <li>RSF = $150,000,000.</li>
        <li>NSFR = (170,000,000 / 150,000,000) × 100 = 113.33%.</li>
        <li>Funding surplus = $20,000,000.</li>
        <li>
          Result exceeds the standard 100% threshold under these educational
          inputs.
        </li>
      </ol>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret NSFR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Below 100%: ASF short of RSF. Equal to 100%: meets the threshold without
        a numerical buffer. Above 100%: exceeds the minimum under the entered
        weights. Supervisory expectations and buffers vary. NSFR is not a
        complete measure of liquidity safety or solvency.
      </p>

      <h2
        id="basel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Basel III and the 100% NSFR Requirement
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Basel Committee on Banking Supervision introduced NSFR alongside LCR
        to strengthen liquidity standards after the global financial crisis.
 International standards are implemented locally; legal requirements,
        scope, and reporting instructions may differ from the Basel text.
      </p>

      <h2
        id="vs-lcr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
 NSFR vs. LCR; What&apos;s the Difference?
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-2 pr-3 font-semibold">Feature</th>
              <th className="py-2 pr-3 font-semibold">NSFR</th>
              <th className="py-2 font-semibold">LCR</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">Purpose</td>
              <td className="py-2 pr-3">Structural funding stability</td>
              <td className="py-2">Short-term liquidity resilience</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">Horizon</td>
              <td className="py-2 pr-3">One year</td>
              <td className="py-2">30 days</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">Numerator</td>
              <td className="py-2 pr-3">Available Stable Funding</td>
              <td className="py-2">High-Quality Liquid Assets</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3 font-medium text-accent">Denominator</td>
              <td className="py-2 pr-3">Required Stable Funding</td>
              <td className="py-2">Net cash outflows</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium text-accent">Threshold</td>
              <td className="py-2 pr-3">Typically 100%</td>
              <td className="py-2">Typically 100%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-foreground/90">
        Compare with the{' '}
        <Link
          href="/tools/lcr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          LCR Calculator
        </Link>
        .
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is NSFR Important for Banks?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NSFR encourages less reliance on unstable short-term funding, stronger
        maturity profiles, diversified liabilities, and disciplined
 asset-liability management; supporting bank and system resilience when
        markets seize up.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Banks Can Improve Their NSFR
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Increase eligible capital and long-term liabilities.</li>
        <li>Extend funding maturities where economical.</li>
        <li>Improve deposit stability and franchise stickiness.</li>
        <li>Adjust asset composition toward lower RSF profiles.</li>
        <li>Manage encumbrance and collateral usage.</li>
        <li>Monitor funding concentration and growth pace.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Improvements often raise funding costs or constrain business mix; 
        trade-offs matter.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NSFR Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Classifications and reporting dates drive results; jurisdictions differ;
        market stress can exceed assumed behaviors; concentration and currency
        mismatches may be understated; funding costs are outside the ratio; and
        a favorable NSFR does not guarantee solvency. Use official manuals for
        filings.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/lcr-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            LCR Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/money-multiplier-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Money Multiplier Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/money-supply-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Money Supply Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gdp-growth-rate-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GDP Growth Rate Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/inflation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Inflation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/fisher-effect-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Effect Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/fisher-equation-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Fisher Equation Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="nsfr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...NSFR_FAQS]} />
      </div>
    </article>
  );
}
